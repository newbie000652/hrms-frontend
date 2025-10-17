// src/components/Form/PerformanceForm.js

import React, { useState } from 'react';

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
        <form onSubmit={handleSubmit}>
            <div>
                <label>员工姓名</label>
                <input
                    type="text"
                    name="employeeName"
                    value={formData.employeeName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>绩效评分</label>
                <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>评估日期</label>
                <input
                    type="date"
                    name="evaluationDate"
                    value={formData.evaluationDate}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">保存</button>
        </form>
    );
};

export default PerformanceForm;
