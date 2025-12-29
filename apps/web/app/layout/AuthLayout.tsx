import { useAppSelector } from '@/app/hooks/redux';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <Outlet />
      </div>
    </div>
  );
};
