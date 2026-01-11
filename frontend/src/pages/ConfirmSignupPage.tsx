/**
 * サインアップ確認ページ
 */

import React from 'react';
import { ConfirmSignupForm } from '../components/features/auth';
import { useGuestOnly } from '../hooks/useAuth';
import { Loading } from '../components/common';

export const ConfirmSignupPage: React.FC = () => {
  const { loading } = useGuestOnly();

  if (loading) {
    return <Loading fullScreen message="読み込み中..." />;
  }

  return <ConfirmSignupForm />;
};

export default ConfirmSignupPage;
