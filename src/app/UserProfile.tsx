// components/UserProfile.tsx
'use client';

import { useUser } from './hooks/useUser';
import { useRouter } from 'next/navigation';

export default function UserProfile() {
  const { user, loading, error } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    // Call logout API to clear cookie
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Error: {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600 mb-4">Please log in to view your profile</p>
        <button
          onClick={() => router.push('/login')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">User Profile</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Full Name</label>
            <p className="text-lg">{user.full_name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Username</label>
            <p className="text-lg">{user.username}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <p className="text-lg">{user.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Account Status</label>
            <p className="text-lg">
              <span className={`px-2 py-1 rounded ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {user.is_active ? 'Active' : 'Inactive'}
              </span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Member Since</label>
            <p className="text-lg">{new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}