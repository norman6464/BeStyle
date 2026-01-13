/**
 * ローディングコンポーネント
 */

import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  message?: string;
  variant?: 'spinner' | 'dots' | 'pulse';
}

const sizeClasses = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  fullScreen = false,
  message,
  variant = 'spinner',
}) => {
  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex items-center justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'} rounded-full bg-gradient-to-r from-brand-500 to-accent-500 animate-bounce`}
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        );
      case 'pulse':
        return (
          <div className="relative">
            <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-brand-500 to-accent-500 animate-pulse`} />
            <div className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-gradient-to-r from-brand-500 to-accent-500 animate-ping opacity-75`} />
          </div>
        );
      default:
        return (
          <div className="relative">
            <svg
              className={`animate-spin ${sizeClasses[size]}`}
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-20"
                cx="12"
                cy="12"
                r="10"
                stroke="url(#gradient)"
                strokeWidth="4"
              />
              <path
                className="opacity-90"
                fill="url(#gradient)"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#d946ef" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        );
    }
  };

  const content = (
    <div className="flex flex-col items-center justify-center">
      {renderLoader()}
      {message && (
        <p className="mt-4 text-sm font-medium text-gray-600 animate-pulse">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/60 z-50">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-gray-100 animate-scale-in">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

/**
 * スケルトンローダー
 */
interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular';
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  variant = 'text',
  className = '',
}) => {
  const baseClasses = 'relative overflow-hidden bg-gray-200 after:absolute after:inset-0 after:-translate-x-full after:animate-shimmer after:bg-gradient-to-r after:from-transparent after:via-white/60 after:to-transparent';

  const variantClasses = {
    text: 'rounded-lg h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
};

/**
 * 投稿カードのスケルトン
 */
export const PostCardSkeleton: React.FC = () => {
  return (
    <div className="p-4 bg-white border-b border-gray-100 animate-pulse">
      <div className="flex space-x-3">
        <Skeleton variant="circular" width={44} height={44} />
        <div className="flex-1 space-y-3">
          <div className="flex items-center space-x-2">
            <Skeleton width="35%" height={16} />
            <Skeleton width="25%" height={14} />
          </div>
          <div className="space-y-2">
            <Skeleton width="100%" height={16} />
            <Skeleton width="85%" height={16} />
          </div>
          <div className="flex space-x-6 pt-2">
            <Skeleton width={50} height={20} variant="rectangular" />
            <Skeleton width={50} height={20} variant="rectangular" />
            <Skeleton width={50} height={20} variant="rectangular" />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * ユーザーカードのスケルトン
 */
export const UserCardSkeleton: React.FC = () => {
  return (
    <div className="flex items-center space-x-4 p-4 bg-white">
      <Skeleton variant="circular" width={52} height={52} />
      <div className="flex-1 space-y-2">
        <Skeleton width="45%" height={18} />
        <Skeleton width="35%" height={14} />
      </div>
      <Skeleton width={90} height={36} variant="rectangular" />
    </div>
  );
};

export default Loading;
