import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  getFriends,
  getMessages,
  sendMessage,
  markMessagesAsRead,
  setTypingStatus,
  subscribeToMessages,
  subscribeToTypingStatus,
  subscribeToUserStatus,
} from "@/lib/supabase-client";

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

type ChatContextType = {
  friends: Friend[];
  activeFriendId: string | null;
  messages: Record<string, Message[]>;
  isLoading: boolean;
  setActiveFriendId: (id: string) => void;
  handleSendMessage: (message: string) => Promise<void>;
  handleTypingStart: () => void;
  handleTypingStop: () => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [activeFriendId, setActiveFriendId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );

  // Load friends when user is authenticated
  useEffect(() => {
    if (!user) {
      setFriends([]);
      setMessages({});
      setIsLoading(false);
      return;
    }

    const loadFriends = async () => {
      try {
        setIsLoading(true);
        const friendsData = await getFriends(user.id);

        const formattedFriends: Friend[] = friendsData.map((item: any) => ({
          id: item.friend.id,
          name: item.friend.name,
          avatar:
            item.friend.avatar_url ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.friend.name}`,
          lastMessage: "",
          timestamp: "",
          unreadCount: 0,
          isOnline: item.friend.status === "online",
          isTyping: false,
        }));

        setFriends(formattedFriends);

        // Set first friend as active if none is selected
        if (formattedFriends.length > 0 && !activeFriendId) {
          setActiveFriendId(formattedFriends[0].id);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading friends:", error);
        setIsLoading(false);
      }
    };

    loadFriends();
  }, [user, activeFriendId]);

  // Load messages for active friend
  useEffect(() => {
    if (!user || !activeFriendId) return;

    const loadMessages = async () => {
      try {
        const messagesData = await getMessages(user.id, activeFriendId);

        // Format messages
        const formattedMessages: Message[] = messagesData.map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          timestamp: new Date(msg.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isCurrentUser: msg.sender_id === user.id,
          // We would need to fetch sender details in a real app
          senderAvatar:
            msg.sender_id === user.id
              ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`
              : friends.find((f) => f.id === msg.sender_id)?.avatar,
          senderName:
            msg.sender_id === user.id
              ? "You"
              : friends.find((f) => f.id === msg.sender_id)?.name,
        }));

        setMessages((prev) => ({
          ...prev,
          [activeFriendId]: formattedMessages,
        }));

        // Mark messages as read
        await markMessagesAsRead(user.id, activeFriendId);

        // Update unread count
        setFriends((prev) =>
          prev.map((friend) =>
            friend.id === activeFriendId
              ? { ...friend, unreadCount: 0 }
              : friend,
          ),
        );
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

    loadMessages();
  }, [user, activeFriendId, friends]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!user) return;

    // Subscribe to new messages
    const messageSubscription = subscribeToMessages(user.id, (payload) => {
      const newMessage = payload.new;
      const senderId = newMessage.sender_id;

      // Format the new message
      const formattedMessage: Message = {
        id: newMessage.id,
        content: newMessage.content,
        timestamp: new Date(newMessage.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isCurrentUser: false,
        senderAvatar: friends.find((f) => f.id === senderId)?.avatar,
        senderName: friends.find((f) => f.id === senderId)?.name,
      };

      // Add message to the conversation
      setMessages((prev) => ({
        ...prev,
        [senderId]: [...(prev[senderId] || []), formattedMessage],
      }));

      // Update friend's last message and unread count if not active
      setFriends((prev) =>
        prev.map((friend) =>
          friend.id === senderId
            ? {
                ...friend,
                lastMessage: newMessage.content,
                timestamp: new Date(newMessage.created_at).toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                ),
                unreadCount:
                  activeFriendId === senderId ? 0 : friend.unreadCount + 1,
              }
            : friend,
        ),
      );

      // Mark as read if this is the active conversation
      if (activeFriendId === senderId) {
        markMessagesAsRead(user.id, senderId).catch(console.error);
      }
    });

    // Subscribe to typing indicators
    const typingSubscription = subscribeToTypingStatus(user.id, (payload) => {
      const typingData = payload.new;
      const typingUserId = typingData.user_id;
      const isTyping = typingData.is_typing;

      // Update friend's typing status
      setFriends((prev) =>
        prev.map((friend) =>
          friend.id === typingUserId ? { ...friend, isTyping } : friend,
        ),
      );
    });

    // Subscribe to user status changes
    const userStatusSubscription = subscribeToUserStatus((payload) => {
      const userData = payload.new;
      const userId = userData.id;
      const status = userData.status;

      // Update friend's online status
      setFriends((prev) =>
        prev.map((friend) =>
          friend.id === userId
            ? { ...friend, isOnline: status === "online" }
            : friend,
        ),
      );
    });

    return () => {
      // Clean up subscriptions
      messageSubscription.then((subscription) => subscription.unsubscribe());
      typingSubscription.then((subscription) => subscription.unsubscribe());
      userStatusSubscription.then((subscription) => subscription.unsubscribe());
    };
  }, [user, activeFriendId, friends]);

  // Send message function
  const handleSendMessage = async (message: string) => {
    if (!user || !activeFriendId || !message.trim()) return;

    try {
      // Send message to Supabase
      const newMessage = await sendMessage(user.id, activeFriendId, message);

      // Format the new message for UI
      const formattedMessage: Message = {
        id: newMessage.id,
        content: newMessage.content,
        timestamp: new Date(newMessage.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isCurrentUser: true,
        senderAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
        senderName: "You",
      };

      // Add message to the conversation
      setMessages((prev) => ({
        ...prev,
        [activeFriendId]: [...(prev[activeFriendId] || []), formattedMessage],
      }));

      // Update friend's last message
      setFriends((prev) =>
        prev.map((friend) =>
          friend.id === activeFriendId
            ? {
                ...friend,
                lastMessage: message,
                timestamp: formattedMessage.timestamp,
              }
            : friend,
        ),
      );

      // Stop typing indicator
      handleTypingStop();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Typing indicator functions
  const handleTypingStart = () => {
    if (!user || !activeFriendId) return;

    // Set typing status to true
    setTypingStatus(user.id, activeFriendId, true).catch(console.error);

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set new timeout to stop typing after 3 seconds of inactivity
    const timeout = setTimeout(() => {
      handleTypingStop();
    }, 3000);

    setTypingTimeout(timeout);
  };

  const handleTypingStop = () => {
    if (!user || !activeFriendId) return;

    // Set typing status to false
    setTypingStatus(user.id, activeFriendId, false).catch(console.error);

    // Clear timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
      setTypingTimeout(null);
    }
  };

  const value = {
    friends,
    activeFriendId,
    messages,
    isLoading,
    setActiveFriendId,
    handleSendMessage,
    handleTypingStart,
    handleTypingStop,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
