import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useVacation } from '../store/VacationContext';
import { chunkIntoWeeks } from '../utils/calendar';
import { SyncPanel } from './SyncPanel';
import { GoogleCalendarPanel } from './GoogleCalendarPanel';

interface HeaderProps {
  onNewEvent: () => void;
}

export function Header({ onNewEvent }: HeaderProps) {
  const {
    rangeStart,
    rangeEnd,
    resetDemo,
    viewMode,
    setViewMode,
    weekIndex,
    setWeekIndex,
  } = useVacation();

  const weekCount = useMemo(
    () => chunkIntoWeeks(rangeStart, rangeEnd).length,
    [rangeStart, rangeEnd],
  );

  const canPrev = weekIndex > 0;
  const canNext = weekIndex < weekCount - 1;

  return (
    <header className="vb-header">
      <div className="vb-header__brand">
        <motion.div
          className="vb-sun"
          animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden
        >
          ☀️
        </motion.div>
        <div>
          <h1 className="vb-title">לוח החופש</h1>
          <p className="vb-subtitle">תוכניות קיץ של כל המשפחה · תאריך עברי</p>
        </div>
      </div>

      <div className="vb-header__actions">
        <SyncPanel />
        <GoogleCalendarPanel />

        <div className="vb-nav-pills" role="group" aria-label="תצוגה">
          <button
            type="button"
            className={`vb-pill-btn ${viewMode === 'all' ? 'vb-pill-btn--fill' : ''}`}
            onClick={() => setViewMode('all')}
          >
            כל השבועות
          </button>
          <button
            type="button"
            className={`vb-pill-btn ${viewMode === 'week' ? 'vb-pill-btn--fill' : ''}`}
            onClick={() => setViewMode('week')}
          >
            שבוע אחד
          </button>
        </div>

        {viewMode === 'week' && (
          <div className="vb-nav-pills vb-nav-pills--week" role="group" aria-label="מעבר בין שבועות">
            <button
              type="button"
              className="vb-pill-btn"
              disabled={!canPrev}
              onClick={() => setWeekIndex((i) => Math.max(0, i - 1))}
              title="לשבוע הקודם בטווח הקיץ"
            >
              ← שבוע קודם
            </button>
            <span className="vb-week-indicator" aria-live="polite">
              שבוע {weekIndex + 1} מתוך {Math.max(weekCount, 1)}
            </span>
            <button
              type="button"
              className="vb-pill-btn"
              disabled={!canNext}
              onClick={() =>
                setWeekIndex((i) => Math.min(Math.max(weekCount - 1, 0), i + 1))
              }
              title="לשבוע הבא בטווח הקיץ"
            >
              שבוע הבא →
            </button>
          </div>
        )}

        <motion.button
          type="button"
          className="vb-cta"
          onClick={onNewEvent}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.96 }}
        >
          + אירוע חדש
        </motion.button>
        <button
          type="button"
          className="vb-reset"
          onClick={() => {
            const ok = window.confirm(
              'לנקות את הלוח?\n\nפעולה זו מוחקת את כל האירועים והאנשים מהמכשיר הזה (ואם מחוברים לגיליון — גם יישמרו לשם).\n\nלא ניתן לבטל.',
            );
            if (ok) resetDemo();
          }}
          title="מוחק את כל האירועים — דורש אישור"
        >
          נקה לוח…
        </button>
      </div>
    </header>
  );
}
