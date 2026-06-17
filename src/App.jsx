import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import BenchmarkResultsPage from "./pages/BenchmarkResultsPage";
import DashboardPage from "./pages/DashboardPage";
import DatasetDetailsPage from "./pages/DatasetDetailsPage";
import DatasetsPage from "./pages/DatasetsPage";
import QuantumAnalysisPage from "./pages/QuantumAnalysisPage";
import RecommendationReportsPage from "./pages/RecommendationReportsPage";
import SystemStatusPage from "./pages/SystemStatusPage";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const AppContent = () => {
  const location = useLocation();
  const { loading } = useAuth();
  const isLoginPage = location.pathname === '/login';

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#1e293b' }}>Loading session...</div>;
  }

  return (
    <div className="app">
      {!isLoginPage && <Navbar />}

      <main className={isLoginPage ? "" : "main-content"}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/datasets" replace />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/datasets" element={<ProtectedRoute><DatasetsPage /></ProtectedRoute>} />
          <Route path="/datasets/:id" element={<ProtectedRoute><DatasetDetailsPage /></ProtectedRoute>} />
          <Route path="/datasets/:id/quantum" element={<ProtectedRoute><QuantumAnalysisPage /></ProtectedRoute>} />
          <Route path="/datasets/:id/benchmarks" element={<ProtectedRoute><BenchmarkResultsPage /></ProtectedRoute>} />
          <Route path="/datasets/:id/reports" element={<ProtectedRoute><RecommendationReportsPage /></ProtectedRoute>} />
          <Route path="/benchmarks" element={<ProtectedRoute><BenchmarkResultsPage /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><RecommendationReportsPage /></ProtectedRoute>} />
          <Route path="/system" element={<ProtectedRoute><SystemStatusPage /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;