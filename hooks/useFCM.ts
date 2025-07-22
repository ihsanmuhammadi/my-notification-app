import { useEffect } from "react";
import { requestForToken } from "@/lib/firebase/messaging";
import { useAuth } from "@/context/AuthContext";

export const useFCM = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    const initFCM = async () => {
      if (typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission === "granted") {
          await requestForToken();
        }
      }
    };

    initFCM();
  }, [isAuthenticated]);

  return null;
};