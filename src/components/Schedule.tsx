// src/components/Schedule.tsx
import React, { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLessonStore } from '../store/useLessonStore';
import type { Lesson } from '../types';
import type { Student } from '../types';
import { useMemo } from 'react';

interface ScheduleProps {
  onAddLesson: (date: string, time: string) => void;
}

export default function Schedule({ onAddLesson }: ScheduleProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const hours = Array.from({ length: 14 }, (_, i) => i + 7);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const lessons = useLessonStore((state) => state.lessons);
  const students = useMemo(() => {
    // Ideally, fetch students from a store or API
    // Using static data for simplicity
    return [
      {
        id: '1',
        firstName: 'Alice',
        lastName: 'Johnson',
        level: 'intermediate',
        email: 'alice@example.com',
      },
      {
        id: '2',
        firstName: 'Bob',
        lastName: 'Smith',
        level: 'beginner',
        email: 'bob@example.com',
      },
    ] as Student[];
  }, []);

  const getWeekDates = (date: Date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return {
      start,
      end,
      month:
        start.getMonth() === end.getMonth()
          ? start.toLocaleString('default', { month: 'long' })
          : `${start.toLocaleString('default', {
              month: 'short',
            })} - ${end.toLocaleString('default', { month: 'short' })}`,
    };
  };

  const weekInfo = getWeekDates(currentWeek);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newDate);
  };

  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      const lessonDate = new Date(lesson.date);
      return lessonDate >= weekInfo.start && lessonDate <= weekInfo.end;
    });
  }, [lessons, weekInfo]);

  const getLessonsForSlot = (day: string, hour: number) => {
    const dayIndex = days.indexOf(day);
    if (dayIndex === -1) return [];

    const lessonDate = new Date(weekInfo.start);
    lessonDate.setDate(lessonDate.getDate() + dayIndex);
    lessonDate.setHours(hour, 0, 0, 0);
    const lessonDateString = lessonDate.toISOString().split('T')[0]; // 'YYYY-MM-DD'

    return filteredLessons.filter(
      (lesson) => lesson.date === lessonDateString && lesson.time === `${hour}:00`
    );
  };

  const getStudentName = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-orange-100">
      {/* Navigation Header */}
      <div className="flex items-center justify-center p-4 border-b border-orange-100 relative">
        <button
          onClick={() => navigateWeek('prev')}
          className="absolute left-4 p-2 hover:bg-orange-50 rounded-full transition-colors"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>

        <div className="text-center">
          <div className="font-medium text-gray-900">{weekInfo.month}</div>
          <div className="text-sm text-gray-500">
            {weekInfo.start.getDate()} - {weekInfo.end.getDate()}
          </div>
        </div>

        <button
          onClick={() => navigateWeek('next')}
          className="absolute right-4 p-2 hover:bg-orange-50 rounded-full transition-colors"
        >
          <ChevronRight size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Days Header */}
      <div className="grid grid-cols-[100px,repeat(7,1fr)] border-b border-orange-100">
        <div className="p-4 font-medium text-gray-500">Time</div>
        {days.map((day) => (
          <div
            key={day}
            className="p-4 font-medium text-gray-700 text-center border-l border-orange-100"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Time Slots */}
      {hours.map((hour) => (
        <div
          key={hour}
          className="grid grid-cols-[100px,repeat(7,1fr)] border-b border-orange-100"
        >
          <div className="p-4 font-medium text-gray-500">{hour}:00</div>
          {days.map((day) => {
            const lessonDate = new Date(weekInfo.start);
            lessonDate.setDate(lessonDate.getDate() + days.indexOf(day));
            lessonDate.setHours(hour, 0, 0, 0);
            const lessonDateString = lessonDate.toISOString().split('T')[0];

            return (
              <div
                key={`${day}-${hour}`}
                className="relative group p-4 border-l border-orange-100 transition-colors hover:bg-orange-50 cursor-pointer"
                onClick={() => onAddLesson(lessonDateString, `${hour}:00`)}
              >
                {/* Display Lessons */}
                {filteredLessons
                  .filter(
                    (lesson) =>
                      lesson.date === lessonDateString && lesson.time === `${hour}:00`
                  )
                  .map((lesson) => (
                    <div
                      key={lesson.id}
                      className="absolute inset-0 bg-orange-100 rounded-lg p-1 text-xs text-gray-800"
                    >
                      {getStudentName(lesson.studentId)}
                    </div>
                  ))}

                {/* Plus Button */}
                <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus className="text-orange-400" size={24} />
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
