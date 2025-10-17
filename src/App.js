// App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import EmployeePage from "./pages/EmployeePage";
import AttendancePage from "./pages/AttendancePage";
import DashboardPage from "./pages/DashboardPage";
import SalaryPage from "./pages/SalaryPage";
import ResignationPage from "./pages/ResignationPage";
import StatisticsPage from "./pages/StatisticsPage";
import LogsPage from "./pages/LogsPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import NotFoundPage from "./pages/NotFoundPage";
import PrivateRoute from "./components/PrivateRoute";
import ProtectedLayout from "./components/Layout/ProtectedLayout";
import PerformancePage from "./pages/PerformancePage";
import AccountPage from "./pages/AccountPage";

const App = () => {
    return (
        <Routes>
            {/* 公共路由（无统一布局） */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* 受保护路由（统一布局 + 权限校验） */}
            <Route element={<ProtectedLayout />}>
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <DashboardPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/employees"
                    element={
                        <PrivateRoute>
                            <EmployeePage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/attendance"
                    element={
                        <PrivateRoute>
                            <AttendancePage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/salary"
                    element={
                        <PrivateRoute>
                            <SalaryPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/resignation"
                    element={
                        <PrivateRoute>
                            <ResignationPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/accounts"
                    element={
                        <PrivateRoute>
                            <AccountPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/performance"
                    element={
                        <PrivateRoute>
                            <PerformancePage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/logs"
                    element={
                        <PrivateRoute>
                            <LogsPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/statistics"
                    element={
                        <PrivateRoute>
                            <StatisticsPage />
                        </PrivateRoute>
                    }
                />
            </Route>

            {/* 兜底路由 */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default App;
