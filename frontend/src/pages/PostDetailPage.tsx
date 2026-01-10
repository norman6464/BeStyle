/**
 * 投稿詳細ページ
 */

import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchPostByIdAsync } from '../store/slices/postSlice';
import { Avatar, Loading, ErrorDisplay, Button } from '../components/common';
import { ROUTES } from '../constants/routes';
import { formatFullDateTime } from '../utils/formatDate';
import { postApi } from '../api/postApi';

export const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentPost, loading, error } = useAppSelector((state) => state.post);
  const { user: currentUser } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchPostByIdAsync(Number(id)));
    }
  }, [dispatch, id]);

  const handleLike = async () => {
    if (currentPost) {
      if (currentPost.isLiked) {
        await postApi.unlikePost(currentPost.id);
      } else {
        await postApi.likePost(currentPost.id);
      }
      dispatch(fetchPostByIdAsync(currentPost.id));
    }
  };

  const handleBookmark = async () => {
    if (currentPost) {
      if (currentPost.isBookmarked) {
        await postApi.unbookmarkPost(currentPost.id);
      } else {
        await postApi.bookmarkPost(currentPost.id);
      }
      dispatch(fetchPostByIdAsync(currentPost.id));
    }
  };

  if (loading) {
    return <Loading fullScreen message="読み込み中..." />;
  }

  if (error) {
    return (
      <div className="p-4">
        <ErrorDisplay error={error} />
      </div>
    );
  }

  if (!currentPost) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">投稿が見つかりませんでした</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <div className="sticky top-14 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center px-4 py-3">
          <button
            onClick={() => window.history.back()}
            className="p-2 -ml-2 mr-4 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-xl font-bold">投稿</h1>
        </div>
      </div>

      {/* 投稿コンテンツ */}
      <article className="p-4">
        {/* ユーザー情報 */}
        <div className="flex items-center space-x-3 mb-4">
          <Link to={ROUTES.PROFILE.VIEW(currentPost.user?.username || '')}>
            <Avatar
              src={currentPost.user?.profileImageUrl}
              name={currentPost.user?.displayName || currentPost.user?.username || '不明なユーザー'}
              size="md"
            />
          </Link>
          <div>
            <Link
              to={ROUTES.PROFILE.VIEW(currentPost.user?.username || '')}
              className="font-bold text-gray-900 hover:underline"
            >
              {currentPost.user?.displayName || currentPost.user?.username || '不明なユーザー'}
            </Link>
            <p className="text-gray-500">@{currentPost.user?.username || 'unknown'}</p>
          </div>
        </div>

        {/* 本文 */}
        <p className="text-lg text-gray-900 whitespace-pre-wrap mb-4">
          {currentPost.content}
        </p>

        {/* 画像 */}
        {currentPost.imageUrl && (
          <img
            src={currentPost.imageUrl}
            alt="投稿画像"
            className="rounded-xl max-h-[500px] object-cover w-full mb-4"
          />
        )}

        {/* 日時 */}
        <p className="text-gray-500 text-sm mb-4">
          {formatFullDateTime(currentPost.createdAt)}
        </p>

        {/* 統計 */}
        <div className="flex items-center space-x-4 py-4 border-t border-b border-gray-200">
          <span>
            <strong>{currentPost.likesCount || 0}</strong>
            <span className="text-gray-500 ml-1">いいね</span>
          </span>
          <span>
            <strong>{currentPost.commentsCount || 0}</strong>
            <span className="text-gray-500 ml-1">返信</span>
          </span>
          <span>
            <strong>{currentPost.bookmarksCount || 0}</strong>
            <span className="text-gray-500 ml-1">ブックマーク</span>
          </span>
        </div>

        {/* アクションボタン */}
        <div className="flex justify-around py-2 border-b border-gray-200">
          <button className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </button>
          <button
            onClick={handleLike}
            className={`p-3 rounded-full ${
              currentPost.isLiked
                ? 'text-red-500 hover:bg-red-50'
                : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
            }`}
          >
            <svg
              className="w-6 h-6"
              fill={currentPost.isLiked ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
          <button
            onClick={handleBookmark}
            className={`p-3 rounded-full ${
              currentPost.isBookmarked
                ? 'text-blue-500 hover:bg-blue-50'
                : 'text-gray-500 hover:text-blue-500 hover:bg-blue-50'
            }`}
          >
            <svg
              className="w-6 h-6"
              fill={currentPost.isBookmarked ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </button>
          <button className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
          </button>
        </div>

        {/* 返信フォーム */}
        <div className="mt-4">
          <div className="flex items-start space-x-3">
            <Avatar
              src={currentUser?.profileImageUrl}
              name={currentUser?.displayName || currentUser?.username}
              size="md"
            />
            <div className="flex-1">
              <textarea
                placeholder="返信を投稿"
                className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
              <div className="flex justify-end mt-2">
                <Button size="sm">返信</Button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default PostDetailPage;
