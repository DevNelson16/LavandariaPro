import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';
import { useState } from 'react';
import type { FormEvent } from 'react';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        // Futuramente vamos implementar a autenticação.
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

            <Button type="submit" className="w-full">
                Entrar
            </Button>
        </form>
    );
}

export default LoginForm;