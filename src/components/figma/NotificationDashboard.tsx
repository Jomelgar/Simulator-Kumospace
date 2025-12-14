import { useEffect, useState } from "react";
import {
  getNotificationUser,
  readNotification,
} from "../../api/notificationApi";
import { Bell, Clock, CheckCircle2, Circle, Sparkles } from "lucide-react";
import "./Notification.css";

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
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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
            notif.id_notification === n.id_notification
              ? { ...notif, is_read: true }
              : notif
          )
        );
      } catch (error) {
        console.error("Error marking as read:", error);
      }
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getNotificationBg = (n: Notification) => {
    if (selected?.id_notification === n.id_notification) return "#FFFBEB";
    if (hoveredId === n.id_notification)
      return n.is_read ? "#FAFAFA" : "#FFFBEB";
    return n.is_read ? "#FFFFFF" : "#FFFEF5";
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#FAFAFA",
        padding: "2rem",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
        {/* Header with Stats */}
        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.5rem",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "0.5rem",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "3rem",
                    height: "3rem",
                    backgroundColor: "#F4C430",
                    borderRadius: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 10px 15px -3px rgba(234, 179, 8, 0.3)",
                  }}
                >
                  <Bell
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                      color: "white",
                    }}
                  />
                </div>
                <div>
                  <h1
                    style={{
                      fontSize: "1.875rem",
                      fontWeight: "700",
                      color: "#171717",
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    Notifications Center
                  </h1>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "400",
                      color: "#737373",
                      margin: 0,
                    }}
                  >
                    Stay updated with your latest alerts
                  </p>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  textAlign: "center",
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#F4C430",
                  borderRadius: "0.75rem",
                  boxShadow: "0 10px 15px -3px rgba(234, 179, 8, 0.3)",
                }}
              >
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: "white",
                  }}
                >
                  {unreadCount}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "500",
                    color: "rgba(255, 255, 255, 0.9)",
                    marginTop: "0.125rem",
                  }}
                >
                  Unread
                </div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  padding: "0.75rem 1.5rem",
                  background:
                    "linear-gradient(to bottom right, #262626, #171717)",
                  borderRadius: "0.75rem",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: "#F4C430",
                  }}
                >
                  {notifications.length}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "500",
                    color: "#D4D4D4",
                    marginTop: "0.125rem",
                  }}
                >
                  Total
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Container */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
            gap: "1.5rem",
            height: "calc(100vh - 280px)",
            minHeight: "500px",
          }}
        >
          <style>{`
            @media (min-width: 1024px) {
              .grid-container {
                grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
              }
              .left-panel {
                grid-column: span 2 / span 2 !important;
              }
              .right-panel {
                grid-column: span 3 / span 3 !important;
              }
            }
          `}</style>

          <div
            className="grid-container"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
              gap: "1.5rem",
              height: "100%",
            }}
          >
            {/* Left Panel: Notification List */}
            <div
              className="left-panel"
              style={{
                backgroundColor: "white",
                borderRadius: "1rem",
                border: "1px solid #E5E5E5",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div
                style={{
                  padding: "1.25rem",
                  borderBottom: "1px solid #FDE68A",
                  background: "#FFFBEB",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Sparkles
                      style={{
                        width: "1.25rem",
                        height: "1.25rem",
                        color: "#F4C430",
                      }}
                    />
                    <h3
                      style={{
                        fontSize: "1.125rem",
                        fontWeight: "600",
                        color: "#171717",
                        margin: 0,
                      }}
                    >
                      Inbox
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      padding: "0.25rem 0.75rem",
                      backgroundColor: "#F4C430",
                      borderRadius: "9999px",
                      color: "white",
                      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {notifications.length} messages
                  </span>
                </div>
              </div>

              <div style={{ flex: 1, overflowY: "auto" }}>
                {notifications.length === 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      padding: "2rem",
                    }}
                  >
                    <div
                      style={{
                        width: "5rem",
                        height: "5rem",
                        backgroundColor: "#FEF9C3",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "1rem",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <Bell
                        style={{
                          width: "2.5rem",
                          height: "2.5rem",
                          color: "#F4C430",
                        }}
                      />
                    </div>
                    <p
                      style={{
                        fontSize: "1.125rem",
                        fontWeight: "600",
                        color: "#171717",
                        marginBottom: "0.25rem",
                      }}
                    >
                      All caught up!
                    </p>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "400",
                        color: "#737373",
                        textAlign: "center",
                        margin: 0,
                      }}
                    >
                      No notifications yet
                    </p>
                  </div>
                ) : (
                  <div style={{ padding: "0.75rem" }}>
                    {notifications.map((n) => (
                      <div
                        key={n.id_notification}
                        onClick={() => handleSelect(n)}
                        onMouseEnter={() => setHoveredId(n.id_notification)}
                        onMouseLeave={() => setHoveredId(null)}
                        style={{
                          cursor: "pointer",
                          padding: "1rem",
                          borderRadius: "0.75rem",
                          transition: "all 0.2s",
                          position: "relative",
                          marginBottom: "0.5rem",
                          backgroundColor: getNotificationBg(n),
                          border:
                            selected?.id_notification === n.id_notification ||
                            !n.is_read
                              ? "1px solid #FDE68A"
                              : "1px solid #F5F5F5",
                          boxShadow:
                            selected?.id_notification === n.id_notification
                              ? "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                              : hoveredId === n.id_notification
                              ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                              : "none",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "0.75rem",
                          }}
                        >
                          <div style={{ flexShrink: 0, marginTop: "0.375rem" }}>
                            {n.is_read ? (
                              <CheckCircle2
                                style={{
                                  width: "1.25rem",
                                  height: "1.25rem",
                                  color: "#10B981",
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: "1.25rem",
                                  height: "1.25rem",
                                  backgroundColor: "#F4C430",
                                  borderRadius: "50%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  boxShadow:
                                    "0 4px 6px -1px rgba(234, 179, 8, 0.4)",
                                }}
                              >
                                <Circle
                                  style={{
                                    width: "0.625rem",
                                    height: "0.625rem",
                                    color: "white",
                                    fill: "white",
                                  }}
                                />
                              </div>
                            )}
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p
                              style={{
                                fontSize: "0.875rem",
                                fontWeight: "500",
                                marginBottom: "0.375rem",
                                lineHeight: 1.625,
                                color: n.is_read ? "#737373" : "#171717",
                                overflow: "hidden",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                margin: 0,
                                marginBottom: "0.375rem",
                              }}
                            >
                              {n.title}
                            </p>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "0.75rem",
                                  fontWeight: "400",
                                  color: "#A3A3A3",
                                }}
                              >
                                {formatRelativeTime(n.date)}
                              </span>
                              {!n.is_read && (
                                <span
                                  style={{
                                    fontSize: "0.75rem",
                                    fontWeight: "600",
                                    padding: "0.125rem 0.5rem",
                                    backgroundColor: "#F4C430",
                                    color: "white",
                                    borderRadius: "9999px",
                                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                                  }}
                                >
                                  New
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {selected?.id_notification === n.id_notification && (
                          <div
                            style={{
                              position: "absolute",
                              left: 0,
                              top: "50%",
                              transform: "translateY(-50%)",
                              width: "0.375rem",
                              height: "3rem",
                              backgroundColor: "#F4C430",
                              borderTopRightRadius: "9999px",
                              borderBottomRightRadius: "9999px",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel: Notification Detail */}
            <div
              className="right-panel"
              style={{
                backgroundColor: "white",
                borderRadius: "1rem",
                border: "1px solid #E5E5E5",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
            >
              {selected ? (
                <>
                  <div
                    style={{
                      padding: "2rem",
                      borderBottom: selected.is_read
                        ? "1px solid #F5F5F5"
                        : "1px solid #FDE68A",
                      background: selected.is_read ? "#FAFAFA" : "#FFFBEB",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "1rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <div
                        style={{
                          flexShrink: 0,
                          width: "3.5rem",
                          height: "3.5rem",
                          borderRadius: "1rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                          backgroundColor: selected.is_read
                            ? "#F5F5F5"
                            : "#F4C430",
                        }}
                      >
                        <Bell
                          style={{
                            width: "1.75rem",
                            height: "1.75rem",
                            color: selected.is_read ? "#737373" : "white",
                          }}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h2
                          style={{
                            fontSize: "1.5rem",
                            fontWeight: "700",
                            color: "#171717",
                            marginBottom: "0.5rem",
                            lineHeight: 1.33,
                            margin: 0,
                            marginBottom: "0.5rem",
                          }}
                        >
                          {selected.title}
                        </h2>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            fontSize: "0.875rem",
                            fontWeight: "400",
                            color: "#737373",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.375rem",
                            }}
                          >
                            <Clock
                              style={{
                                width: "1rem",
                                height: "1rem",
                                color: "#F4C430",
                              }}
                            />
                            <span style={{ fontWeight: "400" }}>
                              {new Date(selected.date).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                          {selected.is_read ? (
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.375rem",
                                padding: "0.25rem 0.75rem",
                                backgroundColor: "#D1FAE5",
                                color: "#047857",
                                borderRadius: "9999px",
                                border: "1px solid #A7F3D0",
                                fontSize: "0.75rem",
                                fontWeight: "600",
                              }}
                            >
                              <CheckCircle2
                                style={{ width: "1rem", height: "1rem" }}
                              />
                              Read
                            </span>
                          ) : (
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.375rem",
                                padding: "0.25rem 0.75rem",
                                backgroundColor: "#F4C430",
                                color: "white",
                                borderRadius: "9999px",
                                boxShadow:
                                  "0 4px 6px -1px rgba(234, 179, 8, 0.4)",
                                fontSize: "0.75rem",
                                fontWeight: "600",
                              }}
                            >
                              <Circle
                                style={{
                                  width: "1rem",
                                  height: "1rem",
                                  fill: "currentColor",
                                }}
                              />
                              Unread
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ flex: 1, overflowY: "auto", padding: "2rem" }}>
                    <div style={{ maxWidth: "48rem" }}>
                      <p
                        style={{
                          fontSize: "1rem",
                          fontWeight: "400",
                          color: "#404040",
                          whiteSpace: "pre-line",
                          lineHeight: 1.625,
                          margin: 0,
                        }}
                      >
                        {selected.content}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    padding: "3rem",
                  }}
                >
                  <div style={{ position: "relative", marginBottom: "1.5rem" }}>
                    <div
                      style={{
                        width: "7rem",
                        height: "7rem",
                        backgroundColor: "#FEF9C3",
                        borderRadius: "1.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <Bell
                        style={{
                          width: "3.5rem",
                          height: "3.5rem",
                          color: "#F4C430",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: "-0.5rem",
                        right: "-0.5rem",
                        width: "2.5rem",
                        height: "2.5rem",
                        backgroundColor: "#F4C430",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <span
                        style={{
                          color: "white",
                          fontWeight: "700",
                          fontSize: "1.125rem",
                        }}
                      >
                        !
                      </span>
                    </div>
                  </div>
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "700",
                      color: "#171717",
                      marginBottom: "0.5rem",
                      margin: 0,
                      marginBottom: "0.5rem",
                    }}
                  >
                    No notification selected
                  </h3>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "400",
                      color: "#737373",
                      textAlign: "center",
                      maxWidth: "24rem",
                      marginBottom: "1rem",
                      lineHeight: 1.625,
                      margin: 0,
                      marginBottom: "1rem",
                    }}
                  >
                    Choose a notification from the inbox to view its full
                    details and content
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      padding: "0.5rem 1rem",
                      backgroundColor: "#FEF9C3",
                      color: "#A16207",
                      borderRadius: "9999px",
                      border: "1px solid #FDE68A",
                    }}
                  >
                    <Sparkles
                      style={{ width: "0.875rem", height: "0.875rem" }}
                    />
                    <span>Select a message to get started</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
