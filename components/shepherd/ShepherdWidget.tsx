"use client";

import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";

import ShepherdChatPanel from "./ShepherdChatPanel";
import { useShepherd } from "./useShepherd";

const OPENED_KEY = "shepherd_widget_opened";

// Floating launcher + chat panel for Shepherd, the sermon-grounded assistant.
// Full-screen sheet on phones, a docked card from `sm` up.
export default function ShepherdWidget() {
  const shepherd = useShepherd();
  const [open, setOpen] = useState(false);
  // Off until mounted, so the server render never pulses for returning visitors.
  const [shouldPulse, setShouldPulse] = useState(false);
  const { ready, start } = shepherd;

  useEffect(() => {
    try {
      setShouldPulse(localStorage.getItem(OPENED_KEY) !== "true");
    } catch {
      // Storage blocked: draw attention this visit, stop once opened.
      setShouldPulse(true);
    }
  }, []);

  // The first open ends the pulse for good.
  useEffect(() => {
    if (!open) return;
    setShouldPulse(false);
    try {
      localStorage.setItem(OPENED_KEY, "true");
    } catch {
      // Not persisted; it will pulse again next visit.
    }
  }, [open]);

  // First open triggers the /user check; later opens keep the conversation.
  useEffect(() => {
    if (open && ready) void start();
  }, [open, ready, start]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-[60] sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[min(640px,calc(100dvh-8rem))] sm:w-[400px]">
          <ShepherdChatPanel shepherd={shepherd} onClose={() => setOpen(false)} />
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close Shepherd chat" : "Ask Shepherd"}
        aria-expanded={open}
        className={`fixed bottom-5 right-5 z-[60] items-center gap-2 rounded-full bg-navy-900 py-3.5 pl-4 pr-5 text-body-sm font-medium text-white shadow-lift transition-all duration-200 hover:-translate-y-0.5 hover:bg-navy-800 sm:bottom-6 sm:right-6 ${
          open ? "hidden sm:flex sm:pr-4" : "flex"
        } ${shouldPulse ? "shepherd-launcher-pulse" : ""}`}
      >
        {open ? (
          <X className="h-5 w-5" />
        ) : (
          <>
            <MessageCircle className="h-5 w-5 text-gold-400" />
            Ask Shepherd
          </>
        )}
      </button>
    </>
  );
}
