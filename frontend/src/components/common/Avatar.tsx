/**
 * アバターコンポーネント
 */

import React from 'react';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-xl',
};

/**
 * 名前からイニシャルを取得
 */
const getInitials = (name?: string): string => {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

/**
 * 名前から背景色を生成
 */
const getColorFromName = (name?: string): string => {
  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-yellow-500',
    'bg-lime-500',
    'bg-green-500',
    'bg-emerald-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-sky-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-violet-500',
    'bg-purple-500',
    'bg-fuchsia-500',
    'bg-pink-500',
    'bg-rose-500',
  ];

  if (!name) return colors[0];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  className = '',
  onClick,
}) => {
  const [imageError, setImageError] = React.useState(false);

  const handleError = () => {
    setImageError(true);
  };

  const baseClasses = `
    rounded-full flex items-center justify-center
    overflow-hidden flex-shrink-0
    ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
    ${sizeClasses[size]}
    ${className}
  `;

  // 画像が利用可能な場合
  if (src && !imageError) {
    return (
      <div className={baseClasses} onClick={onClick}>
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={handleError}
        />
      </div>
    );
  }

  // 画像がない場合はイニシャル表示
  return (
    <div
      className={`${baseClasses} ${getColorFromName(name)} text-white font-semibold`}
      onClick={onClick}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
