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
  hasBuiltInSheetsUrl,
  mergeBoardStates,
  saveBoardState,
  setSheetsUrl,
  type SyncStatus,
} from '../api/sheets';
import { SHARED_SHEETS_URL } from '../config';
import { defaultState } from '../data/defaultState';
import type { Activity, Person, VacationState } from '../types';
import { normalizeDateKey } from '../utils/calendar';
import { familyShades, nextBranchColor, nextPersonColorInBranch } from '../utils/colors';

const STORAGE_KEY = 'vacation-board-v2';
const VIEW_KEY = 'vacation-board-view-mode';

export type ViewMode = 'all' | 'week';

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
  hasBuiltInUrl: boolean;
  viewMode: ViewMode;
  weekIndex: number;
  setViewMode: (mode: ViewMode) => void;
  setWeekIndex: (index: number | ((n: number) => number)) => void;
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
  const initialUrl = getSheetsUrl();
  const [state, setState] = useState<VacationState>(loadLocal);
  const [sheetsUrl, setSheetsUrlState] = useState(initialUrl);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(
    initialUrl ? 'loading' : 'local',
  );
  const [syncError, setSyncError] = useState('');
  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    const v = localStorage.getItem(VIEW_KEY);
    return v === 'week' ? 'week' : 'all';
  });
  const [weekIndex, setWeekIndex] = useState(0);

  const dirtyRef = useRef(false);
  const skipNextSave = useRef(false);
  const readyRef = useRef(!initialUrl);
  const updatedAtRef = useRef('');
  const fingerprintRef = useRef(stateFingerprint(loadLocal()));
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setViewMode = useCallback((mode: ViewMode) => {
    setViewModeState(mode);
    localStorage.setItem(VIEW_KEY, mode);
  }, []);

  const pushToSheets = useCallback(
    async (next: VacationState, url = sheetsUrl) => {
      if (!url) return;
      try {
        // לפני שמירה — מושכים מהשרת ומוזגים כדי לא לדרוס שינויים של אחרים
        let payload = next;
        try {
          const remote = await fetchBoardState(url);
          if (
            remote.updatedAt &&
            remote.updatedAt !== updatedAtRef.current
          ) {
            const merged = mergeState(
              mergeBoardStates(mergeState(remote.state), next),
            );
            payload = merged;
            skipNextSave.current = true;
            fingerprintRef.current = stateFingerprint(merged);
            setState(merged);
          }
        } catch {
          /* אם הקריאה נכשלה — ממשיכים עם השמירה המקומית */
        }

        const { updatedAt } = await saveBoardState(url, payload);
        updatedAtRef.current = updatedAt;
        fingerprintRef.current = stateFingerprint(payload);
        dirtyRef.current = false;
        setSyncStatus('synced');
        setSyncError('');
      } catch (err) {
        dirtyRef.current = false; // לא לחסום polling אחרי כשל
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
      }, 1000);
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
    setSyncStatus((s) => (s === 'synced' ? s : 'loading'));
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
      // אם אין כתובת משובצת — שומרים מקומית כגיבוי זמני
      if (!hasBuiltInSheetsUrl()) {
        setSheetsUrl(url);
      }
      setSheetsUrlState(getSheetsUrl() || url);
      const activeUrl = SHARED_SHEETS_URL.trim() || url;
      readyRef.current = false;
      setSyncStatus('loading');
      try {
        const { state: remote, updatedAt } = await fetchBoardState(activeUrl);
        const hasRemoteData =
          (remote.people?.length ?? 0) > 0 ||
          (remote.activities?.length ?? 0) > 0 ||
          (remote.branches?.length ?? 0) > 0;

        if (hasRemoteData) {
          const merged = mergeState(
            mergeBoardStates(mergeState(remote), stateRef.current),
          );
          updatedAtRef.current = updatedAt;
          // דוחפים מיזוג כדי לא לאבד אף צד
          await saveBoardState(activeUrl, merged);
          applyRemote(merged, new Date().toISOString());
        } else {
          const local = stateRef.current;
          await pushToSheets(local, activeUrl);
          skipNextSave.current = true;
          readyRef.current = true;
          fingerprintRef.current = stateFingerprint(local);
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

  // חיבור אוטומטי לכתובת המשובצת + polling תכוף
  useEffect(() => {
    const url = getSheetsUrl();
    if (!url) return;
    setSheetsUrlState(url);
    void refreshFromSheets();

    const id = window.setInterval(() => {
      if (document.hidden) return;
      void (async () => {
        try {
          const { state: remote, updatedAt } = await fetchBoardState(url);
          if (!updatedAt || updatedAt === updatedAtRef.current) return;
          if (dirtyRef.current) {
            // בזמן עריכה — ממזגים במקום לדרוס
            const merged = mergeState(
              mergeBoardStates(mergeState(remote), stateRef.current),
            );
            updatedAtRef.current = updatedAt;
            const fp = stateFingerprint(merged);
            if (fp !== fingerprintRef.current) {
              fingerprintRef.current = fp;
              skipNextSave.current = true;
              setState(merged);
            }
            return;
          }
          applyRemote(remote, updatedAt);
        } catch {
          /* שקט */
        }
      })();
    }, 8000);

    return () => window.clearInterval(id);
  }, [refreshFromSheets, applyRemote]);

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
      hasBuiltInUrl: hasBuiltInSheetsUrl(),
      viewMode,
      weekIndex,
      setViewMode,
      setWeekIndex,
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
      viewMode,
      weekIndex,
      setViewMode,
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
