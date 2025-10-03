import { useEffect, useState } from 'react';
import { Preferences } from '@capacitor/preferences';

export function useMode() {
  const [mode, setMode] = useState<string>('regular');

  useEffect(() => {
    const fetchMode = async () => {
      const result = await Preferences.get({ key: 'lunacare_mode' });
      if (result.value) setMode(result.value);
    };
    fetchMode();
  }, []);

  const changeMode = async (newMode: string) => {
    await Preferences.set({ key: 'lunacare_mode', value: newMode });
    setMode(newMode);
  };

  return { mode, changeMode };
}
