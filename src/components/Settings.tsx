import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useThemeStore } from '../store/useThemeStore';
import { Bell, Moon, Sun, Globe } from 'lucide-react';

const settingsSchema = z.object({
  notifications: z.boolean(),
  theme: z.enum(['light', 'dark', 'system']),
  language: z.enum(['en', 'es', 'fr']),
});

type SettingsForm = z.infer<typeof settingsSchema>;

export default function Settings() {
  const { theme, setTheme } = useThemeStore();
  const { register, handleSubmit } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      notifications: true,
      theme: 'light',
      language: 'en',
    },
  });

  const onSubmit = (data: SettingsForm) => {
    console.log(data);
    setTheme(data.theme === 'system' ? 'light' : data.theme);
  };

  const sections = [
    {
      title: 'Notifications',
      icon: Bell,
      description: 'Manage how you receive notifications',
      content: (
        <div className="mt-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              {...register('notifications')}
              className="form-checkbox h-5 w-5 text-orange-400 rounded border-gray-300 focus:ring-orange-400"
            />
            <span className="text-gray-700">Enable notifications</span>
          </label>
        </div>
      ),
    },
    {
      title: 'Appearance',
      icon: theme === 'dark' ? Moon : Sun,
      description: 'Customize how Hunny School looks on your device',
      content: (
        <div className="mt-4 space-y-4">
          <div className="flex items-center space-x-4">
            {['light', 'dark', 'system'].map((value) => (
              <label
                key={value}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  value={value}
                  {...register('theme')}
                  className="form-radio h-4 w-4 text-orange-400 border-gray-300 focus:ring-orange-400"
                />
                <span className="text-gray-700 capitalize">{value}</span>
              </label>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'Language',
      icon: Globe,
      description: 'Choose your preferred language',
      content: (
        <div className="mt-4">
          <select
            {...register('language')}
            className="form-select w-full max-w-xs rounded-lg border-gray-300 focus:border-orange-400 focus:ring focus:ring-orange-200"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {sections.map(({ title, icon: Icon, description, content }) => (
          <div
            key={title}
            className="bg-white rounded-lg border border-orange-100 p-6"
          >
            <div className="flex items-center space-x-3">
              <Icon className="h-6 w-6 text-orange-400" />
              <div>
                <h2 className="text-lg font-medium text-gray-900">{title}</h2>
                <p className="text-sm text-gray-500">{description}</p>
              </div>
            </div>
            {content}
          </div>
        ))}
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-orange-400 text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}