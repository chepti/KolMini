import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { v4 as uuid } from 'uuid';
import { defaultState } from '../data/defaultState';
import type { Activity, Person, VacationState } from '../types';
import { SUMMER_COLORS } from '../types';

const STORAGE_KEY = 'vacation-board-v2';

interface VacationStore extends VacationState {
  toggleBranchVisibility: (branchId: string) => void;
  togglePersonVisibility: (personId: string) => void;
  setPersonColor: (personId: string, color: string) => void;
  addPerson: (person: Omit<Person, 'id' | 'color'> & { color?: string }) => void;
  addBranch: (name: string) => void;
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  updateActivity: (id: string, patch: Partial<Activity>) => void;
  removeActivity: (id: string) => void;
  setRange: (start: string, end: string) => void;
  resetDemo: () => void;
}

const VacationContext = createContext<VacationStore | null>(null);

function loadState(): VacationState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) } as VacationState;
  } catch {
    return defaultState;
  }
}

export function VacationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<VacationState>(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const toggleBranchVisibility = useCallback((branchId: string) => {
    setState((prev) => {
      const hidden = prev.hiddenBranches.includes(branchId)
        ? prev.hiddenBranches.filter((id) => id !== branchId)
        : [...prev.hiddenBranches, branchId];
      return { ...prev, hiddenBranches: hidden };
    });
  }, []);

  const togglePersonVisibility = useCallback((personId: string) => {
    setState((prev) => {
      const hidden = prev.hiddenPeople.includes(personId)
        ? prev.hiddenPeople.filter((id) => id !== personId)
        : [...prev.hiddenPeople, personId];
      return { ...prev, hiddenPeople: hidden };
    });
  }, []);

  const setPersonColor = useCallback((personId: string, color: string) => {
    setState((prev) => ({
      ...prev,
      people: prev.people.map((p) => (p.id === personId ? { ...p, color } : p)),
    }));
  }, []);

  const addPerson = useCallback(
    (person: Omit<Person, 'id' | 'color'> & { color?: string }) => {
      setState((prev) => ({
        ...prev,
        people: [
          ...prev.people,
          {
            ...person,
            id: uuid(),
            color:
              person.color ??
              SUMMER_COLORS[prev.people.length % SUMMER_COLORS.length],
          },
        ],
      }));
    },
    [],
  );

  const addBranch = useCallback((name: string) => {
    setState((prev) => ({
      ...prev,
      branches: [...prev.branches, { id: uuid(), name }],
    }));
  }, []);

  const addActivity = useCallback((activity: Omit<Activity, 'id'>) => {
    setState((prev) => ({
      ...prev,
      activities: [...prev.activities, { ...activity, id: uuid() }],
    }));
  }, []);

  const updateActivity = useCallback((id: string, patch: Partial<Activity>) => {
    setState((prev) => ({
      ...prev,
      activities: prev.activities.map((a) =>
        a.id === id ? { ...a, ...patch } : a,
      ),
    }));
  }, []);

  const removeActivity = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      activities: prev.activities.filter((a) => a.id !== id),
    }));
  }, []);

  const setRange = useCallback((start: string, end: string) => {
    setState((prev) => ({ ...prev, rangeStart: start, rangeEnd: end }));
  }, []);

  const resetDemo = useCallback(() => {
    setState(defaultState);
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      toggleBranchVisibility,
      togglePersonVisibility,
      setPersonColor,
      addPerson,
      addBranch,
      addActivity,
      updateActivity,
      removeActivity,
      setRange,
      resetDemo,
    }),
    [
      state,
      toggleBranchVisibility,
      togglePersonVisibility,
      setPersonColor,
      addPerson,
      addBranch,
      addActivity,
      updateActivity,
      removeActivity,
      setRange,
      resetDemo,
    ],
  );

  return (
    <VacationContext.Provider value={value}>{children}</VacationContext.Provider>
  );
}

export function useVacation() {
  const ctx = useContext(VacationContext);
  if (!ctx) throw new Error('useVacation must be used within VacationProvider');
  return ctx;
}
