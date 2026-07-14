export type TimeOfDay = 'morning' | 'noon' | 'evening' | 'all-day';

export type ParticipantMode = 'all' | 'branch' | 'people';

export interface Branch {
  id: string;
  name: string;
  color?: string;
}

export interface Person {
  id: string;
  name: string;
  color: string;
  branchId: string;
  isChild?: boolean;
}

export interface Activity {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  timeOfDay: TimeOfDay;
  location?: string;
  /** פירוט חופשי — למשל תוכנית לפי ימים */
  description?: string;
  participantMode: ParticipantMode;
  branchIds: string[];
  personIds: string[];
  color?: string;
}

export interface VacationState {
  branches: Branch[];
  people: Person[];
  activities: Activity[];
  hiddenBranches: string[];
  hiddenPeople: string[];
  rangeStart: string;
  rangeEnd: string;
}

export const SUMMER_COLORS = [
  '#FF6B6B',
  '#FF8E53',
  '#FFD93D',
  '#6BCB77',
  '#4ECDC4',
  '#45B7D1',
  '#F38181',
  '#AA96DA',
  '#FCBAD3',
  '#A8E6CF',
  '#FFDAC1',
  '#B5EAD7',
] as const;

export const TIME_LABELS: Record<TimeOfDay, string> = {
  morning: 'בוקר',
  noon: 'צהריים',
  evening: 'ערב',
  'all-day': 'כל היום',
};
