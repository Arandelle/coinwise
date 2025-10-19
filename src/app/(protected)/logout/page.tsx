"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
    });
    router.push("/login"); // redirect to login after logout
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}
