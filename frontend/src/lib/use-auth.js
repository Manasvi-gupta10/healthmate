import { useEffect, useState } from "react";
import { apiFetch, getAuthToken, removeAuthToken } from "./api";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = getAuthToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const userData = await apiFetch("/auth/me");
        setUser({ id: userData._id, ...userData });
      } catch (err) {
        removeAuthToken();
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const signOut = () => {
    removeAuthToken();
    setUser(null);
    window.location.href = "/";
  };

  return { user, loading, signOut };
}
