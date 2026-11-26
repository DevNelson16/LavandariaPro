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
        </div>
    );
}

export default DashboardPage;