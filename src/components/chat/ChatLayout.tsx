import React, { useState } from "react";
import FriendsSidebar from "./FriendsSidebar";
import ChatArea from "./ChatArea";
import { cn } from "@/lib/utils";

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

interface Message {
  id: string;
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
  senderAvatar?: string;
  senderName?: string;
}

interface ChatLayoutProps {
  friends?: Friend[];
  initialActiveFriendId?: string;
  className?: string;
}

const ChatLayout = ({
  friends = [
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
  ],
  initialActiveFriendId = "1",
  className,
}: ChatLayoutProps) => {
  const [activeFriendId, setActiveFriendId] = useState(initialActiveFriendId);
  const [friendsData, setFriendsData] = useState<Friend[]>(friends);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState<{
    friendId: string;
    friendName: string;
    message: string;
  } | null>(null);

  // Find the active friend
  const activeFriend = friendsData.find(
    (friend) => friend.id === activeFriendId,
  );

  // Mock messages for the active conversation
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    "1": [
      {
        id: "1",
        content: "Hey there! How's it going?",
        timestamp: "10:30 AM",
        isCurrentUser: false,
        senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        senderName: "Sarah Johnson",
      },
      {
        id: "2",
        content: "I'm doing well, thanks for asking! How about you?",
        timestamp: "10:31 AM",
        isCurrentUser: true,
        senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
        senderName: "You",
      },
      {
        id: "3",
        content: "Pretty good! Just working on this new project.",
        timestamp: "10:32 AM",
        isCurrentUser: false,
        senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        senderName: "Sarah Johnson",
      },
    ],
    "2": [
      {
        id: "1",
        content: "Did you see the latest update?",
        timestamp: "9:15 AM",
        isCurrentUser: false,
        senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
        senderName: "Michael Chen",
      },
      {
        id: "2",
        content: "Not yet, what's new?",
        timestamp: "9:16 AM",
        isCurrentUser: true,
        senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
        senderName: "You",
      },
    ],
    "3": [
      {
        id: "1",
        content: "Let's meet tomorrow at 2pm",
        timestamp: "Yesterday",
        isCurrentUser: false,
        senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
        senderName: "Jessica Williams",
      },
      {
        id: "2",
        content: "Sounds good! Where should we meet?",
        timestamp: "Yesterday",
        isCurrentUser: true,
        senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
        senderName: "You",
      },
    ],
  });

  const handleFriendSelect = (friendId: string) => {
    setActiveFriendId(friendId);

    // Reset unread count when selecting a friend
    setFriendsData((prevFriends) =>
      prevFriends.map((friend) =>
        friend.id === friendId ? { ...friend, unreadCount: 0 } : friend,
      ),
    );
  };

  const handleSendMessage = (message: string) => {
    if (!activeFriendId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isCurrentUser: true,
      senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
      senderName: "You",
    };

    // Add the new message to the conversation
    setMessages((prevMessages) => ({
      ...prevMessages,
      [activeFriendId]: [...(prevMessages[activeFriendId] || []), newMessage],
    }));

    // Simulate friend typing after sending a message
    if (activeFriend) {
      const updatedFriends = friendsData.map((friend) =>
        friend.id === activeFriendId ? { ...friend, isTyping: true } : friend,
      );
      setFriendsData(updatedFriends);

      // Simulate friend response after a delay
      setTimeout(() => {
        simulateFriendResponse(activeFriendId);
      }, 3000);
    }
  };

  const simulateFriendResponse = (friendId: string) => {
    const friend = friendsData.find((f) => f.id === friendId);
    if (!friend) return;

    // Stop typing indicator
    setFriendsData((prevFriends) =>
      prevFriends.map((f) =>
        f.id === friendId ? { ...f, isTyping: false } : f,
      ),
    );

    // Generate a response message
    const responseMessages = [
      "That's interesting!",
      "I see what you mean.",
      "Thanks for letting me know.",
      "I'll get back to you on that.",
      "Sounds good to me!",
    ];

    const randomResponse =
      responseMessages[Math.floor(Math.random() * responseMessages.length)];

    const newMessage: Message = {
      id: Date.now().toString(),
      content: randomResponse,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isCurrentUser: false,
      senderAvatar: friend.avatar,
      senderName: friend.name,
    };

    // Add the response to the conversation
    setMessages((prevMessages) => ({
      ...prevMessages,
      [friendId]: [...(prevMessages[friendId] || []), newMessage],
    }));

    // If the user is not viewing this friend's chat, show a notification
    if (activeFriendId !== friendId) {
      // Increment unread count
      setFriendsData((prevFriends) =>
        prevFriends.map((f) =>
          f.id === friendId
            ? {
                ...f,
                unreadCount: f.unreadCount + 1,
                lastMessage: randomResponse,
              }
            : f,
        ),
      );

      // Show notification
      setNotificationData({
        friendId,
        friendName: friend.name,
        message: randomResponse,
      });
      setShowNotification(true);

      // Hide notification after 5 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    }
  };

  const handleTypingStart = () => {
    // This would typically send a typing indicator to the server
    console.log("User started typing");
  };

  const handleTypingStop = () => {
    // This would typically send a typing stopped indicator to the server
    console.log("User stopped typing");
  };

  const handleNotificationClick = (friendId: string) => {
    setActiveFriendId(friendId);
    setShowNotification(false);

    // Reset unread count
    setFriendsData((prevFriends) =>
      prevFriends.map((friend) =>
        friend.id === friendId ? { ...friend, unreadCount: 0 } : friend,
      ),
    );
  };

  // Simple inline notification component
  const NotificationComponent = ({
    friendId,
    friendName,
    message,
    onClick,
  }: {
    friendId: string;
    friendName: string;
    message: string;
    onClick: () => void;
  }) => (
    <div
      className="fixed top-4 right-4 max-w-sm bg-background border rounded-lg shadow-lg p-4 cursor-pointer animate-in slide-in-from-right"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="font-semibold text-primary">
            {friendName.substring(0, 2)}
          </span>
        </div>
        <div className="flex-1">
          <h4 className="font-medium">{friendName}</h4>
          <p className="text-sm text-muted-foreground truncate">{message}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        "flex h-full w-full overflow-hidden bg-background",
        className,
      )}
    >
      <FriendsSidebar
        friends={friendsData}
        activeFriendId={activeFriendId}
        onFriendSelect={handleFriendSelect}
        onNewChat={() => console.log("New chat requested")}
        onSearch={(query) => console.log("Search query:", query)}
      />

      {activeFriend ? (
        <ChatArea
          friendName={activeFriend.name}
          friendAvatar={activeFriend.avatar}
          isOnline={activeFriend.isOnline}
          isTyping={activeFriend.isTyping}
          lastSeen={activeFriend.isOnline ? undefined : "5 minutes ago"}
          messages={messages[activeFriendId] || []}
          onSendMessage={handleSendMessage}
          onTypingStart={handleTypingStart}
          onTypingStop={handleTypingStop}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-muted/20">
          <div className="text-center p-8">
            <h3 className="text-xl font-medium mb-2">Select a conversation</h3>
            <p className="text-muted-foreground">
              Choose a friend from the sidebar to start chatting
            </p>
          </div>
        </div>
      )}

      {showNotification && notificationData && (
        <NotificationComponent
          friendId={notificationData.friendId}
          friendName={notificationData.friendName}
          message={notificationData.message}
          onClick={() => handleNotificationClick(notificationData.friendId)}
        />
      )}
    </div>
  );
};

export default ChatLayout;
