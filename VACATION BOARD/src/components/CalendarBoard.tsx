import { useMemo } from 'react';
import { useVacation } from '../store/VacationContext';
import type { Activity } from '../types';
import {
  activitySpansDay,
  getDaysInRange,
  gregorianDayLabel,
  hebrewDayLabel,
  isActivityVisible,
  isMultiDay,
  toDateKey,
  weekdayLabel,
} from '../utils/calendar';
import { ActivityPill, isBarStart, MultiDayBar } from './ActivityItems';

const COL_WIDTH = 148;

interface CalendarBoardProps {
  onEdit: (activity: Activity) => void;
  onNewAtDate: (dateKey: string) => void;
}

function assignLanes(bars: Activity[]): Map<string, number> {
  const sorted = [...bars].sort((a, b) => a.startDate.localeCompare(b.startDate));
  const lanes: { end: string }[] = [];
  const map = new Map<string, number>();

  for (const act of sorted) {
    let lane = lanes.findIndex((l) => l.end < act.startDate);
    if (lane === -1) {
      lane = lanes.length;
      lanes.push({ end: act.endDate });
    } else {
      lanes[lane].end = act.endDate;
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

  const days = useMemo(
    () => getDaysInRange(rangeStart, rangeEnd),
    [rangeStart, rangeEnd],
  );

  const visible = useMemo(
    () =>
      activities.filter((a) =>
        isActivityVisible(a, people, hiddenBranches, hiddenPeople),
      ),
    [activities, people, hiddenBranches, hiddenPeople],
  );

  const multiDay = useMemo(
    () =>
      visible.filter(
        (a) =>
          isMultiDay(a) &&
          a.endDate >= rangeStart &&
          a.startDate <= rangeEnd,
      ),
    [visible, rangeStart, rangeEnd],
  );

  const laneMap = useMemo(() => assignLanes(multiDay), [multiDay]);
  const laneCount = laneMap.size === 0 ? 0 : Math.max(...laneMap.values()) + 1;

  return (
    <div className="vb-board">
      <div
        className="vb-board__scroll"
        style={{ ['--col-w' as string]: `${COL_WIDTH}px` }}
      >
        <div
          className="vb-board__inner"
          style={{ width: days.length * COL_WIDTH }}
        >
          <div className="vb-board__header-row">
            {days.map((day) => {
              const key = toDateKey(day);
              const heb = hebrewDayLabel(day);
              const isWeekend = day.getDay() === 5 || day.getDay() === 6;
              return (
                <div
                  key={key}
                  className={`vb-day-head ${isWeekend ? 'is-weekend' : ''}`}
                  style={{ width: COL_WIDTH }}
                >
                  <span className="vb-day-head__weekday">{weekdayLabel(day)}</span>
                  <span className="vb-day-head__heb">{heb.full}</span>
                  <span className="vb-day-head__greg">{gregorianDayLabel(day)}</span>
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
            style={{ height: Math.max(laneCount, 1) * 36 + 16 }}
          >
            {days.map((day, di) => {
              const key = toDateKey(day);
              return multiDay
                .filter((a) => isBarStart(a, key, rangeStart))
                .map((a) => (
                  <MultiDayBar
                    key={a.id}
                    activity={a}
                    people={people}
                    branches={branches}
                    dayIndex={di}
                    rangeStart={rangeStart}
                    rangeEnd={rangeEnd}
                    colWidth={COL_WIDTH}
                    lane={laneMap.get(a.id) ?? 0}
                    onClick={() => onEdit(a)}
                  />
                ));
            })}
          </div>

          <div className="vb-board__days">
            {days.map((day) => {
              const key = toDateKey(day);
              const dayPills = visible.filter(
                (a) => !isMultiDay(a) && activitySpansDay(a, key),
              );
              const isWeekend = day.getDay() === 5 || day.getDay() === 6;

              return (
                <div
                  key={key}
                  className={`vb-day-col ${isWeekend ? 'is-weekend' : ''}`}
                  style={{ width: COL_WIDTH }}
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
      </div>
    </div>
  );
}
