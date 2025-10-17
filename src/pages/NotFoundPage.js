import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div style={{ padding: '3rem', textAlign: 'center' }}>
      <h1>页面不存在 (404)</h1>
      <p>您访问的页面不存在或已被移动。</p>
      <p>
        <Link to="/">返回登录</Link>
      </p>
    </div>
  );
};

export default NotFoundPage;
