import { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import { getOrders } from '../../services/orders';
import type { Order } from '../../types/orders';

function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredOrders = orders.filter((order) => {
        const search = searchTerm.toLowerCase().trim();

        return (
            order.customer.name.toLowerCase().includes(search) ||
            String(order.id).includes(search)
        );
    });

    useEffect(() => {
        async function loadOrders() {
            try {
                const data = await getOrders();
                setOrders(data);
            } catch {
                setError('Não foi possível carregar as encomendas.');
            } finally {
                setIsLoading(false);
            }
        }

        loadOrders();
    }, []);

    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-text-main">
                    Encomendas
                </h1>

                <p className="mt-2 text-sm text-text-muted">
                    Consulte e acompanhe todas as encomendas da lavandaria.
                </p>
            </header>

            <Card className="overflow-hidden">
                <div className="flex flex-col gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="font-semibold text-text-main">
                            Todas as encomendas
                        </h2>

                        <p className="mt-1 text-sm text-text-muted">
                            {filteredOrders.length} encomendas encontradas
                        </p>
                    </div>

                    <input
                        type="search"
                        placeholder="Pesquisar por cliente ou número..."
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 sm:max-w-xs"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-text-muted">
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
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="p-6 text-center text-text-muted">
                                        A carregar encomendas...
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={6} className="p-6 text-center text-danger">
                                        {error}
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-6 text-center text-text-muted">
                                        {searchTerm
                                            ? 'Nenhuma encomenda corresponde à pesquisa.'
                                            : 'Ainda não existem encomendas registadas.'}
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="px-5 py-4 font-medium">
                                            #{order.id}
                                        </td>

                                        <td className="px-5 py-4">
                                            {order.customer.name}
                                        </td>

                                        <td className="px-5 py-4">
                                            {order.items
                                                .map((item) => item.service.name)
                                                .join(', ')}
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
            </Card>
        </div>
    );
}

export default OrdersPage;