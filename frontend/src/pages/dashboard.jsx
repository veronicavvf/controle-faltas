import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [disciplinas, setDisciplinas] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nomeDisciplina, setNomeDisciplina] = useState('');
  const [totalAulas, setTotalAulas] = useState('');
  const [percentualMinimo, setPercentualMinimo] = useState('')

  const navigate = useNavigate();

  // 1. A função fica livre dentro do componente
  const buscarDisciplinas = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/'); return; }

    try {
      const response = await fetch('/api/disciplinas/list', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setDisciplinas(await response.json());
      }
    } catch (error) {
      console.error(error);
    }
  }, [navigate]);

  // 2. O useEffect apenas invoca a função quando a tela abre
  useEffect(() => {
    buscarDisciplinas();
  }, [buscarDisciplinas]);

  const fazerLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleCriarDisciplina = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('/api/disciplinas/criar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nomeDisciplina: nomeDisciplina,
          totalAulas: parseInt(totalAulas), // Garante que enviaremos como número
          percentualMinimo: parseInt(percentualMinimo)
        })
      });

      if (response.ok) {
        const novaDisciplina = await response.json();
        // Adiciona a matéria nova na tela sem precisar recarregar a página!
        setDisciplinas([...disciplinas, novaDisciplina]);

        // Limpa o formulário e fecha o modal
        setNomeDisciplina('');
        setTotalAulas('');
        setIsModalOpen(false);
      }
    } catch (error) {
      alert('Erro ao criar disciplina.');
    }
  };

  const handleRegistrarFalta = async (disciplinaId) => {
    const quantidadeInput = window.prompt('Quantas aulas você faltou hoje? (ex: 2)', '2');
    if (!quantidadeInput) return; // Se o usuário cancelar, não faz nada

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('/api/faltas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          disciplinaId,
          quantidade: parseInt(quantidadeInput)
        })
      });

      if (response.ok) {
        const data = await response.json();

        // O alerta inteligente usando a regra de negócio do nosso backend
        alert(`Falta registrada com sucesso!\n\nStatus: ${data.resumo.status}\nFaltas Restantes: ${data.resumo.faltasRestantes}`);

        // Recarrega os cartões invisivelmente (sem piscar a tela)
        buscarDisciplinas();
      }
    } catch (error) {
      alert('Erro ao registrar falta.');
    }
  };

  const handleDeletarDisciplina = async (id) => {
    const confirmar = window.confirm('Tem certeza que deseja excluir esta disciplina? Todo o histórico de faltas será apagado.');
    if (!confirmar) return;

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`/api/disciplinas/apagarDisciplina/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        // Atualiza a tela puxando a lista nova do servidor
        buscarDisciplinas();
      } else {
        alert('Erro ao excluir disciplina.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Cabeçalho Minimalista */}
      <header className="bg-white border-b border-zinc-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-zinc-800">Controle de Faltas</h1>
        <button
          onClick={fazerLogout}
          className="text-sm font-medium text-zinc-500 hover:text-zinc-800 transition-colors"
        >
          Sair
        </button>
      </header>

      {/* Área Principal */}
      <main className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-zinc-800">Minhas Disciplinas</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-zinc-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors"
          >
            + Nova Disciplina
          </button>
        </div>

        {disciplinas.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-zinc-200 rounded-xl">
            <p className="text-zinc-500">Você ainda não tem disciplinas cadastradas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {disciplinas.map(disciplina => {
              // Cálculos do Progresso da Disciplina
              const totalFaltas = disciplina.faltas?.reduce((total, falta) => total + falta.quantidade, 0) || 0;
              const percentual = disciplina.limiteFaltas > 0 ? Math.min((totalFaltas / disciplina.limiteFaltas) * 100, 100) : 0;

              // O design system da barra: Neutro (Seguro), Laranja (Alerta 75%+), Vermelho (Reprovado 100%)
              const corBarra = percentual >= 100 ? 'bg-red-500' : percentual >= 75 ? 'bg-orange-500' : 'bg-zinc-800';

              return (
                <div key={disciplina.id} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative group">

                  {/* Cabeçalho do Cartão + Botão Deletar Invisível (Aparece no Hover) */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-zinc-800 pr-6">{disciplina.nomeDisciplina}</h3>
                      <p className="text-sm text-zinc-500 mt-1">{disciplina.totalAulas} aulas no semestre</p>
                    </div>
                    <button
                      onClick={() => handleDeletarDisciplina(disciplina.id)}
                      className="text-zinc-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 absolute top-6 right-6"
                      title="Excluir Disciplina"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  </div>

                  {/* Área Inferior: Status, Botão e Barra */}
                  <div className="mt-6 pt-4 border-t border-zinc-100 flex flex-col gap-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-1">Situação</p>
                        <p className="font-semibold text-zinc-800">
                          <span className={percentual >= 100 ? 'text-red-500 text-lg' : 'text-zinc-800 text-lg'}>
                            {totalFaltas}
                          </span>
                          <span className="text-zinc-400 font-normal"> / {disciplina.limiteFaltas} faltas</span>
                        </p>
                      </div>

                      <button
                        onClick={() => handleRegistrarFalta(disciplina.id)}
                        disabled={percentual >= 100}
                        className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors active:scale-95 ${percentual >= 100
                          ? 'bg-zinc-50 text-zinc-400 cursor-not-allowed'
                          : 'text-zinc-800 bg-zinc-100 hover:bg-zinc-200'
                          }`}
                      >
                        Registrar
                      </button>
                    </div>

                    {/* A Barra de Progresso Minimalista */}
                    <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-500 ease-out ${corBarra}`}
                        style={{ width: `${percentual}%` }}
                      ></div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal de Criação */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl border border-zinc-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-zinc-800">Nova Disciplina</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCriarDisciplina} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Nome da Matéria</label>
                <input
                  type="text"
                  required
                  value={nomeDisciplina}
                  onChange={(e) => setNomeDisciplina(e.target.value)}
                  placeholder="Ex: Cálculo 1"
                  className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-800 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Total de Aulas (Semestre)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={totalAulas}
                  onChange={(e) => setTotalAulas(e.target.value)}
                  placeholder="Ex: 80"
                  className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-800 transition-all"
                />
              </div>

              {/* NOVO CAMPO ADICIONADO AQUI */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Percentual Máximo de Faltas (%)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="100"
                  value={percentualMinimo}
                  onChange={(e) => setPercentualMinimo(e.target.value)}
                  placeholder="Ex: 25"
                  className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-800 transition-all"
                />
              </div>
              {/* FIM DO NOVO CAMPO */}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-zinc-800 text-white font-medium py-2.5 rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  Cadastrar Disciplina
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}