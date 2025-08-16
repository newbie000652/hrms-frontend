import React, { useState, useEffect } from 'react';

const SalaryForm = ({ salary, onSave }) => {
  const [employeeName, setEmployeeName] = useState('');
  const [baseSalary, setBaseSalary] = useState('');
  const [bonus, setBonus] = useState('');
  const [payDate, setPayDate] = useState('');

  useEffect(() => {
    if (salary) {
      setEmployeeName(salary.employeeName);
      setBaseSalary(salary.baseSalary);
      setBonus(salary.bonus);
      setPayDate(salary.payDate);
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
    <form onSubmit={handleSubmit}>
      <div>
        <label>员工姓名</label>
        <input
          type="text"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>基础薪资</label>
        <input
          type="number"
          value={baseSalary}
          onChange={(e) => setBaseSalary(e.target.value)}
          required
        />
      </div>
      <div>
        <label>奖金</label>
        <input
          type="number"
          value={bonus}
          onChange={(e) => setBonus(e.target.value)}
          required
        />
      </div>
      <div>
        <label>发薪日期</label>
        <input
          type="date"
          value={payDate}
          onChange={(e) => setPayDate(e.target.value)}
          required
        />
      </div>
      <button type="submit">{salary ? '保存' : '新增'}</button>
    </form>
  );
};

export default SalaryForm;
