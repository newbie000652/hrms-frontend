/* DashboardPage.js */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';

const DashboardPage = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard-container">
      <h1>欢迎来到人事管理系统</h1>
      <div className="dashboard-cards">
        <div className="card" onClick={() => handleNavigate('/employees')}>
          <h2>员工管理</h2>
          <p>管理员工信息和档案</p>
        </div>
        <div className="card" onClick={() => handleNavigate('/attendance')}>
          <h2>考勤管理</h2>
          <p>查看和管理考勤记录</p>
        </div>
        <div className="card" onClick={() => handleNavigate('/salary')}>
          <h2>工资管理</h2>
          <p>查看和更新工资数据</p>
        </div>
        <div className="card" onClick={() => handleNavigate('/resignation')}>
          <h2>离职管理</h2>
          <p>查看和管理离职员工</p>
        </div>
        <div className="card" onClick={() => handleNavigate('/accounts')}>
          <h2>账户管理</h2>
          <p>设置用户角色和权限</p>
        </div>
        <div className="card" onClick={() => handleNavigate('/performance')}>
          <h2>绩效管理</h2>
          <p>查看和管理员工绩效</p>
        </div>
        <div className="card" onClick={() => handleNavigate('/statistics')}>
          <h2>数据统计</h2>
          <p>查看系统关键数据</p>
        </div>
        <div className="card" onClick={() => handleNavigate('/logs')}>
          <h2>日志管理</h2>
          <p>查看系统运行日志</p>
        </div>
      </div>
    </div>
  );
}; 

export default DashboardPage;