import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { login } from '../../../../services/auth';

function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError('')
        setIsLoading(true)

        try {
            await login({
                email,
                password,
            })
        }catch {
            setError("Nã foi possível iniciar a sessão. Verifique as suas credenciais.")
        }finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <Input
                id="email"
                name="email"
                label="Email"
                type="email"
                placeholder="nome@exemplo.pt"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="username"
            />

            <Input
                id="password"
                name="password"
                label="Palavra-passe"
                type="password"
                placeholder="Introduza a sua palavra-passe"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete="current-password"
            />

            {error && (
                <p className='tex-sm text-danger' role='alert'>
                    {error}
                </p>
            )}

            <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
            >
                Entrar
            </Button>
        </form>
    );
}

export default LoginForm;