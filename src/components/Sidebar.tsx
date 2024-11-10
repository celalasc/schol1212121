import React, { useState } from 'react';
import {
  Home,
  Calendar,
  Users,
  BookOpen,
  Settings,
  ChevronRight,
} from 'lucide-react';

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Home', active: false },
    { icon: Calendar, label: 'Schedule', active: true },
    { icon: Users, label: 'Students', active: false },
    { icon: BookOpen, label: 'Materials', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div
        className={`h-screen bg-white border-r border-orange-100 transition-all duration-300 ease-in-out ${
          isExpanded ? 'w-64' : 'w-16'
        }`}
      >
        <div className="h-16 flex items-center justify-center border-b border-orange-100">
          {isExpanded ? (
            <span className="text-xl font-bold text-orange-400">Menu</span>
          ) : (
            <ChevronRight
              className={`text-orange-400 transition-transform duration-300 ${
                isExpanded ? 'rotate-180' : ''
              }`}
              size={20}
            />
          )}
        </div>

        <nav className="p-2 space-y-1">
          {menuItems.map(({ icon: Icon, label, active }) => (
            <button
              key={label}
              className={`w-full flex items-center gap-4 p-3 rounded-lg transition-colors ${
                active
                  ? 'bg-orange-100 text-orange-600'
                  : 'hover:bg-orange-50 text-gray-600'
              }`}
            >
              <Icon size={20} className="min-w-[20px]" />
              <span
                className={`transition-opacity duration-300 whitespace-nowrap ${
                  isExpanded ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {label}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
