import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './pages/auth';
import Dashboard from './pages/dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* A rota raiz '/' mostra o Login */}
        <Route path="/" element={<Auth />} />
        {/* A rota '/dashboard' mostra o Painel */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;