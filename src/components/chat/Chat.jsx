import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import {getChatRequest} from "../../api/userApi";
import { login } from "./axios";

export default function Chat({ tryEnter, exit }) {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getChatRequest();
      if (response?.status === 200) setToken(response.data.authToken);
    };
    fetchData();
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
      src={`${import.meta.env.VITE_CHAT_URL || "http://localhost:3000"}/home?resumeToken=${token}`}
      allow="notifications"
      className="w-full h-full border-none"
    />
  );
}
