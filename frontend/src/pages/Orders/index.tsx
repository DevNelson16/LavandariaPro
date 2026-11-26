import { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import { getOrders } from '../../services/orders';
import type { Order } from '../../types/orders';

function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                <div className="border-b border-gray-200 p-5">
                    <h2 className="font-semibold text-text-main">
                        Todas as encomendas
                    </h2>
                    <p className="mt-1 text-sm text-text-muted">
                        {orders.length} encomendas registadas
                    </p>
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
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-6 text-center text-text-muted">
                                        Ainda não existem encomendas registadas.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="px-5 py-4 font-medium">
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
            </Card>
        </div>
    );
}

export default OrdersPage;