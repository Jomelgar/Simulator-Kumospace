import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { getChatRequest } from "../../api/userApi";

export default function Chat({ tryEnter, user, exit }) {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getChatRequest();
      if (response?.status === 200) {
        setToken(response.data.authToken);
      }
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

  const CHAT_URL = import.meta.env.VITE_CHAT_URL || "http://localhost:3000";

  const iframeSrc = user
    ? `${CHAT_URL}/direct/${user}?resumeToken=${token}`
    : `${CHAT_URL}/home?resumeToken=${token}`;

  return (
    <iframe
      src={iframeSrc}
      allow="notifications"
      className="w-full h-full border-none"
    />
  );
}
