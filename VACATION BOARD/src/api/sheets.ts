import type { VacationState } from '../types';
import { SHARED_SHEETS_URL } from '../config';

const URL_KEY = 'vacation-board-sheets-url';

export type SyncStatus =
  | 'local'
  | 'loading'
  | 'synced'
  | 'saving'
  | 'error'
  | 'offline';

/** תמיד מעדיפים את הכתובת המשובצת באפליקציה */
export function getSheetsUrl(): string {
  const shared = SHARED_SHEETS_URL.trim();
  if (shared) return shared;
  return localStorage.getItem(URL_KEY)?.trim() ?? '';
}

export function setSheetsUrl(url: string) {
  const cleaned = url.trim();
  if (cleaned) localStorage.setItem(URL_KEY, cleaned);
  else localStorage.removeItem(URL_KEY);
}

export function hasBuiltInSheetsUrl(): boolean {
  return SHARED_SHEETS_URL.trim().length > 0;
}

function normalizeUrl(url: string): string {
  return url.trim().replace(/\/$/, '');
}

export async function fetchBoardState(
  url: string,
): Promise<{ state: VacationState; updatedAt: string }> {
  const endpoint = normalizeUrl(url);
  const res = await fetch(`${endpoint}?t=${Date.now()}`, {
    method: 'GET',
    redirect: 'follow',
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`GET ${res.status}`);
  const data = await res.json();
  if (!data?.ok || !data.state) throw new Error(data?.error || 'תשובה לא תקינה');
  return { state: data.state as VacationState, updatedAt: data.updatedAt || '' };
}

export async function saveBoardState(
  url: string,
  state: VacationState,
): Promise<{ updatedAt: string }> {
  const endpoint = normalizeUrl(url);
  // text/plain מונע preflight CORS מול Apps Script
  const res = await fetch(endpoint, {
    method: 'POST',
    redirect: 'follow',
    cache: 'no-store',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ state }),
  });
  if (!res.ok) throw new Error(`POST ${res.status}`);
  const data = await res.json();
  if (!data?.ok) throw new Error(data?.error || 'שמירה נכשלה');
  return { updatedAt: data.updatedAt || new Date().toISOString() };
}

/** מיזוג דו-כיווני: פריטים מקומיים גוברים על אותו id, פריטים חדשים מהשרת נשמרים */
export function mergeBoardStates(
  remote: VacationState,
  local: VacationState,
): VacationState {
  const byId = <T extends { id: string }>(remoteArr: T[], localArr: T[]): T[] => {
    const map = new Map<string, T>();
    for (const item of remoteArr) map.set(item.id, item);
    for (const item of localArr) map.set(item.id, item); // מקומי גובר
    return [...map.values()];
  };

  return {
    ...local,
    rangeStart: local.rangeStart || remote.rangeStart,
    rangeEnd:
      local.rangeEnd >= remote.rangeEnd ? local.rangeEnd : remote.rangeEnd,
    branches: byId(remote.branches, local.branches),
    people: byId(remote.people, local.people),
    activities: byId(remote.activities, local.activities),
    hiddenBranches: local.hiddenBranches ?? remote.hiddenBranches,
    hiddenPeople: local.hiddenPeople ?? remote.hiddenPeople,
  };
}
