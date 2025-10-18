import React from 'react';
import PageHeader from '../components/Layout/PageHeader';
import { PrimaryButton, SecondaryButton } from '../components/Layout/Buttons';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PageHeader title="无权限" />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-2xl font-bold mb-4">403</div>
        <h1 className="text-xl font-semibold text-gray-800 mb-2">抱歉，您没有权限访问此页面</h1>
        <p className="text-gray-500 mb-6">请检查您的账户角色或联系管理员获取访问权限。</p>

        <div className="flex items-center gap-3">
          <PrimaryButton onClick={() => navigate('/')}>返回首页</PrimaryButton>
          <SecondaryButton onClick={() => navigate(-1)}>返回上一页</SecondaryButton>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
