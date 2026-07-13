import type { VacationState } from '../types';

export const defaultState: VacationState = {
  rangeStart: '2026-07-12',
  rangeEnd: '2026-08-31',
  hiddenBranches: [],
  hiddenPeople: [],
  branches: [{ id: 'ben-artzi', name: 'משפחת בן ארצי', color: '#45B7D1' }],
  people: [],
  activities: [],
};
