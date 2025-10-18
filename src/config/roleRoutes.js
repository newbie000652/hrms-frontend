// src/config/roleRoutes.js
const roleRoutes = {
    管理员: ['/dashboard', '/employees', '/statistics', '/resignation', '/attendance', '/salary', '/accounts', '/logs', '/performance'],
    领导: ['/dashboard', '/employees', '/statistics', '/resignation'],
    // 员工角色可访问统计页（包含所有部门报表）
    员工: ['/dashboard', '/attendance', '/statistics'],
};

export default roleRoutes;
