import { HDate, months } from '@hebcal/core';
import {
  addDays,
  differenceInCalendarDays,
  eachDayOfInterval,
  format,
  max as maxDate,
  min as minDate,
  parseISO,
  startOfWeek,
} from 'date-fns';
import { he } from 'date-fns/locale';
import type { Activity, Person, TimeOfDay } from '../types';

const HEBREW_MONTHS: Record<number, string> = {
  [months.NISAN]: 'ניסן',
  [months.IYYAR]: 'אייר',
  [months.SIVAN]: 'סיון',
  [months.TAMUZ]: 'תמוז',
  [months.AV]: 'אב',
  [months.ELUL]: 'אלול',
  [months.TISHREI]: 'תשרי',
  [months.CHESHVAN]: 'חשוון',
  [months.KISLEV]: 'כסלו',
  [months.TEVET]: 'טבת',
  [months.SHVAT]: 'שבט',
  [months.ADAR_I]: 'אדר א׳',
  [months.ADAR_II]: 'אדר ב׳',
};

const HEBREW_DAYS = [
  'א׳',
  'ב׳',
  'ג׳',
  'ד׳',
  'ה׳',
  'ו׳',
  'ז׳',
  'ח׳',
  'ט׳',
  'י׳',
  'י״א',
  'י״ב',
  'י״ג',
  'י״ד',
  'ט״ו',
  'ט״ז',
  'י״ז',
  'י״ח',
  'י״ט',
  'כ׳',
  'כ״א',
  'כ״ב',
  'כ״ג',
  'כ״ד',
  'כ״ה',
  'כ״ו',
  'כ״ז',
  'כ״ח',
  'כ״ט',
  'ל׳',
];

export function toDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/** מנרמל מחרוזת תאריך ל-yyyy-MM-dd, או מחזיר fallback */
export function normalizeDateKey(
  value: unknown,
  fallback: string,
): string {
  if (value == null || value === '') return fallback;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return toDateKey(value);
  }
  const raw = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);

  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) return toDateKey(parsed);
  return fallback;
}

export function getDaysInRange(start: string, end: string): Date[] {
  return eachDayOfInterval({
    start: parseISO(start),
    end: parseISO(end),
  });
}

/** שבועות מיום ראשון עד שבת */
export function chunkIntoWeeks(start: string, end: string): Date[][] {
  const safeStart = normalizeDateKey(start, '2026-07-12');
  const safeEnd = normalizeDateKey(end, '2026-08-31');
  let rangeStart = parseISO(safeStart);
  let rangeEnd = parseISO(safeEnd);

  if (Number.isNaN(rangeStart.getTime()) || Number.isNaN(rangeEnd.getTime())) {
    rangeStart = parseISO('2026-07-12');
    rangeEnd = parseISO('2026-08-31');
  }
  if (rangeEnd < rangeStart) {
    const tmp = rangeStart;
    rangeStart = rangeEnd;
    rangeEnd = tmp;
  }

  const gridStart = startOfWeek(rangeStart, { weekStartsOn: 0 });
  const allDays = eachDayOfInterval({
    start: gridStart,
    end: rangeEnd,
  });

  if (allDays.length === 0) {
    return [eachDayOfInterval({
      start: gridStart,
      end: addDays(gridStart, 6),
    })];
  }

  const last = allDays[allDays.length - 1];
  if (!last) return [];

  const daysToSat = (6 - last.getDay() + 7) % 7;
  if (daysToSat > 0) {
    for (let i = 1; i <= daysToSat; i++) {
      allDays.push(addDays(last, i));
    }
  }

  const weeks: Date[][] = [];
  for (let i = 0; i < allDays.length; i += 7) {
    const week = allDays.slice(i, i + 7).filter(Boolean);
    if (week.length === 7) weeks.push(week);
  }
  return weeks;
}

export function weekLabel(weekDays: Date[]): string {
  const first = weekDays[0];
  const last = weekDays[weekDays.length - 1];
  const a = hebrewDayLabel(first);
  const b = hebrewDayLabel(last);
  return `${a.full} – ${b.full}`;
}

export function hebrewDayLabel(date: Date): { day: string; month: string; full: string } {
  const hd = new HDate(date);
  const dayNum = hd.getDate();
  const monthName = HEBREW_MONTHS[hd.getMonth()] ?? '';
  const day = HEBREW_DAYS[dayNum - 1] ?? String(dayNum);
  return {
    day,
    month: monthName,
    full: `${day} ב${monthName}`,
  };
}

export function gregorianDayLabel(date: Date): string {
  return format(date, 'd/M', { locale: he });
}

export function weekdayLabel(date: Date): string {
  return format(date, 'EEEE', { locale: he });
}

export function isMultiDay(activity: Activity): boolean {
  return activity.startDate !== activity.endDate;
}

export function activitySpansDay(activity: Activity, dateKey: string): boolean {
  return dateKey >= activity.startDate && dateKey <= activity.endDate;
}

export function getVisibleSpan(
  activity: Activity,
  rangeStart: string,
  rangeEnd: string,
): number {
  const start = maxDate([parseISO(activity.startDate), parseISO(rangeStart)]);
  const end = minDate([parseISO(activity.endDate), parseISO(rangeEnd)]);
  return differenceInCalendarDays(end, start) + 1;
}

export function activityColor(activity: Activity, people: Person[]): string {
  if (activity.color) return activity.color;
  if (activity.participantMode === 'people' && activity.personIds.length > 0) {
    const person = people.find((p) => p.id === activity.personIds[0]);
    if (person) return person.color;
  }
  return '#4ECDC4';
}

export function activityParticipantsLabel(
  activity: Activity,
  people: Person[],
  branches: { id: string; name: string }[],
): string {
  if (activity.participantMode === 'all') return 'כולם';
  if (activity.participantMode === 'branch') {
    return activity.branchIds
      .map((id) => branches.find((b) => b.id === id)?.name ?? id)
      .join(', ');
  }
  return activity.personIds
    .map((id) => people.find((p) => p.id === id)?.name ?? id)
    .join(', ');
}

export function isActivityVisible(
  activity: Activity,
  people: Person[],
  hiddenBranches: string[],
  hiddenPeople: string[],
): boolean {
  if (activity.participantMode === 'all') return true;

  if (activity.participantMode === 'branch') {
    return activity.branchIds.some((id) => !hiddenBranches.includes(id));
  }

  return activity.personIds.some((id) => {
    if (hiddenPeople.includes(id)) return false;
    const person = people.find((p) => p.id === id);
    if (!person) return false;
    return !hiddenBranches.includes(person.branchId);
  });
}

export function shiftRange(start: string, end: string, days: number) {
  return {
    rangeStart: toDateKey(addDays(parseISO(start), days)),
    rangeEnd: toDateKey(addDays(parseISO(end), days)),
  };
}

export const TIME_ORDER: TimeOfDay[] = ['all-day', 'morning', 'noon', 'evening'];
