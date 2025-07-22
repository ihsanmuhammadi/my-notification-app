"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getNotifications, markNotificationAsRead } from "@/lib/api";
import { ApiNotification, Notification } from "@/types/notification";
import { onMessageListener } from "@/lib/firebase/messaging";
import { format } from "date-fns";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  refreshNotifications: () => Promise<void>;
  markAsRead: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const data: ApiNotification[] = await getNotifications();
      
      const formattedNotifications: Notification[] = data.map(notif => ({
        ...notif,
        timestamp: format(new Date(notif.createdAt), "dd MMM yyyy, HH:mm"),
      }));
      
      setNotifications(formattedNotifications);
      setUnreadCount(data.filter(n => !n.isRead).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev =>
        prev.map(notif => 
          String(notif.id) === id ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        fetchNotifications();
        
        // Setup FCM message listener
        onMessageListener().then((payload) => {
          console.log("New message received:", payload);
          fetchNotifications();
        }).catch(error => {
          console.error("Error in message listener:", error);
        });
      }
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        refreshNotifications: fetchNotifications,
        markAsRead: handleMarkAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};