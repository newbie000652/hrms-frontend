// src/components/EmployeeDetails.js
import React from 'react';
import { SecondaryButton } from './Layout/Buttons';

const EmployeeDetails = ({ employee, onClose }) => {
    if (!employee) {
        return <p className="text-gray-500">加载中...</p>;
    }

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <div className="flex gap-2 text-sm">
                    <div className="font-medium text-gray-600 w-24">编号：</div>
                    <div className="text-gray-900">{employee.id || '无'}</div>
                </div>
                <div className="flex gap-2 text-sm">
                    <div className="font-medium text-gray-600 w-24">姓名：</div>
                    <div className="text-gray-900">{employee.name || '无'}</div>
                </div>
                <div className="flex gap-2 text-sm">
                    <div className="font-medium text-gray-600 w-24">性别：</div>
                    <div className="text-gray-900">{employee.gender || '未提供'}</div>
                </div>
                <div className="flex gap-2 text-sm">
                    <div className="font-medium text-gray-600 w-24">邮箱：</div>
                    <div className="text-gray-900">{employee.email || '未提供'}</div>
                </div>
                <div className="flex gap-2 text-sm">
                    <div className="font-medium text-gray-600 w-24">电话：</div>
                    <div className="text-gray-900">{employee.phone || '未提供'}</div>
                </div>
                <div className="flex gap-2 text-sm">
                    <div className="font-medium text-gray-600 w-24">入职日期：</div>
                    <div className="text-gray-900">{employee.entryDate ? new Date(employee.entryDate).toLocaleDateString() : '未提供'}</div>
                </div>
                <div className="flex gap-2 text-sm">
                    <div className="font-medium text-gray-600 w-24">状态：</div>
                    <div className="text-gray-900">{employee.isActive ? '在职' : '离职'}</div>
                </div>
            </div>

            <div className="space-y-2 pt-2">
                <h3 className="font-semibold text-gray-700 text-base">部门信息</h3>
                <div className="flex gap-2 text-sm">
                    <div className="font-medium text-gray-600 w-24">部门编号：</div>
                    <div className="text-gray-900">{employee.departmentId || '未分配'}</div>
                </div>
                <div className="flex gap-2 text-sm">
                    <div className="font-medium text-gray-600 w-24">部门名称：</div>
                    <div className="text-gray-900">{employee.departmentName || '未提供'}</div>
                </div>
            </div>

            <div className="space-y-2 pt-2">
                <h3 className="font-semibold text-gray-700 text-base">级别信息</h3>
                <div className="flex gap-2 text-sm">
                    <div className="font-medium text-gray-600 w-24">级别编号：</div>
                    <div className="text-gray-900">{employee.levelId || '未分配'}</div>
                </div>
                <div className="flex gap-2 text-sm">
                    <div className="font-medium text-gray-600 w-24">级别名称：</div>
                    <div className="text-gray-900">{employee.levelName || '未提供'}</div>
                </div>
                <div className="flex gap-2 text-sm">
                    <div className="font-medium text-gray-600 w-24">基础薪资：</div>
                    <div className="text-gray-900">{employee.baseSalary ? `¥${employee.baseSalary}` : '未提供'}</div>
                </div>
            </div>

            <div className="space-y-2 pt-2">
                <h3 className="font-semibold text-gray-700 text-base">技能信息</h3>
                {employee.skillNames && employee.skillNames.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-gray-900">
                        {employee.skillNames.map((skill, index) => (
                            <li key={index}>{skill}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500">暂无技能信息</p>
                )}
            </div>

            <div className="flex justify-end pt-4 border-t">
                <SecondaryButton onClick={onClose}>返回</SecondaryButton>
            </div>
        </div>
    );
};

export default EmployeeDetails;
