/**
 * サインアップフォームコンポーネント
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input, Button } from '../../common';
import { useAuth } from '../../../hooks/useAuth';
import { ROUTES } from '../../../constants/routes';
import {
  validate,
  required,
  email as emailRule,
  passwordStrength,
  username as usernameRule,
  confirmPassword,
} from '../../../utils/validation';

export const SignupForm: React.FC = () => {
  const { signup, loading, error, resetError } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (error) resetError();
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    const usernameResult = validate(formData.username, [
      required('ユーザー名を入力してください'),
      usernameRule(),
    ]);
    if (!usernameResult.isValid) {
      newErrors.username = usernameResult.message;
    }

    const emailResult = validate(formData.email, [
      required('メールアドレスを入力してください'),
      emailRule(),
    ]);
    if (!emailResult.isValid) {
      newErrors.email = emailResult.message;
    }

    const passwordResult = validate(formData.password, [
      required('パスワードを入力してください'),
      passwordStrength(),
    ]);
    if (!passwordResult.isValid) {
      newErrors.password = passwordResult.message;
    }

    const confirmPasswordResult = validate(formData.confirmPassword, [
      required('パスワード（確認）を入力してください'),
      confirmPassword(formData.password),
    ]);
    if (!confirmPasswordResult.isValid) {
      newErrors.confirmPassword = confirmPasswordResult.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    await signup({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      name: formData.username, // 表示名として初期値はユーザー名を使用
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-900">新規登録</h2>

      {/* {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )} */}

      <Input
        type="text"
        name="username"
        label="ユーザー名"
        placeholder="username"
        value={formData.username}
        onChange={handleChange}
        error={errors.username}
        helperText="3〜20文字の英数字とアンダースコア"
        fullWidth
        autoComplete="username"
      />

      <Input
        type="email"
        name="email"
        label="メールアドレス"
        placeholder="example@email.com"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        fullWidth
        autoComplete="email"
      />

      <Input
        type="password"
        name="password"
        label="パスワード"
        placeholder="パスワードを入力"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        helperText="8文字以上、大文字・小文字・数字を含む"
        fullWidth
        autoComplete="new-password"
      />

      <Input
        type="password"
        name="confirmPassword"
        label="パスワード（確認）"
        placeholder="パスワードを再入力"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        fullWidth
        autoComplete="new-password"
      />

      <Button type="submit" fullWidth loading={loading}>
        アカウントを作成
      </Button>

      <p className="text-xs text-gray-500 text-center">
        アカウントを作成することで、
        <Link to="/terms" className="text-blue-600 hover:underline">
          利用規約
        </Link>
        と
        <Link to="/privacy" className="text-blue-600 hover:underline">
          プライバシーポリシー
        </Link>
        に同意したことになります。
      </p>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">または</span>
        </div>
      </div>

      <p className="text-center text-sm text-gray-600">
        既にアカウントをお持ちですか？{' '}
        <Link to={ROUTES.AUTH.LOGIN} className="text-blue-600 hover:text-blue-800 font-medium">
          ログイン
        </Link>
      </p>
    </form>
  );
};

export default SignupForm;
