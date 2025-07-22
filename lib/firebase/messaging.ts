
import { messaging } from "./config";
import { getToken, onMessage, Messaging } from "firebase/messaging";
import { saveFCMToken } from "../api";

export const requestForToken = async () => {
  if (!messaging) {
    // Not in browser, or messaging not available
    return null;
  }
  try {
    const currentToken = await getToken(messaging as Messaging, { 
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY 
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
    // Not in browser, or messaging not available
    return Promise.reject("messaging is not available");
  }
  return new Promise((resolve) => {
    onMessage(messaging as Messaging, (payload) => {
      console.log("Message received:", payload);
      resolve(payload);
    });
  });
};