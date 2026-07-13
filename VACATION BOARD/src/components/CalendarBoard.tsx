import { useMemo } from 'react';
import { useVacation } from '../store/VacationContext';
import type { Activity, TimeOfDay } from '../types';
import {
  activitySpansDay,
  chunkIntoWeeks,
  gregorianDayLabel,
  hebrewDayLabel,
  isActivityVisible,
  isMultiDay,
  toDateKey,
  weekLabel,
  weekdayLabel,
} from '../utils/calendar';
import { ActivityPill, isBarStart, MultiDayBar } from './ActivityItems';

interface CalendarBoardProps {
  onEdit: (activity: Activity) => void;
  onNewAtDate: (dateKey: string) => void;
}

function assignLanes(bars: Activity[], weekStart: string, weekEnd: string): Map<string, number> {
  const sorted = [...bars].sort((a, b) => a.startDate.localeCompare(b.startDate));
  const lanes: { end: string }[] = [];
  const map = new Map<string, number>();

  for (const act of sorted) {
    const start = act.startDate < weekStart ? weekStart : act.startDate;
    const end = act.endDate > weekEnd ? weekEnd : act.endDate;
    let lane = lanes.findIndex((l) => l.end < start);
    if (lane === -1) {
      lane = lanes.length;
      lanes.push({ end });
    } else {
      lanes[lane].end = end;
    }
    map.set(act.id, lane);
  }
  return map;
}

function slotOf(a: Activity): TimeOfDay {
  return a.timeOfDay === 'all-day' ? 'all-day' : a.timeOfDay;
}

const SLOT_ORDER: TimeOfDay[] = ['all-day', 'morning', 'noon', 'evening'];

function assignLanesBySlot(
  bars: Activity[],
  weekStart: string,
  weekEnd: string,
): Map<string, { lane: number; slot: TimeOfDay }> {
  const out = new Map<string, { lane: number; slot: TimeOfDay }>();
  for (const slot of SLOT_ORDER) {
    const subset = bars.filter((a) => slotOf(a) === slot);
    const lanes = assignLanes(subset, weekStart, weekEnd);
    for (const [id, lane] of lanes) {
      out.set(id, { lane, slot });
    }
  }
  return out;
}

export function CalendarBoard({ onEdit, onNewAtDate }: CalendarBoardProps) {
  const {
    rangeStart,
    rangeEnd,
    activities,
    people,
    branches,
    hiddenBranches,
    hiddenPeople,
    viewMode,
    weekIndex,
  } = useVacation();

  const allWeeks = useMemo(
    () => chunkIntoWeeks(rangeStart, rangeEnd),
    [rangeStart, rangeEnd],
  );

  const weeks = useMemo(() => {
    if (viewMode !== 'week' || allWeeks.length === 0) return allWeeks;
    const i = Math.min(Math.max(weekIndex, 0), allWeeks.length - 1);
    return [allWeeks[i]];
  }, [allWeeks, viewMode, weekIndex]);

  const visible = useMemo(
    () =>
      activities.filter((a) =>
        isActivityVisible(a, people, hiddenBranches, hiddenPeople),
      ),
    [activities, people, hiddenBranches, hiddenPeople],
  );

  const spacious = viewMode === 'week';

  return (
    <div className={`vb-board ${spacious ? 'vb-board--week' : ''}`}>
      <div className="vb-weeks">
        {weeks.map((weekDays, wi) => {
          const weekStart = toDateKey(weekDays[0]);
          const weekEnd = toDateKey(weekDays[weekDays.length - 1]);
          const multiDay = visible.filter(
            (a) =>
              isMultiDay(a) && a.endDate >= weekStart && a.startDate <= weekEnd,
          );
          const laneBySlot = assignLanesBySlot(multiDay, weekStart, weekEnd);
          const hasEveningBars = multiDay.some((a) => slotOf(a) === 'evening');
          const hasNoonBars = multiDay.some((a) => slotOf(a) === 'noon');
          const labelIndex = viewMode === 'week' ? weekIndex : wi;

          return (
            <section key={weekStart} className="vb-week">
              <header className="vb-week__label">
                <span className="vb-week__badge">שבוע {labelIndex + 1}</span>
                <span className="vb-week__range">{weekLabel(weekDays)}</span>
              </header>

              <div className="vb-week__grid">
                <div className="vb-board__header-row">
                  {weekDays.map((day) => {
                    if (!day) return null;
                    const key = toDateKey(day);
                    const heb = hebrewDayLabel(day);
                    const isWeekend = day.getDay() === 5 || day.getDay() === 6;
                    return (
                      <div
                        key={key}
                        className={`vb-day-head ${isWeekend ? 'is-weekend' : ''}`}
                      >
                        <span className="vb-day-head__weekday">
                          {weekdayLabel(day)}
                        </span>
                        <span className="vb-day-head__heb">{heb.full}</span>
                        <span className="vb-day-head__greg">
                          {gregorianDayLabel(day)}
                        </span>
                        <button
                          type="button"
                          className="vb-day-add"
                          onClick={() => onNewAtDate(key)}
                          title="הוסף אירוע ליום זה"
                        >
                          +
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div
                  className={`vb-board__days-wrap ${hasEveningBars ? 'has-evening-bars' : ''} ${hasNoonBars ? 'has-noon-bars' : ''}`}
                >
                  <div className="vb-board__bars vb-board__bars--overlay" aria-hidden={false}>
                    {weekDays.map((day, di) => {
                      const key = toDateKey(day);
                      return multiDay
                        .filter((a) => isBarStart(a, key, weekStart))
                        .map((a) => {
                          const meta = laneBySlot.get(a.id);
                          return (
                            <MultiDayBar
                              key={`${a.id}-${weekStart}`}
                              activity={a}
                              people={people}
                              branches={branches}
                              dayIndex={di}
                              rangeStart={weekStart}
                              rangeEnd={weekEnd}
                              colWidthPct={100 / weekDays.length}
                              lane={meta?.lane ?? 0}
                              slot={meta?.slot ?? slotOf(a)}
                              onClick={() => onEdit(a)}
                            />
                          );
                        });
                    })}
                  </div>

                  <div className="vb-board__days">
                    {weekDays.map((day) => {
                      if (!day) return null;
                      const key = toDateKey(day);
                      const dayPills = visible.filter(
                        (a) => !isMultiDay(a) && activitySpansDay(a, key),
                      );
                      const isWeekend = day.getDay() === 5 || day.getDay() === 6;
                      const bySlot = {
                        'all-day': dayPills.filter((a) => slotOf(a) === 'all-day'),
                        morning: dayPills.filter((a) => slotOf(a) === 'morning'),
                        noon: dayPills.filter((a) => slotOf(a) === 'noon'),
                        evening: dayPills.filter((a) => slotOf(a) === 'evening'),
                      };

                      return (
                        <div
                          key={key}
                          className={`vb-day-col ${isWeekend ? 'is-weekend' : ''} ${spacious ? 'vb-day-col--spacious' : ''}`}
                          onDoubleClick={() => onNewAtDate(key)}
                          title="לחיצה כפולה להוספת אירוע"
                        >
                          {bySlot['all-day'].length > 0 && (
                            <div className="vb-day-slot vb-day-slot--all">
                              {bySlot['all-day'].map((a) => (
                                <ActivityPill
                                  key={a.id}
                                  activity={a}
                                  people={people}
                                  branches={branches}
                                  onClick={() => onEdit(a)}
                                />
                              ))}
                            </div>
                          )}

                          <div className="vb-day-body">
                            {(
                              [
                                ['morning', bySlot.morning],
                                ['noon', bySlot.noon],
                                ['evening', bySlot.evening],
                              ] as const
                            ).map(([slot, items]) =>
                              items.length > 0 ? (
                                <div
                                  key={slot}
                                  className={`vb-day-slot vb-day-slot--${slot}`}
                                >
                                  {items.map((a) => (
                                    <ActivityPill
                                      key={a.id}
                                      activity={a}
                                      people={people}
                                      branches={branches}
                                      onClick={() => onEdit(a)}
                                    />
                                  ))}
                                </div>
                              ) : null,
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
