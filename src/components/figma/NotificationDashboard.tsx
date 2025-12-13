import { useEffect, useState } from "react";
import { getNotificationUser, readNotification } from "../../api/notificationApi";

interface Notification {
  id_notification: string;
  title: string;
  content: string;
  is_read: boolean;
  date: string;
}

export default function NotificationDashboard() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selected, setSelected] = useState<Notification | null>(null);

  const fetchNotifications = async () => {
    try {
      const data = await getNotificationUser();
      if (data) {
        setNotifications(data.notifications || []);
        
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSelect = async (n: Notification) => {
    setSelected(n);
    if (!n.is_read) {
      try {
        await readNotification(n.id_notification);
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id_notification === n.id_notification ? { ...notif, is_read: true } : notif
          )
        );
      } catch (error) {
        console.error("Error marking as read:", error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen py-10">
      {/* Titulo */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-extrabold text-zinc-900">Notifications</h1>
        <p className="text-zinc-500  mt-1">Here are your latest notifications</p>
      </div>

      {/* Panel principal */}
      <div
        className="flex bg-white shadow-xl rounded-2xl overflow-hidden border border-black"
        style={{
          width: "80vw",
          maxWidth: "1000px",
          minWidth: "800px",
          height: "70vh",
          minHeight: "700px",
        }}
      >
        {/* Panel izquierdo: lista */}
        <div
          className="w-[35%] overflow-y-auto"
          style={{ borderRight: "2px solid #D97706", backgroundColor: "#FEF3C7" }} // colmena
        >
          <ul className="p-4 space-y-2">
            {notifications.map((n) => (
              <li
                key={n.id_notification}
                onClick={() => handleSelect(n)}
                className={`cursor-pointer px-3 py-2 transition flex justify-between items-start`}
                style={{
                  borderBottom: "1px solid #fca54dff", // línea inferior amarilla
                  backgroundColor:
                    selected?.id_notification === n.id_notification ? "#FEF3C7" : "#FEF9C3", // activo vs normal
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FFFBEB")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    selected?.id_notification === n.id_notification ? "#FEF3C7" : "#FEF9C3")
                }
              >
                <div className="flex flex-col mb-2">
                  <p style={{ color: !n.is_read ? "#78350F" : "#A16207", fontWeight: 500 }}>
                    {n.title}
                  </p>
                  <span style={{ color: "#92400E", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                    {new Date(n.date).toLocaleString()}
                  </span>
                </div>
                {!n.is_read && (
                  <span
                    style={{
                      marginLeft: "0.5rem",
                      width: "0.75rem",
                      height: "0.75rem",
                      backgroundColor: "#EF4444",
                      borderRadius: "9999px",
                      marginTop: "0.25rem",
                      animation: "pulse 2s infinite",
                    }}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>

        

        {/* Panel derecho: detalle */}
        <div className=" p-6 overflow-y-auto flex flex-col">
          {selected ? (
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-zinc-900 mb-4">{selected.title}</h1>
              <p className="text-zinc-400 text-md mb-4">{new Date(selected.date).toLocaleString()}</p>
              <hr className="border-zinc-300 mb-4" />
              <div className="text-zinc-700 text-xl whitespace-pre-line text-base">{selected.content}</div>
            </div>
          ) : (
            <div className="absolute text-zinc-400 text-lg flex-1 flex items-center justify-center">
              Select a notification to view its details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
