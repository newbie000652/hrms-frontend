/* router.js */
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import EmployeePage from './pages/EmployeePage';
import AttendancePage from './pages/AttendancePage';
import SalaryPage from './pages/SalaryPage';
import StatisticsPage from './pages/StatisticsPage';
import ResignationPage from './pages/ResignationPage';
import LogsPage from './pages/LogsPage';
import DashboardPage from './pages/DashboardPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import PrivateRoute from './components/PrivateRoute';
import PerformancePage from './pages/PerformancePage';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute path="/dashboard">
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/employees"
          element={
            <PrivateRoute path="/employees">
              <EmployeePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <PrivateRoute path="/attendance">
              <AttendancePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/salary"
          element={
            <PrivateRoute path="/salary">
              <SalaryPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/permissions"
          element={
            <PrivateRoute path="/permissions">
              <PermissionPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/logs"
          element={
            <PrivateRoute path="/logs">
              <LogsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/performance"
          element={
            <PrivateRoute path="/performance">
              <PerformancePage />
            </PrivateRoute>
          }
        />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
