import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>HRMS System</h4>
          <p>现代化的人力资源管理系统</p>
        </div>
        <div className="footer-section">
          <h4>快速链接</h4>
          <p>
            <a href="/dashboard">仪表盘</a> | 
            <a href="/attendance">考勤管理</a>
          </p>
        </div>
        <div className="footer-section">
          <h4>联系我们</h4>
          <p>
            <a href="/contact">联系支持</a> | 
            <a href="/help">帮助文档</a>
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} HRMS System | All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
