/**
 * ホームページ
 */

import React, { useCallback } from 'react';
import { useAppDispatch } from '../store/hooks';
import { addPost as addPostToTimeline } from '../store/slices/timelineSlice';
import { CreatePostForm, Timeline } from '../components/features';
import { postApi } from '../api/postApi';

export const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleCreatePost = useCallback(
    async (content: string, _imageFile?: File) => {
      // TODO: 画像アップロード処理を実装
      const post = await postApi.createPost({ content });
      dispatch(addPostToTimeline(post));
    },
    [dispatch]
  );

  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <div className="sticky top-14 z-10 bg-white border-b border-gray-200">
        <h1 className="px-4 py-3 text-xl font-bold">ホーム</h1>
      </div>

      {/* 投稿作成フォーム */}
      <CreatePostForm onSubmit={handleCreatePost} />

      {/* タイムライン */}
      <Timeline />
    </div>
  );
};

export default HomePage;
