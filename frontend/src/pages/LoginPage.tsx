/**
 * ログインページ
 */

import React from 'react';
import { LoginForm } from '../components/features/auth';
import { useGuestOnly } from '../hooks/useAuth';
import { Loading } from '../components/common';

export const LoginPage: React.FC = () => {
  const { loading } = useGuestOnly();

  if (loading) {
    return <Loading fullScreen message="読み込み中..." />;
  }

  return <LoginForm />;
};

export default LoginPage;
