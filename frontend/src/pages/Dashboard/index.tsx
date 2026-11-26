import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/Auth';
import Button from '../../components/ui/Button';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';

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

            <section className="mt-8">
                <div className="mb-5">
                    <h2 className="text-lg font-semibold text-text-main">
                        Encomendas recentes
                    </h2>

                    <p className="mt-1 text-sm text-text-muted">
                        Acompanhe as últimas encomendas registadas.
                    </p>
                </div>

                <div className="overflow-x-auto rounded-card border border-gray-200 bg-white">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-gray-200 bg-gray-50 text-text-muted">
                            <tr>
                                <th className="px-5 py-4 font-medium">Encomenda</th>
                                <th className="px-5 py-4 font-medium">Cliente</th>
                                <th className="px-5 py-4 font-medium">Serviço</th>
                                <th className="px-5 py-4 font-medium">Data</th>
                                <th className="px-5 py-4 font-medium">Estado</th>
                                <th className="px-5 py-4 font-medium">Valor</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            <tr>
                                <td className="px-5 py-4 font-medium text-text-main">#1001</td>
                                <td className="px-5 py-4">João Silva</td>
                                <td className="px-5 py-4">Lavagem</td>
                                <td className="px-5 py-4">25/11/2026</td>
                                <td className="px-5 py-4">
                                    <StatusBadge status="IN_PROGRESS" />
                                </td>
                                <td className="px-5 py-4 font-medium">25,00 €</td>
                            </tr>

                            <tr>
                                <td className="px-5 py-4 font-medium text-text-main">#1002</td>
                                <td className="px-5 py-4">Maria Santos</td>
                                <td className="px-5 py-4">Engomadoria</td>
                                <td className="px-5 py-4">25/11/2026</td>
                                <td className="px-5 py-4">
                                    <StatusBadge status="PENDING" />
                                </td>
                                <td className="px-5 py-4 font-medium">18,00 €</td>
                            </tr>

                            <tr>
                                <td className="px-5 py-4 font-medium text-text-main">#1003</td>
                                <td className="px-5 py-4">Pedro Costa</td>
                                <td className="px-5 py-4">Lavagem e secagem</td>
                                <td className="px-5 py-4">24/11/2026</td>
                                <td className="px-5 py-4">
                                    <StatusBadge status="COMPLETED" />
                                </td>
                                <td className="px-5 py-4 font-medium">32,00 €</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

export default DashboardPage;