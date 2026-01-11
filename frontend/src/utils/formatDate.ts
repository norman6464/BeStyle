/**
 * 日付フォーマットユーティリティ
 */

import { format, formatDistanceToNow, isToday, isYesterday, isThisYear, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';

/**
 * 日付文字列をDateオブジェクトに変換
 */
export const parseDate = (dateString: string | Date): Date => {
  if (dateString instanceof Date) {
    return dateString;
  }
  return parseISO(dateString);
};

/**
 * 相対時間を表示（例: "3分前", "2時間前"）
 */
export const formatRelativeTime = (dateString: string | Date): string => {
  const date = parseDate(dateString);
  return formatDistanceToNow(date, { addSuffix: true, locale: ja });
};

/**
 * 投稿日時のフォーマット
 * - 今日: "14:30"
 * - 昨日: "昨日 14:30"
 * - 今年: "3月15日"
 * - それ以外: "2023年3月15日"
 */
export const formatPostDate = (dateString: string | Date): string => {
  const date = parseDate(dateString);

  if (isToday(date)) {
    return format(date, 'HH:mm');
  }

  if (isYesterday(date)) {
    return `昨日 ${format(date, 'HH:mm')}`;
  }

  if (isThisYear(date)) {
    return format(date, 'M月d日', { locale: ja });
  }

  return format(date, 'yyyy年M月d日', { locale: ja });
};

/**
 * 詳細な日時フォーマット（例: "2024年3月15日 14:30"）
 */
export const formatFullDateTime = (dateString: string | Date): string => {
  const date = parseDate(dateString);
  return format(date, 'yyyy年M月d日 HH:mm', { locale: ja });
};

/**
 * 日付のみフォーマット（例: "2024年3月15日"）
 */
export const formatDate = (dateString: string | Date): string => {
  const date = parseDate(dateString);
  return format(date, 'yyyy年M月d日', { locale: ja });
};

/**
 * 時刻のみフォーマット（例: "14:30"）
 */
export const formatTime = (dateString: string | Date): string => {
  const date = parseDate(dateString);
  return format(date, 'HH:mm');
};

/**
 * ISO 8601形式にフォーマット
 */
export const formatISO = (dateString: string | Date): string => {
  const date = parseDate(dateString);
  return date.toISOString();
};

/**
 * スマートな日時表示
 * - 1分以内: "たった今"
 * - 1時間以内: "○分前"
 * - 24時間以内: "○時間前"
 * - 7日以内: "○日前"
 * - それ以外: 日付表示
 */
export const formatSmartDate = (dateString: string | Date): string => {
  const date = parseDate(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'たった今';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}分前`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}時間前`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}日前`;
  }

  return formatPostDate(date);
};
