import { useEffect, useState } from "react";
import {
  getNotificationUser,
  readNotification,
} from "../../api/notificationApi";
import { Bell, Clock, Mail, Circle, CheckCircle2 } from "lucide-react";

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
  const readCount = notifications.filter((n) => n.is_read).length;

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

  return (
    <div className="w-full min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Stats */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-neutral-900 mb-1">Notifications</h1>
              <p className="text-neutral-500">
                Stay updated with your latest alerts
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center px-6 py-3 bg-amber-50 rounded-xl border border-amber-100">
                <div className="text-2xl text-amber-600">{unreadCount}</div>
                <div className="text-xs text-neutral-600 mt-0.5">Unread</div>
              </div>
              <div className="text-center px-6 py-3 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="text-2xl text-neutral-900">
                  {notifications.length}
                </div>
                <div className="text-xs text-neutral-600 mt-0.5">Total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Container */}
        <div
          className="grid grid-cols-1 lg:grid-cols-5 gap-6"
          style={{ height: "calc(100vh - 280px)", minHeight: "500px" }}
        >
          {/* Left Panel: Notification List */}
          <div className="lg:col-span-2 bg-neutral-50 rounded-2xl border border-neutral-200 overflow-hidden flex flex-col">
            <div className="p-5 border-b border-neutral-200 bg-white">
              <div className="flex items-center justify-between">
                <h3 className="text-neutral-900">Inbox</h3>
                <span className="text-xs text-neutral-500">
                  {notifications.length} messages
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <Bell className="w-10 h-10 text-neutral-300" />
                  </div>
                  <p className="text-neutral-900 mb-1">All caught up!</p>
                  <p className="text-sm text-neutral-500 text-center">
                    You have no notifications at the moment
                  </p>
                </div>
              ) : (
                <div className="p-3 space-y-2">
                  {notifications.map((n) => (
                    <div
                      key={n.id_notification}
                      onClick={() => handleSelect(n)}
                      className={`cursor-pointer p-4 rounded-xl transition-all duration-200 relative group ${
                        selected?.id_notification === n.id_notification
                          ? "bg-white shadow-md border border-neutral-200 scale-[1.02]"
                          : "bg-white hover:shadow-sm border border-transparent hover:border-neutral-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Status Indicator */}
                        <div className="flex-shrink-0 mt-1.5">
                          {n.is_read ? (
                            <CheckCircle2 className="w-5 h-5 text-neutral-300" />
                          ) : (
                            <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                              <Circle className="w-2.5 h-2.5 text-white fill-white" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm mb-1.5 line-clamp-2 ${
                              n.is_read
                                ? "text-neutral-600"
                                : "text-neutral-900"
                            }`}
                          >
                            {n.title}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-neutral-400">
                              {formatRelativeTime(n.date)}
                            </span>
                            {!n.is_read && (
                              <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                                New
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Hover indicator */}
                      {selected?.id_notification === n.id_notification && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-amber-500 rounded-r-full" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Notification Detail */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-neutral-200 overflow-hidden flex flex-col">
            {selected ? (
              <>
                {/* Detail Header */}
                <div className="p-8 border-b border-neutral-100">
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                        selected.is_read ? "bg-neutral-100" : "bg-amber-50"
                      }`}
                    >
                      <Bell
                        className={`w-6 h-6 ${
                          selected.is_read
                            ? "text-neutral-400"
                            : "text-amber-600"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl text-neutral-900 mb-2">
                        {selected.title}
                      </h2>
                      <div className="flex items-center gap-3 text-sm text-neutral-500">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          <span>
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
                          <span className="flex items-center gap-1.5 text-emerald-600">
                            <CheckCircle2 className="w-4 h-4" />
                            Read
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-amber-600">
                            <Circle className="w-4 h-4 fill-current" />
                            Unread
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detail Content */}
                <div className="flex-1 overflow-y-auto p-8">
                  <div className="max-w-3xl">
                    <p className="text-neutral-700 whitespace-pre-line leading-relaxed">
                      {selected.content}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-12">
                <div className="relative mb-6">
                  <div className="w-24 h-24 bg-neutral-50 rounded-2xl flex items-center justify-center">
                    <Bell className="w-12 h-12 text-neutral-300" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">!</span>
                  </div>
                </div>
                <h3 className="text-neutral-900 mb-2">
                  No notification selected
                </h3>
                <p className="text-sm text-neutral-500 text-center max-w-sm">
                  Choose a notification from the inbox to view its full details
                  and content
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
