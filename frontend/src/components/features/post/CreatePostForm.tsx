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
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOverLimit = content.length > MAX_POST_LENGTH;
  const isEmpty = content.trim().length === 0 && !imageFile;
  const charRatio = content.length / MAX_POST_LENGTH;

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
    <form 
      onSubmit={handleSubmit} 
      className={`p-4 bg-white border-b border-gray-100 transition-all duration-200 ${isFocused ? 'bg-gradient-to-b from-brand-50/30 to-white' : ''}`}
    >
      <div className="flex space-x-3">
        <div className="ring-2 ring-transparent hover:ring-brand-200 rounded-full transition-all duration-200">
          <Avatar
            src={user?.profileImageUrl}
            name={user?.displayName || user?.username}
            size="md"
          />
        </div>

        <div className="flex-1">
          <TextArea
            value={content}
            onChange={handleContentChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            maxLength={MAX_POST_LENGTH}
            showCount
            rows={compact ? 2 : 3}
            fullWidth
            className="border-none focus:ring-0 resize-none bg-transparent text-[15px] placeholder-gray-400"
          />

          {/* 画像プレビュー */}
          {imagePreview && (
            <div className="relative mt-3 inline-block animate-scale-in">
              <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
                <img
                  src={imagePreview}
                  alt="プレビュー"
                  className="max-h-60 object-cover"
                />
              </div>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-1.5 bg-gray-900/70 backdrop-blur-sm rounded-full text-white hover:bg-gray-900/90 transition-all duration-200 hover:scale-110"
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
            <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 animate-shake">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* アクション */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-1">
              {/* 画像アップロード */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 text-brand-500 hover:bg-brand-50 rounded-xl transition-all duration-200 hover:scale-110"
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
                className="p-2.5 text-brand-500 hover:bg-brand-50 rounded-xl transition-all duration-200 hover:scale-110"
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

              {/* GIF */}
              <button
                type="button"
                className="p-2.5 text-brand-500 hover:bg-brand-50 rounded-xl transition-all duration-200 hover:scale-110"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2m5 2V2m5 2V2M5 8h14M5 12h3m4 0h4m-4 4h4M9 16h.01M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* 文字数カウンター（円形） */}
              {content.length > 0 && (
                <div className="relative w-8 h-8">
                  <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="3"
                    />
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      fill="none"
                      stroke={isOverLimit ? '#ef4444' : charRatio > 0.9 ? '#f59e0b' : '#6366f1'}
                      strokeWidth="3"
                      strokeDasharray={`${charRatio * 88} 88`}
                      strokeLinecap="round"
                      className="transition-all duration-200"
                    />
                  </svg>
                  {isOverLimit && (
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-red-500">
                      -{content.length - MAX_POST_LENGTH}
                    </span>
                  )}
                </div>
              )}
              
              <Button
                type="submit"
                size="sm"
                loading={loading}
                disabled={isEmpty || isOverLimit}
                className={`min-w-[80px] ${!isEmpty && !isOverLimit ? 'animate-pulse-soft' : ''}`}
              >
                {buttonText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreatePostForm;
