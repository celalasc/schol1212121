// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Schedule from './components/Schedule';
import Settings from './components/Settings';
import AddLessonModal from './components/AddLessonModal';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleAddLesson = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  return (
    <Router>
      <div className="flex h-screen bg-orange-50">
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            showProfile={showProfile}
            setShowProfile={setShowProfile}
          />

          <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
            <Routes>
              <Route
                path="/"
                element={<Schedule onAddLesson={(date, time) => handleAddLesson(date, time)} />}
              />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>

        <AddLessonModal
          isOpen={showModal}
          onClose={handleCloseModal}
          initialDate={selectedDate || undefined}
          initialTime={selectedTime || undefined}
        />
      </div>
    </Router>
  );
}

export default App;
