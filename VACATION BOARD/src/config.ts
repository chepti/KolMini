/**
 * כתובת ה-Web App של Apps Script — משותפת לכל המשפחה.
 * כל מי שנכנס ללוח מתחבר אוטומטית לכאן (בלי להדביק קישור).
 */
export const SHARED_SHEETS_URL =
  (import.meta.env.VITE_SHEETS_URL as string | undefined)?.trim() ||
  'https://script.google.com/macros/s/AKfycbwxbxJF3vClP7ql1PunoQwvBC3O-ubJMp5Ou2iR86jzo9uBR3qwaUNhGivgs-2M-H6JIQ/exec';
