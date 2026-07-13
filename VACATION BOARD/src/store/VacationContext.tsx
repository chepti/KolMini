import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { v4 as uuid } from 'uuid';
import {
  fetchBoardState,
  getSheetsUrl,
  saveBoardState,
  setSheetsUrl,
  type SyncStatus,
} from '../api/sheets';
import { defaultState } from '../data/defaultState';
import type { Activity, Person, VacationState } from '../types';
import { normalizeDateKey } from '../utils/calendar';
import { familyShades, nextBranchColor, nextPersonColorInBranch } from '../utils/colors';

const STORAGE_KEY = 'vacation-board-v2';

function loadLocal(): VacationState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    return mergeState(JSON.parse(raw) as VacationState);
  } catch {
    return defaultState;
  }
}

function mergeState(remote: Partial<VacationState>): VacationState {
  const rangeStart = normalizeDateKey(
    remote.rangeStart,
    defaultState.rangeStart,
  );
  let rangeEnd = normalizeDateKey(remote.rangeEnd, defaultState.rangeEnd);
  // לוח הקיץ — עד סוף אוגוסט
  if (rangeEnd < defaultState.rangeEnd) {
    rangeEnd = defaultState.rangeEnd;
  }

  return {
    ...defaultState,
    ...remote,
    rangeStart,
    rangeEnd,
    branches: remote.branches ?? [],
    people: remote.people ?? [],
    activities: (remote.activities ?? []).map((a) => ({
      ...a,
      startDate: normalizeDateKey(a.startDate, rangeStart),
      endDate: normalizeDateKey(a.endDate, a.startDate || rangeStart),
    })),
    hiddenBranches: remote.hiddenBranches ?? [],
    hiddenPeople: remote.hiddenPeople ?? [],
  };
}

function stateFingerprint(s: VacationState): string {
  return JSON.stringify({
    rangeStart: s.rangeStart,
    rangeEnd: s.rangeEnd,
    branches: s.branches,
    people: s.people,
    activities: s.activities,
    hiddenBranches: s.hiddenBranches,
    hiddenPeople: s.hiddenPeople,
  });
}

interface VacationStore extends VacationState {
  syncStatus: SyncStatus;
  syncError: string;
  sheetsUrl: string;
  toggleBranchVisibility: (branchId: string) => void;
  togglePersonVisibility: (personId: string) => void;
  setPersonColor: (personId: string, color: string) => void;
  setBranchColor: (branchId: string, color: string) => void;
  addPerson: (person: Omit<Person, 'id' | 'color'> & { color?: string }) => void;
  addBranch: (name: string) => void;
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  updateActivity: (id: string, patch: Partial<Activity>) => void;
  removeActivity: (id: string) => void;
  setRange: (start: string, end: string) => void;
  resetDemo: () => void;
  connectSheets: (url: string) => Promise<void>;
  refreshFromSheets: () => Promise<void>;
}

const VacationContext = createContext<VacationStore | null>(null);

export function VacationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<VacationState>(loadLocal);
  const [sheetsUrl, setSheetsUrlState] = useState(getSheetsUrl);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(
    getSheetsUrl() ? 'loading' : 'local',
  );
  const [syncError, setSyncError] = useState('');
  const dirtyRef = useRef(false);
  const skipNextSave = useRef(false);
  const readyRef = useRef(!getSheetsUrl());
  const updatedAtRef = useRef('');
  const fingerprintRef = useRef(stateFingerprint(loadLocal()));
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // גיבוי מקומי תמיד
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const pushToSheets = useCallback(
    async (next: VacationState, url = sheetsUrl) => {
      if (!url) return;
      // בלי להבהב "שומר" בכל שינוי קטן — רק בשגיאה/הצלחה שקטה
      try {
        const { updatedAt } = await saveBoardState(url, next);
        updatedAtRef.current = updatedAt;
        fingerprintRef.current = stateFingerprint(next);
        dirtyRef.current = false;
        setSyncStatus('synced');
        setSyncError('');
      } catch (err) {
        setSyncStatus('error');
        setSyncError(err instanceof Error ? err.message : 'שמירה נכשלה');
      }
    },
    [sheetsUrl],
  );

  const scheduleSave = useCallback(
    (next: VacationState) => {
      if (!sheetsUrl || !readyRef.current) return;
      dirtyRef.current = true;
      fingerprintRef.current = stateFingerprint(next);
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        void pushToSheets(next);
      }, 1200);
    },
    [sheetsUrl, pushToSheets],
  );

  const applyRemote = useCallback((remote: VacationState, updatedAt: string) => {
    const merged = mergeState(remote);
    const fp = stateFingerprint(merged);
    updatedAtRef.current = updatedAt;
    dirtyRef.current = false;
    readyRef.current = true;
    setSyncStatus('synced');
    setSyncError('');

    // לא מעדכנים state אם אין שינוי אמיתי — מונע הבהוב
    if (fp === fingerprintRef.current) return;

    fingerprintRef.current = fp;
    skipNextSave.current = true;
    setState(merged);
  }, []);

  const refreshFromSheets = useCallback(async () => {
    const url = getSheetsUrl();
    if (!url) {
      readyRef.current = true;
      setSyncStatus('local');
      return;
    }
    try {
      const { state: remote, updatedAt } = await fetchBoardState(url);
      applyRemote(remote, updatedAt);
    } catch (err) {
      readyRef.current = true;
      setSyncStatus('error');
      setSyncError(err instanceof Error ? err.message : 'טעינה נכשלה');
    }
  }, [applyRemote]);

  const connectSheets = useCallback(
    async (url: string) => {
      setSheetsUrl(url);
      setSheetsUrlState(url);
      readyRef.current = false;
      setSyncStatus('loading');
      try {
        const { state: remote, updatedAt } = await fetchBoardState(url);
        const hasRemoteData =
          (remote.people?.length ?? 0) > 0 ||
          (remote.activities?.length ?? 0) > 0 ||
          (remote.branches?.length ?? 0) > 1;

        if (hasRemoteData) {
          applyRemote(remote, updatedAt);
        } else {
          const local = loadLocal();
          await pushToSheets(local, url);
          skipNextSave.current = true;
          readyRef.current = true;
          fingerprintRef.current = stateFingerprint(local);
          setState(local);
          setSyncStatus('synced');
          setSyncError('');
        }
      } catch (err) {
        readyRef.current = true;
        setSyncStatus('error');
        setSyncError(err instanceof Error ? err.message : 'חיבור נכשל');
        throw err;
      }
    },
    [applyRemote, pushToSheets],
  );

  // טעינה ראשונית + polling עדין
  useEffect(() => {
    if (!sheetsUrl) return;
    void refreshFromSheets();

    const id = window.setInterval(() => {
      if (document.hidden || dirtyRef.current) return;
      void (async () => {
        try {
          const { state: remote, updatedAt } = await fetchBoardState(sheetsUrl);
          if (
            updatedAt &&
            updatedAt !== updatedAtRef.current &&
            !dirtyRef.current
          ) {
            applyRemote(remote, updatedAt);
          }
        } catch {
          /* שקט */
        }
      })();
    }, 45000);

    return () => window.clearInterval(id);
  }, [sheetsUrl, refreshFromSheets, applyRemote]);

  // שמירה אוטומטית אחרי שינוי מקומי
  useEffect(() => {
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    scheduleSave(state);
  }, [state, scheduleSave]);

  const patch = useCallback((updater: (prev: VacationState) => VacationState) => {
    setState(updater);
  }, []);

  const toggleBranchVisibility = useCallback((branchId: string) => {
    patch((prev) => {
      const hidden = prev.hiddenBranches.includes(branchId)
        ? prev.hiddenBranches.filter((id) => id !== branchId)
        : [...prev.hiddenBranches, branchId];
      return { ...prev, hiddenBranches: hidden };
    });
  }, [patch]);

  const togglePersonVisibility = useCallback((personId: string) => {
    patch((prev) => {
      const hidden = prev.hiddenPeople.includes(personId)
        ? prev.hiddenPeople.filter((id) => id !== personId)
        : [...prev.hiddenPeople, personId];
      return { ...prev, hiddenPeople: hidden };
    });
  }, [patch]);

  const setPersonColor = useCallback((personId: string, color: string) => {
    patch((prev) => ({
      ...prev,
      people: prev.people.map((p) => (p.id === personId ? { ...p, color } : p)),
    }));
  }, [patch]);

  const setBranchColor = useCallback((branchId: string, color: string) => {
    patch((prev) => {
      const members = prev.people.filter((p) => p.branchId === branchId);
      const shades = familyShades(color, Math.max(members.length, 1));
      let i = 0;
      return {
        ...prev,
        branches: prev.branches.map((b) =>
          b.id === branchId ? { ...b, color } : b,
        ),
        people: prev.people.map((p) => {
          if (p.branchId !== branchId) return p;
          const next = shades[i % shades.length];
          i += 1;
          return { ...p, color: next };
        }),
      };
    });
  }, [patch]);

  const addPerson = useCallback(
    (person: Omit<Person, 'id' | 'color'> & { color?: string }) => {
      patch((prev) => {
        const siblings = prev.people.filter((p) => p.branchId === person.branchId);
        const branch = prev.branches.find((b) => b.id === person.branchId);
        return {
          ...prev,
          people: [
            ...prev.people,
            {
              ...person,
              id: uuid(),
              color:
                person.color ??
                nextPersonColorInBranch(branch?.color, siblings.length),
            },
          ],
        };
      });
    },
    [patch],
  );

  const addBranch = useCallback((name: string) => {
    patch((prev) => ({
      ...prev,
      branches: [
        ...prev.branches,
        {
          id: uuid(),
          name,
          color: nextBranchColor(prev.branches.length),
        },
      ],
    }));
  }, [patch]);

  const addActivity = useCallback((activity: Omit<Activity, 'id'>) => {
    patch((prev) => ({
      ...prev,
      activities: [...prev.activities, { ...activity, id: uuid() }],
    }));
  }, [patch]);

  const updateActivity = useCallback((id: string, patchAct: Partial<Activity>) => {
    patch((prev) => ({
      ...prev,
      activities: prev.activities.map((a) =>
        a.id === id ? { ...a, ...patchAct } : a,
      ),
    }));
  }, [patch]);

  const removeActivity = useCallback((id: string) => {
    patch((prev) => ({
      ...prev,
      activities: prev.activities.filter((a) => a.id !== id),
    }));
  }, [patch]);

  const setRange = useCallback((start: string, end: string) => {
    patch((prev) => ({ ...prev, rangeStart: start, rangeEnd: end }));
  }, [patch]);

  const resetDemo = useCallback(() => {
    patch(() => defaultState);
  }, [patch]);

  const value = useMemo(
    () => ({
      ...state,
      syncStatus,
      syncError,
      sheetsUrl,
      toggleBranchVisibility,
      togglePersonVisibility,
      setPersonColor,
      setBranchColor,
      addPerson,
      addBranch,
      addActivity,
      updateActivity,
      removeActivity,
      setRange,
      resetDemo,
      connectSheets,
      refreshFromSheets,
    }),
    [
      state,
      syncStatus,
      syncError,
      sheetsUrl,
      toggleBranchVisibility,
      togglePersonVisibility,
      setPersonColor,
      setBranchColor,
      addPerson,
      addBranch,
      addActivity,
      updateActivity,
      removeActivity,
      setRange,
      resetDemo,
      connectSheets,
      refreshFromSheets,
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
