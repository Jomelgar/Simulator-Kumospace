import SignIn from './pages/SignIn';
import Login from './pages/Login';

type TabType = 'inicio' | 'login' | 'sign_in';

interface AppProps {
  page?: TabType;
}

export default function App({ page = 'inicio' }: AppProps) {
  if (page === 'login') {
    return (
      <Login />
    );
  }

  if (page === 'sign_in') {
    return <SignIn />;
  }

  return null;
}
