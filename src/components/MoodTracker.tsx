// ...existing code...
import React, { useState, useEffect } from 'react';
import { Preferences } from '@capacitor/preferences';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Smile, Meh, Frown, Heart, Zap, Cloud } from 'lucide-react';

const MoodTracker = () => {
  // Génération dynamique du message selon le mood et les symptômes
  const getDynamicMessage = (moods: string[], symptoms: string[]): string => {
    if (!Array.isArray(moods) || moods.length === 0) return "";
    const moodMessages: Record<string, string[]> = {
      happy: ["Your smile is contagious!", "Happiness looks great on you!", "Keep spreading joy!", "Enjoy every moment!"],
      neutral: ["A balanced day is a good day.", "Take a moment for yourself.", "Sometimes, neutral is just right.", "Let the day unfold gently."],
      sad: ["It's okay to feel sad. Be gentle with yourself.", "Let yourself feel, and let it pass.", "Sadness is part of healing.", "Reach out if you need support."],
      anxious: ["Breathe deeply, you're not alone.", "Anxiety is tough, but so are you.", "Try a calming activity.", "Take it one breath at a time."],
      tired: ["Rest is important. Listen to your body.", "A nap or gentle walk may help.", "Recharge when you need to.", "Slow down and be kind to yourself."],
      loved: ["You are loved and appreciated!", "Let love fill your day.", "Share your joy with others.", "Cherish the love you feel."]
    };
    let base = moods.map(m => {
      const options = moodMessages[m] || ["Take care of yourself today."];
      return options[Math.floor(Math.random() * options.length)];
    }).join(" ");
    if (symptoms.length > 0) {
      base += `\nYou're experiencing: ${symptoms.join(", ")}. `;
      const symptomTips: Record<string, string[]> = {
        Headache: ["Stay hydrated.", "Rest your eyes.", "Try gentle stretches."],
        Fatigue: ["A short nap may help.", "Gentle movement can boost energy.", "Eat something nutritious."],
        Cramps: ["A warm compress can relieve cramps.", "Gentle yoga may help.", "Try to relax your muscles."],
        Nausea: ["Sip ginger tea.", "Eat light meals.", "Rest if needed."],
        'Mood swings': ["Emotional ups and downs are normal.", "Talk to someone you trust.", "Practice mindfulness."],
        'Back pain': ["Gentle stretching can help.", "Apply a warm pack.", "Rest your back."],
        Bloating: ["Stay hydrated.", "Eat slowly.", "Avoid heavy foods."],
        'Breast tenderness': ["Wear comfortable clothing.", "Apply a cold pack.", "Rest if needed."],
        'Food cravings': ["Treat yourself in moderation.", "Opt for healthy snacks.", "Enjoy your favorite food."],
        Acne: ["Gentle skincare is recommended.", "Keep your skin clean.", "Avoid touching your face."]
      };
      symptoms.forEach(s => {
        if (symptomTips[s]) {
          base += symptomTips[s][Math.floor(Math.random() * symptomTips[s].length)] + " ";
        } else {
          base += `For your symptom "${s}", listen to your body. `;
        }
      });
      const endings = ["Tomorrow is a new day!", "Take a moment for yourself.", "You're doing your best.", "Be proud of your resilience.", "Let yourself rest and recharge."];
      base += endings[Math.floor(Math.random() * endings.length)];
    } else {
      const endings = ["Enjoy your day!", "Take care of yourself.", "Let positivity guide you.", "You are enough.", "Smile, even if just a little."];
      base += " " + endings[Math.floor(Math.random() * endings.length)];
    }
    return base;
  };
  const [customSymptom, setCustomSymptom] = useState<string>("");
  const [allSymptoms, setAllSymptoms] = useState<string[]>([
    'Cramps', 'Bloating', 'Headache', 'Back pain', 'Breast tenderness',
    'Mood swings', 'Fatigue', 'Nausea', 'Food cravings', 'Acne'
  ]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [moodsHistory, setMoodsHistory] = useState<any[]>([]);
  const [symptomsHistory, setSymptomsHistory] = useState<any[]>([]);

  useEffect(() => {
    // Charger les symptômes personnalisés si besoin
    const loadCustomSymptoms = async () => {
      const custom = await Preferences.get({ key: 'customSymptoms' });
      if (custom.value) {
        const customList = JSON.parse(custom.value);
  setAllSymptoms((prev: string[]) => [...prev, ...customList]);
      }
    };
    loadCustomSymptoms();
    const loadData = async () => {
      const moods = await Preferences.get({ key: 'moodsHistory' });
      if (moods.value) setMoodsHistory(JSON.parse(moods.value));

      const symptomsData = await Preferences.get({ key: 'symptomsHistory' });
      if (symptomsData.value) setSymptomsHistory(JSON.parse(symptomsData.value));

      // On ne charge plus les messages supprimés
    };
    loadData();
  }, []);

  const saveData = async (key: string, value: any) => {
    await Preferences.set({ key, value: JSON.stringify(value) });
  };

  const addMoodEntry = async () => {
    await Preferences.set({ key: 'customSymptoms', value: JSON.stringify(allSymptoms.filter((s: string) => ![
      'Cramps', 'Bloating', 'Headache', 'Back pain', 'Breast tenderness',
      'Mood swings', 'Fatigue', 'Nausea', 'Food cravings', 'Acne'
    ].includes(s))) });
    const today = new Date().toISOString().split('T')[0];
  const newEntry = { date: today, moods: selectedMoods, symptoms };
    const updatedMoods = [...moodsHistory, newEntry];
    setMoodsHistory(updatedMoods);
    await saveData('moodsHistory', updatedMoods);

    const updatedSymptoms = [...symptomsHistory, { date: today, symptoms }];
    setSymptomsHistory(updatedSymptoms);
    await saveData('symptomsHistory', updatedSymptoms);

  setSelectedMoods([]);
    setSymptoms([]);
  };

  // Notifications pour rappel
  useEffect(() => {
    const scheduleNotifications = async () => {
  await LocalNotifications.cancel({ notifications: [] });
      const today = new Date();
      const notificationTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 0, 0);
      await LocalNotifications.schedule({
        notifications: [
          {
            title: "Daily Mood & Symptoms",
            body: "Don't forget to log your mood and symptoms today!",
            id: 1,
            schedule: { at: notificationTime },
          },
        ],
      });
    };
    scheduleNotifications();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">How are you feeling?</h2>
        <p className="text-gray-500">Track your mood and symptoms</p>
      </div>

      {/* Mood Selection */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Today's Moods</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { id: 'happy', icon: Smile, label: 'Happy', color: 'text-green-500 bg-green-100' },
            { id: 'neutral', icon: Meh, label: 'Neutral', color: 'text-yellow-500 bg-yellow-100' },
            { id: 'sad', icon: Frown, label: 'Sad', color: 'text-blue-500 bg-blue-100' },
            { id: 'anxious', icon: Zap, label: 'Anxious', color: 'text-orange-500 bg-orange-100' },
            { id: 'tired', icon: Cloud, label: 'Tired', color: 'text-gray-500 bg-gray-100' },
            { id: 'loved', icon: Heart, label: 'Loved', color: 'text-pink-500 bg-pink-100' },
          ].map((mood) => {
            const Icon = mood.icon;
            const isSelected = selectedMoods.includes(mood.id);
            return (
              <button
                key={mood.id}
                onClick={() => {
                  if (isSelected) {
                    setSelectedMoods(selectedMoods.filter((m: string) => m !== mood.id));
                  } else {
                    setSelectedMoods([...selectedMoods, mood.id]);
                  }
                }}
                className={`
                  p-4 rounded-xl transition-all transform hover:scale-105
                  ${isSelected 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md' 
                    : mood.color + ' hover:shadow-sm'
                  }
                `}
              >
                <Icon className="w-6 h-6 mx-auto mb-2" />
                <div className="text-xs font-medium">{mood.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Symptoms */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Symptoms</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {allSymptoms.map((symptom) => (
            <div key={symptom} className="flex items-center gap-1">
              <button
                onClick={() => {
                  if (symptoms.includes(symptom)) setSymptoms(symptoms.filter((s: string) => s !== symptom));
                  else setSymptoms([...symptoms, symptom]);
                }}
                className={`
                  px-3 py-2 rounded-full text-sm font-medium transition-colors
                  ${symptoms.includes(symptom)
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                {symptom}
              </button>
              {allSymptoms.length > 10 && ![
                'Cramps', 'Bloating', 'Headache', 'Back pain', 'Breast tenderness',
                'Mood swings', 'Fatigue', 'Nausea', 'Food cravings', 'Acne'
              ].includes(symptom) && (
                <button
                  onClick={() => setAllSymptoms(allSymptoms.filter((s: string) => s !== symptom))}
                  className="text-xs text-gray-400 hover:text-red-500"
                  title="Remove symptom"
                >✕</button>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={customSymptom}
            onChange={e => setCustomSymptom(e.target.value)}
            placeholder="Add a symptom..."
            className="border rounded-full px-3 py-2 text-sm flex-1"
          />
          <button
            onClick={() => {
              if (customSymptom.trim() && !allSymptoms.includes(customSymptom.trim())) {
                setAllSymptoms([...allSymptoms, customSymptom.trim()]);
                setCustomSymptom("");
              }
            }}
            className="bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold"
          >Add</button>
        </div>
      </div>

      {/* Emotional Support */}
      {selectedMoods.length > 0 && (
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-800 mb-4">💜 Just for you</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            {getDynamicMessage(selectedMoods, symptoms)}
          </p>
        </div>
      )}

      {/* Save Button */}
      <button
        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-2xl font-semibold shadow-md hover:shadow-lg transition-shadow"
        onClick={addMoodEntry}
        disabled={selectedMoods.length === 0 && symptoms.length === 0}
      >
        Save Today's Entry
      </button>
    </div>
  );
};

export default MoodTracker;
