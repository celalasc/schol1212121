// src/types/index.ts
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  email: string;
}

export interface Lesson {
  id: string;
  type: 'individual' | 'group';
  studentId: string;
  date: string; // Format: 'YYYY-MM-DD'
  time: string; // Format: 'HH:MM'
}
