import React from "react";
import ReactDOM from "react-dom/client"; // 引入 React 18 的 createRoot 方法
import App from "./App"; // 主应用组件
import "./assets/styles/common.css"; // 全局样式

// 获取根元素
const rootElement = document.getElementById("root");

// 使用 createRoot 渲染应用
const root = ReactDOM.createRoot(rootElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
