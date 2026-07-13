import type { VacationState } from '../types';

const URL_KEY = 'vacation-board-sheets-url';

export type SyncStatus =
  | 'local'
  | 'loading'
  | 'synced'
  | 'saving'
  | 'error'
  | 'offline';

export function getSheetsUrl(): string {
  return localStorage.getItem(URL_KEY)?.trim() ?? '';
}

export function setSheetsUrl(url: string) {
  const cleaned = url.trim();
  if (cleaned) localStorage.setItem(URL_KEY, cleaned);
  else localStorage.removeItem(URL_KEY);
}

function normalizeUrl(url: string): string {
  return url.trim().replace(/\/$/, '');
}

export async function fetchBoardState(
  url: string,
): Promise<{ state: VacationState; updatedAt: string }> {
  const endpoint = normalizeUrl(url);
  const res = await fetch(endpoint, { method: 'GET', redirect: 'follow' });
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
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ state }),
  });
  if (!res.ok) throw new Error(`POST ${res.status}`);
  const data = await res.json();
  if (!data?.ok) throw new Error(data?.error || 'שמירה נכשלה');
  return { updatedAt: data.updatedAt || new Date().toISOString() };
}
