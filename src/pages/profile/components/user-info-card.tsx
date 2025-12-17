import { Card, CardContent } from "@/shared/ui";
import type { User } from "firebase/auth";

interface UserInfoCardProps {
  user: User;
  memberSince: string;
}

export function UserInfoCard({ user, memberSince }: UserInfoCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt={user.displayName || "User"}
              className="h-16 w-16 rounded-full"
              referrerPolicy="no-referrer"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold">{user.displayName}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Member since {formatDate(memberSince)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
