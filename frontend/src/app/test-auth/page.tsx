"use client";

import { useAuth } from '@/context/AuthContext';

export default function TestAuthPage() {
  const { user, token, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Test Page</h1>
      <div className="space-y-2">
        <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
        <p><strong>User:</strong> {user ? JSON.stringify(user) : 'No user'}</p>
        <p><strong>Token:</strong> {token ? token.substring(0, 20) + '...' : 'No token'}</p>
        <p><strong>LocalStorage token:</strong> {typeof window !== 'undefined' && localStorage.getItem('token') ? 'Exists' : 'Missing'}</p>
        <p><strong>LocalStorage user:</strong> {typeof window !== 'undefined' && localStorage.getItem('user') ? 'Exists' : 'Missing'}</p>
      </div>
      
      <div className="mt-4">
        <a href="/owner/dashboard" className="text-blue-600 underline mr-4">Go to Owner Dashboard</a>
        <a href="/dashboard" className="text-blue-600 underline">Go to User Dashboard</a>
      </div>
    </div>
  );
}