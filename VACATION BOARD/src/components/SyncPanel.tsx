import { AnimatePresence, motion } from 'framer-motion';
import { useState, type FormEvent } from 'react';
import { useVacation } from '../store/VacationContext';

const STATUS_LABEL: Record<string, string> = {
  local: 'רק מקומי',
  loading: 'טוען מ-Sheets…',
  synced: 'מסונכרן עם Sheets',
  saving: 'שומר…',
  error: 'שגיאת סנכרון',
  offline: 'אין חיבור',
};

export function SyncPanel() {
  const { syncStatus, sheetsUrl, connectSheets, syncError, refreshFromSheets } =
    useVacation();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(sheetsUrl);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg('');
    try {
      await connectSheets(url.trim());
      setMsg('מחובר! הנתונים נשמרים בגיליון.');
      setTimeout(() => setOpen(false), 700);
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
              <h2>שמירה ב-Google Sheets</h2>
              <p className="vb-sync-help">
                צרו גיליון, הדביקו את קוד ה־Apps Script מתיקיית{' '}
                <code>apps-script</code>, פרסמו כ־Web App (Anyone), והדביקו כאן
                את הכתובת.
              </p>

              <form onSubmit={submit} className="vb-modal__form">
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

                {msg && <p className="vb-sync-msg">{msg}</p>}
                {syncError && !msg && (
                  <p className="vb-sync-msg vb-sync-msg--err">{syncError}</p>
                )}

                <div className="vb-modal__actions">
                  {sheetsUrl && (
                    <button
                      type="button"
                      className="vb-pill-btn"
                      onClick={() => refreshFromSheets()}
                    >
                      רענון מהגיליון
                    </button>
                  )}
                  <button
                    type="button"
                    className="vb-pill-btn"
                    onClick={() => setOpen(false)}
                  >
                    סגור
                  </button>
                  <button type="submit" className="vb-cta" disabled={busy}>
                    {busy ? 'מתחבר…' : 'חבר ושמור'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
