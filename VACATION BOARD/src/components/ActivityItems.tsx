import { motion } from 'framer-motion';
import type { Activity, Person } from '../types';
import { TIME_LABELS } from '../types';
import {
  activityColor,
  activityParticipantsLabel,
  getVisibleSpan,
  isMultiDay,
} from '../utils/calendar';

function participantCount(activity: Activity): number {
  if (activity.participantMode === 'all') return 99;
  if (activity.participantMode === 'branch') {
    return Math.max(activity.branchIds.length * 3, 3);
  }
  return activity.personIds.length;
}

/** אירוע אישי/זוגי — קו דק בלי טקסט, פרטים בריחוף */
function isSlimPeople(activity: Activity): boolean {
  return activity.participantMode === 'people' && participantCount(activity) <= 2;
}

/** בוקר/צהריים/ערב — דק יותר מכל-היום */
function isPartDay(activity: Activity): boolean {
  return activity.timeOfDay !== 'all-day';
}

interface ActivityPillProps {
  activity: Activity;
  people: Person[];
  branches: { id: string; name: string }[];
  onClick: () => void;
  index?: number;
}

export function ActivityPill({
  activity,
  people,
  branches,
  onClick,
}: ActivityPillProps) {
  const color = activityColor(activity, people);
  const who = activityParticipantsLabel(activity, people, branches);
  const slim = isSlimPeople(activity);
  const thin = isPartDay(activity) || slim;
  const tip = [
    activity.title,
    TIME_LABELS[activity.timeOfDay],
    activity.location,
    who,
  ]
    .filter(Boolean)
    .join(' · ');

  if (slim) {
    return (
      <motion.button
        type="button"
        className="vb-activity-pill vb-activity-pill--slim"
        style={{
          background: color,
          boxShadow: `0 2px 8px ${color}55`,
        }}
        onClick={onClick}
        title={tip}
        initial={false}
        whileHover={{ scaleY: 1.8, scaleX: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="vb-activity-pill__hover-tip">{tip}</span>
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      className={`vb-activity-pill ${thin ? 'vb-activity-pill--thin' : ''}`}
      style={{
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        boxShadow: `0 4px 14px ${color}55`,
      }}
      onClick={onClick}
      title={tip}
      initial={false}
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
    >
      <span className="vb-activity-pill__title">{activity.title}</span>
      {!thin && (
        <>
          <span className="vb-activity-pill__meta">
            {TIME_LABELS[activity.timeOfDay]}
            {activity.location ? ` · ${activity.location}` : ''}
          </span>
          <span className="vb-activity-pill__who">{who}</span>
        </>
      )}
      {thin && (
        <span className="vb-activity-pill__meta vb-activity-pill__meta--one">
          {TIME_LABELS[activity.timeOfDay]}
          {activity.location ? ` · ${activity.location}` : ''}
        </span>
      )}
    </motion.button>
  );
}

interface MultiDayBarProps {
  activity: Activity;
  people: Person[];
  branches: { id: string; name: string }[];
  dayIndex: number;
  rangeStart: string;
  rangeEnd: string;
  colWidthPct: number;
  onClick: () => void;
  lane: number;
}

export function MultiDayBar({
  activity,
  people,
  branches,
  dayIndex,
  rangeStart,
  rangeEnd,
  colWidthPct,
  onClick,
  lane,
}: MultiDayBarProps) {
  const color = activityColor(activity, people);
  const span = getVisibleSpan(activity, rangeStart, rangeEnd);
  const who = activityParticipantsLabel(activity, people, branches);
  const slim = isSlimPeople(activity);
  const widthPct = Math.max(span * colWidthPct - 1.2, colWidthPct - 1.2);
  const startPct = dayIndex * colWidthPct + 0.6;
  const tip = [
    activity.title,
    activity.location,
    who,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <motion.button
      type="button"
      className={`vb-multiday-bar ${slim ? 'vb-multiday-bar--slim' : ''}`}
      style={{
        width: `${widthPct}%`,
        insetInlineStart: `${startPct}%`,
        top: slim ? lane * 18 + 6 : lane * 32 + 8,
        height: slim ? 10 : 26,
        background: `linear-gradient(90deg, ${color}, ${color}dd)`,
        boxShadow: `0 4px 12px ${color}44`,
      }}
      onClick={onClick}
      title={tip}
      initial={false}
      whileHover={{ y: -2, filter: 'brightness(1.05)' }}
    >
      {!slim && (
        <>
          <span className="vb-multiday-bar__title">{activity.title}</span>
          <span className="vb-multiday-bar__meta">
            {activity.location ? `${activity.location} · ` : ''}
            {who}
          </span>
        </>
      )}
      {slim && <span className="vb-multiday-bar__hover-tip">{tip}</span>}
    </motion.button>
  );
}

export function isBarStart(
  activity: Activity,
  dateKey: string,
  rangeStart: string,
): boolean {
  if (!isMultiDay(activity)) return false;
  if (activity.startDate === dateKey) return true;
  return (
    dateKey === rangeStart &&
    activity.startDate < rangeStart &&
    activity.endDate >= rangeStart
  );
}
