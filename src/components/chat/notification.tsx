import { useState, useEffect, useRef } from "react";
import { UserMessage } from "./UserMessage";
import { getChatRequest } from "../../api/userApi";

interface Message {
  id: string; // ID único para cada mensaje
  username: string;
  message: string;
  timestamp?: string;
}

type ChatUser = {
  userId: string;
  authToken: string;
};

export function MessageNotifications() {
  const [notifications, setNotifications] = useState<Message[]>([]);
  const [chatData, setChatData] = useState<ChatUser | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getChatRequest();
      if (response?.status === 200) setChatData(response.data);
    };
    fetchData();
  }, []);

  // Conectar WebSocket con reconexión automática
  useEffect(() => {
    if (!chatData) return;

    const connectWS = () => {
      const wsUrl = `${import.meta.env.VITE_WS_NOTIFICATION || "ws://localhost:3003"}?userId=${chatData.userId}&authToken=${chatData.authToken}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => console.log("WebSocket conectado");
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        const message: Message = {
          id: crypto.randomUUID(),
          username: data.username || "Chat",
          message: data.text || data.message || "Nuevo mensaje",
          timestamp: new Date().toLocaleTimeString(),
        };

        setNotifications((prev) => [...prev, message]);

        // Eliminar mensaje automáticamente después de 5s
        setTimeout(() => {
          setNotifications((prev) => prev.filter((msg) => msg.id !== message.id));
        }, 5000);
      };

      ws.onerror = (err) => console.error("WS error:", err);

      ws.onclose = () => {
        console.log("WS cerrado, reconectando en 2s...");
        reconnectRef.current = setTimeout(connectWS, 2000);
      };
    };

    connectWS();

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
    };
  }, [chatData]);

  // Cerrar notificación manualmente
  const handleClose = (id: string) => {
    setNotifications((prev) => prev.filter((msg) => msg.id !== id));
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
      {notifications.map((msg) => (
        <UserMessage
          key={msg.id}
          id={msg.id}
          username={msg.username}
          message={msg.message}
          timestamp={msg.timestamp}
          onClose={handleClose}
        />
      ))}
    </div>
  );
}
