"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// The Shepherd backend lives outside this app. Override per environment with
// NEXT_PUBLIC_SHEPHERD_API_URL; the default is the live Render service.
const API_URL = (
  process.env.NEXT_PUBLIC_SHEPHERD_API_URL ??
  "https://shepherd-backend-0sja.onrender.com"
).replace(/\/$/, "");

const USER_ID_KEY = "shepherd_user_id";

export const LANGUAGES = [
  "English",
  "Yoruba",
  "Igbo",
  "Hausa",
  "French",
  "Nigerian Pidgin",
] as const;

export type Language = (typeof LANGUAGES)[number];

export type Reference = { title: string; link: string };

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  type?: "answer" | "action_plan" | "error" | "welcome";
  references?: Reference[];
};

type ChatResponse = {
  reply: string;
  type?: string;
  references?: Reference[];
};

type UserResponse =
  | { registered: false }
  | { registered: true; name: string; language?: string };

// "loading" until /user answers; "unregistered" shows the name prompt.
export type Status = "idle" | "loading" | "unregistered" | "ready" | "offline";

const WELCOME =
  "Hi, I'm Shepherd 👋 I share Apostle Jide Ojo's teaching from his sermons — ask me anything, or tap below to get started.";

function getOrCreateUserId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = localStorage.getItem(USER_ID_KEY);
    if (!id) {
      id = "web_" + crypto.randomUUID();
      localStorage.setItem(USER_ID_KEY, id);
    }
    return id;
  } catch {
    // Storage blocked (private mode, strict settings): fall back to a
    // per-tab id so the widget still works for this visit.
    return "web_" + crypto.randomUUID();
  }
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) throw new Error(`Shepherd ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

// The backend writes for Telegram, so `reply` carries "🎧 Listen: <url>" inline.
// Pull those out of the text; the structured `references` array is what we
// render as links. A URL with no matching reference is kept as one, untitled,
// so a link is never silently lost.
const LISTEN_LINK = /[ \t]*🎧[^\n]*?(https?:\/\/\S+)[^\S\n]*/g;

function splitReply(reply: string, references: Reference[] = []) {
  const refs = references.filter((r) => r?.link);
  const known = new Set(refs.map((r) => r.link));
  const text = reply
    .replace(LISTEN_LINK, (_, url: string) => {
      if (!known.has(url)) {
        known.add(url);
        refs.push({ title: "this message", link: url });
      }
      return "";
    })
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return { text, references: refs };
}

const SOUND_KEY = "shepherd_sound";
const RECEIVED_SOUND = "/sounds/message-received.wav";

function readSoundPref(): boolean {
  try {
    return localStorage.getItem(SOUND_KEY) !== "off";
  } catch {
    return true;
  }
}

let counter = 0;
const nextId = () => `m${Date.now()}_${counter++}`;

export function useShepherd() {
  const [userId, setUserId] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [name, setName] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>("English");
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [busy, setBusy] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const started = useRef(false);
  const soundOn = useRef(true);

  // Read or mint the visitor id on the client only, never during render.
  useEffect(() => {
    setUserId(getOrCreateUserId());
    const pref = readSoundPref();
    soundOn.current = pref;
    setSoundEnabled(pref);
  }, []);

  const toggleSound = useCallback(() => {
    const next = !soundOn.current;
    soundOn.current = next;
    setSoundEnabled(next);
    try {
      localStorage.setItem(SOUND_KEY, next ? "on" : "off");
    } catch {
      // Not persisted; the toggle still holds for this visit.
    }
  }, []);

  // Replies arrive after a user action (opening the panel, sending), so
  // browsers allow playback; if one refuses anyway, stay silent.
  const playReceived = useCallback(() => {
    if (!soundOn.current) return;
    const audio = new Audio(RECEIVED_SOUND);
    audio.volume = 0.4;
    audio.play().catch(() => {});
  }, []);

  const append = useCallback((m: Omit<Message, "id">) => {
    setMessages((prev) => [...prev, { ...m, id: nextId() }]);
  }, []);

  const appendError = useCallback(
    () =>
      append({
        role: "assistant",
        type: "error",
        content: "Something went wrong, try again.",
      }),
    [append],
  );

  // Called the first time the panel opens.
  const start = useCallback(async () => {
    if (!userId || started.current) return;
    started.current = true;
    setStatus("loading");
    setMessages([{ id: nextId(), role: "assistant", type: "welcome", content: WELCOME }]);
    try {
      const user = await api<UserResponse>(`/user/${encodeURIComponent(userId)}`);
      if (user.registered) {
        setName(user.name);
        if (user.language) setLanguage(user.language);
        setStatus("ready");
      } else {
        setStatus("unregistered");
      }
    } catch {
      // Let them retry by reopening or tapping retry.
      started.current = false;
      setStatus("offline");
    }
  }, [userId]);

  const retry = useCallback(() => {
    started.current = false;
    setMessages([]);
    void start();
  }, [start]);

  const register = useCallback(
    async (rawName: string) => {
      const trimmed = rawName.trim();
      if (!trimmed || busy) return;
      setBusy(true);
      try {
        await api("/register", {
          method: "POST",
          body: JSON.stringify({ user_id: userId, name: trimmed }),
        });
        setName(trimmed);
        setStatus("ready");
        append({
          role: "assistant",
          type: "answer",
          content: `Lovely to meet you, ${trimmed}. What would you like to know?`,
        });
      } catch {
        appendError();
      } finally {
        setBusy(false);
      }
    },
    [userId, busy, append, appendError],
  );

  const send = useCallback(
    async (text: string) => {
      const message = text.trim();
      if (!message || busy) return;
      append({ role: "user", content: message });
      setBusy(true);
      setTyping(true);
      try {
        const res = await api<ChatResponse>("/chat", {
          method: "POST",
          body: JSON.stringify({ user_id: userId, message, want_audio: false }),
        });
        const { text, references } = splitReply(res.reply, res.references);
        append({
          role: "assistant",
          type: res.type === "action_plan" ? "action_plan" : "answer",
          content: text,
          references,
        });
        playReceived();
      } catch {
        appendError();
      } finally {
        setTyping(false);
        setBusy(false);
      }
    },
    [userId, busy, append, appendError, playReceived],
  );

  const changeLanguage = useCallback(
    async (lang: Language) => {
      if (busy) return;
      setBusy(true);
      try {
        await api("/set_language", {
          method: "POST",
          body: JSON.stringify({ user_id: userId, language: lang }),
        });
        setLanguage(lang);
        append({
          role: "assistant",
          type: "answer",
          content: `Language set to ${lang}.`,
        });
      } catch {
        appendError();
      } finally {
        setBusy(false);
      }
    },
    [userId, busy, append, appendError],
  );

  return {
    ready: userId !== "",
    status,
    name,
    language,
    messages,
    typing,
    busy,
    start,
    retry,
    register,
    send,
    changeLanguage,
    soundEnabled,
    toggleSound,
  };
}

export type ShepherdState = ReturnType<typeof useShepherd>;
