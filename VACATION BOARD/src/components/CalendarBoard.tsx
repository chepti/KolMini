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

const SLOT_ORDER: TimeOfDay[] = ['all-day', 'morning', 'noon', 'evening'];

const SLOT_LABEL: Record<TimeOfDay, string> = {
  'all-day': 'כל היום',
  morning: 'בוקר',
  noon: 'צהריים',
  evening: 'ערב',
};

function slotOf(a: Activity): TimeOfDay {
  return a.timeOfDay === 'all-day' ? 'all-day' : a.timeOfDay;
}

/** מפריד פסים חופפים לתאריכים לשורות נפרדות בלי חפיפה */
function assignLanes(bars: Activity[], weekStart: string, weekEnd: string): Map<string, number> {
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
    // end כולל — אם פס מסתיים באותו יום שפס אחר מתחיל, הם חופפים
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

          const multiBySlot = Object.fromEntries(
            SLOT_ORDER.map((slot) => [
              slot,
              visible.filter(
                (a) =>
                  isMultiDay(a) &&
                  slotOf(a) === slot &&
                  a.endDate >= weekStart &&
                  a.startDate <= weekEnd,
              ),
            ]),
          ) as Record<TimeOfDay, Activity[]>;

          const lanesBySlot = Object.fromEntries(
            SLOT_ORDER.map((slot) => [
              slot,
              assignLanes(multiBySlot[slot], weekStart, weekEnd),
            ]),
          ) as Record<TimeOfDay, Map<string, number>>;

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

                {SLOT_ORDER.map((slot) => {
                  const multi = multiBySlot[slot];
                  const laneMap = lanesBySlot[slot];
                  const laneCount =
                    laneMap.size === 0 ? 0 : Math.max(...laneMap.values()) + 1;
                  const barRowHeight =
                    laneCount === 0 ? 0 : laneCount * 30 + 8;

                  const hasSingleDay = weekDays.some((day) => {
                    if (!day) return false;
                    const key = toDateKey(day);
                    return visible.some(
                      (a) =>
                        !isMultiDay(a) &&
                        slotOf(a) === slot &&
                        activitySpansDay(a, key),
                    );
                  });

                  if (laneCount === 0 && !hasSingleDay) return null;

                  return (
                    <div
                      key={slot}
                      className={`vb-band vb-band--${slot} ${spacious ? 'vb-band--spacious' : ''}`}
                    >
                      <div className="vb-band__label" title={SLOT_LABEL[slot]}>
                        {SLOT_LABEL[slot]}
                      </div>

                      <div className="vb-band__content">
                        {laneCount > 0 && (
                          <div
                            className="vb-band__bars"
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
                          <div className="vb-band__days">
                            {weekDays.map((day) => {
                              if (!day) return null;
                              const key = toDateKey(day);
                              const isWeekend =
                                day.getDay() === 5 || day.getDay() === 6;
                              const pills = visible.filter(
                                (a) =>
                                  !isMultiDay(a) &&
                                  slotOf(a) === slot &&
                                  activitySpansDay(a, key),
                              );

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
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
