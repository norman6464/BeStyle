/**
 * ローディングコンポーネント
 */

import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  message?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  fullScreen = false,
  message,
}) => {
  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <svg
        className={`animate-spin text-blue-600 ${sizeClasses[size]}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {message && <p className="mt-2 text-sm text-gray-500">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
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
  const baseClasses = 'animate-pulse bg-gray-200';

  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded',
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
    <div className="p-4 bg-white border-b border-gray-200">
      <div className="flex space-x-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <div className="flex items-center space-x-2">
            <Skeleton width="30%" height={16} />
            <Skeleton width="20%" height={14} />
          </div>
          <Skeleton width="100%" height={16} />
          <Skeleton width="80%" height={16} />
          <div className="flex space-x-4 pt-2">
            <Skeleton width={60} height={20} />
            <Skeleton width={60} height={20} />
            <Skeleton width={60} height={20} />
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
    <div className="flex items-center space-x-3 p-4 bg-white">
      <Skeleton variant="circular" width={48} height={48} />
      <div className="flex-1 space-y-2">
        <Skeleton width="40%" height={16} />
        <Skeleton width="30%" height={14} />
      </div>
      <Skeleton width={80} height={32} variant="rectangular" />
    </div>
  );
};

export default Loading;
