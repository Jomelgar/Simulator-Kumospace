import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { login } from "./axios";

export default function Chat({ username, password, tryEnter, exit }) {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await login(username, password);
        setToken(res.token);
      } catch {
        exit && exit();
      }
    };
    if (tryEnter) fetch();
  }, [tryEnter]);

  if (!token) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <BarLoader />
      </div>
    );
  }

  return (
    <iframe
      src={`http://localhost:3000/home?resumeToken=${token}`}
      className="w-full h-full border-none"
    />
  );
}
