/**
 * 404 Not Found ページ
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common';
import { ROUTES } from '../constants/routes';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-200">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mt-4">
          ページが見つかりません
        </h2>
        <p className="text-gray-500 mt-2 mb-8">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <div className="flex justify-center space-x-4">
          <Button onClick={() => window.history.back()} variant="outline">
            戻る
          </Button>
          <Link to={ROUTES.HOME}>
            <Button>ホームへ</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
