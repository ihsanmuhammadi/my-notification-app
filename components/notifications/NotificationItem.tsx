import React from "react";
import { Notification } from "@/types/notification";
import { Button } from "../ui/Button";
import { BellAlertIcon, BellIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
}) => {
  return (
    <div
      className={`p-4 rounded-xl border ${
        notification.isRead
          ? "bg-white border-gray-200"
          : "bg-indigo-50 border-indigo-100"
      } transition-all duration-200 hover:shadow-sm`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          {notification.isRead ? (
            <BellIcon className="h-5 w-5 text-gray-400" />
          ) : (
            <BellAlertIcon className="h-5 w-5 text-indigo-500" />
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{notification.title}</h3>
          <p className="mt-1 text-gray-600">{notification.body}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-gray-500">{notification.createdAt}</span>
            
            {!notification.isRead && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMarkAsRead(String(notification.id))}
                className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700"
              >
                <CheckCircleIcon className="h-4 w-4" />
                <span>Tandai sudah dibaca</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};