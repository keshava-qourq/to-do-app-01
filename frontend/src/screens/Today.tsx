// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

const TODAY_LABEL = "Wed 11 Nov";
const TODAY_ISO = "2026-11-11";
const USER_EMAIL = "mara.oyelaran@example.com";
const MAX_NAME = 100;

// doneAgo: how many days ago each completion happened (0 = today)
const SEED_HABITS = [
  { id: 101, name: "Drink water", doneAgo: [0, 1, 2, 3, 4, 7, 8], wf: "i-2-0-0" },
  { id: 102, name: "Read 20 pages", doneAgo: [1, 2, 3, 6], wf: "i-2-0-1" },
  { id: 103, name: "Go for a run", doneAgo: [3, 4], wf: "i-2-0-2" },
  { id: 104, name: "Stretch for ten minutes", doneAgo: [0, 1], wf: null },
  { id: 105, name: "Write three lines in the journal", doneAgo: [0, 2, 3, 4], wf: null },
];

function streakOf(doneAgo) {
  let day = doneAgo.includes(0) ? 0 : 1;
  let n = 0;
  while (doneAgo.includes(day)) {
    n += 1;
    day += 1;
  }
  return n;
}

export default function Screen() {
  const navigate = useNavigate();
  const [habits, setHabits] = React.useState(SEED_HABITS);
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [pendingDelete, setPendingDelete] = React.useState(null);
  const nextId = React.useRef(200);
  const inputRef = React.useRef(null);
  const cancelRef = React.useRef(null);
  const confirmRef = React.useRef(null);
  const returnFocusRef = React.useRef(null);

  const ink = brand.primaryColor;
  const paper = brand.backgroundColor;
  const accent = brand.accentColor;
  const quiet = brand.neutralColor;
  const border = `3px solid ${ink}`;
  const shadow = `6px 6px 0 ${ink}`;

  const doneCount = habits.filter((h) => h.doneAgo.includes(0)).length;

  React.useEffect(() => {
    if (pendingDelete && cancelRef.current) cancelRef.current.focus();
  }, [pendingDelete]);

  function toggle(id) {
    const h = habits.find((x) => x.id === id);
    if (!h) return;
    const wasDone = h.doneAgo.includes(0);
    const nextAgo = wasDone ? h.doneAgo.filter((d) => d !== 0) : [0, ...h.doneAgo];
    const s = streakOf(nextAgo);
    setHabits(habits.map((x) => (x.id === id ? { ...x, doneAgo: nextAgo } : x)));
    setStatus(
      wasDone
        ? `Undone: “${h.name}” is not done today. Streak is ${s} ${s === 1 ? "day" : "days"}.`
        : `Done: “${h.name}” is checked off for today. Streak is ${s} ${s === 1 ? "day" : "days"}.`
    );
  }

  function addHabit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("A name is required. Type what you want to do each day.");
      setStatus("");
      if (inputRef.current) inputRef.current.focus();
      return;
    }
    if (trimmed.length > MAX_NAME) {
      setError(`That name is too long. Keep it to ${MAX_NAME} characters or fewer.`);
      if (inputRef.current) inputRef.current.focus();
      return;
    }
    nextId.current += 1;
    setHabits([...habits, { id: nextId.current, name: trimmed, doneAgo: [], wf: null }]);
    setName("");
    setError("");
    setStatus(`Added “${trimmed}”. Streak starts at 0 days.`);
    if (inputRef.current) inputRef.current.focus();
  }

  function askDelete(h, el) {
    returnFocusRef.current = el;
    setPendingDelete(h);
  }

  function closeModal() {
    setPendingDelete(null);
    const el = returnFocusRef.current;
    if (el && document.body.contains(el)) el.focus();
  }

  function confirmDelete() {
    const h = pendingDelete;
    setHabits(habits.filter((x) => x.id !== h.id));
    setPendingDelete(null);
    setStatus(`Deleted “${h.name}”. Its completion records are permanently gone.`);
    if (inputRef.current) inputRef.current.focus();
  }

  function onModalKey(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      closeModal();
      return;
    }
    if (e.key === "Tab") {
      const first = cancelRef.current;
      const last = confirmRef.current;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  const label = {
    fontFamily: brand.fontBody,
    fontSize: 12,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    fontVariantNumeric: "tabular-nums",
  };

  const css = `
    .bs-root { font-family: ${brand.fontBody}; color: ${ink}; }
    .bs-root button, .bs-root input { font-family: inherit; }
    .bs-focus:focus-visible { outline: 3px solid ${accent}; outline-offset: 3px; }
    .bs-press { transition: transform 120ms ease, box-shadow 120ms ease, background-color 120ms ease; }
    .bs-press:hover { transform: translate(2px, 2px); box-shadow: 4px 4px 0 ${ink}; }
    .bs-press:active { transform: translate(6px, 6px); box-shadow: 0 0 0 ${ink}; }
    .bs-press:disabled { opacity: .5; cursor: not-allowed; }
    .bs-row:hover .bs-toggle { background-color: ${paper}; }
    .bs-del:hover { background-color: ${ink}; color: ${paper}; }
    .bs-del { transition: background-color 120ms ease, color 120ms ease; }
    @keyframes bs-in { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
    @keyframes bs-pop { from { opacity: 0; transform: translate(-6px,-6px); } to { opacity: 1; transform: none; } }
    .bs-enter { animation: bs-in 220ms ease both; }
    .bs-modal { animation: bs-pop 160ms ease both; }
    .bs-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
    @media (prefers-reduced-motion: reduce) {
      .bs-press, .bs-del { transition: none; }
      .bs-press:hover, .bs-press:active { transform: none; }
      .bs-enter, .bs-modal { animation: none; }
    }
  `;

  return (
    <div className="bs-root mx-auto w-full max-w-4xl px-4 py-8 md:px-8 md:py-12" style={{ backgroundColor: paper }}>
      <style>{css}</style>
      <div className="bs-sr" role="status" aria-live="polite">{status}</div>

      {/* Row 1: title + sign out */}
      <header className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-end" style={{ paddingBottom: 24, borderBottom: border }}>
        <div className="md:col-span-8" data-wf="b-0-0">
          <p style={{ ...label, color: quiet, marginBottom: 12 }}>No. 01 · Daily sheet · {TODAY_ISO}</p>
          <h1
            style={{
              fontFamily: brand.fontHeading,
              fontWeight: 700,
              fontSize: "clamp(40px, 8vw, 72px)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            Today · {TODAY_LABEL}
          </h1>
        </div>
        <div className="flex flex-col gap-3 md:col-span-4 md:items-end">
          <p style={{ ...label, color: quiet, overflowWrap: "anywhere" }}>Signed in · {USER_EMAIL}</p>
          <button
            type="button"
            data-wf="b-0-1"
            onClick={() => navigate("sign-in")}
            className="bs-press bs-focus w-full md:w-auto"
            style={{
              minHeight: 48,
              padding: "0 24px",
              border,
              backgroundColor: paper,
              color: ink,
              boxShadow: shadow,
              cursor: "pointer",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontSize: 13,
            }}
          >
            Sign out
          </button>
        </div>
      </header>

      <main>
        {/* Row 2: add a habit */}
        <section aria-labelledby="add-title" style={{ marginTop: 48 }}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-start">
            <form
              id="add-habit-form"
              onSubmit={addHabit}
              noValidate
              data-wf="b-1-0"
              className="md:col-span-9"
              style={{ border, boxShadow: shadow, padding: 24, backgroundColor: paper }}
            >
              <div className="flex items-baseline justify-between gap-4" style={{ marginBottom: 16 }}>
                <h2 id="add-title" style={{ fontFamily: brand.fontHeading, fontSize: 28, fontWeight: 700, lineHeight: 1.1 }}>
                  Add a habit
                </h2>
                <span style={{ ...label, color: quiet }}>01</span>
              </div>
              <label htmlFor="habit-name" style={{ ...label, display: "block", marginBottom: 8, color: ink, fontWeight: 700 }}>
                Habit name (max 100 characters)
              </label>
              <input
                id="habit-name"
                ref={inputRef}
                data-wf="i-1-0-0"
                type="text"
                value={name}
                maxLength={MAX_NAME}
                autoComplete="off"
                placeholder="e.g. Practice guitar"
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? "habit-name-error habit-name-count" : "habit-name-count"}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError("");
                }}
                className="bs-focus"
                style={{
                  width: "100%",
                  minHeight: 52,
                  padding: "0 16px",
                  fontSize: 16,
                  border,
                  borderRadius: 0,
                  backgroundColor: "transparent",
                  color: ink,
                }}
              />
              <div className="flex items-start justify-between gap-4" style={{ marginTop: 8 }}>
                <span id="habit-name-count" style={{ ...label, color: quiet, marginLeft: "auto", order: 2 }}>
                  {name.length}/{MAX_NAME}
                </span>
                <span style={{ ...label, color: quiet, textTransform: "none", letterSpacing: 0, fontSize: 13, order: 1 }}>
                  Press Enter to add. New habits start at a 0-day streak.
                </span>
              </div>
              {error && (
                <p
                  id="habit-name-error"
                  className="bs-enter flex items-start gap-2"
                  style={{ marginTop: 16, padding: "12px 16px", backgroundColor: ink, color: paper, fontSize: 14 }}
                >
                  <Icons.AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span>{error}</span>
                </p>
              )}
            </form>

            <div className="md:col-span-3">
              <button
                type="submit"
                form="add-habit-form"
                data-wf="b-1-1"
                className="bs-press bs-focus flex w-full items-center justify-center gap-2"
                style={{
                  minHeight: 56,
                  border,
                  backgroundColor: ink,
                  color: paper,
                  boxShadow: shadow,
                  cursor: "pointer",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: 14,
                }}
              >
                <Icons.Plus className="h-5 w-5" aria-hidden="true" />
                Add
              </button>
            </div>
          </div>
        </section>

        {/* Row 3 + 4: habit list */}
        <section aria-labelledby="list-title" data-wf="b-2-0" style={{ marginTop: 64 }}>
          <div className="flex items-end justify-between gap-4" style={{ borderBottom: `1px dashed ${ink}`, paddingBottom: 12, marginBottom: 24 }}>
            <div>
              <p style={{ ...label, color: quiet, marginBottom: 4 }}>02</p>
              <h2 id="list-title" style={{ fontFamily: brand.fontHeading, fontSize: 36, fontWeight: 700, lineHeight: 1.05 }}>
                My habits
              </h2>
            </div>
            <p style={{ ...label, fontWeight: 700, fontSize: 13 }}>
              {habits.length === 0 ? "0 habits" : `${doneCount} of ${habits.length} done`}
            </p>
          </div>

          {habits.length > 0 && (
            <ul className="flex flex-col" style={{ gap: 32, listStyle: "none", padding: 0, margin: 0 }}>
              {habits.map((h, idx) => {
                const done = h.doneAgo.includes(0);
                const s = streakOf(h.doneAgo);
                return (
                  <li
                    key={h.id}
                    className="bs-row bs-enter"
                    style={{ border, boxShadow: shadow, backgroundColor: paper }}
                  >
                    <button
                      type="button"
                      className="bs-toggle bs-focus flex w-full items-center gap-4 text-left"
                      data-wf={h.wf || undefined}
                      aria-pressed={done}
                      onClick={() => toggle(h.id)}
                      style={{
                        minHeight: 80,
                        padding: "16px 24px",
                        backgroundColor: paper,
                        color: ink,
                        cursor: "pointer",
                        border: 0,
                        transition: "background-color 120ms ease",
                      }}
                    >
                      <span
                        aria-hidden="true"
                        className="flex shrink-0 items-center justify-center"
                        style={{
                          width: 40,
                          height: 40,
                          border,
                          backgroundColor: done ? accent : "transparent",
                          color: paper,
                          transition: "background-color 120ms ease",
                        }}
                      >
                        {done && <Icons.Check className="h-6 w-6" />}
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                        <span className="min-w-0">
                          <span
                            style={{
                              display: "block",
                              fontSize: 18,
                              fontWeight: 700,
                              overflowWrap: "anywhere",
                              textDecoration: done ? "line-through" : "none",
                              textDecorationThickness: 2,
                            }}
                          >
                            {h.name}
                          </span>
                          <span aria-hidden="true" style={{ ...label, color: done ? accent : quiet, fontWeight: 700 }}>
                            {done ? "Done" : "Not done"}
                          </span>
                        </span>
                        <span
                          style={{ fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", fontSize: 14 }}
                        >
                          <span style={{ fontFamily: brand.fontHeading, fontSize: 32, fontWeight: 700, lineHeight: 1 }}>{s}</span>
                          -day streak
                        </span>
                      </span>
                    </button>
                    <button
                      type="button"
                      data-wf={idx === 0 ? "b-3-0" : undefined}
                      className="bs-del bs-focus flex w-full items-center justify-center gap-2"
                      onClick={(e) => askDelete(h, e.currentTarget)}
                      aria-label={`Delete habit: ${h.name}`}
                      style={{
                        minHeight: 48,
                        borderTop: `1px dashed ${ink}`,
                        borderLeft: 0,
                        borderRight: 0,
                        borderBottom: 0,
                        backgroundColor: "transparent",
                        color: ink,
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                      }}
                    >
                      <Icons.X className="h-4 w-4" aria-hidden="true" />
                      Delete habit
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Row 6: empty state */}
          {habits.length === 0 && (
            <div
              data-wf="b-5-0"
              className="bs-enter"
              style={{ border, borderStyle: "dashed", padding: "48px 24px", textAlign: "left" }}
            >
              <p style={{ ...label, color: quiet, marginBottom: 12 }}>Nothing on the sheet</p>
              <p style={{ fontFamily: brand.fontHeading, fontSize: 36, fontWeight: 700, lineHeight: 1.1, marginBottom: 12 }}>
                No habits yet.
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.6, maxWidth: "48ch" }}>
                Add your first habit above. Tap it once a day to check it off, and watch the streak grow.
              </p>
              <button
                type="button"
                className="bs-focus"
                onClick={() => inputRef.current && inputRef.current.focus()}
                style={{
                  marginTop: 24,
                  minHeight: 44,
                  padding: "0 4px",
                  border: 0,
                  background: "transparent",
                  color: accent,
                  fontWeight: 700,
                  textDecoration: "underline",
                  textUnderlineOffset: 4,
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                Go to the name field
              </button>
            </div>
          )}

          <p style={{ ...label, color: quiet, marginTop: 32, textTransform: "none", letterSpacing: 0, fontSize: 13, lineHeight: 1.6 }}>
            Only today can be changed. A streak counts the days in a row ending today, or yesterday until you tick today.
          </p>
        </section>
      </main>

      {/* Row 5: delete confirmation modal */}
      {pendingDelete && (
        <div
          data-wf="b-4-0"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onKeyDown={onModalKey}
        >
          <div
            aria-hidden="true"
            onClick={closeModal}
            className="absolute inset-0"
            style={{ backgroundColor: ink, opacity: 0.6 }}
          />
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="del-title"
            aria-describedby="del-desc"
            className="bs-modal relative w-full"
            style={{ maxWidth: 480, border, backgroundColor: paper, boxShadow: `8px 8px 0 ${ink}`, padding: 24 }}
          >
            <p style={{ ...label, color: quiet, marginBottom: 12 }}>Confirm · cannot be undone</p>
            <h2
              id="del-title"
              style={{ fontFamily: brand.fontHeading, fontSize: 30, fontWeight: 700, lineHeight: 1.15, overflowWrap: "anywhere" }}
            >
              Delete ‘{pendingDelete.name}’?
            </h2>
            <p id="del-desc" style={{ marginTop: 16, fontSize: 15, lineHeight: 1.6 }}>
              Its completion records will be permanently deleted.
            </p>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end" style={{ marginTop: 32 }}>
              <button
                type="button"
                ref={cancelRef}
                onClick={closeModal}
                className="bs-press bs-focus"
                style={{
                  minHeight: 48,
                  padding: "0 24px",
                  border,
                  backgroundColor: paper,
                  color: ink,
                  boxShadow: shadow,
                  cursor: "pointer",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: 13,
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                ref={confirmRef}
                onClick={confirmDelete}
                className="bs-press bs-focus flex items-center justify-center gap-2"
                style={{
                  minHeight: 48,
                  padding: "0 24px",
                  border,
                  backgroundColor: ink,
                  color: paper,
                  boxShadow: shadow,
                  cursor: "pointer",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: 13,
                }}
              >
                <Icons.Trash className="h-4 w-4" aria-hidden="true" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
