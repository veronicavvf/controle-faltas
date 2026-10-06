import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './pages/auth';
import Dashboard from './pages/dashboard';
import forgotPassword from './pages/forgotPassword';
import resetPassword from './pages/resetPassword'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* A rota raiz '/' mostra o Login */}
        <Route path="/" element={<Auth />} />
        {/* A rota '/dashboard' mostra o Painel */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/recuperar-senha" element={<forgotPassword />} />
        <Route path="/api/auth/resetSenha/:token" element={<resetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;