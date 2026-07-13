/**
 * כתובת ה-Web App של Apps Script — משותפת לכל המשפחה.
 * כל מי שנכנס ללוח מתחבר אוטומטית לכאן (בלי להדביק קישור).
 *
 * איך למלא: Deploy ב-Apps Script → העתיקי את כתובת ה-/exec → הדביקי כאן.
 */
export const SHARED_SHEETS_URL =
  (import.meta.env.VITE_SHEETS_URL as string | undefined)?.trim() ||
  // <<< הדביקי כאן את כתובת ה-Web App >>>
  '';
