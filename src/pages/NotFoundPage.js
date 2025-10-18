import React from 'react';
import PageHeader from '../components/Layout/PageHeader';
import { PrimaryButton, SecondaryButton } from '../components/Layout/Buttons';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <PageHeader title="页面不存在" />
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center text-2xl font-bold mb-4">404</div>
        <h1 className="text-xl font-semibold text-gray-800 mb-2">抱歉，页面丢失了</h1>
        <p className="text-gray-500 mb-6">您访问的页面不存在或已被移动。</p>
        <div className="flex items-center gap-3">
          <PrimaryButton onClick={() => navigate('/')}>返回首页</PrimaryButton>
          <SecondaryButton onClick={() => navigate(-1)}>返回上一页</SecondaryButton>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
