import React, { useState, useEffect } from 'react';
import { PrimaryButton, SecondaryButton } from '../Layout/Buttons';

const SalaryForm = ({ salary, onSave, onCancel }) => {
  const [employeeName, setEmployeeName] = useState('');
  const [baseSalary, setBaseSalary] = useState('');
  const [bonus, setBonus] = useState('');
  const [payDate, setPayDate] = useState('');

  useEffect(() => {
    if (salary) {
      setEmployeeName(salary.employeeName || '');
      setBaseSalary(salary.baseSalary || '');
      setBonus(salary.bonus || '');
      setPayDate(salary.payDate || '');
    }
  }, [salary]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: salary ? salary.id : null,
      employeeName,
      baseSalary: parseFloat(baseSalary),
      bonus: parseFloat(bonus),
      payDate,
      totalSalary: parseFloat(baseSalary) + parseFloat(bonus),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">员工姓名</label>
        <input
          type="text"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-600"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">基础薪资</label>
        <input
          type="number"
          value={baseSalary}
          onChange={(e) => setBaseSalary(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-600"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">奖金</label>
        <input
          type="number"
          value={bonus}
          onChange={(e) => setBonus(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-600"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">发薪日期</label>
        <input
          type="date"
          value={payDate}
          onChange={(e) => setPayDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-600"
          required
        />
      </div>
      <div className="flex gap-2 justify-end pt-4 border-t">
        <PrimaryButton type="submit">保存</PrimaryButton>
        {onCancel && <SecondaryButton type="button" onClick={onCancel}>取消</SecondaryButton>}
      </div>
    </form>
  );
};

export default SalaryForm;
