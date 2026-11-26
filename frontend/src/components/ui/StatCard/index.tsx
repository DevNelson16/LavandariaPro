

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
}

function StatCard({ title, value, description }: StatCardProps) {
  return (
    <div className="rounded-card border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-text-muted">
        {title}
      </p>

      <p className="mt-3 text-2xl font-bold text-text-main">
        {value}
      </p>

      <p className="mt-2 text-xs text-text-muted">
        {description}
      </p>
    </div>
  );
}

export default StatCard;