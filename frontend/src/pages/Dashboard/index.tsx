import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/Auth';
import Button from '../../components/ui/Button';
import StatCard from '../../components/ui/StatCard';

function DashboardPage() {
    const { employee, signOut } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        signOut();
        navigate('/', { replace: true });
    }

    return (
        <div className="p-8">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-text-main">
                        Painel de gestão
                    </h1>

                    <p className="mt-2 text-sm text-text-muted">
                        Bem-vindo, {employee?.name}.
                    </p>

                    <p className="mt-1 text-sm text-text-muted">
                        Visão geral da atividade da lavandaria.
                    </p>
                </div>

                <Button variant="secondary" onClick={handleLogout}>
                    Terminar sessão
                </Button>
            </header>

            <section>
                <div className="mb-5">
                    <h2 className="text-lg font-semibold text-text-main">
                        Indicadores gerais
                    </h2>

                    <p className="mt-1 text-sm text-text-muted">
                        Resumo da atividade da lavandaria.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="Encomendas de hoje"
                        value={24}
                        description="Total de encomendas recebidas"
                    />

                    <StatCard
                        title="Em processamento"
                        value={12}
                        description="Encomendas em tratamento"
                    />

                    <StatCard
                        title="Prontas para entrega"
                        value={8}
                        description="Aguardam levantamento"
                    />

                    <StatCard
                        title="Receita do mês"
                        value="2.450 €"
                        description="Total recebido este mês"
                    />
                </div>
            </section>
        </div>
    );
}

export default DashboardPage;