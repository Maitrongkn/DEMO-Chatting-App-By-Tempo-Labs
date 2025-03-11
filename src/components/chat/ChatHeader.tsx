import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/lib/utils";
import { MoreHorizontal, Phone, Video } from "lucide-react";

interface ChatHeaderProps {
  friendName?: string;
  friendAvatar?: string;
  isOnline?: boolean;
  isTyping?: boolean;
  lastSeen?: string;
}

const ChatHeader = ({
  friendName = "Sarah Johnson",
  friendAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  isOnline = true,
  isTyping = false,
  lastSeen = "5 minutes ago",
}: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between h-[72px] px-4 py-3 border-b bg-background">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={friendAvatar} alt={friendName} />
            <AvatarFallback>{friendName.substring(0, 2)}</AvatarFallback>
          </Avatar>
          {isOnline && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
          )}
        </div>

        <div className="flex flex-col">
          <h2 className="font-medium text-base">{friendName}</h2>
          {isTyping ? (
            <p className="text-xs text-primary animate-pulse">Typing...</p>
          ) : isOnline ? (
            <p className="text-xs text-muted-foreground">Online</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Last seen {lastSeen}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Phone className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Voice call</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Video className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Video call</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>More options</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ChatHeader;
