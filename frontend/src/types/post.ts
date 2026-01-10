/**
 * 投稿関連の型定義
 */

export type PostVisibility = 'PUBLIC' | 'FOLLOWERS_ONLY' | 'PRIVATE';
export type PostType = 'ORIGINAL' | 'REPLY' | 'REPOST' | 'QUOTE';

export interface Post {
  id: number;
  userId: number;
  content: string;
  visibility: PostVisibility;
  postType: PostType;
  replyToId?: number;
  repostOfId?: number;
  quoteOfId?: number;
  likesCount: number;
  repliesCount: number;
  repostsCount: number;
  bookmarksCount: number;
  commentsCount?: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt?: string;
  // 拡張情報
  user?: {
    id: number;
    username: string;
    displayName: string;
    profileImageUrl?: string;
  };
  isLiked?: boolean;
  isBookmarked?: boolean;
  isReposted?: boolean;
  // 関連投稿
  replyTo?: Post;
  repostOf?: Post;
  quoteOf?: Post;
}

export interface CreatePostRequest {
  content: string;
  visibility?: PostVisibility;
  replyToId?: number;
  repostOfId?: number;
  quoteOfId?: number;
}

export interface UpdatePostRequest {
  content?: string;
  visibility?: PostVisibility;
}

export interface PostState {
  posts: Post[];
  currentPost: Post | null;
  userPosts: Post[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
}

export interface TimelineState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
}
