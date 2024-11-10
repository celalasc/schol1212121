// src/store/useLessonStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Lesson } from '../types';

interface LessonState {
  lessons: Lesson[];
  addLesson: (lesson: Omit<Lesson, 'id'>) => void;
  removeLesson: (id: string) => void;
}

const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

export const useLessonStore = create<LessonState>()(
  persist(
    (set) => ({
      lessons: [],
      addLesson: (lesson) =>
        set((state) => ({
          lessons: [...state.lessons, { ...lesson, id: generateId() }],
        })),
      removeLesson: (id) =>
        set((state) => ({
          lessons: state.lessons.filter((lesson) => lesson.id !== id),
        })),
    }),
    {
      name: 'lesson-storage', // Name of the storage
    }
  )
);
