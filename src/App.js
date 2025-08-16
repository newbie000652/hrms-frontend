import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import EmployeePage from "./pages/EmployeePage";
import AttendancePage from "./pages/AttendancePage";
import DashboardPage from "./pages/DashboardPage";
import SalaryPage from "./pages/SalaryPage";
import ResignationPage from "./pages/ResignationPage";
import StatisticsPage from "./pages/StatisticsPage";
import LogsPage from "./pages/LogsPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import Sidebar from "./components/Layout/Sidebar";
import PrivateRoute from "./components/PrivateRoute";
import PerformancePage from "./pages/PerformancePage";
import AccountPage from "./pages/AccountPage"; // 添加这一行

const App = () => {
    return (
        <Router>
            <div className="app-container">
                <Header />
                <div className="main-layout">
                    <Sidebar />
                    <div className="content">
                        <Routes>
                            {/* 公共路由 */}
                            <Route path="/" element={<LoginPage />} />
                            <Route path="/unauthorized" element={<UnauthorizedPage />} />

                            {/* 受保护路由 */}
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
                        </Routes>
                    </div>
                </div>
                <Footer />
            </div>
        </Router>
    );
};

export default App;