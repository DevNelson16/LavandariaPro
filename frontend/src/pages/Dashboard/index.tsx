import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/Auth';
import Button from '../../components/ui/Button';

function DashboardPage() {
  const { employee, signOut } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    signOut();
    navigate('/', { replace: true });
  }

  return (
    <main className="min-h-screen bg-background p-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-main">
            Painel de Gestão
          </h1>

          <p className="mt-2 text-text-muted">
            Bem-vindo, {employee?.name}.
          </p>
        </div>

        <Button variant="secondary" onClick={handleLogout}>
          Terminar sessão
        </Button>
      </header>
    </main>
  );
}

export default DashboardPage;