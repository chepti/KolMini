import type { VacationState } from '../types';

export const defaultState: VacationState = {
  rangeStart: '2026-07-12',
  rangeEnd: '2026-08-15',
  hiddenBranches: [],
  hiddenPeople: [],
  branches: [{ id: 'ben-artzi', name: 'משפחת בן ארצי' }],
  people: [],
  activities: [],
};
