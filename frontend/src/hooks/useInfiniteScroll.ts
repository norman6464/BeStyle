/**
 * 無限スクロール用のカスタムフック
 */

import { useEffect, useRef, useCallback, useState } from 'react';

interface UseInfiniteScrollOptions {
  /** 次のページを読み込む関数 */
  onLoadMore: () => Promise<void>;
  /** まだデータがあるかどうか */
  hasMore: boolean;
  /** 読み込み中かどうか */
  loading: boolean;
  /** スクロール閾値（px）- 画面下端からこの距離になったら読み込み開始 */
  threshold?: number;
  /** ルート要素（デフォルトはビューポート） */
  root?: Element | null;
  /** ルートマージン */
  rootMargin?: string;
}

/**
 * 無限スクロールを実装するためのフック
 */
export const useInfiniteScroll = ({
  onLoadMore,
  hasMore,
  loading,
  threshold = 100,
  root = null,
  rootMargin = '0px',
}: UseInfiniteScrollOptions) => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  // IntersectionObserver のコールバック
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      setIsIntersecting(entry.isIntersecting);
    },
    []
  );

  // 交差状態が変化した時の処理
  useEffect(() => {
    if (isIntersecting && hasMore && !loading) {
      onLoadMore();
    }
  }, [isIntersecting, hasMore, loading, onLoadMore]);

  // IntersectionObserver のセットアップ
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(handleIntersection, {
      root,
      rootMargin: `${threshold}px`,
      threshold: 0,
    });

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [handleIntersection, root, rootMargin, threshold]);

  return {
    sentinelRef,
    isIntersecting,
  };
};

/**
 * スクロール位置に基づく無限スクロール（シンプル版）
 */
export const useScrollLoadMore = (
  onLoadMore: () => void,
  hasMore: boolean,
  loading: boolean,
  threshold: number = 100
) => {
  const handleScroll = useCallback(() => {
    if (loading || !hasMore) return;

    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;

    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      onLoadMore();
    }
  }, [loading, hasMore, threshold, onLoadMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);
};
