// src/components/Form/PerformanceForm.js

import React, { useState } from 'react';
import { PrimaryButton } from '../Layout/Buttons';

const PerformanceForm = ({ performance, onSave }) => {
    const [formData, setFormData] = useState({
        employeeName: performance?.employeeName || '',
        rating: performance?.rating || '',
        evaluationDate: performance?.evaluationDate || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">员工姓名</label>
                <input
                    type="text"
                    name="employeeName"
                    value={formData.employeeName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">绩效评分</label>
                <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">评估日期</label>
                <input
                    type="date"
                    name="evaluationDate"
                    value={formData.evaluationDate}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
            </div>
            <div className="flex justify-end">
                <PrimaryButton type="submit">
                    保存
                </PrimaryButton>
            </div>
        </form>
    );
};

export default PerformanceForm;
