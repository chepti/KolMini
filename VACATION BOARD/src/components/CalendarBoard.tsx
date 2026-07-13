import { useMemo } from 'react';
import { useVacation } from '../store/VacationContext';
import type { Activity } from '../types';
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

export function CalendarBoard({ onEdit, onNewAtDate }: CalendarBoardProps) {
  const {
    rangeStart,
    rangeEnd,
    activities,
    people,
    branches,
    hiddenBranches,
    hiddenPeople,
  } = useVacation();

  const weeks = useMemo(
    () => chunkIntoWeeks(rangeStart, rangeEnd),
    [rangeStart, rangeEnd],
  );

  const visible = useMemo(
    () =>
      activities.filter((a) =>
        isActivityVisible(a, people, hiddenBranches, hiddenPeople),
      ),
    [activities, people, hiddenBranches, hiddenPeople],
  );

  return (
    <div className="vb-board">
      <div className="vb-weeks">
        {weeks.map((weekDays, wi) => {
          const weekStart = toDateKey(weekDays[0]);
          const weekEnd = toDateKey(weekDays[weekDays.length - 1]);
          const multiDay = visible.filter(
            (a) =>
              isMultiDay(a) && a.endDate >= weekStart && a.startDate <= weekEnd,
          );
          const laneMap = assignLanes(multiDay, weekStart, weekEnd);
          const laneCount =
            laneMap.size === 0 ? 0 : Math.max(...laneMap.values()) + 1;

          return (
            <section key={weekStart} className="vb-week">
              <header className="vb-week__label">
                <span className="vb-week__badge">שבוע {wi + 1}</span>
                <span className="vb-week__range">{weekLabel(weekDays)}</span>
              </header>

              <div className="vb-week__grid">
                <div className="vb-board__header-row">
                  {weekDays.map((day) => {
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
                  className="vb-board__bars"
                  style={{
                    height: laneCount === 0 ? 6 : laneCount * 32 + 10,
                  }}
                >
                  {weekDays.map((day, di) => {
                    const key = toDateKey(day);
                    return multiDay
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

                <div className="vb-board__days">
                  {weekDays.map((day) => {
                    const key = toDateKey(day);
                    const dayPills = visible.filter(
                      (a) => !isMultiDay(a) && activitySpansDay(a, key),
                    );
                    const isWeekend = day.getDay() === 5 || day.getDay() === 6;

                    return (
                      <div
                        key={key}
                        className={`vb-day-col ${isWeekend ? 'is-weekend' : ''}`}
                      >
                        {dayPills.length === 0 && (
                          <button
                            type="button"
                            className="vb-day-empty"
                            onClick={() => onNewAtDate(key)}
                          >
                            הוסף תוכנית
                          </button>
                        )}
                        {dayPills.map((a, i) => (
                          <ActivityPill
                            key={a.id}
                            activity={a}
                            people={people}
                            branches={branches}
                            onClick={() => onEdit(a)}
                            index={i}
                          />
                        ))}
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
