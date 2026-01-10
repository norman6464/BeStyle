/**
 * サインアップページ
 */

import React from 'react';
import { SignupForm } from '../components/features/auth';
import { useGuestOnly } from '../hooks/useAuth';
import { Loading } from '../components/common';

export const SignupPage: React.FC = () => {
  const { loading } = useGuestOnly();

  if (loading) {
    return <Loading fullScreen message="読み込み中..." />;
  }

  return <SignupForm />;
};

export default SignupPage;
