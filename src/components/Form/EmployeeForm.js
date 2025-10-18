import React, { useState, useEffect } from 'react';
import useMetaOptions from '../../hooks/useMetaOptions';
import { PrimaryButton, SecondaryButton } from '../Layout/Buttons';

const EmployeeForm = ({ employee = {}, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        gender: '',
        email: '',
        phone: '',
        entry_date: '',
        level_id: '',
        department_id: '',
    });

    const { levels, departments } = useMetaOptions();

    useEffect(() => {
        if (employee) {
            setFormData({
                name: employee.name || '',
                gender: employee.gender || '',
                email: employee.email || '',
                phone: employee.phone || '',
                entry_date: employee.entry_date ? new Date(employee.entry_date).toISOString().substring(0, 16) : '',
                level_id: employee.level_id || '',
                department_id: employee.department_id || '',
            });
        }
    }, [employee]);

    // 元数据通过 hook 加载

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 映射前端字段到后端字段
        const updatedFormData = {
            name: formData.name,
            gender: formData.gender,
            email: formData.email,
            phone: formData.phone,
            entryDate: formData.entry_date,  // 保证匹配后端的字段
            levelId: formData.level_id,      // 保证匹配后端的字段
            departmentId: formData.department_id, // 保证匹配后端的字段
            isActive: 1, // 如果需要，手动设置其他字段，如默认在职
        };

        onSave(updatedFormData);
    };



    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">姓名</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">性别</label>
                    <input
                        type="text"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">邮箱</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">电话</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">入职时间</label>
                    <input
                        type="datetime-local"
                        name="entry_date"
                        value={formData.entry_date}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">员工级别</label>
                    <select
                        name="level_id"
                        value={formData.level_id}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                    >
                        <option value="">选择级别</option>
                        {levels.map(l => (
                            <option key={l.id} value={l.id}>{l.name || l.id}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">部门</label>
                    <select
                        name="department_id"
                        value={formData.department_id}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                    >
                        <option value="">选择部门</option>
                        {departments.map(d => (
                            <option key={d.id} value={d.id}>{d.name || d.id}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
                <SecondaryButton type="button" onClick={onCancel}>
                    取消
                </SecondaryButton>
                <PrimaryButton type="submit">
                    保存
                </PrimaryButton>
            </div>
        </form>
    );
};

export default EmployeeForm;
