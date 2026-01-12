/**
 * サインアップ確認フォームコンポーネント
 */

import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Input, Button } from '../../common';
import { useAuth } from '../../../hooks/useAuth';
import { ROUTES } from '../../../constants/routes';
import { validate, required, minLength } from '../../../utils/validation';

export const ConfirmSignupForm: React.FC = () => {
  const location = useLocation();
  const { confirmSignup, loading, error, resetError } = useAuth();

  const emailFromState = (location.state as { email?: string })?.email || '';

  const [formData, setFormData] = useState({
    email: emailFromState,
    confirmationCode: '',
  });
  const [errors, setErrors] = useState<{
    email?: string;
    confirmationCode?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (error) resetError();
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    const emailResult = validate(formData.email, [
      required('メールアドレスを入力してください'),
    ]);
    if (!emailResult.isValid) {
      newErrors.email = emailResult.message;
    }

    const codeResult = validate(formData.confirmationCode, [
      required('確認コードを入力してください'),
      minLength(6, '確認コードは6文字です'),
    ]);
    if (!codeResult.isValid) {
      newErrors.confirmationCode = codeResult.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    await confirmSignup({
      email: formData.email,
      code: formData.confirmationCode,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-900">メール確認</h2>

      <p className="text-sm text-gray-600 text-center">
        {emailFromState ? (
          <>
            <span className="font-medium">{emailFromState}</span> に確認コードを送信しました。
          </>
        ) : (
          '登録したメールアドレスに送信された確認コードを入力してください。'
        )}
      </p>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {!emailFromState && (
        <Input
          type="email"
          name="email"
          label="メールアドレス"
          placeholder="example@email.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          fullWidth
        />
      )}

      <Input
        type="text"
        name="confirmationCode"
        label="確認コード"
        placeholder="123456"
        value={formData.confirmationCode}
        onChange={handleChange}
        error={errors.confirmationCode}
        fullWidth
        maxLength={6}
        autoComplete="one-time-code"
      />

      <Button type="submit" fullWidth loading={loading}>
        確認
      </Button>

      <div className="text-center">
        <button
          type="button"
          className="text-sm text-blue-600 hover:text-blue-800"
          // TODO: 再送信処理を実装
        >
          確認コードを再送信
        </button>
      </div>

      <p className="text-center text-sm text-gray-600">
        <Link to={ROUTES.AUTH.LOGIN} className="text-blue-600 hover:text-blue-800">
          ログインに戻る
        </Link>
      </p>
    </form>
  );
};

export default ConfirmSignupForm;
