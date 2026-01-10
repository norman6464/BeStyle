/**
 * APIクライアント
 * fetch APIをラップした共通HTTPクライアント
 */

import { API_CONFIG } from '../constants/config';
import type { ApiError, RequestConfig } from '../types/api';

class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  /**
   * リクエスト実行
   */
  private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { method = 'GET', headers = {}, body, params } = config;

    // URLパラメータの構築
    let url = `${this.baseUrl}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    // リクエスト設定
    const fetchConfig: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      credentials: 'include', // Cookieを送信
    };

    if (body && method !== 'GET') {
      fetchConfig.body = JSON.stringify(body);
    }

    // タイムアウト制御
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    fetchConfig.signal = controller.signal;

    try {
      console.log(`[API] ${method} ${url}`);
      const response = await fetch(url, fetchConfig);
      clearTimeout(timeoutId);

      // レスポンスのログ
      console.log(`[API] Response status: ${response.status}`);

      // エラーハンドリング
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error: ApiError = {
          status: response.status,
          message: errorData.error || errorData.message || `HTTP Error: ${response.status}`,
          error: errorData.error,
        };
        throw error;
      }

      // 204 No Contentの場合
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      // AbortError（タイムアウト）
      if (error instanceof Error && error.name === 'AbortError') {
        throw {
          status: 408,
          message: 'リクエストがタイムアウトしました',
        } as ApiError;
      }

      // ネットワークエラー
      if (error instanceof TypeError) {
        throw {
          status: 0,
          message: 'ネットワークエラーが発生しました',
        } as ApiError;
      }

      throw error;
    }
  }

  /**
   * GETリクエスト
   */
  async get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  /**
   * POSTリクエスト
   */
  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body });
  }

  /**
   * PUTリクエスト
   */
  async put<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body });
  }

  /**
   * PATCHリクエスト
   */
  async patch<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body });
  }

  /**
   * DELETEリクエスト
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// シングルトンインスタンス
export const apiClient = new ApiClient();
export default apiClient;
