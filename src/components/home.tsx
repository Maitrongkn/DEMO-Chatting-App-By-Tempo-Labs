import React, { useState, useEffect } from "react";
import ChatLayout from "./chat/ChatLayout";
import NotificationSystem from "./chat/NotificationSystem";

interface Friend {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  isTyping: boolean;
}

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
  // Sample friends data
  const [friends, setFriends] = useState<Friend[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      lastMessage: "Hey, how's it going?",
      timestamp: "10:30 AM",
      unreadCount: 2,
      isOnline: true,
      isTyping: false,
    },
    {
      id: "2",
      name: "Michael Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      lastMessage: "Did you see the latest update?",
      timestamp: "9:15 AM",
      unreadCount: 0,
      isOnline: true,
      isTyping: true,
    },
    {
      id: "3",
      name: "Jessica Williams",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
      lastMessage: "Let's meet tomorrow at 2pm",
      timestamp: "Yesterday",
      unreadCount: 0,
      isOnline: false,
      isTyping: false,
    },
    {
      id: "4",
      name: "David Rodriguez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      lastMessage: "Thanks for your help!",
      timestamp: "Yesterday",
      unreadCount: 0,
      isOnline: false,
      isTyping: false,
    },
    {
      id: "5",
      name: "Emily Thompson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
      lastMessage: "Can you send me the files?",
      timestamp: "Monday",
      unreadCount: 0,
      isOnline: true,
      isTyping: false,
    },
  ]);

  // Sample notifications
  const [notifications, setNotifications] = useState<Notification[]>([
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
  ]);

  // Simulate receiving a new notification periodically
  useEffect(() => {
    const notificationSenders = [
      {
        name: "Michael Chen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
        messages: [
          "Hey, are you available for a call?",
          "Just sent you the project files",
          "Don't forget about our meeting tomorrow",
        ],
      },
      {
        name: "Jessica Williams",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
        messages: [
          "Check out this article I found",
          "How's the project coming along?",
          "Are we still on for lunch next week?",
        ],
      },
    ];

    // Set up a timer to add a new notification every 30 seconds
    const timer = setTimeout(() => {
      const sender =
        notificationSenders[
          Math.floor(Math.random() * notificationSenders.length)
        ];
      const message =
        sender.messages[Math.floor(Math.random() * sender.messages.length)];

      const newNotification: Notification = {
        id: Date.now().toString(),
        title: "New Message",
        message: `${sender.name}: ${message}`,
        timestamp: new Date(),
        read: false,
        sender: {
          name: sender.name,
          avatar: sender.avatar,
        },
      };

      setNotifications((prev) => [newNotification, ...prev]);
    }, 30000);

    return () => clearTimeout(timer);
  }, [notifications]);

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
        // In a real app, you would navigate to the chat with this friend
        console.log(`Navigating to chat with friend ID: ${friendId}`);
      }
    }
  };

  // Handle notification dismiss
  const handleNotificationDismiss = (notificationId: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId),
    );
  };

  return (
    <div className="h-screen w-full flex flex-col bg-background">
      {/* Main chat interface */}
      <div className="flex-1 overflow-hidden">
        <ChatLayout friends={friends} initialActiveFriendId="1" />
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
