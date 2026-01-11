/**
 * ログインフォームコンポーネント
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input, Button } from '../../common';
import { useAuth } from '../../../hooks/useAuth';
import { ROUTES } from '../../../constants/routes';
import { validate, required, email as emailRule, minLength } from '../../../utils/validation';

export const LoginForm: React.FC = () => {
  const { login, loading, error, resetError } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (error) resetError();
  };

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    const emailResult = validate(formData.email, [required('メールアドレスを入力してください'), emailRule()]);
    if (!emailResult.isValid) {
      newErrors.email = emailResult.message;
    }

    const passwordResult = validate(formData.password, [
      required('パスワードを入力してください'),
      minLength(8, 'パスワードは8文字以上で入力してください'),
    ]);
    if (!passwordResult.isValid) {
      newErrors.password = passwordResult.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    await login({
      email: formData.email,
      password: formData.password,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-900">ログイン</h2>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

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
        fullWidth
        autoComplete="current-password"
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-600">ログイン状態を保持</span>
        </label>
        <Link
          to={ROUTES.AUTH.FORGOT_PASSWORD}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          パスワードをお忘れですか？
        </Link>
      </div>

      <Button type="submit" fullWidth loading={loading}>
        ログイン
      </Button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">または</span>
        </div>
      </div>

      <p className="text-center text-sm text-gray-600">
        アカウントをお持ちでないですか？{' '}
        <Link to={ROUTES.AUTH.SIGNUP} className="text-blue-600 hover:text-blue-800 font-medium">
          新規登録
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
