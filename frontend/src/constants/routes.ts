/**
 * ルート定義
 */

export const ROUTES = {
  // ホーム
  HOME: '/',

  // 認証
  AUTH: {
    LOGIN: '/login',
    SIGNUP: '/signup',
    CONFIRM_SIGNUP: '/confirm-signup',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    LOGIN_CALLBACK: '/login/callback',
  },

  // 便利なショートカット
  LOGIN: '/login',
  SIGNUP: '/signup',
  LOGIN_CALLBACK: '/login/callback',
  CONFIRM_SIGNUP: '/confirm-signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // メイン機能
  TIMELINE: '/timeline',
  EXPLORE: '/explore',
  NOTIFICATIONS: '/notifications',
  MESSAGES: '/messages',
  BOOKMARKS: '/bookmarks',

  // プロフィール
  PROFILE: {
    VIEW: (username: string) => `/profile/${username}`,
    FOLLOWERS: (username: string) => `/profile/${username}/followers`,
    FOLLOWING: (username: string) => `/profile/${username}/following`,
  },

  // 設定
  SETTINGS: {
    INDEX: '/settings',
    PROFILE: '/settings/profile',
    ACCOUNT: '/settings/account',
    PRIVACY: '/settings/privacy',
    NOTIFICATIONS: '/settings/notifications',
  },

  // 投稿
  POST: {
    DETAIL: (postId: number | string) => `/post/${postId}`,
  },
  COMPOSE: '/compose',

  // その他
  SEARCH: '/search',
  NOT_FOUND: '*',
} as const;

// パラメータ付きルート生成ヘルパー（後方互換性のため維持）
export const buildRoute = {
  profile: (username: string) => `/profile/${username}`,
  profileFollowers: (username: string) => `/profile/${username}/followers`,
  profileFollowing: (username: string) => `/profile/${username}/following`,
  postDetail: (postId: number | string) => `/post/${postId}`,
};
