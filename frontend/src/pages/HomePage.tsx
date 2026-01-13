/**
 * ホームページ（Twitter/X スタイル）
 */

import React, { useCallback } from 'react';
import { useAppDispatch } from '../store/hooks';
import { fetchTimelineAsync } from '../store/slices/timelineSlice';
import { CreatePostForm, Timeline } from '../components/features';
import { postApi } from '../api/postApi';

export const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleCreatePost = useCallback(
    async (content: string, _imageFile?: File) => {
      // TODO: 画像アップロード処理を実装
      await postApi.createPost({ content });
      // 投稿後にタイムラインをリフレッシュ
      dispatch(fetchTimelineAsync({ page: 0, refresh: true }));
    },
    [dispatch]
  );

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center justify-between px-4 h-14">
          <h1 className="text-xl font-bold">ホーム</h1>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </button>
        </div>
        
        {/* タブ */}
        <div className="flex border-b border-gray-100">
          <button className="flex-1 py-4 text-center font-bold relative hover:bg-gray-50 transition-colors">
            おすすめ
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-blue-500 rounded-full" />
          </button>
          <button className="flex-1 py-4 text-center font-medium text-gray-500 hover:bg-gray-50 transition-colors">
            フォロー中
          </button>
        </div>
      </div>

      {/* 投稿作成フォーム */}
      <CreatePostForm onSubmit={handleCreatePost} />

      {/* タイムライン */}
      <Timeline />
    </div>
  );
};

export default HomePage;
