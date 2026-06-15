import { useState } from "react";
import { useAuth } from "@/shared/hooks";

export function useDeleteAccount() {
  const { deleteAccount } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await deleteAccount();
    } catch {
      setError("Възникна грешка. Моля, влезте отново и опитайте.");
      setIsDeleting(false);
    }
  };

  return { isDeleting, error, handleDelete };
}
