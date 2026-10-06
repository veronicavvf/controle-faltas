import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EsqueciSenha() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const response = await fetch('/api/usuarios/esqueceuSenha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || data.error || 'Ocorreu um erro ao solicitar a recuperação.');
      }

      setSucesso(true);
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
          <h1 className="text-2xl font-semibold text-zinc-800">Recuperar Senha</h1>
          <p className="text-sm text-zinc-500 mt-2">
            Insira o seu e-mail para receber as instruções de redefinição.
          </p>
        </div>

        {!sucesso ? (
          <form onSubmit={handleSubmit} className="space-y-4">
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
              {carregando ? 'Enviando...' : 'Enviar E-mail'}
            </button>
          </form>
        ) : (
          <div className="text-center bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-green-700 font-medium">E-mail enviado com sucesso!</p>
            <p className="text-sm text-green-600 mt-2">Verifique a sua caixa de entrada e clique no link para redefinir a sua senha.</p>
          </div>
        )}

        <div className="mt-6 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-sm text-zinc-500 hover:text-zinc-800 transition-colors"
          >
            Voltar para o Login
          </button>
        </div>

      </div>
    </div>
  );
}