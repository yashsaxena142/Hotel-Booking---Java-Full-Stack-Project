// src/app/admin/page.tsx
"use client";

import ProtectedRoute from '@/components/ProtectedRoute';

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole={['ADMIN', 'SUPER_ADMIN']}>
      <div>
        <h1>Admin Panel</h1>
        {/* Your admin content */}
      </div>
    </ProtectedRoute>
  );
}