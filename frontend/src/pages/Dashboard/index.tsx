import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/Auth';
import Button from '../../components/ui/Button';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { getOrders } from '../../services/orders';
import type { Order } from '../../types/orders';

function DashboardPage() {
    const { employee, signOut } = useAuth();
    const navigate = useNavigate();

    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(true);
    const [ordersError, setOrdersError] = useState<string | null>(null);

    useEffect(() => {
        async function loadOrders() {
            try {
                const data = await getOrders();
                setOrders(data);
            } catch {
                setOrdersError('Não foi possível carregar as encomendas.');
            } finally {
                setIsLoadingOrders(false);
            }
        }

        loadOrders();
    }, []);

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
                            {isLoadingOrders ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-6 text-center text-text-muted">
                                        A carregar encomendas...
                                    </td>
                                </tr>
                            ) : ordersError ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-6 text-center text-danger">
                                        {ordersError}
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-6 text-center text-text-muted">
                                        Ainda não existem encomendas registadas.
                                    </td>
                                </tr>
                            ) : (
                                orders.slice(0, 5).map((order) => (
                                    <tr key={order.id}>
                                        <td className="px-5 py-4 font-medium text-text-main">
                                            #{order.id}
                                        </td>

                                        <td className="px-5 py-4">
                                            {order.customer.name}
                                        </td>

                                        <td className="px-5 py-4">
                                            {order.items.map((item) => item.service.name).join(', ')}
                                        </td>

                                        <td className="px-5 py-4">
                                            {new Date(order.receivedAt).toLocaleDateString('pt-PT')}
                                        </td>

                                        <td className="px-5 py-4">
                                            <StatusBadge status={order.status} />
                                        </td>

                                        <td className="px-5 py-4 font-medium">
                                            {Number(order.total).toLocaleString('pt-PT', {
                                                style: 'currency',
                                                currency: 'EUR',
                                            })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

export default DashboardPage;