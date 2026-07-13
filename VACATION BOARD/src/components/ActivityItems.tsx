import { motion } from 'framer-motion';
import type { Activity, Person } from '../types';
import { TIME_LABELS } from '../types';
import {
  activityColor,
  activityParticipantsLabel,
  getVisibleSpan,
  isMultiDay,
} from '../utils/calendar';

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
  index = 0,
}: ActivityPillProps) {
  const color = activityColor(activity, people);
  const who = activityParticipantsLabel(activity, people, branches);

  return (
    <motion.button
      type="button"
      className="vb-activity-pill"
      style={{
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        boxShadow: `0 4px 14px ${color}55`,
      }}
      onClick={onClick}
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.04, type: 'spring', stiffness: 320, damping: 20 }}
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
    >
      <span className="vb-activity-pill__title">{activity.title}</span>
      <span className="vb-activity-pill__meta">
        {TIME_LABELS[activity.timeOfDay]}
        {activity.location ? ` · ${activity.location}` : ''}
      </span>
      <span className="vb-activity-pill__who">{who}</span>
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
  colWidth: number;
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
  colWidth,
  onClick,
  lane,
}: MultiDayBarProps) {
  const color = activityColor(activity, people);
  const span = getVisibleSpan(activity, rangeStart, rangeEnd);
  const who = activityParticipantsLabel(activity, people, branches);
  const width = Math.max(span * colWidth - 10, colWidth - 10);

  return (
    <motion.button
      type="button"
      className="vb-multiday-bar"
      style={{
        width,
        insetInlineStart: dayIndex * colWidth + 5,
        top: lane * 36 + 8,
        background: `linear-gradient(90deg, ${color}, ${color}dd)`,
        boxShadow: `0 6px 18px ${color}44`,
      }}
      onClick={onClick}
      initial={{ opacity: 0, scaleX: 0.4 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 22 }}
      whileHover={{ y: -2, filter: 'brightness(1.05)' }}
    >
      <span className="vb-multiday-bar__title">{activity.title}</span>
      <span className="vb-multiday-bar__meta">
        {activity.location ? `${activity.location} · ` : ''}
        {who}
      </span>
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
