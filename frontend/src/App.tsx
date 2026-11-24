import LoginPage from './pages/Login';
import { AuthProvider } from './context/Auth';

function App() {
    return (
        <AuthProvider>
            <LoginPage />
        </AuthProvider>
    );
}

export default App;