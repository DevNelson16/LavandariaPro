import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';

function LoginForm() {
    return (
        <form className="space-y-5">
            <Input
                id="email"
                name="email"
                label="Email"
                type="email"
                placeholder="nome@exemplo.pt"
                required
                autoComplete="username"
            />

            <Input
                id="password"
                name="password"
                label="Palavra-passe"
                type="password"
                placeholder="Introduza a sua palavra-passe"
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