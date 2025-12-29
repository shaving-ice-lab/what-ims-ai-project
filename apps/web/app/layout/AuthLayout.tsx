'use client';

import { useAppSelector } from '@/hooks/redux';
import { redirect } from 'next/navigation';
import React, { useEffect } from 'react';

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      redirect('/dashboard');
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">{children}</div>
    </div>
  );
};
