import { useEffect, useState } from 'react';
import { Preferences } from '@capacitor/preferences';

export function useSymptomsHistory() {
  const [recentSymptoms, setRecentSymptoms] = useState<string[]>([]);

  useEffect(() => {
    const fetchSymptoms = async () => {
      const historyRaw = await Preferences.get({ key: 'symptomsHistory' });
      let history: { date: string, symptoms: string[] }[] = [];
      if (historyRaw.value) {
        history = JSON.parse(historyRaw.value);
      }
      // 4 derniers jours
      const lastDays = history.slice(-4);
      const allSymptoms = Array.from(new Set(lastDays.flatMap(entry => entry.symptoms)));
      setRecentSymptoms(allSymptoms);
    };
    fetchSymptoms();
  }, []);

  return recentSymptoms;
}
