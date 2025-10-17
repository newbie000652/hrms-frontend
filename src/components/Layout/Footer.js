import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* HRMS System 信息 */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">人事管理系统</h4>
            <p className="text-xs text-gray-600 leading-relaxed">现代化的人力资源管理解决方案</p>
          </div>

          {/* 快速链接 */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">快速链接</h4>
            <div className="space-y-2">
              <a href="/dashboard" className="block text-xs text-gray-600 hover:text-blue-600 transition-colors">仪表盘</a>
              <a href="/attendance" className="block text-xs text-gray-600 hover:text-blue-600 transition-colors">考勤管理</a>
            </div>
          </div>

          {/* 联系我们 */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">联系我们</h4>
            <div className="space-y-2">
              <a href="/contact" className="block text-xs text-gray-600 hover:text-blue-600 transition-colors">联系支持</a>
              <a href="/help" className="block text-xs text-gray-600 hover:text-blue-600 transition-colors">帮助文档</a>
            </div>
          </div>
        </div>

        {/* 底部版权 */}
        <div className="pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            &copy; {new Date().getFullYear()} HRMS System | All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
