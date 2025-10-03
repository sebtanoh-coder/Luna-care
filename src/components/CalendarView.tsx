import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Droplets, Settings } from 'lucide-react';
import { Preferences } from '@capacitor/preferences';
import { LocalNotifications } from '@capacitor/local-notifications';

const getDaysInMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
  for (let day = 1; day <= daysInMonth; day++) days.push(day);

  return days;
};

const addDays = (date: Date, days: number) => {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
};

const CalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [lastPeriod, setLastPeriod] = useState<string>('');
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [periodLength, setPeriodLength] = useState<number>(5);
  const [ovulationDate, setOvulationDate] = useState<string>('');
  const [history, setHistory] = useState<any[]>([]);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Nouvelle fonction pour prédire les fenêtres fertiles du mois affiché
  const getFertileWindowsForMonth = () => {
    if (!lastPeriod || !cycleLength) return [];
    const fertileDays: number[] = [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    // On part de la dernière période et on avance de cycle en cycle
    let startDate = new Date(lastPeriod);
    while (startDate.getFullYear() < year || (startDate.getFullYear() === year && startDate.getMonth() <= month)) {
      // Calcul de la date d'ovulation pour ce cycle
      const ovulation = addDays(startDate, cycleLength - 14); // Ovulation ~14 jours avant la fin du cycle
      // Fenêtre fertile : 5 jours avant et 1 jour après l'ovulation
      for (let i = -5; i <= 1; i++) {
        const fertileDate = addDays(ovulation, i);
        if (fertileDate.getFullYear() === year && fertileDate.getMonth() === month) {
          fertileDays.push(fertileDate.getDate());
        }
      }
      // Passe au cycle suivant
      startDate = addDays(startDate, cycleLength);
    }
    return fertileDays;
  };

  const fertileDaysThisMonth = getFertileWindowsForMonth();

  useEffect(() => {
    const loadData = async () => {
      const last = await Preferences.get({ key: 'lastPeriod' });
      if (last.value) setLastPeriod(last.value);

      const cycle = await Preferences.get({ key: 'cycleLength' });
      if (cycle.value) setCycleLength(Number(cycle.value));

      const period = await Preferences.get({ key: 'periodLength' });
      if (period.value) setPeriodLength(Number(period.value));

      const ovul = await Preferences.get({ key: 'ovulationDate' });
      if (ovul.value) setOvulationDate(ovul.value);

      const hist = await Preferences.get({ key: 'moodsHistory' });
      if (hist.value) setHistory(JSON.parse(hist.value));
    };
    loadData();
  }, []);

  const saveData = async (key: string, value: any) => {
    await Preferences.set({ key, value: JSON.stringify(value) });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const lastPeriodDate = lastPeriod ? new Date(lastPeriod) : null;
  // const ovulation = ovulationDate ? new Date(ovulationDate) : null;
  // const nextPeriodDate = lastPeriodDate ? addDays(lastPeriodDate, cycleLength) : null;

  const isPeriodDay = (day: number | null) => {
    if (!day || !lastPeriodDate) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const diffDays = Math.floor((date.getTime() - lastPeriodDate.getTime()) / (1000 * 60 * 60 * 24));
    const cycleDay = (diffDays % cycleLength + cycleLength) % cycleLength + 1;
    return cycleDay >= 1 && cycleDay <= periodLength;
  };

  const isFertileDay = (day: number | null) => {
  if (!day) return false;
  // On utilise la prédiction des jours fertiles pour le mois affiché
  return fertileDaysThisMonth.includes(day);
  };

  const isToday = (day: number | null) => {
    if (!day) return false;
    const today = new Date();
    return day === today.getDate() &&
           currentMonth.getMonth() === today.getMonth() &&
           currentMonth.getFullYear() === today.getFullYear();
  };

  const days = getDaysInMonth(currentMonth);

  // Sauvegarde et notifications
  useEffect(() => {
    saveData('lastPeriod', lastPeriod);
    saveData('cycleLength', cycleLength);
    saveData('periodLength', periodLength);
    saveData('ovulationDate', ovulationDate);

    const scheduleNotifications = async () => {
      await LocalNotifications.cancel({ notifications: [] }); // Annule toutes les notifications
      const today = new Date();
      for (let i = 0; i < days.length; i++) {
        const day = days[i];
        if (!day) continue;
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        if (date < today) continue;
        if (isPeriodDay(day) || isFertileDay(day)) {
          await LocalNotifications.schedule({
            notifications: [{
              title: isPeriodDay(day) ? 'Period Day' : 'Fertile Window',
              body: `Check your cycle for ${date.toDateString()}`,
              id: i,
              schedule: { at: date },
            }],
          });
        }
      }
    };
    scheduleNotifications();
  }, [lastPeriod, cycleLength, periodLength, ovulationDate, currentMonth]);

  return (
  <div className="p-6 space-y-6">

      {/* Bouton pour ouvrir paramètres */}
      <div className="flex justify-end">
        <button onClick={() => setShowSettings(true)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Modal Paramètres */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-lg space-y-4">
            <h3 className="font-semibold text-gray-800 text-center">Cycle Settings</h3>
            <label className="block text-sm text-gray-600">
              Last period start:
              <input type="date" value={lastPeriod} onChange={(e) => setLastPeriod(e.target.value)} className="ml-2 border p-1 rounded w-full" />
            </label>
            <label className="block text-sm text-gray-600">
              Cycle length (days):
              <input type="number" value={cycleLength} onChange={(e) => setCycleLength(Number(e.target.value))} className="ml-2 w-full border p-1 rounded" />
            </label>
            <label className="block text-sm text-gray-600">
              Period length (days):
              <input type="number" value={periodLength} onChange={(e) => setPeriodLength(Number(e.target.value))} className="ml-2 w-full border p-1 rounded" />
            </label>
            <label className="block text-sm text-gray-600">
              Ovulation date:
              <input type="date" value={ovulationDate} onChange={(e) => setOvulationDate(e.target.value)} className="ml-2 border p-1 rounded w-full" />
            </label>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowSettings(false)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
              <button onClick={() => setShowSettings(false)} className="px-4 py-2 rounded bg-pink-500 text-white hover:bg-pink-600">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Header calendrier */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigateMonth(-1)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h2>
          <p className="text-sm text-gray-500">Track your cycle</p>
        </div>
        <button onClick={() => navigateMonth(1)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Calendrier */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayLabels.map(label => <div key={label} className="text-center text-xs font-semibold text-gray-500 py-2">{label}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            if (!day) return <div key={idx} className="h-10"></div>;
            const period = isPeriodDay(day);
            const fertile = isFertileDay(day);
            const today = isToday(day);
            return (
              <button key={idx} className={`h-10 w-10 rounded-full text-sm font-medium transition-colors relative
                ${today ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                        : period ? 'bg-pink-200 text-pink-800 hover:bg-pink-300'
                        : fertile ? 'bg-purple-200 text-purple-800 hover:bg-purple-300'
                        : 'hover:bg-gray-100 text-gray-700'}`}>
                {day}
                {period && <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2"><Droplets className="w-2 h-2 text-pink-600" /></div>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Légende */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mt-4">
        <h3 className="font-semibold text-gray-800 mb-3">Legend</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"></div>
            <span className="text-sm text-gray-600">Today</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-pink-200 rounded-full"></div>
            <span className="text-sm text-gray-600">Period days</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-purple-200 rounded-full"></div>
            <span className="text-sm text-gray-600">Fertile window</span>
          </div>
        </div>
      </div>

      {/* Résumé cycle */}
      {lastPeriodDate && (
        <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-4">
          <h3 className="font-semibold text-gray-800 mb-3">This Cycle</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">{cycleLength}</div>
              <div className="text-xs text-gray-600">Average cycle</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{periodLength}</div>
              <div className="text-xs text-gray-600">Period length</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CalendarView;
