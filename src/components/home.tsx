import React, { useState, useEffect } from "react";
import ChatLayout from "./chat/ChatLayout";
import NotificationSystem from "./chat/NotificationSystem";
import { useChat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";

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

const Home = () => {
  const { user } = useAuth();
  const { friends, activeFriendId, setActiveFriendId } = useChat();

  // Sample notifications - in a real app, these would come from the backend
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Handle notification click
  const handleNotificationClick = (notificationId: string) => {
    // Mark notification as read
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification,
      ),
    );

    // Find the corresponding friend and navigate to their chat
    const notification = notifications.find((n) => n.id === notificationId);
    if (notification?.sender) {
      const friendId = friends.find(
        (f) => f.name === notification.sender?.name,
      )?.id;
      if (friendId) {
        setActiveFriendId(friendId);
      }
    }
  };

  // Handle notification dismiss
  const handleNotificationDismiss = (notificationId: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId),
    );
  };

  // Create notifications from unread messages
  useEffect(() => {
    if (!friends.length) return;

    const unreadFriends = friends.filter((friend) => friend.unreadCount > 0);

    const newNotifications = unreadFriends.map((friend) => ({
      id: `${friend.id}-${Date.now()}`,
      title: "New Message",
      message: `${friend.name}: ${friend.lastMessage}`,
      timestamp: new Date(),
      read: false,
      sender: {
        name: friend.name,
        avatar: friend.avatar,
      },
    }));

    if (newNotifications.length > 0) {
      setNotifications((prev) => [...newNotifications, ...prev]);
    }
  }, [friends]);

  return (
    <div className="h-screen w-full flex flex-col bg-background">
      {/* Main chat interface */}
      <div className="flex-1 overflow-hidden">
        <ChatLayout />
      </div>

      {/* Notification system */}
      <NotificationSystem
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
        onNotificationDismiss={handleNotificationDismiss}
        position="top-right"
        maxNotifications={3}
        autoHideDuration={5000}
      />
    </div>
  );
};

export default Home;
