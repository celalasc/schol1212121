import React from 'react';
import { Bell, User, Settings, LogOut, HelpCircle } from 'lucide-react';

interface HeaderProps {
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  showProfile: boolean;
  setShowProfile: (show: boolean) => void;
}

export default function Header({
  showNotifications,
  setShowNotifications,
  showProfile,
  setShowProfile,
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-orange-100 h-16 flex items-center justify-between px-6">
      <h1 className="text-2xl font-bold text-orange-400">Hunny School</h1>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 hover:bg-orange-50 rounded-full transition-colors relative"
          >
            <Bell className="text-gray-600" size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-orange-100 py-2">
              <div className="px-4 py-2 border-b border-orange-100">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
              </div>
              <div className="px-4 py-2 text-sm text-gray-500">
                No new notifications
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 p-2 hover:bg-orange-50 rounded-lg transition-colors"
          >
            <User className="text-gray-600" size={20} />
            <span className="text-gray-700">John Doe</span>
          </button>
          
          {showProfile && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-orange-100 py-2">
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-orange-50 flex items-center gap-2">
                <Settings size={16} />
                Settings
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-orange-50 flex items-center gap-2">
                <HelpCircle size={16} />
                Support
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-orange-50 flex items-center gap-2">
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}