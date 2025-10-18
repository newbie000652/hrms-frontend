import React, { useEffect, useState } from 'react';
import useMetaOptions from '../hooks/useMetaOptions';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { getStatistics, getPersonalReport, getDepartmentReport } from '../services/statisticsService';
import PageHeader from '../components/Layout/PageHeader';
import { PrimaryButton, SecondaryButton } from '../components/Layout/Buttons';
import Alert from '../components/Layout/Alert';
import Modal from '../components/Modal';

ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale);

const StatisticsPage = () => {
  const [statistics, setStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [reportType, setReportType] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const { departments } = useMetaOptions();

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
      if (!selectedDepartment) {
        setError('请选择部门后再生成部门报表');
        setReportData(null);
        setReportType('department');
        setModalOpen(true);
        return;
      }
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
    return (
      <div className="text-center py-12 text-gray-500">加载中...</div>
    );
  }

  const departmentData = statistics && statistics.departmentCounts ? {
    labels: statistics.departmentCounts.map(item => item.departmentName),
    datasets: [
      {
        label: '员工数量',
        data: statistics.departmentCounts.map(item => item.count),
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
      },
    ],
  } : null;

  const salaryData = statistics ? {
    labels: ['总工资', '实际总工资'],
    datasets: [
      {
        label: '金额',
        data: [statistics.totalSalary, statistics.totalSalaryFinal || 0],
        backgroundColor: ['#10B981', '#14B8A6'],
      },
    ],
  } : null;

  const attendanceData = statistics ? {
    labels: ['已打卡', '未打卡'],
    datasets: [
      {
        label: '考勤',
        data: [statistics.attendance.punched, statistics.attendance.notPunched],
        backgroundColor: ['#10B981', '#EF4444'],
      },
    ],
  } : null;

  return (
    <div className="space-y-6">
      <PageHeader title="数据统计" />

      {error && <Alert>{error}</Alert>}

      {/* 操作按钮 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-center">
        <div>
          <PrimaryButton onClick={handleGeneratePersonalReport} className="w-full sm:w-auto rounded-md h-10">生成个人报表</PrimaryButton>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
          >
            <option value="">选择部门</option>
            {departments.map((d) => (
              <option key={d.id} value={String(d.id)}>{d.name}</option>
            ))}
          </select>
          <PrimaryButton
            onClick={handleGenerateDepartmentReport}
            disabled={!selectedDepartment}
            className="rounded-md h-10 whitespace-nowrap px-4"
          >
            生成部门报表
          </PrimaryButton>
        </div>
      </div>

      {!error && statistics && statistics.totalEmployees !== 0 && (
        <>
          {/* 概述卡片 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">概述</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                <div className="text-sm text-blue-600 font-medium mb-1">员工总数</div>
                <div className="text-3xl font-bold text-blue-700">{statistics.totalEmployees || '0'}</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                <div className="text-sm text-green-600 font-medium mb-1">部门数量</div>
                <div className="text-3xl font-bold text-green-700">{statistics.departmentCounts ? statistics.departmentCounts.length : '0'}</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4">
                <div className="text-sm text-yellow-600 font-medium mb-1">总工资</div>
                <div className="text-3xl font-bold text-yellow-700">¥{statistics.totalSalary || '0'}</div>
              </div>
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-4">
                <div className="text-sm text-teal-600 font-medium mb-1">实际总工资（基本+奖金-罚款）</div>
                <div className="text-3xl font-bold text-teal-700">¥{statistics.totalSalaryFinal || '0'}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                <div className="text-sm text-purple-600 font-medium mb-1">考勤率</div>
                <div className="text-3xl font-bold text-purple-700">
                  {statistics.attendance.total > 0 
                    ? `${((statistics.attendance.punched / statistics.attendance.total) * 100).toFixed(1)}%`
                    : '0%'
                  }
                </div>
              </div>
            </div>
          </div>

          {/* 图表网格 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 部门员工数量饼图 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">各部门员工数量</h2>
              <div className="h-64 flex items-center justify-center">
                {statistics.departmentCounts && statistics.departmentCounts.length === 0 ? (
                  <p className="text-gray-400">没有部门数据</p>
                ) : (
                  <Pie data={departmentData} options={{ maintainAspectRatio: false }} />
                )}
              </div>
            </div>

            {/* 总工资柱状图 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">总工资</h2>
              <div className="h-64 flex items-center justify-center">
                {statistics.totalSalary === 0 ? (
                  <p className="text-gray-400">没有工资数据</p>
                ) : (
                  <Bar data={salaryData} options={{ maintainAspectRatio: false }} />
                )}
              </div>
            </div>

            {/* 考勤饼图 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">考勤</h2>
              <div className="h-64 flex items-center justify-center">
                {statistics.attendance.total === 0 ? (
                  <p className="text-gray-400">没有考勤数据</p>
                ) : (
                  <Pie data={attendanceData} options={{ maintainAspectRatio: false }} />
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {modalOpen && (
        <Modal title={reportType === 'personal' ? '个人工资信息' : '部门报表'} onClose={handleCloseModal}>
          <div className="space-y-4">
            {reportType === 'personal' ? (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium text-gray-600">员工 ID:</div>
                  <div className="text-gray-800">{reportData?.employeeId || '无'}</div>
                  <div className="font-medium text-gray-600">姓名:</div>
                  <div className="text-gray-800">{reportData?.name || '无'}</div>
                  <div className="font-medium text-gray-600">基本工资:</div>
                  <div className="text-gray-800">¥{reportData?.baseSalary || '无'}</div>
                  <div className="font-medium text-gray-600">奖金:</div>
                  <div className="text-gray-800">¥{reportData?.bonus || '无'}</div>
                  <div className="font-medium text-gray-600">罚款:</div>
                  <div className="text-gray-800">¥{reportData?.penalty || '无'}</div>
                  <div className="font-medium text-gray-600">总工资:</div>
                  <div className="text-lg font-bold text-green-600">¥{reportData?.totalSalary || '无'}</div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium text-gray-600">部门名称:</div>
                  <div className="text-gray-800">{reportData?.departmentName || '—'}</div>
                  <div className="font-medium text-gray-600">员工总数:</div>
                  <div className="text-gray-800">{reportData?.totalEmployees || '60'}</div>
                  <div className="font-medium text-gray-600">总工资:</div>
                  <div className="text-gray-800">¥{reportData?.totalSalary || '536,000'}</div>
                  <div className="font-medium text-gray-600">离职率:</div>
                  <div className="text-gray-800">{reportData?.turnoverRate || '1.9%'}</div>
                </div>
              </div>
            )}
            <div className="flex gap-2 justify-end pt-4 border-t">
              <PrimaryButton onClick={handlePrint}>打印</PrimaryButton>
              <SecondaryButton onClick={handleCloseModal}>取消</SecondaryButton>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StatisticsPage;
