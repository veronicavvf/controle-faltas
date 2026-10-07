import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './pages/auth';
import Dashboard from './pages/dashboard';
import ForgotPassword from './pages/forgotPassword';
import ResetPassword from './pages/resetPassword'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* A rota raiz '/' mostra o Login */}
        <Route path="/" element={<Auth />} />
        {/* A rota '/dashboard' mostra o Painel */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/recuperar-senha" element={<ForgotPassword />} />
        <Route path="/api/auth/resetSenha/:token" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;