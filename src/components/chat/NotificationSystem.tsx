import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  sender?: {
    name: string;
    avatar: string;
  };
  onClick?: () => void;
}

interface NotificationSystemProps {
  notifications?: Notification[];
  onNotificationClick?: (notificationId: string) => void;
  onNotificationDismiss?: (notificationId: string) => void;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  maxNotifications?: number;
  autoHideDuration?: number;
}

const NotificationSystem = ({
  notifications = [
    {
      id: "1",
      title: "New Message",
      message: "Sarah sent you a new message",
      timestamp: new Date(),
      read: false,
      sender: {
        name: "Sarah Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      },
    },
    {
      id: "2",
      title: "Friend Request",
      message: "Michael wants to connect with you",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      sender: {
        name: "Michael Chen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      },
    },
  ],
  onNotificationClick = () => {},
  onNotificationDismiss = () => {},
  position = "top-right",
  maxNotifications = 3,
  autoHideDuration = 5000,
}: NotificationSystemProps) => {
  const [visibleNotifications, setVisibleNotifications] = useState<
    Notification[]
  >([]);

  // Update visible notifications when the notifications prop changes
  useEffect(() => {
    const unreadNotifications = notifications
      .filter((notification) => !notification.read)
      .slice(0, maxNotifications);
    setVisibleNotifications(unreadNotifications);
  }, [notifications, maxNotifications]);

  // Auto-dismiss notifications after a delay
  useEffect(() => {
    if (autoHideDuration <= 0) return;

    const timers = visibleNotifications.map((notification) => {
      return setTimeout(() => {
        handleDismiss(notification.id);
      }, autoHideDuration);
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [visibleNotifications, autoHideDuration]);

  const handleClick = (notificationId: string) => {
    onNotificationClick(notificationId);
    handleDismiss(notificationId);
  };

  const handleDismiss = (notificationId: string) => {
    setVisibleNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId),
    );
    onNotificationDismiss(notificationId);
  };

  // Position classes
  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };

  return (
    <div
      className={cn(
        "fixed z-50 flex flex-col gap-2 w-[350px] pointer-events-none",
        positionClasses[position],
        "bg-background",
      )}
    >
      <AnimatePresence>
        {visibleNotifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto"
          >
            <div
              className="flex items-start p-4 rounded-lg border shadow-md bg-card text-card-foreground hover:shadow-lg transition-shadow"
              role="alert"
            >
              {notification.sender && (
                <div className="flex-shrink-0 mr-3">
                  <img
                    src={notification.sender.avatar}
                    alt={notification.sender.name}
                    className="h-10 w-10 rounded-full"
                  />
                </div>
              )}
              <div
                className="flex-1 cursor-pointer"
                onClick={() => handleClick(notification.id)}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-sm">{notification.title}</h3>
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(notification.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {notification.message}
                </p>
              </div>
              <button
                className="ml-2 flex-shrink-0 text-muted-foreground hover:text-foreground"
                onClick={() => handleDismiss(notification.id)}
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Helper function to format timestamps
const formatTimestamp = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else {
    return date.toLocaleDateString();
  }
};

export default NotificationSystem;
