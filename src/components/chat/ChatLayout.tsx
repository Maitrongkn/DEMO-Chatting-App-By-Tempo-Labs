import React from "react";
import FriendsSidebar from "./FriendsSidebar";
import ChatArea from "./ChatArea";
import { cn } from "@/lib/utils";
import { useChat } from "@/context/ChatContext";

interface ChatLayoutProps {
  className?: string;
}

const ChatLayout = ({ className }: ChatLayoutProps) => {
  const {
    friends,
    activeFriendId,
    messages,
    setActiveFriendId,
    handleSendMessage,
    handleTypingStart,
    handleTypingStop,
    isLoading,
  } = useChat();

  // Find the active friend
  const activeFriend = friends.find((friend) => friend.id === activeFriendId);

  const handleFriendSelect = (friendId: string) => {
    setActiveFriendId(friendId);
  };

  return (
    <div
      className={cn(
        "flex h-full w-full overflow-hidden bg-background",
        className,
      )}
    >
      <FriendsSidebar
        friends={friends}
        activeFriendId={activeFriendId || ""}
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
          messages={activeFriendId ? messages[activeFriendId] || [] : []}
          onSendMessage={handleSendMessage}
          onTypingStart={handleTypingStart}
          onTypingStop={handleTypingStop}
          isLoading={isLoading}
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
    </div>
  );
};

export default ChatLayout;
