import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/Auth';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;