import React from "react";
import { Notification } from "@/types/notification";
import { NotificationItem } from "./NotificationItem";
import { Button } from "../ui/Button";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { sendNotification } from "@/lib/api";

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onRefresh: () => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onMarkAsRead,
  onRefresh,
}) => {
  const handleTestNotification = async () => {
    await sendNotification(
      "Notifikasi Percobaan",
      "Ini adalah notifikasi percobaan untuk memastikan sistem bekerja dengan baik!"
    );
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Notifikasi Terbaru</h2>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={onRefresh}
            className="flex items-center gap-1"
          >
            <ArrowPathIcon className="h-4 w-4" />
            <span>Segarkan</span>
          </Button>
          <Button
            variant="primary"
            onClick={handleTestNotification}
          >
            Tambah Notifikasi
          </Button>
        </div>
      </div>
      
      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 border-2 border-dashed rounded-xl p-8 max-w-md mx-auto">
            <h3 className="font-medium text-gray-900">Tidak ada notifikasi</h3>
            <p className="mt-1 text-gray-600">
              Semua notifikasi yang Anda terima akan muncul di sini
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={onMarkAsRead}
            />
          ))}
        </div>
      )}
    </div>
  );
};