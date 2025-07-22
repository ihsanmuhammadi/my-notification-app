"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { NotificationList } from "@/components/notifications/NotificationList";
import { useEffect } from "react";

export default function NotificationsPage() {
  const { isAuthenticated } = useAuth();
  const { notifications, unreadCount, refreshNotifications, markAsRead } =
    useNotifications();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Mengarahkan ke halaman login...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Notifikasi</h1>
          <p className="text-gray-600">
            {unreadCount > 0
              ? `Anda memiliki ${unreadCount} notifikasi belum dibaca`
              : "Semua notifikasi telah dibaca"}
          </p>
        </div>
      </div>

      <NotificationList
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onRefresh={refreshNotifications}
      />
    </div>
  );
}