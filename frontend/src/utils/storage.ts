/**
 * ローカルストレージ関連のユーティリティ
 */

const PREFIX = 'bestyle_';

/**
 * ローカルストレージに値を保存
 */
export const setItem = <T>(key: string, value: T): void => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(`${PREFIX}${key}`, serializedValue);
  } catch (error) {
    console.error(`Failed to save to localStorage: ${key}`, error);
  }
};

/**
 * ローカルストレージから値を取得
 */
export const getItem = <T>(key: string, defaultValue: T | null = null): T | null => {
  try {
    const item = localStorage.getItem(`${PREFIX}${key}`);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Failed to read from localStorage: ${key}`, error);
    return defaultValue;
  }
};

/**
 * ローカルストレージから値を削除
 */
export const removeItem = (key: string): void => {
  try {
    localStorage.removeItem(`${PREFIX}${key}`);
  } catch (error) {
    console.error(`Failed to remove from localStorage: ${key}`, error);
  }
};

/**
 * プレフィックス付きの全てのアイテムを削除
 */
export const clearAll = (): void => {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.error('Failed to clear localStorage', error);
  }
};

// キー定数
export const STORAGE_KEYS = {
  THEME: 'theme',
  LANGUAGE: 'language',
  DRAFT_POST: 'draft_post',
  LAST_VISITED: 'last_visited',
  NOTIFICATION_SETTINGS: 'notification_settings',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
} as const;

/**
 * セッションストレージに値を保存
 */
export const setSessionItem = <T>(key: string, value: T): void => {
  try {
    const serializedValue = JSON.stringify(value);
    sessionStorage.setItem(`${PREFIX}${key}`, serializedValue);
  } catch (error) {
    console.error(`Failed to save to sessionStorage: ${key}`, error);
  }
};

/**
 * セッションストレージから値を取得
 */
export const getSessionItem = <T>(key: string, defaultValue: T | null = null): T | null => {
  try {
    const item = sessionStorage.getItem(`${PREFIX}${key}`);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Failed to read from sessionStorage: ${key}`, error);
    return defaultValue;
  }
};

/**
 * セッションストレージから値を削除
 */
export const removeSessionItem = (key: string): void => {
  try {
    sessionStorage.removeItem(`${PREFIX}${key}`);
  } catch (error) {
    console.error(`Failed to remove from sessionStorage: ${key}`, error);
  }
};

/**
 * ストレージイベントを監視
 */
export const onStorageChange = (
  key: string,
  callback: (newValue: unknown, oldValue: unknown) => void
): (() => void) => {
  const handler = (event: StorageEvent) => {
    if (event.key === `${PREFIX}${key}`) {
      const newValue = event.newValue ? JSON.parse(event.newValue) : null;
      const oldValue = event.oldValue ? JSON.parse(event.oldValue) : null;
      callback(newValue, oldValue);
    }
  };

  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
};
