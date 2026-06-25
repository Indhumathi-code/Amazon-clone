'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthGuard({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('amazon_token');
    if (!token) {
      // Preserve current path and parameters to redirect back after login
      const currentPath = window.location.pathname + window.location.search;
      router.replace(`/login?redirect=${encodeURIComponent(currentPath)}`);
    } else {
      setTimeout(() => {
        setAuthorized(true);
      }, 0);
    }
  }, [router]);

  if (!authorized) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans select-none p-4">
        {/* Amazon-style loading indicator */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-[3px] border-[#FF9900]/20 border-t-[#FF9900] rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-gray-500">Checking authentication...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
