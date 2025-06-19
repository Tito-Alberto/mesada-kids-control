
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

interface NotificationBadgeProps {
  count: number;
  className?: string;
}

const NotificationBadge = ({ count, className = "" }: NotificationBadgeProps) => {
  if (count === 0) return null;

  return (
    <div className={`relative ${className}`}>
      <Bell className="w-5 h-5" />
      {count > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
        >
          {count > 99 ? "99+" : count}
        </Badge>
      )}
    </div>
  );
};

export default NotificationBadge;
