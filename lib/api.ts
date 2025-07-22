
import { ApiNotification } from "@/types/notification";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not set. Please check your .env.local file and set NEXT_PUBLIC_API_BASE_URL.");
}

export const login = async (username: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/sign-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) throw new Error("Login failed");
  return response.json();
};

export const saveFCMToken = async (token: string) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    console.warn("No accessToken found in localStorage, cannot save FCM token.");
    return;
  }
  try {
    console.log("Saving FCM token to backend:", token);
    const response = await fetch(`${API_BASE_URL}/api/fcm/save-token`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ token }),
    });
    if (!response.ok) {
      const text = await response.text();
      console.error("Failed to save FCM token:", response.status, text);
    } else {
      console.log("FCM token saved successfully.");
    }
  } catch (err) {
    console.error("Error saving FCM token:", err);
  }
};

export const getNotifications = async (): Promise<ApiNotification[]> => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return [];
  
  const response = await fetch(`${API_BASE_URL}/api/notification`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch notifications");
  
  const result = await response.json();

  return result.data?.notification || [];
};

export const markNotificationAsRead = async (notificationId: string) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return;
  
  await fetch(`${API_BASE_URL}/api/notification/mark-read/${notificationId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const sendNotification = async (title: string, body: string) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return;
  
  await fetch(`${API_BASE_URL}/api/notification/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ title, body }),
  });
};