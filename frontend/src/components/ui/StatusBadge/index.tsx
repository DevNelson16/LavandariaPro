type OrderStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

interface StatusBadgeProps {
  status: OrderStatus;
}

const statusConfig = {
  PENDING: {
    label: 'Pendente',
    className: 'bg-yellow-100 text-yellow-800',
  },
  IN_PROGRESS: {
    label: 'Em processamento',
    className: 'bg-blue-100 text-blue-800',
  },
  COMPLETED: {
    label: 'Concluída',
    className: 'bg-green-100 text-green-800',
  },
  CANCELLED: {
    label: 'Cancelada',
    className: 'bg-red-100 text-red-800',
  },
};

function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}

export default StatusBadge;