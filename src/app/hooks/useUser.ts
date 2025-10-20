// hooks/useUser.ts
import { useState, useEffect } from 'react';
import { User } from '../types/Users';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/me');
      
      if (!response.ok) {
        if (response.status === 401) {

          const response = await fetch("/api/auth/logout", {
            method: "POST"
          });

          window.location.href = "/login"

          setUser(null);
          return;
        }
        throw new Error('Failed to fetch user');
      }

      const data = await response.json();
      setUser(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const refetch = () => fetchUser();

  return { user, loading, error, refetch };
}