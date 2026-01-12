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
  showBorder?: boolean;
  status?: 'online' | 'offline' | 'away' | 'busy';
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-9 h-9 text-sm',
  md: 'w-11 h-11 text-base',
  lg: 'w-16 h-16 text-lg',
  xl: 'w-24 h-24 text-2xl',
};

const statusSizes = {
  xs: 'w-1.5 h-1.5 border',
  sm: 'w-2.5 h-2.5 border-2',
  md: 'w-3 h-3 border-2',
  lg: 'w-4 h-4 border-2',
  xl: 'w-5 h-5 border-2',
};

const statusColors = {
  online: 'bg-emerald-500',
  offline: 'bg-gray-400',
  away: 'bg-amber-500',
  busy: 'bg-red-500',
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
 * 名前から背景グラデーションを生成
 */
const getGradientFromName = (name?: string): string => {
  const gradients = [
    'from-rose-400 to-pink-500',
    'from-orange-400 to-amber-500',
    'from-amber-400 to-yellow-500',
    'from-lime-400 to-green-500',
    'from-emerald-400 to-teal-500',
    'from-teal-400 to-cyan-500',
    'from-cyan-400 to-sky-500',
    'from-sky-400 to-blue-500',
    'from-blue-400 to-indigo-500',
    'from-indigo-400 to-violet-500',
    'from-violet-400 to-purple-500',
    'from-purple-400 to-fuchsia-500',
    'from-fuchsia-400 to-pink-500',
    'from-brand-400 to-accent-500',
  ];

  if (!name) return gradients[0];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return gradients[hash % gradients.length];
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  className = '',
  onClick,
  showBorder = false,
  status,
}) => {
  const [imageError, setImageError] = React.useState(false);

  const handleError = () => {
    setImageError(true);
  };

  const baseClasses = `
    rounded-full flex items-center justify-center
    overflow-hidden flex-shrink-0 relative
    transition-all duration-200
    ${onClick ? 'cursor-pointer hover:opacity-90 active:scale-95' : ''}
    ${showBorder ? 'ring-2 ring-white shadow-md' : ''}
    ${sizeClasses[size]}
    ${className}
  `;

  const renderStatus = () => {
    if (!status) return null;
    return (
      <span
        className={`
          absolute bottom-0 right-0 rounded-full border-white
          ${statusSizes[size]}
          ${statusColors[status]}
        `}
      />
    );
  };

  // 画像が利用可能な場合
  if (src && !imageError) {
    return (
      <div className={baseClasses} onClick={onClick}>
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-200 hover:scale-110"
          onError={handleError}
        />
        {renderStatus()}
      </div>
    );
  }

  // 画像がない場合はイニシャル表示
  return (
    <div
      className={`${baseClasses} bg-gradient-to-br ${getGradientFromName(name)} text-white font-semibold shadow-inner`}
      onClick={onClick}
    >
      <span className="drop-shadow-sm">{getInitials(name)}</span>
      {renderStatus()}
    </div>
  );
};

export default Avatar;
