import { useState } from "react";

export interface Notification {
  id: string;
  type: "order" | "subscription" | "farmer" | "delivery";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "order", title: "Order Delivered!", message: "Your order ORD-001 has been delivered successfully.", time: "2 min ago", read: false },
  { id: "n2", type: "delivery", title: "Order In Transit", message: "ORD-002 is on the way — estimated in 45 mins.", time: "18 min ago", read: false },
  { id: "n3", type: "subscription", title: "Weekly Box Reminder", message: "Your Harvest plan delivers tomorrow. Update preferences now.", time: "1 hr ago", read: false },
  { id: "n4", type: "farmer", title: "Farmer Approved", message: "Bee Haven Farm has been verified and is now live.", time: "3 hrs ago", read: true },
  { id: "n5", type: "order", title: "New Order Received", message: "ORD-003 placed by Lisa Park for $7.47.", time: "5 hrs ago", read: true },
  { id: "n6", type: "subscription", title: "Plan Renewed", message: "Your Seedling subscription has auto-renewed for this week.", time: "Yesterday", read: true },
];

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification };
}
