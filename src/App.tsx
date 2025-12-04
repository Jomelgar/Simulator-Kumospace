import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkRequest } from "./api/authApi";
import SignIn from './pages/SignIn';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';

type TabType = 'inicio' | 'login' | 'sign_in' | 'dashboard';

interface AppProps {
  page?: TabType;
}

export default function App({ page = 'inicio' }: AppProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const validateCookie = async () => {
      try {
        const response = await checkRequest(); // Esta función hace request al backend
        if (response?.status >= 200 && response?.status < 300) {
          // Cookie válida → redirigir a Dashboard o Home
          if (page === 'login' || page === 'signin') {
            navigate('/dashboard', { replace: true });
          }
        } else {
          // Cookie inválida → redirigir a login o sign_in según page
          if (page === 'dashboard' || page === 'inicio') {
            navigate('/login', { replace: true });
          }
        }
      } catch (error) {
        if (page === 'dashboard' || page === 'inicio') {
          navigate('/login', { replace: true });
        }
      }
    };

    validateCookie();
  }, [navigate, page]);

  // Renderiza según la página solicitada
  if (page === 'login') return <Login />;
  if (page === 'signin') return <SignIn />;
  if (page === 'dashboard') return <Dashboard />;
  if (page === 'inicio') return <Home />;

  return <Login />; // fallback
}
