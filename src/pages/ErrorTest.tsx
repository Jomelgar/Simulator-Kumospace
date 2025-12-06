import { ErrorPage } from "../components/errors/ErrorPage";

export default function ErrorTest(): JSX.Element {
  // Aquí puedes cambiar el código para ir probando:
  // 404, 500, "network", "maintenance", etc.
  return <ErrorPage errorCode={404} />;
}