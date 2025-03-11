import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import FriendListItem from "./FriendListItem";
import {
  Search,
  Plus,
  Settings,
  MessageSquare,
  Users,
  Bell,
  ChevronDown,
} from "lucide-react";

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

interface FriendsSidebarProps {
  friends?: Friend[];
  activeFriendId?: string;
  onFriendSelect?: (friendId: string) => void;
  onNewChat?: () => void;
  onSearch?: (query: string) => void;
}

const FriendsSidebar = ({
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
  ],
  activeFriendId = "",
  onFriendSelect = () => {},
  onNewChat = () => {},
  onSearch = () => {},
}: FriendsSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"chats" | "friends">("chats");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const totalUnreadCount = friends.reduce(
    (total, friend) => total + friend.unreadCount,
    0,
  );

  return (
    <div className="flex flex-col h-full w-[320px] border-r bg-background">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <h2 className="font-semibold text-lg">Messages</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={onNewChat}
          >
            <Plus className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-9 rounded-full bg-muted/50"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={cn(
            "flex-1 py-2 text-sm font-medium relative",
            activeTab === "chats"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
          onClick={() => setActiveTab("chats")}
        >
          Chats
          {totalUnreadCount > 0 && (
            <Badge
              variant="default"
              className="ml-1.5 h-5 w-5 flex items-center justify-center p-0 rounded-full text-[10px]"
            >
              {totalUnreadCount}
            </Badge>
          )}
          {activeTab === "chats" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
        <button
          className={cn(
            "flex-1 py-2 text-sm font-medium relative",
            activeTab === "friends"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
          onClick={() => setActiveTab("friends")}
        >
          Friends
          {activeTab === "friends" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
      </div>

      {/* Filter Options */}
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <span className="text-xs font-medium text-muted-foreground">
          {activeTab === "chats" ? "Recent Chats" : "All Friends"}
        </span>
        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
          <span>All</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>

      {/* Friends List */}
      <ScrollArea className="flex-1">
        <div className="divide-y divide-border">
          {friends.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 p-4 text-center">
              <Users className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {activeTab === "chats"
                  ? "No recent conversations"
                  : "No friends found"}
              </p>
              <Button
                variant="link"
                size="sm"
                className="mt-2"
                onClick={onNewChat}
              >
                {activeTab === "chats" ? "Start a new chat" : "Add friends"}
              </Button>
            </div>
          ) : (
            friends.map((friend) => (
              <FriendListItem
                key={friend.id}
                avatar={friend.avatar}
                name={friend.name}
                lastMessage={friend.lastMessage}
                timestamp={friend.timestamp}
                unreadCount={friend.unreadCount}
                isOnline={friend.isOnline}
                isTyping={friend.isTyping}
                isActive={friend.id === activeFriendId}
                onClick={() => onFriendSelect(friend.id)}
              />
            ))
          )}
        </div>
      </ScrollArea>

      {/* Online Status */}
      <div className="p-4 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                <span className="text-xs font-medium">YO</span>
              </div>
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">You</span>
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FriendsSidebar;
