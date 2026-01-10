/**
 * 投稿カードコンポーネント
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar } from '../../common';
import { ROUTES } from '../../../constants/routes';
import { formatSmartDate } from '../../../utils/formatDate';
import type { Post } from '../../../types/post';

interface PostCardProps {
  post: Post;
  onLike?: (postId: number) => void;
  onUnlike?: (postId: number) => void;
  onBookmark?: (postId: number) => void;
  onUnbookmark?: (postId: number) => void;
  onDelete?: (postId: number) => void;
  isOwner?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onUnlike,
  onBookmark,
  onUnbookmark,
  onDelete,
  isOwner = false,
}) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLikeToggle = () => {
    if (post.isLiked) {
      onUnlike?.(post.id);
    } else {
      onLike?.(post.id);
    }
  };

  const handleBookmarkToggle = () => {
    if (post.isBookmarked) {
      onUnbookmark?.(post.id);
    } else {
      onBookmark?.(post.id);
    }
  };

  const handleDelete = () => {
    if (window.confirm('この投稿を削除しますか？')) {
      onDelete?.(post.id);
    }
    setShowMenu(false);
  };

  // ユーザー情報がない場合のフォールバック
  const username = post.user?.username || 'unknown';
  const displayName = post.user?.displayName || post.user?.username || '不明なユーザー';
  const profileImageUrl = post.user?.profileImageUrl;

  return (
    <article className="p-4 bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="flex space-x-3">
        {/* アバター */}
        <Link to={ROUTES.PROFILE.VIEW(username)}>
          <Avatar
            src={profileImageUrl}
            name={displayName}
            size="md"
          />
        </Link>

        {/* コンテンツ */}
        <div className="flex-1 min-w-0">
          {/* ヘッダー */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 min-w-0">
              <Link
                to={ROUTES.PROFILE.VIEW(username)}
                className="font-semibold text-gray-900 truncate hover:underline"
              >
                {displayName}
              </Link>
              <Link
                to={ROUTES.PROFILE.VIEW(username)}
                className="text-gray-500 truncate"
              >
                @{username}
              </Link>
              <span className="text-gray-400">·</span>
              <span className="text-gray-500 text-sm whitespace-nowrap">
                {formatSmartDate(post.createdAt)}
              </span>
            </div>

            {/* メニュー */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    {isOwner ? (
                      <>
                        <button
                          onClick={handleDelete}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                        >
                          削除する
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                          報告する
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 本文 */}
          <Link to={ROUTES.POST.DETAIL(post.id)} className="block mt-2">
            <p className="text-gray-900 whitespace-pre-wrap break-words">{post.content}</p>
          </Link>

          {/* 画像 */}
          {post.imageUrl && (
            <Link to={ROUTES.POST.DETAIL(post.id)} className="block mt-3">
              <img
                src={post.imageUrl}
                alt="投稿画像"
                className="rounded-xl max-h-96 object-cover w-full"
              />
            </Link>
          )}

          {/* アクションボタン */}
          <div className="flex items-center justify-between mt-3 max-w-md">
            {/* コメント */}
            <button
              onClick={() => navigate(ROUTES.POST.DETAIL(post.id))}
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 group"
            >
              <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <span className="text-sm">{post.commentsCount || 0}</span>
            </button>

            {/* いいね */}
            <button
              onClick={handleLikeToggle}
              className={`flex items-center space-x-2 group ${
                post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <div className="p-2 rounded-full group-hover:bg-red-50 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill={post.isLiked ? 'currentColor' : 'none'}
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
              </div>
              <span className="text-sm">{post.likesCount || 0}</span>
            </button>

            {/* ブックマーク */}
            <button
              onClick={handleBookmarkToggle}
              className={`flex items-center space-x-2 group ${
                post.isBookmarked ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'
              }`}
            >
              <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill={post.isBookmarked ? 'currentColor' : 'none'}
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
              </div>
              <span className="text-sm">{post.bookmarksCount || 0}</span>
            </button>

            {/* シェア */}
            <button className="flex items-center text-gray-500 hover:text-blue-600 group">
              <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
