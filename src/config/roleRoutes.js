// src/config/roleRoutes.js
const roleRoutes = {
    管理员: ['/dashboard', '/employees', '/statistics', '/resignation', '/attendance', '/salary', '/accounts', '/logs', '/performance'],
    领导: ['/dashboard', '/employees', '/statistics', '/resignation'],
    员工: ['/dashboard', '/attendance', '/statistics'],
};

export default roleRoutes;