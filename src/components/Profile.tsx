import React, { useState, useEffect } from 'react';
import { User, Settings, Bell, Heart, Calendar, Shield, HelpCircle } from 'lucide-react';
import { Preferences } from '@capacitor/preferences';
import { LocalNotifications } from '@capacitor/local-notifications';

const Profile = () => {
  // --- Toggles persistants ---
  const [notifications, setNotifications] = useState(true);
  const [periodReminders, setPeriodReminders] = useState(true);
  const [moodReminders, setMoodReminders] = useState(true);

  // --- Statistiques dynamiques ---
  const [profileStats, setProfileStats] = useState([
    { label: 'Days tracked', value: 0, icon: Calendar },
    { label: 'Cycles logged', value: 0, icon: Heart },
    { label: 'Mood entries', value: 0, icon: User },
  ]);

  // --- Charger préférences et statistiques depuis Storage ---
  useEffect(() => {
    const loadData = async () => {
      // Toggles
      const notif = await Preferences.get({ key: 'notifications' });
      const period = await Preferences.get({ key: 'periodReminders' });
      const mood = await Preferences.get({ key: 'moodReminders' });
      if (notif.value) setNotifications(JSON.parse(notif.value));
      if (period.value) setPeriodReminders(JSON.parse(period.value));
      if (mood.value) setMoodReminders(JSON.parse(mood.value));

      // --- Calculer stats réelles depuis MoodTracker et CalendarView ---
      const moodsHistory = await Preferences.get({ key: 'moodsHistory' });
      const cyclesHistory = await Preferences.get({ key: 'cyclesHistory' });

      const moods = moodsHistory.value ? JSON.parse(moodsHistory.value) : [];
      const cycles = cyclesHistory.value ? JSON.parse(cyclesHistory.value) : [];

      // Comptage des jours suivis (dates uniques dans moods)
      const daysTrackedSet = new Set(moods.map((entry: any) => entry.date));
      const daysTracked = daysTrackedSet.size;
      const cyclesLogged = cycles.length;
      const moodEntries = moods.length;

      setProfileStats([
        { label: 'Days tracked', value: daysTracked, icon: Calendar },
        { label: 'Cycles logged', value: cyclesLogged, icon: Heart },
        { label: 'Mood entries', value: moodEntries, icon: User },
      ]);
    };
    loadData();
  }, []);

  // --- Sauvegarder automatiquement les toggles ---
  useEffect(() => {
    Preferences.set({ key: 'notifications', value: JSON.stringify(notifications) });
    Preferences.set({ key: 'periodReminders', value: JSON.stringify(periodReminders) });
    Preferences.set({ key: 'moodReminders', value: JSON.stringify(moodReminders) });
  }, [notifications, periodReminders, moodReminders]);

  // --- Notifications locales pour jours futurs ---
  useEffect(() => {
    const scheduleNotifications = async () => {
      if (periodReminders) {
        await LocalNotifications.schedule({
          notifications: [
            {
              title: 'Period Reminder',
              body: 'Your period is coming soon!',
              id: 1,
              schedule: { at: new Date(Date.now() + 1000 * 60 * 60 * 24) },
              sound: undefined,
              actionTypeId: '',
              extra: null
            }
          ]
        });
      }
      if (moodReminders) {
        const today8am = new Date();
        today8am.setHours(8, 0, 0, 0);
        if (today8am.getTime() > Date.now()) {
          await LocalNotifications.schedule({
            notifications: [
              {
                title: 'Mood Tracker',
                body: 'Log your mood for today!',
                id: 2,
                schedule: { at: today8am },
                sound: undefined,
                actionTypeId: '',
                extra: null
              }
            ]
          });
        }
      }
    };
    scheduleNotifications();
  }, [periodReminders, moodReminders]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Sarah</h2>
        <p className="text-gray-500">Luna Care member since Jan 2024</p>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">Your Journey</h3>
        <div className="grid grid-cols-3 gap-4">
          {profileStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Icon className="w-6 h-6 text-purple-500" />
                </div>
                <div className="text-xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cycle Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">Cycle Settings</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium text-gray-800">Average cycle length</div>
              <div className="text-sm text-gray-500">Current: 28 days</div>
            </div>
            <button className="text-purple-500 text-sm font-medium hover:text-purple-600">
              Edit
            </button>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium text-gray-800">Period length</div>
              <div className="text-sm text-gray-500">Current: 5 days</div>
            </div>
            <button className="text-purple-500 text-sm font-medium hover:text-purple-600">
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Bell className="w-5 h-5 text-blue-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Notifications</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium text-gray-800">All notifications</div>
              <div className="text-sm text-gray-500">Receive app notifications</div>
            </div>
            <button 
              onClick={() => setNotifications(!notifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications ? 'bg-purple-500' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notifications ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium text-gray-800">Period reminders</div>
              <div className="text-sm text-gray-500">Get notified before your period</div>
            </div>
            <button 
              onClick={() => setPeriodReminders(!periodReminders)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                periodReminders ? 'bg-purple-500' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                periodReminders ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium text-gray-800">Mood check-ins</div>
              <div className="text-sm text-gray-500">Daily mood tracking reminders</div>
            </div>
            <button 
              onClick={() => setMoodReminders(!moodReminders)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                moodReminders ? 'bg-purple-500' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                moodReminders ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Other Options */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="space-y-4">
          <button className="flex items-center space-x-3 w-full text-left hover:bg-gray-50 p-2 rounded-lg transition-colors">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <div className="font-medium text-gray-800">Privacy Settings</div>
              <div className="text-sm text-gray-500">Manage your data and privacy</div>
            </div>
          </button>

          <button className="flex items-center space-x-3 w-full text-left hover:bg-gray-50 p-2 rounded-lg transition-colors">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <div className="font-medium text-gray-800">Help & Support</div>
              <div className="text-sm text-gray-500">Get help or contact support</div>
            </div>
          </button>

          <button className="flex items-center space-x-3 w-full text-left hover:bg-gray-50 p-2 rounded-lg transition-colors">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <Settings className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <div className="font-medium text-gray-800">App Settings</div>
              <div className="text-sm text-gray-500">Customize your experience</div>
            </div>
          </button>
        </div>
      </div>

      {/* App Info */}
      <div className="text-center text-gray-400 text-sm">
        <p>Luna Care v1.0.0</p>
        <p>Made with 💜 for your wellbeing</p>
      </div>
    </div>
  );
};

export default Profile;
