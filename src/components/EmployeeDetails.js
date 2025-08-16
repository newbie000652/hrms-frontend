// src/components/EmployeeDetails.js
import React from 'react';

const EmployeeDetails = ({ employee, onClose }) => {
    if (!employee) {
        return <p>加载中...</p>;
    }

    return (
        <div className="employee-details">
            <h3>基本信息</h3>
            <p>编号: {employee.id}</p>
            <p>姓名: {employee.name}</p>
            <p>性别: {employee.gender || '未提供'}</p>
            <p>邮箱: {employee.email || '未提供'}</p>
            <p>电话: {employee.phone || '未提供'}</p>
            <p>入职日期: {new Date(employee.entryDate).toLocaleDateString()}</p>
            <p>状态: {employee.isActive ? '在职' : '离职'}</p>

            <h3>部门信息</h3>
            <p>部门编号: {employee.departmentId || '未分配'}</p>
            <p>部门名称: {employee.departmentName || '未提供'}</p>

            <h3>级别信息</h3>
            <p>级别编号: {employee.levelId || '未分配'}</p>
            <p>级别名称: {employee.levelName || '未提供'}</p>
            <p>基础薪资: {employee.baseSalary ? `¥${employee.baseSalary}` : '未提供'}</p>

            <h3>技能信息</h3>
            {employee.skillNames && employee.skillNames.length > 0 ? (
                <ul>
                    {employee.skillNames.map((skill, index) => (
                        <li key={index}>{skill}</li>
                    ))}
                </ul>
            ) : (
                <p>暂无技能信息</p>
            )}

            <button onClick={onClose}>返回</button>
        </div>
    );
};

export default EmployeeDetails;