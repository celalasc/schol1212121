// src/components/AddLessonModal.tsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Student } from '../types';
import { useLessonStore } from '../store/useLessonStore';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

interface AddLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: string;
  initialTime?: string;
}

type Screen = 'type' | 'student' | 'date' | 'confirmation';

const lessonSchema = z.object({
  type: z.enum(['individual', 'group']),
  studentId: z.string(),
  date: z.string(),
  time: z.string(),
});

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>
        {children}
      </div>
    </div>
  );
};

const BackButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="absolute top-6 left-6 text-gray-500 hover:text-gray-700"
  >
    ← Back
  </button>
);

const ProgressSteps = ({ currentStep }: { currentStep: number }) => (
  <div className="flex justify-center gap-2 mb-6">
    {[1, 2, 3, 4].map((step) => (
      <div
        key={step}
        className={`w-2 h-2 rounded-full ${
          step <= currentStep ? 'bg-orange-400' : 'bg-gray-200'
        }`}
      />
    ))}
  </div>
);

const StudentSelect = ({ onSelect }: { onSelect: (student: Student) => void }) => {
  const students: Student[] = [
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
  ];

  return (
    <div className="space-y-2">
      {students.map((student) => (
        <button
          key={student.id}
          onClick={() => onSelect(student)}
          className="w-full p-4 text-left rounded-lg border border-orange-100 hover:bg-orange-50 transition-colors"
        >
          <div className="font-medium text-gray-900">
            {student.firstName} {student.lastName}
          </div>
          <div className="text-sm text-gray-500 capitalize">
            Level: {student.level}
          </div>
        </button>
      ))}
    </div>
  );
};

export default function AddLessonModal({ isOpen, onClose, initialDate, initialTime }: AddLessonModalProps) {
  const [screen, setScreen] = useState<Screen>('type');
  const [selectedType, setSelectedType] = useState<'individual' | 'group'>();
  const [selectedStudent, setSelectedStudent] = useState<Student>();

  const { register, handleSubmit, getValues, setValue, reset, formState: { errors } } = useForm({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      type: 'individual',
      studentId: '',
      date: '',
      time: '',
    },
  });

  const addLesson = useLessonStore((state) => state.addLesson);

  useEffect(() => {
    if (isOpen) {
      reset({
        type: 'individual',
        studentId: '',
        date: initialDate || '',
        time: initialTime || '',
      });
      if (initialDate && initialTime) {
        setScreen('confirmation');
      } else {
        setScreen('type');
      }
      setSelectedType(undefined);
      setSelectedStudent(undefined);
    }
  }, [isOpen, initialDate, initialTime, reset]);

  const handleBack = () => {
    switch (screen) {
      case 'student':
        setScreen('type');
        break;
      case 'date':
        setScreen('student');
        break;
      case 'confirmation':
        if (initialDate && initialTime) {
          setScreen('confirmation');
        } else {
          setScreen('date');
        }
        break;
      default:
        break;
    }
  };

  const getCurrentStep = () => {
    switch (screen) {
      case 'type':
        return 1;
      case 'student':
        return 2;
      case 'date':
        return 3;
      case 'confirmation':
        return 4;
      default:
        return 1;
    }
  };

  const onSubmit = (data: z.infer<typeof lessonSchema>) => {
    setScreen('confirmation');
  };

  const handleConfirm = () => {
    const formData = getValues();
    addLesson({
      type: formData.type,
      studentId: formData.studentId,
      date: formData.date,
      time: formData.time,
    });
    onClose();
    // Reset modal state
    setScreen('type');
    setSelectedType(undefined);
    setSelectedStudent(undefined);
  };

  const renderContent = () => {
    switch (screen) {
      case 'type':
        return (
          <div className="p-6">
            <ProgressSteps currentStep={getCurrentStep()} />
            <h2 className="text-2xl font-bold text-orange-400 text-center mb-6 pt-4">
              Select Lesson Type
            </h2>

            <div className="space-y-4">
              <button
                onClick={() => {
                  setSelectedType('individual');
                  setValue('type', 'individual');
                  setScreen('student');
                }}
                className="w-full p-4 text-left rounded-lg border border-orange-100 hover:bg-orange-50 transition-colors"
              >
                <div className="font-medium text-gray-900">Individual Lesson</div>
                <div className="text-sm text-gray-500">
                  One-on-one lesson with a student
                </div>
              </button>

              <button
                onClick={() => {
                  setSelectedType('group');
                  setValue('type', 'group');
                  setScreen('student');
                }}
                className="w-full p-4 text-left rounded-lg border border-orange-100 hover:bg-orange-50 transition-colors"
              >
                <div className="font-medium text-gray-900">Group Lesson</div>
                <div className="text-sm text-gray-500">
                  Lesson with multiple students
                </div>
              </button>
            </div>
          </div>
        );

      case 'student':
        return (
          <div className="p-6">
            <BackButton onClick={handleBack} />
            <ProgressSteps currentStep={getCurrentStep()} />
            <h2 className="text-2xl font-bold text-orange-400 text-center mb-6 pt-4">
              Select Student
            </h2>

            <div className="space-y-6">
              <StudentSelect
                onSelect={(student) => {
                  setSelectedStudent(student);
                  setValue('studentId', student.id);
                  setScreen('date');
                }}
              />
            </div>
          </div>
        );

      case 'date':
        return (
          <div className="p-6">
            <BackButton onClick={handleBack} />
            <ProgressSteps currentStep={getCurrentStep()} />
            <h2 className="text-2xl font-bold text-orange-400 text-center mb-6 pt-4">
              Select Date & Time
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                  {...register('date', { required: true })}
                />
                {errors.date && <p className="text-red-500 text-sm">Date is required</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                  {...register('time', { required: true })}
                />
                {errors.time && <p className="text-red-500 text-sm">Time is required</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-orange-400 text-white py-2 px-4 rounded-lg hover:bg-orange-500 transition-colors"
              >
                Continue
              </button>
            </form>
          </div>
        );

      case 'confirmation':
        const formData = getValues();
        const selectedStudentName = selectedStudent
          ? `${selectedStudent.firstName} ${selectedStudent.lastName}`
          : 'N/A';

        const formattedDate = new Date(formData.date).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        return (
          <div className="p-6">
            <BackButton onClick={handleBack} />
            <ProgressSteps currentStep={getCurrentStep()} />
            <h2 className="text-2xl font-bold text-orange-400 text-center mb-6 pt-4">
              Confirm Lesson
            </h2>

            <div className="space-y-4">
              <div className="rounded-lg border border-orange-100 p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Type</div>
                    <div className="font-medium text-gray-900 capitalize">
                      {formData.type} Lesson
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500">Student</div>
                    <div className="font-medium text-gray-900">
                      {selectedStudentName}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500">Date</div>
                    <div className="font-medium text-gray-900">
                      {formattedDate}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500">Time</div>
                    <div className="font-medium text-gray-900">
                      {formData.time}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                className="w-full bg-orange-400 text-white py-2 px-4 rounded-lg hover:bg-orange-500 transition-colors"
              >
                Confirm Lesson
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setScreen('type');
        setSelectedType(undefined);
        setSelectedStudent(undefined);
      }}
    >
      {renderContent()}
    </Modal>
  );
}
