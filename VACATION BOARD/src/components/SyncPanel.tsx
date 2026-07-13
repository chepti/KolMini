import { AnimatePresence, motion } from 'framer-motion';
import { useState, type FormEvent } from 'react';
import { hasBuiltInSheetsUrl } from '../api/sheets';
import { useVacation } from '../store/VacationContext';

const STATUS_LABEL: Record<string, string> = {
  local: 'לא מחובר',
  loading: 'טוען…',
  synced: 'מסונכרן',
  saving: 'שומר…',
  error: 'שגיאת סנכרון',
  offline: 'אין חיבור',
};

export function SyncPanel() {
  const {
    syncStatus,
    sheetsUrl,
    connectSheets,
    syncError,
    refreshFromSheets,
    hasBuiltInUrl,
  } = useVacation();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(sheetsUrl);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const builtIn = hasBuiltInUrl || hasBuiltInSheetsUrl();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg('');
    try {
      await connectSheets(url.trim());
      setMsg(
        builtIn
          ? 'רענון מהשרת המשותף בוצע.'
          : 'מחובר זמנית במכשיר זה. כדי שכולם יראו — שבצו את הכתובת ב-src/config.ts',
      );
      setTimeout(() => setOpen(false), 900);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'חיבור נכשל');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={`vb-sync-btn vb-sync-btn--${syncStatus}`}
        onClick={() => {
          setUrl(sheetsUrl);
          setMsg('');
          setOpen(true);
        }}
        title={syncError || STATUS_LABEL[syncStatus]}
      >
        📊 {STATUS_LABEL[syncStatus]}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="vb-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="vb-modal vb-sync-modal"
              role="dialog"
              aria-modal
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>סנכרון משפחתי</h2>
              {builtIn ? (
                <p className="vb-sync-help">
                  החיבור לנתונים משובץ באפליקציה — כולם רואים את אותו לוח
                  אוטומטית. אפשר לרענן ידנית אם משהו לא התעדכן.
                </p>
              ) : (
                <p className="vb-sync-help">
                  עדיין אין כתובת משובצת בקוד. הדביקי את כתובת ה־Web App של Apps
                  Script, ואז שלחי אותה לשיבוץ ב־<code>src/config.ts</code> כדי
                  שכל המשפחה תתחבר אוטומטית.
                </p>
              )}

              <form onSubmit={submit} className="vb-modal__form">
                {!builtIn && (
                  <label>
                    כתובת Web App
                    <input
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://script.google.com/macros/s/…/exec"
                      dir="ltr"
                      required
                    />
                  </label>
                )}

                {msg && <p className="vb-sync-msg">{msg}</p>}
                {syncError && !msg && (
                  <p className="vb-sync-msg vb-sync-msg--err">{syncError}</p>
                )}

                <div className="vb-modal__actions">
                  <button
                    type="button"
                    className="vb-pill-btn"
                    onClick={() => refreshFromSheets()}
                  >
                    רענון מהגיליון
                  </button>
                  <button
                    type="button"
                    className="vb-pill-btn"
                    onClick={() => setOpen(false)}
                  >
                    סגור
                  </button>
                  {!builtIn && (
                    <button type="submit" className="vb-cta" disabled={busy}>
                      {busy ? 'מתחבר…' : 'חבר'}
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
