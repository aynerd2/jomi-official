"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import {
  ArrowUp,
  BellRing,
  CalendarPlus,
  CheckCircle2,
  Globe,
  Headphones,
  ListChecks,
  Loader2,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";

import {
  LANGUAGES,
  ShepherdApiError,
  getCalendarLinks,
  type CalendarLinks,
  type Message,
  type ShepherdState,
} from "./useShepherd";

const STARTERS = [
  "What has he said about prayer?",
  "Teach me about the finished works of Christ",
];

type Props = {
  shepherd: ShepherdState;
  onClose: () => void;
};

export default function ShepherdChatPanel({ shepherd, onClose }: Props) {
  const { status, messages, typing, busy, language } = shepherd;
  const [draft, setDraft] = useState("");
  const [planMode, setPlanMode] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep the newest message in view. Replies can be long, so a new answer is
  // scrolled to its first line rather than its last.
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const last = messages[messages.length - 1];
    const bubbles = el.querySelectorAll<HTMLElement>("[data-msg]");
    const lastEl = bubbles[bubbles.length - 1];
    if (last?.role === "assistant" && !typing && lastEl && messages.length > 1) {
      // The list is `relative`, so offsetTop is measured from its top.
      el.scrollTop = lastEl.offsetTop - 12;
    } else {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, typing, status, showLanguages]);

  // The input is disabled while a request is in flight, which drops focus;
  // hand it back once the reply lands so the visitor can keep typing.
  useEffect(() => {
    if (busy) return;
    if (status === "ready" || status === "unregistered") inputRef.current?.focus();
  }, [status, planMode, busy]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || busy) return;
    if (status === "unregistered") {
      void shepherd.register(text);
    } else {
      void shepherd.send(planMode ? `/plan ${text}` : text);
      setPlanMode(false);
    }
    setDraft("");
  };

  const showStarters =
    status === "ready" && !messages.some((m) => m.role === "user") && !typing;
  const inputDisabled = busy || (status !== "ready" && status !== "unregistered");

  return (
    <div
      role="dialog"
      aria-label="Chat with Shepherd"
      className="flex h-full flex-col overflow-hidden bg-white sm:rounded-2xl sm:border sm:border-ink-100 sm:shadow-lift"
    >
      {/* Header */}
      <div className="flex items-center gap-3 bg-navy-900 px-4 py-3.5 text-white">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500 font-display text-lg font-semibold text-navy-900">
          S
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[1.0625rem] font-semibold leading-tight">
            Shepherd
          </p>
          <p className="truncate text-caption text-navy-200">
            From Apostle Jide Ojo&rsquo;s sermons
          </p>
        </div>
        {status === "ready" && (
          <button
            type="button"
            onClick={() => setShowLanguages((v) => !v)}
            aria-expanded={showLanguages}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-caption text-navy-100 transition-colors hover:bg-white/10"
          >
            <Globe className="h-4 w-4" />
            <span className="max-w-[6rem] truncate">{language}</span>
          </button>
        )}
        <button
          type="button"
          onClick={shepherd.toggleSound}
          aria-pressed={!shepherd.soundEnabled}
          aria-label={shepherd.soundEnabled ? "Mute sounds" : "Unmute sounds"}
          title={shepherd.soundEnabled ? "Mute sounds" : "Unmute sounds"}
          className="rounded-full p-1.5 text-navy-100 transition-colors hover:bg-white/10"
        >
          {shepherd.soundEnabled ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="rounded-full p-1.5 text-navy-100 transition-colors hover:bg-white/10"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {showLanguages && (
        <div className="border-b border-ink-100 bg-surface-muted px-4 py-3">
          <p className="eyebrow mb-2">Reply language</p>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                type="button"
                disabled={busy}
                onClick={() => {
                  setShowLanguages(false);
                  if (lang !== language) void shepherd.changeLanguage(lang);
                }}
                className={`rounded-full border px-3 py-1.5 text-caption font-medium transition-colors disabled:opacity-60 ${
                  lang === language
                    ? "border-navy-900 bg-navy-900 text-white"
                    : "border-ink-200 bg-white text-navy-900 hover:border-gold-500"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div
        ref={listRef}
        aria-live="polite"
        className="scrollbar-brand relative flex-1 space-y-3 overflow-y-auto bg-surface-muted px-4 py-5"
      >
        {messages.map((m) => (
          <Bubble key={m.id} message={m} />
        ))}

        {status === "loading" && <TypingDots label="Connecting to Shepherd" />}
        {typing && <TypingDots label="Shepherd is typing" />}

        {status === "unregistered" && (
          <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-white px-4 py-3 text-body-sm text-ink-800 shadow-card">
            Before we start, what&rsquo;s your name?
          </div>
        )}

        {status === "offline" && (
          <div className="rounded-2xl border border-red-200 bg-white px-4 py-3 text-body-sm text-ink-700">
            <p>Shepherd isn&rsquo;t reachable right now.</p>
            <button
              type="button"
              onClick={shepherd.retry}
              className="mt-2 inline-flex items-center gap-1.5 font-medium text-gold-700 hover:text-gold-600"
            >
              <RotateCcw className="h-4 w-4" /> Try again
            </button>
          </div>
        )}

        {showStarters && (
          <div className="flex flex-wrap gap-2 pt-1">
            {STARTERS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => void shepherd.send(s)}
                className="rounded-full border border-gold-200 bg-white px-3.5 py-2 text-left text-caption text-navy-900 transition-colors hover:border-gold-500 hover:bg-gold-50"
              >
                {s}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPlanMode(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-gold-200 bg-white px-3.5 py-2 text-caption text-navy-900 transition-colors hover:border-gold-500 hover:bg-gold-50"
            >
              <ListChecks className="h-4 w-4 text-gold-600" /> Get an action plan
            </button>
            <button
              type="button"
              onClick={() => setShowLanguages(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-gold-200 bg-white px-3.5 py-2 text-caption text-navy-900 transition-colors hover:border-gold-500 hover:bg-gold-50"
            >
              <Globe className="h-4 w-4 text-gold-600" /> Change language
            </button>
          </div>
        )}
      </div>

      {/* Composer */}
      <form onSubmit={onSubmit} className="border-t border-ink-100 bg-white px-3 pb-3 pt-2.5">
        {planMode && (
          <div className="mb-2 flex items-center justify-between rounded-lg bg-gold-50 px-3 py-1.5 text-caption text-gold-800">
            <span className="inline-flex items-center gap-1.5">
              <ListChecks className="h-4 w-4" /> Action plan: type a topic
            </span>
            <button
              type="button"
              onClick={() => setPlanMode(false)}
              aria-label="Cancel action plan"
              className="rounded p-0.5 hover:bg-gold-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <label htmlFor="shepherd-input" className="sr-only">
            {status === "unregistered" ? "Your name" : "Message Shepherd"}
          </label>
          <input
            ref={inputRef}
            id="shepherd-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            disabled={inputDisabled}
            autoComplete={status === "unregistered" ? "given-name" : "off"}
            maxLength={status === "unregistered" ? 60 : 1000}
            placeholder={
              status === "unregistered"
                ? "Your first name"
                : planMode
                  ? "e.g. prayer, faith, finances"
                  : "Ask about a sermon or topic…"
            }
            // 16px on mobile stops iOS zooming into the field.
            className="min-w-0 flex-1 rounded-full border border-ink-200 bg-white px-4 py-2.5 text-base text-ink-800 placeholder-ink-400 transition-colors focus:border-gold-500 focus:outline-none disabled:bg-ink-50 sm:text-body-sm"
          />
          <button
            type="submit"
            disabled={inputDisabled || !draft.trim()}
            aria-label={status === "unregistered" ? "Continue" : "Send"}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-500 text-navy-900 transition-colors hover:bg-gold-400 disabled:opacity-50"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}

function Bubble({ message }: { message: Message }) {
  if (message.role === "user") {
    return (
      <div data-msg className="flex justify-end">
        <div className="max-w-[85%] whitespace-pre-line break-words rounded-2xl rounded-br-md bg-navy-900 px-4 py-2.5 text-body-sm text-white">
          {message.content.replace(/^\/plan\s+/i, "Action plan: ")}
        </div>
      </div>
    );
  }

  const isError = message.type === "error";
  return (
    <div data-msg className="flex justify-start">
      <div
        className={`max-w-[85%] break-words rounded-2xl rounded-bl-md px-4 py-3 text-body-sm shadow-card ${
          isError ? "border border-red-200 bg-white text-red-700" : "bg-white text-ink-800"
        }`}
      >
        {message.type === "action_plan" ? (
          <>
            <ActionPlan text={message.content} />
            <DailyReminder topic={message.topic} plan={message.content} />
          </>
        ) : (
          <p className="whitespace-pre-line">{stripMarkdown(message.content)}</p>
        )}

        {message.references && message.references.length > 0 && (
          <ul className="mt-3 space-y-1.5 border-t border-ink-100 pt-2.5">
            {message.references.map((ref, i) => (
              <li key={`${ref.link}-${i}`}>
                <a
                  href={ref.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-1.5 text-caption font-medium text-gold-700 hover:text-gold-600 hover:underline"
                >
                  <Headphones className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>Listen to {ref.title}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// Lines that look like list items ("1.", "-", "•", "*", "☐") become checklist
// rows; anything else stays as a paragraph.
const LIST_ITEM = /^\s*(?:\d+[.)]|[-•*☐✅]|\[\s?\])\s+/;

function ActionPlan({ text }: { text: string }) {
  const lines = stripMarkdown(text)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <div className="space-y-2">
      <p className="eyebrow flex items-center gap-1.5">
        <ListChecks className="h-3.5 w-3.5" /> Action plan
      </p>
      {lines.map((line, i) =>
        LIST_ITEM.test(line) ? (
          <div key={i} className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
            <span>{line.replace(LIST_ITEM, "")}</span>
          </div>
        ) : (
          <p key={i}>{line}</p>
        ),
      )}
    </div>
  );
}

// The first day must come from the visitor's own calendar. toISOString() is
// UTC and gives the wrong day for evening visitors east or west of it.
function tomorrowLocal(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Checklist rows, without their markers. "|" separates steps on the wire, so
// it can't appear inside one.
function planSteps(text: string) {
  return stripMarkdown(text)
    .split("\n")
    .filter((l) => LIST_ITEM.test(l))
    .map((l) => l.replace(LIST_ITEM, "").replace(/\|/g, " ").replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, 6);
}

type ReminderState =
  | { step: "closed" }
  | { step: "picking"; error?: "invalid" | "network" }
  | { step: "loading" }
  | { step: "done"; links: CalendarLinks; time: string };

// A daily reminder via the visitor's own calendar: the site can't message them
// or set an alarm, but a repeating calendar event alerts them every day.
function DailyReminder({ topic, plan }: { topic?: string; plan: string }) {
  const [state, setState] = useState<ReminderState>({ step: "closed" });
  const [time, setTime] = useState("08:00");
  const boxRef = useRef<HTMLDivElement>(null);
  const inputId = useId();

  // The picker opens at the bottom of a long bubble; bring it into view.
  useEffect(() => {
    if (state.step !== "closed") boxRef.current?.scrollIntoView({ block: "nearest" });
  }, [state.step]);

  const submit = async (e?: FormEvent) => {
    e?.preventDefault();
    const match = /^(\d{1,2}):(\d{2})/.exec(time);
    const hour = match ? Number(match[1]) : NaN;
    const minute = match ? Number(match[2]) : NaN;
    if (!(hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59)) {
      setState({ step: "picking", error: "invalid" });
      return;
    }
    setState({ step: "loading" });
    try {
      const links = await getCalendarLinks({
        topic: topic?.trim() || "Action plan",
        hour,
        minute,
        steps: planSteps(plan),
        start: tomorrowLocal(),
      });
      const pad = (n: number) => String(n).padStart(2, "0");
      setState({ step: "done", links, time: `${pad(hour)}:${pad(minute)}` });
    } catch (err) {
      const invalid = err instanceof ShepherdApiError && err.status === 422;
      setState({ step: "picking", error: invalid ? "invalid" : "network" });
    }
  };

  if (state.step === "closed") {
    return (
      <button
        type="button"
        onClick={() => setState({ step: "picking" })}
        className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-gold-200 bg-white px-3.5 py-2 text-caption font-medium text-navy-900 transition-colors hover:border-gold-500 hover:bg-gold-50"
      >
        <BellRing className="h-4 w-4 text-gold-600" /> Remind me daily
      </button>
    );
  }

  if (state.step === "done") {
    return (
      <div ref={boxRef} className="mt-3 space-y-2 border-t border-ink-100 pt-3">
        <a
          href={state.links.googleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 rounded-full bg-navy-900 px-3.5 py-2 text-caption font-medium text-white transition-colors hover:bg-navy-800"
        >
          <CalendarPlus className="h-4 w-4 text-gold-400" /> Add to Google Calendar
        </a>
        {/* No `download`: plain navigation is what brings up iOS's
            "Add to Calendar" sheet; Android downloads and opens it. */}
        <a
          href={state.links.icsUrl}
          className="flex items-center justify-center gap-1.5 rounded-full border border-gold-200 bg-white px-3.5 py-2 text-caption font-medium text-navy-900 transition-colors hover:border-gold-500 hover:bg-gold-50"
        >
          <CalendarPlus className="h-4 w-4 text-gold-600" /> Add to Apple, Outlook or other
          calendar
        </a>
        <p className="text-caption text-ink-500">
          Your calendar will remind you daily at {state.time} for the next 30 days.
        </p>
      </div>
    );
  }

  const loading = state.step === "loading";
  const error = state.step === "picking" ? state.error : undefined;
  return (
    <div ref={boxRef} className="mt-3 border-t border-ink-100 pt-3">
      <form onSubmit={submit} className="space-y-2">
        <label htmlFor={inputId} className="eyebrow block">
          Remind me daily at
        </label>
        <div className="flex items-center gap-2">
          <input
            id={inputId}
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            disabled={loading}
            required
            // 16px on mobile stops iOS zooming into the field.
            className="min-w-0 flex-1 rounded-full border border-ink-200 bg-white px-3.5 py-2 text-base text-ink-800 transition-colors focus:border-gold-500 focus:outline-none disabled:bg-ink-50 sm:text-body-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gold-500 px-3.5 py-2 text-caption font-medium text-navy-900 transition-colors hover:bg-gold-400 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 motion-safe:animate-spin" />}
            {loading ? "Setting…" : "Set reminder"}
          </button>
        </div>
        {error === "invalid" && (
          <p role="alert" className="text-caption text-red-700">
            Please choose a valid time.
          </p>
        )}
        {error === "network" && (
          <div role="alert" className="text-caption text-red-700">
            <p>Something went wrong, try again.</p>
            <button
              type="button"
              onClick={() => void submit()}
              className="mt-1 inline-flex items-center gap-1.5 font-medium text-gold-700 hover:text-gold-600"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Try again
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

// The backend writes for Telegram, which renders *bold* and _italic_. We show
// plain text, so drop the markers rather than print them.
function stripMarkdown(text: string) {
  return text
    .replace(/\*\*([^*\n]+)\*\*/g, "$1")
    .replace(/(^|\s)\*(\S[^*\n]*?)\*(?=\s|$|[.,;:!?])/g, "$1$2")
    .replace(/(^|\s)_(\S[^_\n]*?)_(?=\s|$|[.,;:!?])/g, "$1$2");
}

function TypingDots({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-caption text-ink-500" role="status">
      <span className="flex gap-1 rounded-2xl rounded-bl-md bg-white px-3.5 py-3 shadow-card">
        {[0, 150, 300].map((d) => (
          <span
            key={d}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold-500"
            style={{ animationDelay: `${d}ms` }}
          />
        ))}
      </span>
      {label}…
    </div>
  );
}
