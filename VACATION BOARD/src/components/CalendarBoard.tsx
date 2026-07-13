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

/** בוקר למעלה → כל היום באמצע → צהריים → ערב למטה */
const SLOT_STACK: TimeOfDay[] = ['morning', 'all-day', 'noon', 'evening'];

function slotOf(a: Activity): TimeOfDay {
  return a.timeOfDay === 'all-day' ? 'all-day' : a.timeOfDay;
}

function assignLanes(
  bars: Activity[],
  weekStart: string,
  weekEnd: string,
): Map<string, number> {
  const sorted = [...bars].sort((a, b) => {
    const byStart = a.startDate.localeCompare(b.startDate);
    if (byStart !== 0) return byStart;
    return b.endDate.localeCompare(a.endDate);
  });
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

                <div className="vb-week__body">
                  {SLOT_STACK.map((slot) => {
                    const multi = visible.filter(
                      (a) =>
                        isMultiDay(a) &&
                        slotOf(a) === slot &&
                        a.endDate >= weekStart &&
                        a.startDate <= weekEnd,
                    );
                    const laneMap = assignLanes(multi, weekStart, weekEnd);
                    const laneCount =
                      laneMap.size === 0
                        ? 0
                        : Math.max(...laneMap.values()) + 1;
                    const barRowHeight =
                      laneCount === 0 ? 0 : laneCount * 30 + 4;

                    const dayPills = weekDays.map((day) => {
                      if (!day) return [] as Activity[];
                      const key = toDateKey(day);
                      return visible.filter(
                        (a) =>
                          !isMultiDay(a) &&
                          slotOf(a) === slot &&
                          activitySpansDay(a, key),
                      );
                    });
                    const hasSingleDay = dayPills.some((p) => p.length > 0);

                    if (laneCount === 0 && !hasSingleDay) return null;

                    return (
                      <div key={slot} className="vb-slot-pack">
                        {laneCount > 0 && (
                          <div
                            className="vb-board__bars"
                            style={{ height: barRowHeight }}
                          >
                            {weekDays.map((day, di) => {
                              if (!day) return null;
                              const key = toDateKey(day);
                              return multi
                                .filter((a) => isBarStart(a, key, weekStart))
                                .map((a) => (
                                  <MultiDayBar
                                    key={`${a.id}-${weekStart}`}
                                    activity={a}
                                    people={people}
                                    branches={branches}
                                    dayIndex={di}
                                    rangeStart={weekStart}
                                    rangeEnd={weekEnd}
                                    colWidthPct={100 / weekDays.length}
                                    lane={laneMap.get(a.id) ?? 0}
                                    onClick={() => onEdit(a)}
                                  />
                                ));
                            })}
                          </div>
                        )}

                        {hasSingleDay && (
                          <div className="vb-board__days">
                            {weekDays.map((day, di) => {
                              if (!day) return null;
                              const key = toDateKey(day);
                              const isWeekend =
                                day.getDay() === 5 || day.getDay() === 6;
                              const pills = dayPills[di];

                              return (
                                <div
                                  key={key}
                                  className={`vb-day-col ${isWeekend ? 'is-weekend' : ''}`}
                                  onDoubleClick={() => onNewAtDate(key)}
                                  title="לחיצה כפולה להוספת אירוע"
                                >
                                  {pills.map((a) => (
                                    <ActivityPill
                                      key={a.id}
                                      activity={a}
                                      people={people}
                                      branches={branches}
                                      onClick={() => onEdit(a)}
                                    />
                                  ))}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
