
import { messaging } from "./config";
import { getToken, onMessage, Messaging } from "firebase/messaging";
import { saveFCMToken } from "../api";

export const requestForToken = async () => {
  if (!messaging) {
    return null;
  }
  try {
    const currentToken = await getToken(messaging, { 
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });
    
    if (currentToken) {
      console.log("Current FCM token:", currentToken);
      await saveFCMToken(currentToken);
      return currentToken;
    } else {
      console.log("No registration token available");
    }
  } catch (err) {
    console.error("Error getting FCM token:", err);
  }
  return null;
};

export const onMessageListener = () => {
  if (!messaging) {
    return Promise.reject("messaging is not available");
  }
  return new Promise((resolve) => {
    onMessage(messaging as Messaging, (payload) => {
      console.log("Message received:", payload);
      if (Notification.permission === "granted") {
        let title = "Notifikasi Baru";
        let body = "Ada notifikasi baru.";
        if (payload?.notification) {
          title = payload.notification.title || title;
          body = payload.notification.body || body;
        } else if (payload?.data) {
          title = payload.data.title || title;
          body = payload.data.body || body;
        }
        new Notification(title, { body });
      }
      resolve(payload);
    });
  });
};