import { useEffect, useState, useRef, use } from "react";
import { BarLoader } from 'react-spinners';
import axiosInstance,{login} from "./axios";

export default function RocketChatIframe({ username, password,tryEnter,exit }) {
  const [token, setToken] = useState();

  useEffect(() => {
    const fetchUser = async () => {
      if (!username || !password) return;
      try {
        const response = await login(username, password);
        setToken(response.token); 
      } catch (error) {
        setToken(null);
        exit();
      }
    };
    if(tryEnter === true) fetchUser()
  }, [tryEnter]);

  return (
    <div
      className="fixed bottom-0 right-0 w-full items-center justify-center h-screen bg-gray-100 flex flex-col shadow-lg"
    >
      {token ? (
        <iframe
          title="Rocket.Chat"
          src={`http://localhost:3000/home?resumeToken=${token}`}
          className="w-full h-full border-none"
        />
      ) : (
        <BarLoader/>
      )}
    </div>
  );
}
