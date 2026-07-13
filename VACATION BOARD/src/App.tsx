import { useState } from 'react';
import { CalendarBoard } from './components/CalendarBoard';
import { EventModal } from './components/EventModal';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { VacationProvider } from './store/VacationContext';
import type { Activity } from './types';
import './index.css';

function BoardApp() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editActivity, setEditActivity] = useState<Activity | null>(null);
  const [defaultDate, setDefaultDate] = useState<string | undefined>();

  const openNew = (date?: string) => {
    setEditActivity(null);
    setDefaultDate(date);
    setModalOpen(true);
  };

  const openEdit = (activity: Activity) => {
    setEditActivity(activity);
    setDefaultDate(undefined);
    setModalOpen(true);
  };

  const close = () => {
    setModalOpen(false);
    setEditActivity(null);
  };

  return (
    <div className="vb-app">
      <div className="vb-bg-blobs" aria-hidden>
        <span className="blob blob-1" />
        <span className="blob blob-2" />
        <span className="blob blob-3" />
      </div>

      <Header onNewEvent={() => openNew()} />

      <div className="vb-layout">
        <main className="vb-main">
          <CalendarBoard onEdit={openEdit} onNewAtDate={openNew} />
        </main>
        <Sidebar />
      </div>

      <EventModal
        open={modalOpen}
        onClose={close}
        editActivity={editActivity}
        defaultDate={defaultDate}
      />
    </div>
  );
}

export default function App() {
  return (
    <VacationProvider>
      <BoardApp />
    </VacationProvider>
  );
}
