// src/native.ts
import { Storage } from '@capacitor/storage';
import { LocalNotifications } from '@capacitor/local-notifications';

// --- Storage --- //
export const saveData = async (key: string, value: string) => {
  await Storage.set({ key, value });
};

export const getData = async (key: string) => {
  const res = await Storage.get({ key });
  return res.value;
};

// --- Notifications --- //
export const sendNotification = async (title: string, body: string, delayMs = 0) => {
  await LocalNotifications.schedule({
    notifications: [
      {
        title,
        body,
        id: new Date().getTime(),
        schedule: { at: new Date(Date.now() + delayMs) },
      },
    ],
  });
};
