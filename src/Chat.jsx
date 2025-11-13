import { useEffect, useState, useRef } from "react";
import axiosInstance from "./axios";

export default function RocketChatIframe({ username, password }) {
  const [token, setToken] = useState();
  const [width, setWidth] = useState(500);
  const iframeRef = useRef(null);
  const isResizing = useRef(false);
  const lastX = useRef(0);

  useEffect(() => {
    const fetchUser = async () => {
      if (!username || !password) return;
      try {
        const response = await axiosInstance.post('/login', { username, password });
        if (response.status === 200) setToken(response.data.auth_token);
        else setToken(null);
      } catch (error) {
        setToken(null);
      }
    };
    fetchUser();
  }, [username, password]);

  const startResize = (e) => {
    isResizing.current = true;
    lastX.current = e.clientX;
    e.preventDefault();
  };

  const stopResize = () => {
    isResizing.current = false;
  };

  const resize = (e) => {
    if (isResizing.current) {
      const dx = lastX.current - e.clientX;
      const newWidth = width + dx;
      if (newWidth >= 300 && newWidth <= 800) {
        setWidth(newWidth);
        lastX.current = e.clientX; 
      }
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResize);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResize);
    };
  }, [width]);

  return (
    <div
      className="fixed bottom-0 right-0 h-screen bg-gray-100 flex flex-col shadow-lg"
      style={{ width }}
    >
      {token ? (
        <iframe
          ref={iframeRef}
          title="Rocket.Chat"
          src={`http://localhost:3000/home?resumeToken=${token}`}
          className="w-full h-full border-none"
        />
      ) : (
        <p>Cargando...</p>
      )}
      <div
        className="absolute top-0 left-0 w-1 h-full cursor-ew-resize bg-transparent"
        onMouseDown={startResize}
      />
    </div>
  );
}
