import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  src?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  isOnline?: boolean;
  className?: string;
}

export function UserAvatar({
  src,
  name = "User",
  size = "md",
  isOnline = false,
  className,
}: UserAvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const statusSizeClasses = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-3.5 w-3.5",
    xl: "h-4 w-4",
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="relative inline-block">
      <Avatar className={`${sizeClasses[size]} ${className}`}>
        <AvatarImage src={src} alt={name} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      {isOnline && (
        <span
          className={`absolute bottom-0 right-0 ${statusSizeClasses[size]} rounded-full bg-green-500 border-2 border-background`}
        ></span>
      )}
    </div>
  );
}
