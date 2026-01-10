/**
 * 投稿作成フォームコンポーネント
 */

import React, { useState, useRef } from 'react';
import { Avatar, Button, TextArea } from '../../common';
import { useAuth } from '../../../hooks/useAuth';
import { MAX_POST_LENGTH } from '../../../constants/config';

interface CreatePostFormProps {
  onSubmit: (content: string, imageFile?: File) => Promise<void>;
  placeholder?: string;
  buttonText?: string;
  compact?: boolean;
}

export const CreatePostForm: React.FC<CreatePostFormProps> = ({
  onSubmit,
  placeholder = '今何してる？',
  buttonText = '投稿',
  compact = false,
}) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOverLimit = content.length > MAX_POST_LENGTH;
  const isEmpty = content.trim().length === 0 && !imageFile;

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setError(null);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 画像サイズチェック (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('画像サイズは5MB以下にしてください');
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEmpty || isOverLimit) return;

    setLoading(true);
    setError(null);

    try {
      await onSubmit(content, imageFile || undefined);
      setContent('');
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError('投稿に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white border-b border-gray-200">
      <div className="flex space-x-3">
        <Avatar
          src={user?.profileImageUrl}
          name={user?.displayName || user?.username}
          size="md"
        />

        <div className="flex-1">
          <TextArea
            value={content}
            onChange={handleContentChange}
            placeholder={placeholder}
            maxLength={MAX_POST_LENGTH}
            showCount
            rows={compact ? 2 : 3}
            fullWidth
            className="border-none focus:ring-0 resize-none"
          />

          {/* 画像プレビュー */}
          {imagePreview && (
            <div className="relative mt-2 inline-block">
              <img
                src={imagePreview}
                alt="プレビュー"
                className="max-h-60 rounded-lg"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* エラーメッセージ */}
          {error && (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          )}

          {/* アクション */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              {/* 画像アップロード */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />

              {/* 絵文字 */}
              <button
                type="button"
                className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>

            <Button
              type="submit"
              size="sm"
              loading={loading}
              disabled={isEmpty || isOverLimit}
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreatePostForm;
