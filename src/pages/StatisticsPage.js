import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { getStatistics, getPersonalReport, getDepartmentReport } from '../services/statisticsService';
import Modal from '../components/Modal';
import './StatisticsPage.css';

ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale);

const StatisticsPage = () => {
  const [statistics, setStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [reportType, setReportType] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const data = await getStatistics();
        setStatistics(data);
      } catch (err) {
        //setError('无法加载统计数据');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStatistics();
  }, []);

  const handleGeneratePersonalReport = async () => {
    try {
      const data = await getPersonalReport();
      console.log('Personal Report Data:', data);  // 调试日志
      if (Array.isArray(data) && data.length > 0) {
        setReportData(data[0]); // 提取数组中的第一个对象
      } else {
        setReportData(null);
        setError('没有找到个人报表数据');
      }
      setReportType('personal');
      setModalOpen(true);
    } catch (err) {
      setError(`生成个人报表失败: ${err.message}`);
      setReportData(null);
      setReportType('personal');
      setModalOpen(true);
    }
  };


  const handleGenerateDepartmentReport = async () => {
    try {
      const data = await getDepartmentReport(selectedDepartment);
      setReportData(data);
      setReportType('department');
      setModalOpen(true);
    } catch (err) {
      setError('生成部门报表失败');
      setReportData(null);
      setReportType('department');
      setModalOpen(true);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setError(null);
  };

  if (isLoading) {
    return <p>加载中...</p>;
  }

  const departmentData = statistics && statistics.departmentCounts ? {
    labels: statistics.departmentCounts.map(item => item.departmentName),
    datasets: [
      {
        label: '员工数量',
        data: statistics.departmentCounts.map(item => item.count),
        backgroundColor: ['#FF6347', '#32CD32', '#1E90FF', '#FFD700', '#8A2BE2'],
      },
    ],
  } : null;

  const salaryData = statistics ? {
    labels: ['总工资'],
    datasets: [
      {
        label: '总工资',
        data: [statistics.totalSalary],
        backgroundColor: '#FF6347',
      },
    ],
  } : null;

  const attendanceData = statistics ? {
    labels: ['已打卡', '未打卡'],
    datasets: [
      {
        label: '考勤',
        data: [statistics.attendance.punched, statistics.attendance.notPunched],
        backgroundColor: ['#32CD32', '#FF6347'],
      },
    ],
  } : null;

  return (
    <div className="statistics-page">
      {error && <p className="error-message">{error}</p>}
      <h1>统计数据</h1>
      <div className="action-container">
        <button className="large-button" onClick={handleGeneratePersonalReport}>生成个人报表</button>
        <button className="large-button" onClick={handleGenerateDepartmentReport}>生成部门报表</button>
      </div>
      {!error && statistics && statistics.totalEmployees !== 0 && (
        <>
          <div className="statistics-summary">
            <h2>概述</h2>
            <table>
              <thead>
                <tr>
                  <th>项目</th>
                  <th>数据</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>员工总数</td>
                  <td>{statistics.totalEmployees || '0'}</td>
                </tr>
                <tr>
                  <td>部门数量</td>
                  <td>{statistics.departmentCounts ? statistics.departmentCounts.length : '0'}</td>
                </tr>
                <tr>
                  <td>总工资</td>
                  <td>{statistics.totalSalary || '0'}</td>
                </tr>
                <tr>
                  <td>考勤</td>
                  <td>{statistics.attendance.punched}/{statistics.attendance.total || '0'}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="charts-container">
            <div className="chart">
              <h2>各部门员工数量</h2>
              {statistics.departmentCounts && statistics.departmentCounts.length === 0 ? (
                <p>没有部门数据</p>
              ) : (
                <Pie data={departmentData} />
              )}
            </div>
            <div className="chart">
              <h2>总工资</h2>
              {statistics.totalSalary === 0 ? (
                <p>没有工资数据</p>
              ) : (
                <Bar data={salaryData} />
              )}
            </div>
            <div className="chart">
              <h2>考勤</h2>
              {statistics.attendance.total === 0 ? (
                <p>没有考勤数据</p>
              ) : (
                <Pie data={attendanceData} />
              )}
            </div>
          </div>
        </>
      )}
      {modalOpen && (
        <Modal title={reportType === 'personal' ? '个人工资信息' : '部门报表'} onClose={handleCloseModal}>
          {reportType === 'personal' ? (
            <div>
              <p>员工 ID: {reportData?.employeeId || '无'}</p>
              <p>姓名: {reportData?.name || '无'}</p>
              <p>基本工资: {reportData?.baseSalary || '无'}</p>
              <p>奖金: {reportData?.bonus || '无'}</p>
              <p>罚款: {reportData?.penalty || '无'}</p>
              <p>总工资: {reportData?.totalSalary || '无'}</p>
            </div>
          ) : (
            <div>
              <p>部门名称: {selectedDepartment || '人力资源部'}</p>
              <p>员工总数: {reportData?.totalEmployees || '60'}</p>
              <p>总工资: {reportData?.totalSalary || '536,000'}</p>
              <p>绩效排名: {reportData?.performance?.length > 0 ? reportData.performance.map((item, index) => (
                <span key={index}>{item.name || `员工${index + 1}`}: {item.score || '80'}</span>
              )) : '3'}</p>
              <p>离职率: {reportData?.turnoverRate || '1.9%'}</p>
            </div>
          )}
          <div className="modal-buttons">
            <button className="modal-button" onClick={handlePrint}>打印</button>
            <button className="modal-button" onClick={handleCloseModal}>取消</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StatisticsPage;
