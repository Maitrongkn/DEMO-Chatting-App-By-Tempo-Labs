import React from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

interface ChatAreaProps {
  friendName?: string;
  friendAvatar?: string;
  isOnline?: boolean;
  isTyping?: boolean;
  lastSeen?: string;
  messages?: Array<{
    id: string;
    content: string;
    timestamp: string;
    isCurrentUser: boolean;
    senderAvatar?: string;
    senderName?: string;
  }>;
  onSendMessage?: (message: string) => void;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
  isLoading?: boolean;
}

const ChatArea = ({
  friendName = "Sarah Johnson",
  friendAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  isOnline = true,
  isTyping = false,
  lastSeen = "5 minutes ago",
  messages = [
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
    {
      id: "4",
      content: "Can you share some details about it?",
      timestamp: "10:33 AM",
      isCurrentUser: false,
      senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      senderName: "Sarah Johnson",
    },
    {
      id: "5",
      content: "Sure! It's a messaging app with real-time chat functionality.",
      timestamp: "10:35 AM",
      isCurrentUser: true,
      senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
      senderName: "You",
    },
    {
      id: "6",
      content: "That sounds interesting! I'd love to see it when it's ready.",
      timestamp: "10:36 AM",
      isCurrentUser: false,
      senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      senderName: "Sarah Johnson",
    },
  ],
  onSendMessage = (message: string) => console.log("Message sent:", message),
  onTypingStart = () => console.log("Typing started"),
  onTypingStop = () => console.log("Typing stopped"),
  isLoading = false,
}: ChatAreaProps) => {
  const handleSendMessage = (message: string) => {
    onSendMessage(message);
  };

  return (
    <div className="flex flex-col h-full w-full bg-background">
      <ChatHeader
        friendName={friendName}
        friendAvatar={friendAvatar}
        isOnline={isOnline}
        isTyping={isTyping}
        lastSeen={lastSeen}
      />

      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>

      <MessageInput
        onSendMessage={handleSendMessage}
        onTypingStart={onTypingStart}
        onTypingStop={onTypingStop}
        disabled={isLoading}
        placeholder="Type a message..."
      />
    </div>
  );
};

export default ChatArea;
