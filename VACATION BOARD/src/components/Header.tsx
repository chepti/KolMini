import { motion } from 'framer-motion';
import { useVacation } from '../store/VacationContext';
import { shiftRange } from '../utils/calendar';
import { SyncPanel } from './SyncPanel';

interface HeaderProps {
  onNewEvent: () => void;
}

export function Header({ onNewEvent }: HeaderProps) {
  const { rangeStart, rangeEnd, setRange, resetDemo } = useVacation();

  const shift = (days: number) => {
    const next = shiftRange(rangeStart, rangeEnd, days);
    setRange(next.rangeStart, next.rangeEnd);
  };

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
        <div className="vb-nav-pills">
          <button type="button" className="vb-pill-btn" onClick={() => shift(-7)}>
            ← שבוע קודם
          </button>
          <button type="button" className="vb-pill-btn" onClick={() => shift(7)}>
            שבוע הבא →
          </button>
        </div>
        <motion.button
          type="button"
          className="vb-cta"
          onClick={onNewEvent}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.96 }}
        >
          + אירוע חדש
        </motion.button>
        <button type="button" className="vb-reset" onClick={resetDemo} title="איפוס הלוח">
          איפוס
        </button>
      </div>
    </header>
  );
}
