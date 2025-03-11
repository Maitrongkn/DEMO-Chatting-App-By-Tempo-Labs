import React, { useRef, useEffect } from "react";
import { ScrollArea } from "../ui/scroll-area";
import MessageBubble from "./MessageBubble";

interface Message {
  id: string;
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
  senderAvatar?: string;
  senderName?: string;
}

interface MessageGroup {
  senderId: string;
  isCurrentUser: boolean;
  messages: Message[];
  senderAvatar?: string;
  senderName?: string;
}

interface MessageListProps {
  messages?: Message[];
  isLoading?: boolean;
}

const MessageList = ({
  messages = [
    {
      id: "1",
      content: "Hey there! How's it going?",
      timestamp: "10:30 AM",
      isCurrentUser: false,
      senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
      senderName: "Alice",
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
      senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
      senderName: "Alice",
    },
    {
      id: "4",
      content: "Can you share some details about it?",
      timestamp: "10:33 AM",
      isCurrentUser: false,
      senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
      senderName: "Alice",
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
      senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
      senderName: "Alice",
    },
  ],
  isLoading = false,
}: MessageListProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Group messages by sender and consecutive messages
  const groupMessages = (messages: Message[]): MessageGroup[] => {
    const groups: MessageGroup[] = [];
    let currentGroup: MessageGroup | null = null;

    messages.forEach((message) => {
      // If no current group or the sender changed, create a new group
      if (
        !currentGroup ||
        currentGroup.isCurrentUser !== message.isCurrentUser
      ) {
        if (currentGroup) {
          groups.push(currentGroup);
        }

        currentGroup = {
          senderId: message.isCurrentUser
            ? "currentUser"
            : message.senderName || "unknown",
          isCurrentUser: message.isCurrentUser,
          messages: [message],
          senderAvatar: message.senderAvatar,
          senderName: message.senderName,
        };
      } else {
        // Add to existing group
        currentGroup.messages.push(message);
      }
    });

    // Add the last group if it exists
    if (currentGroup) {
      groups.push(currentGroup);
    }

    return groups;
  };

  const messageGroups = groupMessages(messages);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <div
      className="flex flex-col h-full w-full bg-background"
      ref={scrollAreaRef}
    >
      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : messageGroups.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No messages yet. Start a conversation!
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            {messageGroups.map((group, groupIndex) => (
              <div
                key={`${group.senderId}-${groupIndex}`}
                className="flex flex-col"
              >
                {group.messages.map((message, messageIndex) => (
                  <MessageBubble
                    key={message.id}
                    content={message.content}
                    timestamp={message.timestamp}
                    isCurrentUser={message.isCurrentUser}
                    senderAvatar={group.senderAvatar}
                    senderName={group.senderName || "Unknown"}
                    isFirstInGroup={messageIndex === 0}
                    isLastInGroup={messageIndex === group.messages.length - 1}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default MessageList;
