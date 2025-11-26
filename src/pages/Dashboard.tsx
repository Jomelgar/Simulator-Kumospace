// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { UserProfile } from "../components/figma/UserProfile";
import { VirtualOfficeView } from "../components/figma/VirtualOfficeView";

export default function Dashboard() {
  const [currentView, setCurrentView] = useState<"profile" | "office">("profile");
  const [currentSpaceId, setCurrentSpaceId] = useState<string | null>(null);

  // If the URL has ?space=xyz, go directly to the office view
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const space = params.get("space");
    if (space) {
      setCurrentSpaceId(space);
      setCurrentView("office");
    }
  }, []);

  const handleJoinSpace = (spaceId: string) => {
    setCurrentSpaceId(spaceId);
    setCurrentView("office");

    const url = new URL(window.location.href);
    url.searchParams.set("space", spaceId);
    window.history.pushState({}, "", url.toString());
  };

  const handleBackToProfile = () => {
    setCurrentView("profile");
    setCurrentSpaceId(null);

    const url = new URL(window.location.href);
    url.searchParams.delete("space");
    window.history.pushState({}, "", url.toString());
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {currentView === "profile" ? (
        <UserProfile onJoinSpace={handleJoinSpace} />
      ) : (
        <VirtualOfficeView
          onBackToProfile={handleBackToProfile}
          spaceId={currentSpaceId}
        />
      )}
    </div>
  );
}
