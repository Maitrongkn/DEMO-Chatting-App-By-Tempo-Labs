import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  content: string;
  timestamp: string;
  isCurrentUser?: boolean;
  senderAvatar?: string;
  senderName?: string;
  isFirstInGroup?: boolean;
  isLastInGroup?: boolean;
}

const MessageBubble = ({
  content = "Hello there! How are you doing today?",
  timestamp = "10:30 AM",
  isCurrentUser = false,
  senderAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  senderName = "John Doe",
  isFirstInGroup = true,
  isLastInGroup = true,
}: MessageBubbleProps) => {
  return (
    <div
      className={cn(
        "flex w-full max-w-[600px] mb-1",
        isCurrentUser ? "ml-auto justify-end" : "mr-auto justify-start",
        !isLastInGroup && "mb-0.5",
        "bg-background",
      )}
    >
      {!isCurrentUser && isFirstInGroup && (
        <div className="flex-shrink-0 mr-2 mt-auto">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={senderAvatar} alt={senderName} />
                  <AvatarFallback>{senderName.substring(0, 2)}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="top">{senderName}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
      {!isCurrentUser && !isFirstInGroup && <div className="w-8 mr-2"></div>}

      <div className="flex flex-col max-w-[85%]">
        <div
          className={cn(
            "px-4 py-2 rounded-2xl",
            isCurrentUser
              ? "bg-primary text-primary-foreground rounded-tr-none"
              : "bg-muted rounded-tl-none",
            isFirstInGroup && isCurrentUser && "rounded-tr-2xl",
            isFirstInGroup && !isCurrentUser && "rounded-tl-2xl",
          )}
        >
          {content}
        </div>

        {isLastInGroup && (
          <span
            className={cn(
              "text-xs text-muted-foreground mt-1",
              isCurrentUser ? "text-right" : "text-left",
            )}
          >
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
