/**
 * 投稿カードコンポーネント（Twitter/X スタイル）
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
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);

  const handleLikeToggle = () => {
    if (!post.isLiked) {
      setIsLikeAnimating(true);
      setTimeout(() => setIsLikeAnimating(false), 300);
    }
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

  const handleCardClick = (e: React.MouseEvent) => {
    // リンクやボタン以外をクリックした場合に詳細ページへ
    if ((e.target as HTMLElement).closest('a, button')) return;
    navigate(ROUTES.POST.DETAIL(post.id));
  };

  // ユーザー情報がない場合のフォールバック
  const username = post.user?.username || 'unknown';
  const displayName = post.user?.displayName || post.user?.username || '不明なユーザー';
  const profileImageUrl = post.user?.profileImageUrl;

  return (
    <article 
      onClick={handleCardClick}
      className="px-4 py-3 bg-white border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer"
    >
      <div className="flex space-x-3">
        {/* アバター */}
        <Link 
          to={ROUTES.PROFILE.VIEW(username)}
          onClick={(e) => e.stopPropagation()}
          className="flex-shrink-0"
        >
          <Avatar
            src={profileImageUrl}
            name={displayName}
            size="md"
            className="hover:opacity-90 transition-opacity"
          />
        </Link>

        {/* コンテンツ */}
        <div className="flex-1 min-w-0">
          {/* ヘッダー */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 min-w-0 text-[15px]">
              <Link
                to={ROUTES.PROFILE.VIEW(username)}
                onClick={(e) => e.stopPropagation()}
                className="font-bold text-gray-900 truncate hover:underline"
              >
                {displayName}
              </Link>
              <span className="text-gray-500 truncate">@{username}</span>
              <span className="text-gray-400 flex-shrink-0">·</span>
              <time className="text-gray-500 flex-shrink-0 hover:underline">
                {formatSmartDate(post.createdAt)}
              </time>
            </div>

            {/* メニュー */}
            <div className="relative ml-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-2 -mr-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                    }}
                  />
                  <div className="absolute right-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-20 overflow-hidden">
                    {isOwner ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete();
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-gray-50 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span className="font-bold">削除する</span>
                      </button>
                    ) : (
                      <>
                        <button 
                          onClick={(e) => e.stopPropagation()}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                          <span>@{username}さんをミュート</span>
                        </button>
                        <button 
                          onClick={(e) => e.stopPropagation()}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <span>ポストを報告</span>
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 本文 */}
          <div className="mt-1">
            <p className="text-[15px] text-gray-900 whitespace-pre-wrap break-words leading-relaxed">
              {post.content}
            </p>
          </div>

          {/* 画像 */}
          {post.imageUrl && (
            <div className="mt-3">
              <img
                src={post.imageUrl}
                alt="投稿画像"
                className="rounded-2xl max-h-[512px] object-cover w-full border border-gray-100"
              />
            </div>
          )}

          {/* アクションボタン */}
          <div className="flex items-center justify-between mt-3 -ml-2 max-w-md">
            {/* リプライ */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(ROUTES.POST.DETAIL(post.id));
              }}
              className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 group"
            >
              <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="text-sm min-w-[1ch]">{post.commentsCount || ''}</span>
            </button>

            {/* リポスト */}
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center space-x-1 text-gray-500 hover:text-green-500 group"
            >
              <div className="p-2 rounded-full group-hover:bg-green-50 transition-colors">
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <span className="text-sm min-w-[1ch]">{post.repostsCount || ''}</span>
            </button>

            {/* いいね */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLikeToggle();
              }}
              className={`flex items-center space-x-1 group transition-colors ${
                post.isLiked ? 'text-pink-600' : 'text-gray-500 hover:text-pink-600'
              }`}
            >
              <div className={`p-2 rounded-full group-hover:bg-pink-50 transition-all ${
                isLikeAnimating ? 'scale-125' : ''
              }`}>
                <svg
                  className="w-[18px] h-[18px]"
                  fill={post.isLiked ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className={`text-sm min-w-[1ch] ${post.isLiked ? 'text-pink-600' : ''}`}>
                {post.likesCount || ''}
              </span>
            </button>

            {/* ブックマーク & シェア */}
            <div className="flex items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleBookmarkToggle();
                }}
                className={`p-2 rounded-full transition-colors ${
                  post.isBookmarked 
                    ? 'text-blue-500 hover:bg-blue-50' 
                    : 'text-gray-500 hover:text-blue-500 hover:bg-blue-50'
                }`}
              >
                <svg
                  className="w-[18px] h-[18px]"
                  fill={post.isBookmarked ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
              
              <button
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-full text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-colors"
              >
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
