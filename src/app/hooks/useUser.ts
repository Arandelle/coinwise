// hooks/useUser.ts
import { User } from "../types/Users";
import { useQuery } from "@tanstack/react-query";

// Old version

// export function useUser() {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchUser = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('/api/auth/me');

//       if (!response.ok) {
//         if (response.status === 401) {

//           const logoutResponse = await fetch("/api/auth/logout", {
//             method: "POST"
//           });
//           if(logoutResponse.ok){
//             window.location.href = "/login"
//           }

//           setUser(null);
//           return;
//         }
//         throw new Error('Failed to fetch user');
//       }

//       const data = await response.json();
//       setUser(data);
//       setError(null);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'An error occurred');
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUser();
//   }, []);

//   const refetch = () => fetchUser();

//   return { user, loading, error, refetch };
// }

// new version as we use tanstack react-query

export function useUser(options?: { guestMode?: boolean }) {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await fetch("/api/auth/me");

      if (!response.ok) {
        if (response.status === 401) {

          // only redirect if not in guest mode
          if (!options?.guestMode) {
            // User not authenticated
            const logoutResponse = await fetch("/api/auth/logout", {
              method: "POST",
            });
            if (logoutResponse.ok) {
              window.location.href = "/login";
            }
          }

          return null;
        }
        throw new Error("Failed to fetch user");
      }

      const data: User = await response.json();
      return data;
    },
    staleTime: 5 * 60 * 1000, // User data stays fresh for 5 minutes
    retry: false, // Don't retry on 401 errors
  });
}
