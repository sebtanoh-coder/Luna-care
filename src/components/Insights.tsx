import React, { useEffect, useState } from 'react';
import { Preferences } from '@capacitor/preferences';
import { Heart, Activity, TrendingUp } from 'lucide-react';

const Insights = () => {
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [periodDuration, setPeriodDuration] = useState<number>(5);
  const [moodsHistory, setMoodsHistory] = useState<any[]>([]);
  const [symptomsHistory, setSymptomsHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const moods = await Preferences.get({ key: 'moodsHistory' });
      if (moods.value) setMoodsHistory(JSON.parse(moods.value));
      const symptoms = await Preferences.get({ key: 'symptomsHistory' });
      if (symptoms.value) setSymptomsHistory(JSON.parse(symptoms.value));
      // Optionnel : charger cycleLength et periodDuration depuis Preferences si stockés
    };
    fetchData();
  }, []);

  // Calculs dynamiques
  const happyDays = moodsHistory.filter(entry => entry.moods?.includes('happy')).length;
  const challengingDays = moodsHistory.filter(entry => entry.moods?.some((m: string) => ['sad', 'anxious', 'tired'].includes(m))).length;
  const neutralDays = moodsHistory.filter(entry => entry.moods?.includes('neutral')).length;
  const totalDays = moodsHistory.length || 1;

  // Fréquence des symptômes
  const symptomCounts: Record<string, number> = {};
  symptomsHistory.forEach(entry => {
    entry.symptoms?.forEach((s: string) => {
      symptomCounts[s] = (symptomCounts[s] || 0) + 1;
    });
  });
  const mostCommonSymptoms = Object.entries(symptomCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([symptom, count]) => ({
      symptom,
      frequency: Math.round((count / totalDays) * 100),
      color: {
        'Cramps': 'bg-pink-400',
        'Bloating': 'bg-purple-400',
        'Fatigue': 'bg-blue-400',
        'Mood swings': 'bg-orange-400',
        'Headache': 'bg-green-400',
        'Back pain': 'bg-yellow-400',
        'Nausea': 'bg-red-400',
        'Breast tenderness': 'bg-teal-400',
        'Food cravings': 'bg-indigo-400',
        'Acne': 'bg-gray-400',
      }[symptom] || 'bg-gray-300'
    }));

  // Prédictions (exemple simple)
  const today = new Date();
  const nextPeriodDate = new Date(today.getTime() + (cycleLength * 24 * 60 * 60 * 1000));
  const fertileStart = new Date(today.getTime() + ((cycleLength - 14) * 24 * 60 * 60 * 1000));
  const fertileEnd = new Date(fertileStart.getTime() + (5 * 24 * 60 * 60 * 1000));
  const pmsStart = new Date(nextPeriodDate.getTime() - (3 * 24 * 60 * 60 * 1000));

  // Conseils personnalisés (exemple)
  const tips = [
    "Vous semblez plus énergique entre les jours 8 et 14 du cycle. Prévoyez vos activités importantes à ce moment.",
    "Les bains chauds soulagent vos crampes selon votre suivi. Continuez ce rituel de soin !",
    "Votre humeur s'améliore généralement après le 3ème jour de vos règles. Gardez-le en tête lors des moments difficiles.",
    "Les fruits frais et les tisanes semblent améliorer votre bien-être. Intégrez-les régulièrement.",
    "Pensez à noter vos symptômes pour mieux anticiper les périodes délicates."
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Insights</h2>
        <p className="text-gray-500">Understanding your patterns</p>
      </div>

      {/* Cycle Summary */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-6 text-white">
        <h3 className="text-lg font-bold mb-4">This Month's Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">{cycleLength}</div>
            <div className="text-xs text-pink-100">Average cycle length</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">{periodDuration}</div>
            <div className="text-xs text-pink-100">Period duration</div>
          </div>
        </div>
      </div>

      {/* Mood Patterns */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Heart className="w-5 h-5 text-blue-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Mood Patterns</h3>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Happy days this cycle</span>
              <span className="text-sm font-semibold text-green-600">{happyDays} days</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-400 h-2 rounded-full" style={{ width: `${Math.round((happyDays/totalDays)*100)}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Challenging days</span>
              <span className="text-sm font-semibold text-orange-600">{challengingDays} days</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-orange-400 h-2 rounded-full" style={{ width: `${Math.round((challengingDays/totalDays)*100)}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Neutral days</span>
              <span className="text-sm font-semibold text-gray-600">{neutralDays} days</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gray-400 h-2 rounded-full" style={{ width: `${Math.round((neutralDays/totalDays)*100)}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Common Symptoms */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
            <Activity className="w-5 h-5 text-pink-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Most Common Symptoms</h3>
        </div>
        <div className="space-y-3">
          {mostCommonSymptoms.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{item.symptom}</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.frequency}%` }}></div>
                </div>
                <span className="text-xs text-gray-500 w-8">{item.frequency}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cycle Predictions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-purple-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Predictions</h3>
        </div>
        <div className="space-y-4">
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-1">Next Period</h4>
            <p className="text-sm text-purple-600">Expected in {cycleLength} days ({nextPeriodDate.toLocaleDateString()})</p>
          </div>
          <div className="bg-pink-50 rounded-lg p-4">
            <h4 className="font-semibold text-pink-800 mb-1">Fertile Window</h4>
            <p className="text-sm text-pink-600">{fertileStart.toLocaleDateString()} - {fertileEnd.toLocaleDateString()}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-1">PMS Symptoms</h4>
            <p className="text-sm text-blue-600">Likely to start around {pmsStart.toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Wellness Tips */}
      <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl p-6">
        <h3 className="font-bold text-gray-800 mb-4">💡 Personalized Tips</h3>
        <div className="space-y-3">
          {tips.map((tip, idx) => (
            <div key={idx} className="bg-white/60 rounded-lg p-3">
              <p className="text-sm text-gray-700">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Insights;
