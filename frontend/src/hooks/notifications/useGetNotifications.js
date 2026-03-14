import * as notificationService from "@/services/notificationService";
import { useState } from "react";

export const useGetNotifications = () => {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const[count, setCount] = useState(0)

  const getNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationService.getNotifications();
      if (res.notifications) setNotifications(res.notifications);
      if(res.count) setCount(res.count)
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { error: message };
    } finally {
      setLoading(false);
    }
  };

  return { getNotifications, notifications, loading, count };
};
