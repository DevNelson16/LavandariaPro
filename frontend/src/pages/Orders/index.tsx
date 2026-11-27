import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';

import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';

import { getOrders, createOrder } from '../../services/orders';
import { getCustomers } from '../../services/customers';
import { getServices } from '../../services/services';

import type { Order } from '../../types/orders';
import type { Customer } from '../../types/customers';
import type { LaundryService } from '../../types/services';

function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [services, setServices] = useState<LaundryService[]>([]);
    const [isLoadingOptions, setIsLoadingOptions] = useState(true);

    const [selectedCustomerId, setSelectedCustomerId] = useState('');
    const [selectedServiceId, setSelectedServiceId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [estimatedDeliveryAt, setEstimatedDeliveryAt] = useState('');
    const [notes, setNotes] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const selectedService = services.find(
        (service) => service.id === Number(selectedServiceId)
    );

    const subtotal = selectedService
        ? Number(selectedService.price) * quantity
        : 0;

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

    useEffect(() => {
        async function loadFormOptions() {
            try {
                const [customersData, servicesData] = await Promise.all([
                    getCustomers(),
                    getServices(),
                ]);

                setCustomers(customersData.filter((customer) => customer.active));
                setServices(servicesData.filter((service) => service.active));
            } catch {
                setError('Não foi possível carregar os clientes e serviços.');
            } finally {
                setIsLoadingOptions(false);
            }
        }

        loadFormOptions();
    }, []);

    async function handleCreateOrder(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setFormError(null);

        if (!selectedCustomerId || !selectedServiceId) {
            setFormError('Seleciona um cliente e um serviço.');
            return;
        }

        if (quantity < 1 || !Number.isInteger(quantity)) {
            setFormError('A quantidade deve ser um número inteiro igual ou superior a 1.');
            return;
        }

        setIsSubmitting(true);

        try {
            await createOrder({
                customerId: Number(selectedCustomerId),
                estimatedDeliveryAt: estimatedDeliveryAt || undefined,
                notes: notes.trim() || undefined,
                items: [
                    {
                        serviceId: Number(selectedServiceId),
                        quantity,
                    },
                ],
            });

            const updatedOrders = await getOrders();
            setOrders(updatedOrders);

            setSelectedCustomerId('');
            setSelectedServiceId('');
            setQuantity(1);
            setEstimatedDeliveryAt('');
            setNotes('');

            setIsFormOpen(false);
        } catch {
            setFormError(
                'Não foi possível criar a encomenda. Verifica os dados e tenta novamente.'
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="p-8">
            <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-main">
                        Encomendas
                    </h1>

                    <p className="mt-2 text-sm text-text-muted">
                        Consulte e acompanhe todas as encomendas da lavandaria.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        setFormError(null);
                        setIsFormOpen(true);
                    }}
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover"
                >
                    + Nova encomenda
                </button>
            </header>

            {isFormOpen && (
                <Card className="mb-6 p-6">
                    <form onSubmit={handleCreateOrder}>
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-text-main">
                                Nova encomenda
                            </h2>

                            <button
                                type="button"
                                onClick={() => setIsFormOpen(false)}
                                className="text-sm text-text-muted transition hover:text-text-main"
                            >
                                Cancelar
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-text-main">
                                    Cliente
                                </label>

                                <select
                                    required
                                    value={selectedCustomerId}
                                    onChange={(event) =>
                                        setSelectedCustomerId(event.target.value)
                                    }
                                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                    disabled={isLoadingOptions}
                                >
                                    <option value="" disabled>
                                        {isLoadingOptions
                                            ? 'A carregar clientes...'
                                            : 'Selecionar cliente'}
                                    </option>

                                    {customers.map((customer) => (
                                        <option
                                            key={customer.id}
                                            value={customer.id}
                                        >
                                            {customer.name} — {customer.phone}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-text-main">
                                    Serviço
                                </label>

                                <select
                                    required
                                    value={selectedServiceId}
                                    onChange={(event) =>
                                        setSelectedServiceId(event.target.value)
                                    }
                                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                    disabled={isLoadingOptions}
                                >
                                    <option value="" disabled>
                                        {isLoadingOptions
                                            ? 'A carregar serviços...'
                                            : 'Selecionar serviço'}
                                    </option>

                                    {services.map((service) => (
                                        <option
                                            key={service.id}
                                            value={service.id}
                                        >
                                            {service.name} —{' '}
                                            {Number(service.price).toLocaleString(
                                                'pt-PT',
                                                {
                                                    style: 'currency',
                                                    currency: 'EUR',
                                                }
                                            )}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-text-main">
                                    Quantidade
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    step="1"
                                    required
                                    value={quantity}
                                    onChange={(event) =>
                                        setQuantity(
                                            Math.max(
                                                1,
                                                Number(event.target.value) || 1
                                            )
                                        )
                                    }
                                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-text-main">
                                    Subtotal
                                </label>

                                <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-semibold text-text-main">
                                    {subtotal.toLocaleString('pt-PT', {
                                        style: 'currency',
                                        currency: 'EUR',
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-text-main">
                                    Data prevista de entrega
                                </label>

                                <input
                                    type="date"
                                    value={estimatedDeliveryAt}
                                    onChange={(event) =>
                                        setEstimatedDeliveryAt(event.target.value)
                                    }
                                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-text-main">
                                    Observações
                                </label>

                                <textarea
                                    rows={3}
                                    value={notes}
                                    onChange={(event) =>
                                        setNotes(event.target.value)
                                    }
                                    placeholder="Observações sobre a encomenda..."
                                    className="w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                />
                            </div>
                        </div>

                        {formError && (
                            <p className="mt-4 text-sm text-danger">
                                {formError}
                            </p>
                        )}

                        <div className="mt-6 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting || isLoadingOptions}
                                className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSubmitting
                                    ? 'A criar encomenda...'
                                    : 'Criar encomenda'}
                            </button>
                        </div>
                    </form>
                </Card>
            )}

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
                                <th className="px-5 py-4 font-medium">
                                    Encomenda
                                </th>
                                <th className="px-5 py-4 font-medium">
                                    Cliente
                                </th>
                                <th className="px-5 py-4 font-medium">
                                    Serviço
                                </th>
                                <th className="px-5 py-4 font-medium">
                                    Data
                                </th>
                                <th className="px-5 py-4 font-medium">
                                    Estado
                                </th>
                                <th className="px-5 py-4 font-medium">
                                    Valor
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="p-6 text-center text-text-muted"
                                    >
                                        A carregar encomendas...
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="p-6 text-center text-danger"
                                    >
                                        {error}
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="p-6 text-center text-text-muted"
                                    >
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
                                            {new Date(
                                                order.receivedAt
                                            ).toLocaleDateString('pt-PT')}
                                        </td>

                                        <td className="px-5 py-4">
                                            <StatusBadge status={order.status} />
                                        </td>

                                        <td className="px-5 py-4 font-medium">
                                            {Number(order.total).toLocaleString(
                                                'pt-PT',
                                                {
                                                    style: 'currency',
                                                    currency: 'EUR',
                                                }
                                            )}
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