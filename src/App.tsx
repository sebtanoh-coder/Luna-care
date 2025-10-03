import { useState } from 'react';
import { Calendar, Heart, Smile, MessageCircle, TrendingUp, User } from 'lucide-react';
import Dashboard from './components/Dashboard';
import DashboardConception from './components/DashboardConception';
import DashboardGrossesse from './components/DashboardGrossesse';
import DashboardMenopause from './components/DashboardMenopause';
import CalendarView from './components/CalendarView';
import MoodTracker from './components/MoodTracker';
import SupportMessages from './components/SupportMessages';
import SupportMessagesConception from './components/SupportMessagesConception';
import SupportMessagesGrossesse from './components/SupportMessagesGrossesse';
import SupportMessagesMenopause from './components/SupportMessagesMenopause';
import Insights from './components/Insights';
import Profile from './components/Profile';
import ModesObjectives from './components/ModesObjectives';
import { Flower } from 'lucide-react';

import { useMode } from './hooks/useMode';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { mode } = useMode();

  const tabs = [
    { id: 'dashboard', label: 'Home', icon: Heart },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'mood', label: 'Mood', icon: Smile },
    { id: 'support', label: 'Support', icon: MessageCircle },
    { id: 'insights', label: 'Insights', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'modes', label: 'Modes', icon: Flower }, // Add Modes tab
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        if (mode === 'conception') {
          return <DashboardConception />;
        } else if (mode === 'grossesse') {
          return <DashboardGrossesse />;
        } else if (mode === 'menopause') {
          return <DashboardMenopause />;
        } else {
          return <Dashboard />;
        }
      case 'calendar':
        return <CalendarView />;
      case 'mood':
        return <MoodTracker />;
      case 'support':
        if (mode === 'conception') {
          return <SupportMessagesConception />;
        } else if (mode === 'grossesse') {
          return <SupportMessagesGrossesse />;
        } else if (mode === 'menopause') {
          return <SupportMessagesMenopause />;
        } else {
          return <SupportMessages />;
        }
      case 'insights':
        return <Insights />;
      case 'profile':
        return <Profile />;
      case 'modes':
        return <ModesObjectives onBack={() => setActiveTab('dashboard')} />;
      default:
        if (mode === 'conception') {
          return <DashboardConception />;
        } else if (mode === 'grossesse') {
          return <DashboardGrossesse />;
        } else if (mode === 'menopause') {
          return <DashboardMenopause />;
        } else {
  return <Dashboard />;
        }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-md mx-auto bg-white shadow-xl min-h-screen">
        {/* Header */}
        <header className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 rounded-b-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Luna Care</h1>
              <p className="text-pink-100 text-sm">Your wellness companion</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="pb-20">
          {renderActiveComponent()}
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200">
          <div className="flex justify-around py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center p-2 transition-colors ${
                    isActive
                      ? 'text-pink-500'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

export default App;