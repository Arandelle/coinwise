// hooks/useUser.ts
import { useState, useEffect } from 'react';

export interface User {
  _id: string;
  email: string;
  username: string;
  full_name: string;
  created_at: string;
  is_active: boolean;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/me');
      
      if (!response.ok) {
        if (response.status === 401) {
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