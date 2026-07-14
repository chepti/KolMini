import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useVacation } from '../store/VacationContext';
import {
  buildVacationIcs,
  downloadIcsFile,
  sheetsUrlToIcsUrl,
} from '../utils/ics';

export function GoogleCalendarPanel() {
  const {
    activities,
    people,
    branches,
    hiddenBranches,
    hiddenPeople,
    sheetsUrl,
  } = useVacation();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const icsUrl = useMemo(() => sheetsUrlToIcsUrl(sheetsUrl), [sheetsUrl]);

  const copyUrl = async () => {
    if (!icsUrl) return;
    try {
      await navigator.clipboard.writeText(icsUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('העתיקו את הקישור:', icsUrl);
    }
  };

  const downloadNow = () => {
    const ics = buildVacationIcs({
      activities,
      people,
      branches,
      hiddenBranches,
      hiddenPeople,
    });
    downloadIcsFile(ics, 'לוח-החופש.ics');
  };

  return (
    <>
      <button
        type="button"
        className="vb-gcal-btn"
        onClick={() => {
          setCopied(false);
          setOpen(true);
        }}
        title="הוספת לוח החופש כיומן נוסף בגוגל"
      >
        📅 ליומן גוגל
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
              className="vb-modal vb-gcal-modal"
              role="dialog"
              aria-modal
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>יומן גוגל · לוח החופש</h2>
              <p className="vb-sync-help">
                מוסיפים את הלוח המשפחתי כיומן נוסף. גוגל ישאב ממנו מעת לעת
                (בדרך כלל כל כמה שעות) — שינויים בלוח יופיעו גם אצלכם ביומן.
              </p>

              <ol className="vb-gcal-steps">
                <li>העתיקו את קישור המנוי למטה</li>
                <li>
                  בגוגל יומן → יומנים אחרים →{' '}
                  <strong>+</strong> → מכתובת URL
                </li>
                <li>הדביקו את הקישור ושמרו</li>
              </ol>

              {icsUrl ? (
                <label className="vb-gcal-url">
                  קישור מנוי (מתעדכן מהלוח)
                  <input value={icsUrl} readOnly dir="ltr" onFocus={(e) => e.target.select()} />
                </label>
              ) : (
                <p className="vb-sync-msg vb-sync-msg--err">
                  אין חיבור לגיליון — קודם חברו סנכרון משפחתי.
                </p>
              )}

              <div className="vb-modal__actions">
                <button
                  type="button"
                  className="vb-cta"
                  onClick={copyUrl}
                  disabled={!icsUrl}
                >
                  {copied ? 'הועתק ✓' : 'העתק קישור מנוי'}
                </button>
                <button type="button" className="vb-pill-btn" onClick={downloadNow}>
                  הורדת קובץ חד־פעמי
                </button>
                <button
                  type="button"
                  className="vb-pill-btn"
                  onClick={() => setOpen(false)}
                >
                  סגור
                </button>
              </div>

              <p className="vb-gcal-note">
                הורדת קובץ לא מתעדכנת לבד — רק המנוי מהקישור. אחרי עדכון קוד
                Apps Script צריך Deploy מחדש פעם אחת כדי שהקישור יעבוד.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
