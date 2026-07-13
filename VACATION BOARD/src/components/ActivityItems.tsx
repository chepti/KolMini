import { motion } from 'framer-motion';
import type { Activity, Person, TimeOfDay } from '../types';
import { TIME_LABELS } from '../types';
import {
  activityParticipantsLabel,
  activityStripeColors,
  getVisibleSpan,
  isMultiDay,
  stripeBackground,
} from '../utils/calendar';

function participantCount(activity: Activity): number {
  if (activity.participantMode === 'all') return 99;
  if (activity.participantMode === 'branch') {
    return Math.max(activity.branchIds.length * 3, 3);
  }
  return activity.personIds.length;
}

function isSlimPeople(activity: Activity): boolean {
  return activity.participantMode === 'people' && participantCount(activity) <= 2;
}

function isSharedEvent(activity: Activity): boolean {
  if (activity.participantMode === 'all') return true;
  if (activity.participantMode === 'branch') return activity.branchIds.length >= 1;
  return activity.personIds.length >= 2;
}

function isPartDay(activity: Activity): boolean {
  return activity.timeOfDay !== 'all-day';
}

interface ActivityPillProps {
  activity: Activity;
  people: Person[];
  branches: { id: string; name: string; color?: string }[];
  onClick: () => void;
}

export function ActivityPill({
  activity,
  people,
  branches,
  onClick,
}: ActivityPillProps) {
  const colors = activityStripeColors(activity, people, branches);
  const bg = stripeBackground(colors);
  const who = activityParticipantsLabel(activity, people, branches);
  const slim = isSlimPeople(activity);
  const thin = isPartDay(activity) || slim;
  const shared = isSharedEvent(activity) && colors.length > 1;
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
          background: shared ? bg : colors[0],
          boxShadow: `0 2px 8px ${colors[0]}55`,
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
      className={`vb-activity-pill ${thin ? 'vb-activity-pill--thin' : ''} ${shared ? 'vb-activity-pill--striped' : ''}`}
      style={{
        background: bg,
        boxShadow: `0 4px 14px ${colors[0]}55`,
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
  branches: { id: string; name: string; color?: string }[];
  dayIndex: number;
  rangeStart: string;
  rangeEnd: string;
  colWidthPct: number;
  onClick: () => void;
  lane: number;
  slot: TimeOfDay;
}

/** מיקום אנכי לפי שעת היום בתוך אזור הימים */
const SLOT_TOP: Record<TimeOfDay, string> = {
  'all-day': '4%',
  morning: '10%',
  noon: '42%',
  evening: '72%',
};

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
  slot,
}: MultiDayBarProps) {
  const colors = activityStripeColors(activity, people, branches);
  const bg = stripeBackground(colors);
  const span = getVisibleSpan(activity, rangeStart, rangeEnd);
  const who = activityParticipantsLabel(activity, people, branches);
  const slim = isSlimPeople(activity);
  const shared = isSharedEvent(activity) && colors.length > 1;
  const widthPct = Math.max(span * colWidthPct - 1.2, colWidthPct - 1.2);
  const startPct = dayIndex * colWidthPct + 0.6;
  const tip = [
    activity.title,
    TIME_LABELS[activity.timeOfDay],
    activity.location,
    who,
  ]
    .filter(Boolean)
    .join(' · ');
  const laneGap = slim ? 12 : 28;
  const barHeight = slim ? 10 : 26;

  return (
    <motion.button
      type="button"
      className={`vb-multiday-bar vb-multiday-bar--${slot} ${slim ? 'vb-multiday-bar--slim' : ''} ${shared ? 'vb-multiday-bar--striped' : ''}`}
      style={{
        width: `${widthPct}%`,
        insetInlineStart: `${startPct}%`,
        top: `calc(${SLOT_TOP[slot]} + ${lane * laneGap}px)`,
        height: barHeight,
        background: bg,
        boxShadow: `0 4px 12px ${colors[0]}44`,
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
            {TIME_LABELS[activity.timeOfDay]}
            {activity.location ? ` · ${activity.location}` : ''}
            {who ? ` · ${who}` : ''}
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

export const TIME_SLOTS: TimeOfDay[] = ['all-day', 'morning', 'noon', 'evening'];
