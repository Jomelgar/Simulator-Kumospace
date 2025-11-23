import SignIn from './pages/SignIn';

type TabType = 'inicio' | 'login' | 'sign_in';

interface AppProps {
  page?: TabType;
}

export default function App({ page = 'inicio' }: AppProps) {
  if (page === 'login') {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900">Login</h1>
        </div>
      </div>
    );
  }

  if (page === 'sign_in') {
    return (
      <SignIn/>
    );
  }

  return null;
}
