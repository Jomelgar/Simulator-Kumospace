import SignIn from "./pages/SignIn";
import Login from "./pages/Login";
import HiveApp from "./pages/HiveApp";

type TabType = "inicio" | "login" | "sign_in" | "dashboard";

interface AppProps {
  page?: TabType;
}

export default function App({ page = "inicio" }: AppProps) {
  if (page === "login") {
    return <Login />;
  }

  if (page === "sign_in") {
    return <SignIn />;
  }
  if (page === "dashboard") {
    return <HiveApp />;
  }

  return null;
}
