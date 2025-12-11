import { useState, useEffect, useRef } from "react";
import { UserMessage } from "./UserMessage";
import { getChatRequest } from "../../api/userApi";

interface Message {
  id: string;
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
  const connectingRef = useRef<boolean>(false); // 🟢 Evita conexiones múltiples
  const reconnectRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const response = await getChatRequest();
        if (mounted && response?.status === 200) {
          setChatData(response.data);
        }
      } catch (err) {
        console.error("Error cargando chat info:", err);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!chatData) return;

    const connect = async () => {
      if (connectingRef.current) return;
      connectingRef.current = true;

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        connectingRef.current = false;
        return;
      }

      const wsUrl = `${
        import.meta.env.VITE_WS_NOTIFICATION || "ws://localhost:3003"
      }?userId=${chatData.userId}&authToken=${chatData.authToken}`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WS conectado ✔");
        connectingRef.current = false;
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        // Mensaje normal
        const message: Message = {
          id: crypto.randomUUID(),
          username: data.username || "Chat",
          message: data.text || data.message || "Nuevo mensaje",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        setNotifications((prev) => [...prev, message]);

        setTimeout(() => {
          setNotifications((prev) => prev.filter((msg) => msg.id !== message.id));
        }, 5000);
      };

      ws.onerror = (err) => {
        console.warn("WS error:", err);
      };

      ws.onclose = () => {
        console.warn("WS desconectado, reintentando...");
        connectingRef.current = false;

        if (!reconnectRef.current) {
          reconnectRef.current = setTimeout(() => {
            reconnectRef.current = null;
            connect();
          }, 2000);
        }
      };
    };

    connect();

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
    };
  }, [chatData]);

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
