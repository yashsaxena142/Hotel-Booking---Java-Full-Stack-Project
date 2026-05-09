"use client";

import Link from 'next/link';
import { Shield, Home, LogIn } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-3xl"></div>
      
      <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-red-600 to-pink-600 relative">
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
            <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center">
              <Shield className="w-10 h-10 text-red-600" />
            </div>
          </div>
        </div>

        <div className="px-8 pt-12 pb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-6">
            You don't have permission to access this page.
          </p>

          <div className="space-y-3">
            <Link
              href="/"
              className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              <Home className="w-5 h-5" />
              <span>Go to Homepage</span>
            </Link>
            
            <Link
              href="/login"
              className="flex items-center justify-center space-x-2 w-full border-2 border-indigo-600 text-indigo-600 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-all"
            >
              <LogIn className="w-5 h-5" />
              <span>Switch Account</span>
            </Link>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            Need help? <Link href="/contact" className="text-indigo-600 hover:text-indigo-700 font-medium">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
}