/**
 * デバウンス用のカスタムフック
 */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';

/**
 * 値のデバウンス
 * @param value デバウンスする値
 * @param delay 遅延時間（ミリ秒）
 */
export const useDebounce = <T>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * 関数のデバウンス
 * @param callback デバウンスする関数
 * @param delay 遅延時間（ミリ秒）
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
): ((...args: Parameters<T>) => void) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

/**
 * 検索用のデバウンスフック
 * @param searchTerm 検索文字列
 * @param delay 遅延時間（ミリ秒）
 */
export const useDebouncedSearch = (searchTerm: string, delay: number = 300) => {
  const debouncedTerm = useDebounce(searchTerm, delay);
  const isSearching = useMemo(() => searchTerm !== debouncedTerm, [searchTerm, debouncedTerm]);

  return {
    debouncedTerm,
    isSearching,
  };
};

/**
 * スロットル用のカスタムフック
 * @param callback スロットルする関数
 * @param delay 遅延時間（ミリ秒）
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useThrottledCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
): ((...args: Parameters<T>) => void) => {
  const lastExecutedRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastExecution = now - lastExecutedRef.current;

      if (timeSinceLastExecution >= delay) {
        lastExecutedRef.current = now;
        callback(...args);
      } else {
        // 遅延時間経過後に最後の呼び出しを実行
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(
          () => {
            lastExecutedRef.current = Date.now();
            callback(...args);
          },
          delay - timeSinceLastExecution
        );
      }
    },
    [callback, delay]
  );

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return throttledCallback;
};
