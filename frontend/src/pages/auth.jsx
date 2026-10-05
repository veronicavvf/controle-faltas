import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState(''); // Novo estado para confirmação
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    // Validações exclusivas da tela de cadastro
    if (!isLogin) {
      if (senha !== confirmaSenha) {
        setErro('As senhas não coincidem.');
        return;
      }
      
      // Expressão Regular: Mínimo 8 caracteres, 1 minúscula e 1 caractere especial
      const regexSenha = /^(?=.*[A-Z])(?=.*[!@#$\%^&*(),.?":{}\vert{}<>]).{8,}$/;
      if (!regexSenha.test(senha)) {
        setErro('A senha deve ter no mínimo 8 caracteres, uma letra maiúscula e um caractere especial.');
        return;
      }
    }

    const endpoint = isLogin ? '/login' : '/cadastrar';
    const url = `/api/usuarios${endpoint}`;
    
    const payload = isLogin ? { email, senha } : { nome, email, senha };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || 'Ocorreu um erro.');
      }

      if (isLogin) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        alert('Cadastro realizado! Faça o login agora.');
        setIsLogin(true);
        setConfirmaSenha(''); // Limpa o campo após sucesso
      }
    } catch (error) {
      setErro(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-zinc-200">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-zinc-800">
            {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
          </h1>
          <p className="text-sm text-zinc-500 mt-2">
            {isLogin ? 'Gerencie suas faltas com facilidade.' : 'Comece a organizar sua vida acadêmica.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Nome</label>
              <input 
                type="text" 
                required 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:border-transparent transition-all"
                placeholder="Seu nome completo"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">E-mail</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:border-transparent transition-all"
              placeholder="estudante@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Senha</label>
            <input 
              type="password" 
              required 
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>

          {/* Novo campo que só aparece no Cadastro */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Confirmar Senha</label>
              <input 
                type="password" 
                required 
                value={confirmaSenha}
                onChange={(e) => setConfirmaSenha(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
          )}

          {erro && (
            <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded-md">
              {erro}
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-zinc-800 text-white font-medium py-2.5 rounded-lg hover:bg-zinc-700 transition-colors mt-2"
          >
            {isLogin ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setErro(''); setConfirmaSenha(''); }}
            className="text-sm text-zinc-500 hover:text-zinc-800 transition-colors"
          >
            {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
          </button>
        </div>

      </div>
    </div>
  );
}