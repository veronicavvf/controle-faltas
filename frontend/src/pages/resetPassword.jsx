import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function RedefinirSenha() {
  const navigate = useNavigate();
  const { token } = useParams(); // Lê o :token da URL configurada no React Router
  
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (novaSenha !== confirmaSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    // Expressão Regular igual à do cadastro original
    const regexSenha = /^(?=.*[A-Z])(?=.*[!@#$\%^&*(),.?":{}\vert{}<>]).{8,}$/;
    if (!regexSenha.test(novaSenha)) {
      setErro('A senha deve ter no mínimo 8 caracteres, uma letra maiúscula e um caractere especial.');
      return;
    }

    setCarregando(true);

    try {
      const response = await fetch(`/api/usuarios/resetarSenha/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ novaSenha })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || 'Ocorreu um erro ao redefinir a senha.');
      }

      setSucesso(true);
      setTimeout(() => navigate('/'), 3000); // Redireciona após 3 segundos
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-zinc-200">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-zinc-800">Criar Nova Senha</h1>
          <p className="text-sm text-zinc-500 mt-2">
            Por favor, escolha uma senha forte e segura.
          </p>
        </div>

        {!sucesso ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Nova Senha</label>
              <input 
                type="password" 
                required 
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Confirmar Nova Senha</label>
              <input 
                type="password" 
                required 
                value={confirmaSenha}
                onChange={(e) => setConfirmaSenha(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            {erro && (
              <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded-md">
                {erro}
              </div>
            )}

            <button 
              type="submit" 
              disabled={carregando}
              className={`w-full text-white font-medium py-2.5 rounded-lg transition-colors mt-2 ${carregando ? 'bg-zinc-400 cursor-not-allowed' : 'bg-zinc-800 hover:bg-zinc-700'}`}
            >
              {carregando ? 'Salvando...' : 'Redefinir Senha'}
            </button>
          </form>
        ) : (
          <div className="text-center bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-green-700 font-medium">Senha atualizada com sucesso!</p>
            <p className="text-sm text-green-600 mt-2">Redirecionando para o login...</p>
          </div>
        )}

      </div>
    </div>
  );
}