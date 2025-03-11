import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

interface FriendListItemProps {
  avatar?: string;
  name?: string;
  lastMessage?: string;
  timestamp?: string;
  unreadCount?: number;
  isOnline?: boolean;
  isTyping?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

const FriendListItem = ({
  avatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Buddy",
  name = "Alex Johnson",
  lastMessage = "Hey, how's it going?",
  timestamp = "10:30 AM",
  unreadCount = 0,
  isOnline = false,
  isTyping = false,
  isActive = false,
  onClick = () => {},
}: FriendListItemProps) => {
  return (
    <div
      className={cn(
        "flex items-center p-3 gap-3 cursor-pointer hover:bg-muted/50 transition-colors w-full h-[72px] bg-background",
        isActive && "bg-muted",
      )}
      onClick={onClick}
    >
      <div className="relative flex-shrink-0">
        <Avatar className="h-12 w-12 border border-border">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        {isOnline && (
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
        )}
      </div>

      <div className="flex flex-col flex-grow min-w-0 overflow-hidden">
        <div className="flex justify-between items-center w-full">
          <span className="font-medium truncate">{name}</span>
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {timestamp}
          </span>
        </div>

        <div className="flex justify-between items-center w-full">
          <span className="text-sm text-muted-foreground truncate">
            {isTyping ? (
              <span className="text-primary italic">typing...</span>
            ) : (
              lastMessage
            )}
          </span>
          {unreadCount > 0 && (
            <Badge
              variant="default"
              className="ml-2 h-5 w-5 flex items-center justify-center p-0 rounded-full flex-shrink-0"
            >
              {unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendListItem;
