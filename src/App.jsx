import { Navigate, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import BenchmarkResultsPage from "./pages/BenchmarkResultsPage";
import DashboardPage from "./pages/DashboardPage";
import DatasetDetailsPage from "./pages/DatasetDetailsPage";
import DatasetsPage from "./pages/DatasetsPage";
import QuantumAnalysisPage from "./pages/QuantumAnalysisPage";
import SystemStatusPage from "./pages/SystemStatusPage";

function App() {
  return (
    <div className="app">
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/datasets" element={<DatasetsPage />} />
          <Route path="/datasets/:id" element={<DatasetDetailsPage />} />
          <Route path="/datasets/:id/quantum" element={<QuantumAnalysisPage />} />
          <Route
            path="/datasets/:id/benchmarks"
            element={<BenchmarkResultsPage />}
          />
          <Route path="/benchmarks" element={<BenchmarkResultsPage />} />
          <Route path="/system" element={<SystemStatusPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;