import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      // clear all react query cache
      queryClient.clear();

      // optional : clear local or session storage
      localStorage.clear();
      sessionStorage.clear();

      // redirect to login
      router.push("/");
    } catch (error) {
      console.error("Error logging out: ", error);

      queryClient.clear();
      router.push("/");
    }
  };

  return { logout };
}
