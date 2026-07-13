import { AnimatePresence, motion } from 'framer-motion';
import { useState, type FormEvent } from 'react';
import { useVacation } from '../store/VacationContext';
import { SUMMER_COLORS } from '../types';

export function Sidebar() {
  const {
    branches,
    people,
    hiddenBranches,
    hiddenPeople,
    toggleBranchVisibility,
    togglePersonVisibility,
    setPersonColor,
    addPerson,
    addBranch,
  } = useVacation();

  const [newBranch, setNewBranch] = useState('');
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [isChild, setIsChild] = useState(true);
  const [colorOpen, setColorOpen] = useState<string | null>(null);

  const submitBranch = (e: FormEvent) => {
    e.preventDefault();
    if (!newBranch.trim()) return;
    addBranch(newBranch.trim());
    setNewBranch('');
  };

  const submitPerson = (e: FormEvent) => {
    e.preventDefault();
    if (!addingTo || !newName.trim()) return;
    addPerson({ name: newName.trim(), branchId: addingTo, isChild });
    setNewName('');
    setAddingTo(null);
    setIsChild(true);
  };

  return (
    <aside className="vb-sidebar">
      <div className="vb-sidebar__head">
        <h2>המשפחה</h2>
        <p>הצגה / הסתרה · בחירת צבע</p>
      </div>

      <div className="vb-sidebar__list">
        {branches.map((branch, bi) => {
          const branchPeople = people.filter((p) => p.branchId === branch.id);
          const adults = branchPeople.filter((p) => !p.isChild);
          const kids = branchPeople.filter((p) => p.isChild);
          const branchHidden = hiddenBranches.includes(branch.id);

          return (
            <motion.section
              key={branch.id}
              className={`vb-branch ${branchHidden ? 'is-hidden' : ''}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: bi * 0.06 }}
            >
              <div className="vb-branch__header">
                <button
                  type="button"
                  className="vb-eye"
                  onClick={() => toggleBranchVisibility(branch.id)}
                  title={branchHidden ? 'הצג ענף' : 'הסתר ענף'}
                  aria-label={branchHidden ? 'הצג ענף' : 'הסתר ענף'}
                >
                  {branchHidden ? '🙈' : '👀'}
                </button>
                <h3>{branch.name}</h3>
                <button
                  type="button"
                  className="vb-mini-add"
                  onClick={() => setAddingTo(branch.id)}
                  title="הוסף אדם"
                >
                  +
                </button>
              </div>

              <AnimatePresence>
                {!branchHidden && (
                  <motion.div
                    className="vb-branch__people"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    {[...adults, ...kids].map((person) => {
                      const personHidden = hiddenPeople.includes(person.id);
                      return (
                        <div
                          key={person.id}
                          className={`vb-person ${person.isChild ? 'is-child' : ''} ${personHidden ? 'is-dim' : ''}`}
                        >
                          <button
                            type="button"
                            className="vb-eye vb-eye--sm"
                            onClick={() => togglePersonVisibility(person.id)}
                            title={personHidden ? 'הצג' : 'הסתר'}
                          >
                            {personHidden ? '🙈' : '👀'}
                          </button>

                          <div className="vb-person__color-wrap">
                            <button
                              type="button"
                              className="vb-swatch"
                              style={{ background: person.color }}
                              onClick={() =>
                                setColorOpen(colorOpen === person.id ? null : person.id)
                              }
                              title="בחר צבע"
                              aria-label={`צבע של ${person.name}`}
                            />
                            <AnimatePresence>
                              {colorOpen === person.id && (
                                <motion.div
                                  className="vb-palette"
                                  initial={{ opacity: 0, scale: 0.9, y: -4 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.9 }}
                                >
                                  {SUMMER_COLORS.map((c) => (
                                    <button
                                      key={c}
                                      type="button"
                                      className={`vb-palette__dot ${person.color === c ? 'is-active' : ''}`}
                                      style={{ background: c }}
                                      onClick={() => {
                                        setPersonColor(person.id, c);
                                        setColorOpen(null);
                                      }}
                                    />
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          <span className="vb-person__name">
                            {person.name}
                            {person.isChild && <span className="vb-kid-tag">ילד/ה</span>}
                          </span>
                        </div>
                      );
                    })}

                    {addingTo === branch.id && (
                      <form className="vb-add-person" onSubmit={submitPerson}>
                        <input
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          placeholder="שם..."
                          autoFocus
                        />
                        <label className="vb-check">
                          <input
                            type="checkbox"
                            checked={isChild}
                            onChange={(e) => setIsChild(e.target.checked)}
                          />
                          ילד/ה
                        </label>
                        <div className="vb-add-person__actions">
                          <button type="submit" className="vb-pill-btn vb-pill-btn--fill">
                            הוסף
                          </button>
                          <button
                            type="button"
                            className="vb-pill-btn"
                            onClick={() => setAddingTo(null)}
                          >
                            ביטול
                          </button>
                        </div>
                      </form>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          );
        })}
      </div>

      <form className="vb-add-branch" onSubmit={submitBranch}>
        <input
          value={newBranch}
          onChange={(e) => setNewBranch(e.target.value)}
          placeholder="ענף משפחה חדש..."
        />
        <button type="submit" className="vb-pill-btn vb-pill-btn--fill">
          + ענף
        </button>
      </form>
    </aside>
  );
}
