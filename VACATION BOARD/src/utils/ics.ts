import type { Activity, Person, TimeOfDay, VacationState } from '../types';
import { TIME_LABELS } from '../types';
import { activityParticipantsLabel, isActivityVisible } from './calendar';

/** שעות משוערות לפי חלק ביום (אזור זמן ישראל) */
const SLOT_HOURS: Record<
  Exclude<TimeOfDay, 'all-day'>,
  { start: [number, number]; end: [number, number] }
> = {
  morning: { start: [8, 0], end: [12, 0] },
  noon: { start: [12, 0], end: [16, 0] },
  evening: { start: [16, 0], end: [21, 0] },
};

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function foldLine(line: string): string {
  if (line.length <= 75) return line;
  const parts: string[] = [];
  let rest = line;
  parts.push(rest.slice(0, 75));
  rest = rest.slice(75);
  while (rest.length > 0) {
    parts.push(` ${rest.slice(0, 74)}`);
    rest = rest.slice(74);
  }
  return parts.join('\r\n');
}

function escapeText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

/** יום אחרי yyyy-MM-dd (קצה DTEND לאירוע יום-שלם — לא כולל) */
function nextDateKey(dateKey: string): string {
  const d = new Date(`${dateKey}T12:00:00`);
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function toIcsDate(dateKey: string): string {
  return dateKey.replace(/-/g, '');
}

function toIcsLocal(dateKey: string, hour: number, minute: number): string {
  return `${toIcsDate(dateKey)}T${pad(hour)}${pad(minute)}00`;
}

function stampUtcNow(): string {
  const d = new Date();
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

function eventTimes(activity: Activity): { startLine: string; endLine: string } {
  if (activity.timeOfDay === 'all-day') {
    return {
      startLine: `DTSTART;VALUE=DATE:${toIcsDate(activity.startDate)}`,
      endLine: `DTEND;VALUE=DATE:${toIcsDate(nextDateKey(activity.endDate))}`,
    };
  }
  const slot = SLOT_HOURS[activity.timeOfDay];
  return {
    startLine: `DTSTART;TZID=Asia/Jerusalem:${toIcsLocal(activity.startDate, slot.start[0], slot.start[1])}`,
    endLine: `DTEND;TZID=Asia/Jerusalem:${toIcsLocal(activity.endDate, slot.end[0], slot.end[1])}`,
  };
}

export function sheetsUrlToIcsUrl(sheetsUrl: string): string {
  const base = sheetsUrl.trim().replace(/\/$/, '');
  if (!base) return '';
  const sep = base.includes('?') ? '&' : '?';
  return `${base}${sep}format=ics`;
}

export function buildVacationIcs(
  state: Pick<
    VacationState,
    'activities' | 'people' | 'branches' | 'hiddenBranches' | 'hiddenPeople'
  >,
  options?: { calendarName?: string },
): string {
  const name = options?.calendarName ?? 'לוח החופש';
  const stamp = stampUtcNow();
  const visible = state.activities.filter((a) =>
    isActivityVisible(a, state.people, state.hiddenBranches, state.hiddenPeople),
  );

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//KolMini//Vacation Board//HE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeText(name)}`,
    'X-WR-TIMEZONE:Asia/Jerusalem',
    'BEGIN:VTIMEZONE',
    'TZID:Asia/Jerusalem',
    'BEGIN:STANDARD',
    'TZOFFSETFROM:+0200',
    'TZOFFSETTO:+0200',
    'TZNAME:IST',
    'DTSTART:19700101T000000',
    'END:STANDARD',
    'END:VTIMEZONE',
  ];

  for (const activity of visible) {
    const who = activityParticipantsLabel(
      activity,
      state.people as Person[],
      state.branches,
    );
    const { startLine, endLine } = eventTimes(activity);
    const descParts = [
      activity.description,
      TIME_LABELS[activity.timeOfDay],
      who ? `משתתפים: ${who}` : '',
      'מקור: לוח החופש המשפחתי',
    ].filter(Boolean);

    const eventLines = [
      'BEGIN:VEVENT',
      `UID:${activity.id}@vacation-board.kolmini`,
      `DTSTAMP:${stamp}`,
      startLine,
      endLine,
      `SUMMARY:${escapeText(activity.title)}`,
      `DESCRIPTION:${escapeText(descParts.join('\n'))}`,
    ];
    if (activity.location) {
      eventLines.push(`LOCATION:${escapeText(activity.location)}`);
    }
    eventLines.push('END:VEVENT');
    lines.push(...eventLines);
  }

  lines.push('END:VCALENDAR');
  return `${lines.map(foldLine).join('\r\n')}\r\n`;
}

export function downloadIcsFile(ics: string, filename = 'vacation-board.ics'): void {
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
