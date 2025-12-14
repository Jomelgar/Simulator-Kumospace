import { useEffect, useState } from "react";
import {
  getNotificationUser,
  readNotification,
} from "../../api/notificationApi";
import { Bell, Clock, CheckCircle2, Circle, Sparkles } from "lucide-react";

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
    <div className="w-full min-h-screen bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-yellow-50/40 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Stats */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Bell className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h1 className="text-neutral-900 mb-0.5">
                    Notifications Center
                  </h1>
                  <p className="text-neutral-600">
                    Stay updated with your latest alerts
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center px-6 py-3 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl shadow-lg shadow-amber-500/30">
                <div className="text-2xl text-black">{unreadCount}</div>
                <div className="text-xs text-amber-50 mt-0.5">Unread</div>
              </div>
              <div className="text-center px-6 py-3 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl shadow-lg">
                <div className="text-2xl text-black">
                  {notifications.length}
                </div>
                <div className="text-xs text-neutral-300 mt-0.5">Total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Container - Always show two panels */}
        <div
          className="grid grid-cols-1 lg:grid-cols-5 gap-6"
          style={{ height: "calc(100vh - 280px)", minHeight: "500px" }}
        >
          {/* Left Panel: Notification List */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200 overflow-hidden flex flex-col shadow-xl">
            <div className="p-5 border-b border-neutral-200 bg-gradient-to-r from-amber-50 to-orange-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <h3 className="text-neutral-900">Inbox</h3>
                </div>
                <span className="text-xs px-3 py-1 bg-amber-100 rounded-full text-amber-700 border border-amber-200">
                  {notifications.length} messages
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mb-4">
                    <Bell className="w-10 h-10 text-amber-600" />
                  </div>
                  <p className="text-neutral-900 mb-1">All caught up!</p>
                  <p className="text-sm text-neutral-600 text-center">
                    No notifications yet
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
                          ? "bg-gradient-to-r from-amber-50 to-orange-50 shadow-lg border border-amber-200"
                          : n.is_read
                          ? "bg-white hover:shadow-md border border-neutral-100 hover:border-amber-200"
                          : "bg-amber-50/50 hover:bg-amber-50 border border-amber-200 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Status Indicator */}
                        <div className="flex-shrink-0 mt-1.5">
                          {n.is_read ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <div className="w-5 h-5 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-md">
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
                              <span className="text-xs px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full">
                                New
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Hover indicator */}
                      {selected?.id_notification === n.id_notification && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-gradient-to-b from-amber-400 to-orange-500 rounded-r-full" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Notification Detail */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-neutral-200 overflow-hidden flex flex-col shadow-xl">
            {selected ? (
              <>
                {/* Detail Header */}
                <div
                  className={`p-8 border-b ${
                    selected.is_read
                      ? "border-neutral-100 bg-neutral-50"
                      : "border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50"
                  }`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                        selected.is_read
                          ? "bg-neutral-100"
                          : "bg-gradient-to-br from-amber-400 to-orange-500"
                      }`}
                    >
                      <Bell
                        className={`w-7 h-7 ${
                          selected.is_read ? "text-neutral-600" : "text-white"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl text-neutral-900 mb-2">
                        {selected.title}
                      </h2>
                      <div className="flex items-center gap-3 text-sm text-neutral-600">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-amber-600" />
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
                          <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-4 h-4" />
                            Read
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full">
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
                  <div className="w-28 h-28 bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl flex items-center justify-center shadow-lg">
                    <Bell className="w-14 h-14 text-amber-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white">!</span>
                  </div>
                </div>
                <h3 className="text-neutral-900 mb-2">
                  No notification selected
                </h3>
                <p className="text-sm text-neutral-600 text-center max-w-sm mb-4">
                  Choose a notification from the inbox to view its full details
                  and content
                </p>
                <div className="flex items-center gap-2 text-xs px-4 py-2 bg-amber-100 text-amber-700 rounded-full border border-amber-200">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Select a message to get started</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
