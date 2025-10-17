/* DashboardPage.js */
import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  const cards = [
    { 
      key: 'employees', 
      title: '员工管理', 
      desc: '管理员工信息和档案', 
      path: '/employees', 
      icon: (
        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
      iconColor: 'text-blue-600'
    },
    { 
      key: 'attendance', 
      title: '考勤管理', 
      desc: '查看和管理考勤记录', 
      path: '/attendance', 
      icon: (
        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      ),
      iconColor: 'text-green-600'
    },
    { 
      key: 'salary', 
      title: '工资管理', 
      desc: '查看和更新工资数据', 
      path: '/salary', 
      icon: (
        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
        </svg>
      ),
      iconColor: 'text-emerald-600'
    },
    { 
      key: 'resignation', 
      title: '离职管理', 
      desc: '查看和管理离职员工', 
      path: '/resignation', 
      icon: (
        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
        </svg>
      ),
      iconColor: 'text-orange-600'
    },
    { 
      key: 'accounts', 
      title: '账户管理', 
      desc: '设置用户角色和权限', 
      path: '/accounts', 
      icon: (
        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
      ),
      iconColor: 'text-red-600'
    },
    { 
      key: 'performance', 
      title: '绩效管理', 
      desc: '查看和管理员工绩效', 
      path: '/performance', 
      icon: (
        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
      ),
      iconColor: 'text-purple-600'
    },
    { 
      key: 'statistics', 
      title: '数据统计', 
      desc: '查看系统关键数据', 
      path: '/statistics', 
      icon: (
        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
        </svg>
      ),
      iconColor: 'text-indigo-600'
    },
    { 
      key: 'logs', 
      title: '日志管理', 
      desc: '查看系统运行日志', 
      path: '/logs', 
      icon: (
        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
        </svg>
      ),
      iconColor: 'text-gray-600'
    },
  ];

  return (
    <div className="min-h-full bg-gray-50 p-8">
      {/* 页头 */}
      <div className="mb-12">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          人事管理系统
        </h1>
        <p className="text-sm text-gray-600">从以下模块快速进入常用功能</p>
      </div>

      {/* 卡片网格 */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((item) => (
          <button
            key={item.key}
            onClick={() => handleNavigate(item.path)}
            className="group bg-white border border-gray-200 rounded p-6 text-left transition-all duration-150 hover:shadow-md hover:border-gray-300 hover:-translate-y-0.5"
          >
            {/* 图标区域 - 增加背景 */}
            <div className="mb-5">
              <div className={`inline-flex p-3 rounded ${item.iconColor} bg-opacity-10`}>
                <div className={item.iconColor}>
                  {item.icon}
                </div>
              </div>
            </div>

            {/* 标题 */}
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              {item.title}
            </h3>

            {/* 描述 */}
            <p className="text-sm text-gray-600 leading-relaxed">
              {item.desc}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}; 

export default DashboardPage;
