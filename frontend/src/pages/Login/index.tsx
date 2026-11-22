import LoginForm from './components/LoginForm';

function LoginPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
            <section className="w-full max-w-md rounded-card border border-gray-200 bg-surface p-8 shadow-sm sm:p-10">

                <header className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-text-main">
                        LavandariaPro
                    </h1>

                    <p className="mt-2 text-sm text-text-muted">
                        Sistema de gestão de lavandaria
                    </p>
                </header>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-text-main">
                        Iniciar sessão
                    </h2>

                    <p className="mt-1 text-sm text-text-muted">
                        Introduza os seus dados de acesso.
                    </p>
                </div>

                <LoginForm />

                <footer className="mt-8 border-t border-gray-100 pt-5">
                    <p className="text-center text-xs text-text-muted">
                        LavandariaPro · Sistema de gestão
                    </p>
                </footer>

            </section>
        </main>
    );
}

export default LoginPage;