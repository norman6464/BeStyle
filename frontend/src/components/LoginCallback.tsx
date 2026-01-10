import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { exchangeAuthCode } from '../api/authApi';

/**
 * ログインコールバックコンポーネント
 * Cognitoからのリダイレクト後に認証コードを処理
 * 
 * ルーティングで /login/callback に設定してください
 * 例: <Route path="/login/callback" element={<LoginCallback />} />
 */
const LoginCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError(`認証エラー: ${errorParam}`);
      setLoading(false);
      return;
    }

    if (!code) {
      setError('認証コードが見つかりません');
      setLoading(false);
      return;
    }

    // 認証コードをBFFに送信
    const handleCallback = async () => {
      try {
        const response = await exchangeAuthCode(code, state || '');
        
        if (response.success) {
          // ログイン成功 - ホームページにリダイレクト
          navigate('/', { replace: true });
        } else {
          setError(response.message || '認証に失敗しました');
        }
      } catch (err) {
        console.error('認証エラー:', err);
        setError('認証処理中にエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">認証処理中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            ログインページに戻る
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default LoginCallback;
