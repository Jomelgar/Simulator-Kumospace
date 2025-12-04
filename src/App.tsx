import SignIn from './pages/SignIn';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

type TabType = 'inicio' | 'login' | 'sign_in' | 'dashboard';

interface AppProps {
  page?: TabType;
}

export default function App({ page = 'inicio' }: AppProps) {
  if (page === 'login') {
    return (
      <Login />
    );
  }

  if (page === 'signin') {
    return <SignIn />;
  }
  if (page === 'dashboard') {
    return <Dashboard />;
  }

  return null;
}