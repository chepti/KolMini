import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState, type FormEvent } from 'react';
import { useVacation } from '../store/VacationContext';
import type { Activity, ParticipantMode, TimeOfDay } from '../types';
import { SUMMER_COLORS, TIME_LABELS } from '../types';

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  editActivity?: Activity | null;
  defaultDate?: string;
}

function emptyForm(defaultDate?: string) {
  const today = new Date().toISOString().slice(0, 10);
  return {
    title: '',
    startDate: defaultDate ?? today,
    endDate: defaultDate ?? today,
    timeOfDay: 'morning' as TimeOfDay,
    location: '',
    participantMode: 'people' as ParticipantMode,
    branchIds: [] as string[],
    personIds: [] as string[],
    color: '',
  };
}

function fromActivity(a: Activity) {
  return {
    title: a.title,
    startDate: a.startDate,
    endDate: a.endDate,
    timeOfDay: a.timeOfDay,
    location: a.location ?? '',
    participantMode: a.participantMode,
    branchIds: [...a.branchIds],
    personIds: [...a.personIds],
    color: a.color ?? '',
  };
}

export function EventModal({ open, onClose, editActivity, defaultDate }: EventModalProps) {
  const { branches, people, addActivity, updateActivity, removeActivity } = useVacation();
  const [form, setForm] = useState(() => emptyForm(defaultDate));

  useEffect(() => {
    if (open) {
      setForm(editActivity ? fromActivity(editActivity) : emptyForm(defaultDate));
    }
  }, [open, editActivity, defaultDate]);

  const toggleBranch = (id: string) => {
    setForm((f) => ({
      ...f,
      branchIds: f.branchIds.includes(id)
        ? f.branchIds.filter((x) => x !== id)
        : [...f.branchIds, id],
    }));
  };

  const togglePerson = (id: string) => {
    setForm((f) => ({
      ...f,
      personIds: f.personIds.includes(id)
        ? f.personIds.filter((x) => x !== id)
        : [...f.personIds, id],
    }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const end = form.endDate < form.startDate ? form.startDate : form.endDate;
    const payload = {
      title: form.title.trim(),
      startDate: form.startDate,
      endDate: end,
      timeOfDay: form.timeOfDay,
      location: form.location.trim() || undefined,
      participantMode: form.participantMode,
      branchIds: form.participantMode === 'branch' ? form.branchIds : [],
      personIds: form.participantMode === 'people' ? form.personIds : [],
      color: form.color || undefined,
    };

    if (editActivity) {
      updateActivity(editActivity.id, payload);
    } else {
      addActivity(payload);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="vb-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="vb-modal"
            role="dialog"
            aria-modal
            aria-labelledby="vb-modal-title"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="vb-modal-title">{editActivity ? 'עריכת אירוע' : 'אירוע חדש'}</h2>

            <form onSubmit={submit} className="vb-modal__form">
              <label>
                מה קורה?
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="ים, טיול, מחנה..."
                  required
                  autoFocus
                />
              </label>

              <div className="vb-modal__row">
                <label>
                  מתאריך
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    required
                  />
                </label>
                <label>
                  עד תאריך
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    required
                  />
                </label>
              </div>

              <fieldset className="vb-time-pills">
                <legend>מתי ביום?</legend>
                {(Object.keys(TIME_LABELS) as TimeOfDay[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`vb-chip ${form.timeOfDay === t ? 'is-active' : ''}`}
                    onClick={() => setForm({ ...form, timeOfDay: t })}
                  >
                    {TIME_LABELS[t]}
                  </button>
                ))}
              </fieldset>

              <fieldset className="vb-time-pills">
                <legend>צבע האירוע</legend>
                <div className="vb-event-colors">
                  <button
                    type="button"
                    className={`vb-palette__dot vb-palette__dot--auto ${!form.color ? 'is-active' : ''}`}
                    onClick={() => setForm({ ...form, color: '' })}
                    title="אוטומטי לפי משתתפים"
                  >
                    א
                  </button>
                  {SUMMER_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`vb-palette__dot ${form.color === c ? 'is-active' : ''}`}
                      style={{ background: c }}
                      onClick={() => setForm({ ...form, color: c })}
                    />
                  ))}
                </div>
              </fieldset>

              <label>
                מיקום
                <input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="בבית / חוף / ירושלים..."
                />
              </label>

              <fieldset className="vb-who">
                <legend>מי משתתף?</legend>
                <div className="vb-who__modes">
                  {(
                    [
                      ['all', 'כולם'],
                      ['branch', 'ענף'],
                      ['people', 'אנשים'],
                    ] as const
                  ).map(([mode, label]) => (
                    <button
                      key={mode}
                      type="button"
                      className={`vb-chip ${form.participantMode === mode ? 'is-active' : ''}`}
                      onClick={() => setForm({ ...form, participantMode: mode })}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {form.participantMode === 'branch' && (
                  <div className="vb-who__list">
                    {branches.map((b) => (
                      <label key={b.id} className="vb-check-pill">
                        <input
                          type="checkbox"
                          checked={form.branchIds.includes(b.id)}
                          onChange={() => toggleBranch(b.id)}
                        />
                        {b.name}
                      </label>
                    ))}
                  </div>
                )}

                {form.participantMode === 'people' && (
                  <div className="vb-who__list">
                    {branches.map((b) => (
                      <div key={b.id} className="vb-who__branch">
                        <strong>{b.name}</strong>
                        {people
                          .filter((p) => p.branchId === b.id)
                          .map((p) => (
                            <label key={p.id} className="vb-check-pill">
                              <input
                                type="checkbox"
                                checked={form.personIds.includes(p.id)}
                                onChange={() => togglePerson(p.id)}
                              />
                              <span className="vb-dot" style={{ background: p.color }} />
                              {p.name}
                            </label>
                          ))}
                      </div>
                    ))}
                  </div>
                )}
              </fieldset>

              <div className="vb-modal__actions">
                {editActivity && (
                  <button
                    type="button"
                    className="vb-pill-btn vb-pill-btn--danger"
                    onClick={() => {
                      removeActivity(editActivity.id);
                      onClose();
                    }}
                  >
                    מחק
                  </button>
                )}
                <button type="button" className="vb-pill-btn" onClick={onClose}>
                  ביטול
                </button>
                <button type="submit" className="vb-cta">
                  {editActivity ? 'שמור' : 'צור אירוע'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
