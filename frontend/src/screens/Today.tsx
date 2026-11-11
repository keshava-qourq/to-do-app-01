// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.

import React from "react";
import { useNavigate } from "@/lib/navigate";

import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { apiFetch } from "@/lib/api";
import { signOut, useCurrentUser } from "@/lib/auth";

const MAX_NAME = 100;

function localToday() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  const iso = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  const label = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })
    .format(d)
    .replace(",", "");
  return { iso, label };
}

export default function Screen() {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const { iso, label: todayLabel } = localToday();
  const [habits, setHabits] = React.useState(null);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    let live = true;
    apiFetch("/habits")
      .then((r) => live && setHabits(r))
      .catch(() => live && setFailed(true));
    return () => {
      live = false;
    };
  }, []);

  const [name, setName] = React.useState("");
  const [nameError, setNameError] = React.useState("");
  const [adding, setAdding] = React.useState(false);
  const [pending, setPending] = React.useState({});
  const [confirmId, setConfirmId] = React.useState(null);
  const [rowError, setRowError] = React.useState("");
  const busy = React.useRef(new Set());

  function onAdd(e) {
    e.preventDefault();
    if (adding) return;
    const n = name.trim();
    if (!n) {
      setNameError("Habit name is required.");
      return;
    }
    if (n.length > MAX_NAME) {
      setNameError(`Habit name must be at most ${MAX_NAME} characters.`);
      return;
    }
    setNameError("");
    setAdding(true);
    apiFetch("/habits", { method: "POST", body: JSON.stringify({ name: n }) })
      .then((h) => {
        setHabits((p) => [...(p || []), h]);
        setName("");
      })
      .catch((err) => {
        const d = err && err.body && err.body.detail;
        const f = Array.isArray(d) && d.find((x) => x.loc && x.loc[1] === "name");
        setNameError(
          f ? `Habit name: ${f.msg}` : "Habit name could not be saved. Please try again.",
        );
      })
      .finally(() => setAdding(false));
  }

  function setPendingFor(id, on) {
    if (on) busy.current.add(id);
    else busy.current.delete(id);
    setPending((p) => ({ ...p, [id]: on }));
  }

  function onTick(h) {
    if (busy.current.has(h.id)) return;
    setRowError("");
    setPendingFor(h.id, true);
    apiFetch(`/habits/${h.id}/today`, {
      method: "PUT",
      body: JSON.stringify({ done: !h.done_today }),
    })
      .then((u) => setHabits((p) => p.map((x) => (x.id === h.id ? u : x))))
      .catch(() => setRowError("Could not update that habit. Please try again."))
      .finally(() => setPendingFor(h.id, false));
  }

  function onDelete(h) {
    if (busy.current.has(h.id)) return;
    setRowError("");
    setPendingFor(h.id, true);
    apiFetch(`/habits/${h.id}`, { method: "DELETE" })
      .then(() => {
        setHabits((p) => p.filter((x) => x.id !== h.id));
        setConfirmId(null);
      })
      .catch(() => setRowError("Could not delete that habit. Please try again."))
      .finally(() => setPendingFor(h.id, false));
  }

  const list = habits || [];
  const ink = brand.primaryColor;
  const paper = brand.backgroundColor;
  const accent = brand.accentColor;
  const quiet = brand.neutralColor;
  const border = `3px solid ${ink}`;
  const shadow = `6px 6px 0 ${ink}`;
  const doneCount = list.filter((h) => h.done_today).length;

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
    .bs-press:hover:not(:disabled) { transform: translate(2px, 2px); box-shadow: 4px 4px 0 ${ink}; }
    .bs-press:disabled { opacity: .5; cursor: not-allowed; }
    @keyframes bs-in { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
    .bs-enter { animation: bs-in 220ms ease both; }
    @media (prefers-reduced-motion: reduce) {
      .bs-press { transition: none; }
      .bs-enter { animation: none; }
    }
  `;

  const rowBtn = {
    border: 0,
    backgroundColor: "transparent",
    color: ink,
    cursor: "pointer",
  };

  return (
    <div
      className="bs-root mx-auto w-full max-w-4xl px-4 py-8 md:px-8 md:py-12"
      style={{ backgroundColor: paper }}
    >
      <style>{css}</style>

      <header
        className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-end"
        style={{ paddingBottom: 24, borderBottom: border }}
      >
        <div className="md:col-span-8" data-wf="b-0-0">
          <p style={{ ...label, color: quiet, marginBottom: 12 }}>No. 01 · Daily sheet · {iso}</p>
          <h1
            style={{
              fontFamily: brand.fontHeading,
              fontWeight: 700,
              fontSize: "clamp(40px, 8vw, 72px)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            Today · {todayLabel}
          </h1>
        </div>
        <div className="flex flex-col gap-3 md:col-span-4 md:items-end">
          <p style={{ ...label, color: quiet, overflowWrap: "anywhere" }}>
            Signed in · {user ? user.email : ""}
          </p>
          <button
            type="button"
            data-wf="b-0-1"
            onClick={() => signOut(navigate)}
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
        <section aria-labelledby="add-title" style={{ marginTop: 48 }}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-start">
            <form
              id="add-habit-form"
              onSubmit={onAdd}
              noValidate
              data-wf="b-1-0"
              className="md:col-span-9"
              style={{ border, boxShadow: shadow, padding: 24, backgroundColor: paper }}
            >
              <div
                className="flex items-baseline justify-between gap-4"
                style={{ marginBottom: 16 }}
              >
                <h2
                  id="add-title"
                  style={{
                    fontFamily: brand.fontHeading,
                    fontSize: 28,
                    fontWeight: 700,
                    lineHeight: 1.1,
                  }}
                >
                  Add a habit
                </h2>
                <span style={{ ...label, color: quiet }}>01</span>
              </div>
              <label
                htmlFor="habit-name"
                style={{ ...label, display: "block", marginBottom: 8, color: ink, fontWeight: 700 }}
              >
                Habit name (max 100 characters)
              </label>
              <input
                id="habit-name"
                data-wf="i-1-0-0"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError("");
                }}
                maxLength={MAX_NAME}
                aria-invalid={nameError ? "true" : "false"}
                aria-describedby={nameError ? "habit-name-err" : undefined}
                placeholder="e.g. Drink water"
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
              {nameError && (
                <p id="habit-name-err" role="alert" style={{ marginTop: 8, fontWeight: 700 }}>
                  {nameError}
                </p>
              )}
            </form>

            <div className="md:col-span-3">
              <button
                type="submit"
                form="add-habit-form"
                data-wf="b-1-1"
                disabled={adding}
                className="bs-press bs-focus flex w-full items-center justify-center gap-2"
                style={{
                  minHeight: 56,
                  border,
                  backgroundColor: ink,
                  color: paper,
                  boxShadow: shadow,
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

        <section aria-labelledby="list-title" data-wf="b-2-0" style={{ marginTop: 64 }}>
          <div
            className="flex items-end justify-between gap-4"
            style={{ borderBottom: `1px dashed ${ink}`, paddingBottom: 12, marginBottom: 24 }}
          >
            <div>
              <p style={{ ...label, color: quiet, marginBottom: 4 }}>02</p>
              <h2
                id="list-title"
                style={{
                  fontFamily: brand.fontHeading,
                  fontSize: 36,
                  fontWeight: 700,
                  lineHeight: 1.05,
                }}
              >
                My habits
              </h2>
            </div>
            <p style={{ ...label, fontWeight: 700, fontSize: 13 }}>
              {list.length === 0 ? "0 habits" : `${doneCount} of ${list.length} done`}
            </p>
          </div>

          {!failed && habits === null && <p role="status">Loading your habits…</p>}
          {failed && <p role="alert">Could not load your habits. Please try again.</p>}
          {rowError && <p role="alert">{rowError}</p>}

          {list.length > 0 && (
            <ul
              className="flex flex-col"
              style={{ gap: 32, listStyle: "none", padding: 0, margin: 0 }}
            >
              {list.map((h) => (
                <li
                  key={h.id}
                  className="bs-enter"
                  style={{ border, boxShadow: shadow, backgroundColor: paper }}
                >
                  <button
                    type="button"
                    disabled={!!pending[h.id]}
                    onClick={() => onTick(h)}
                    aria-pressed={h.done_today ? "true" : "false"}
                    className="bs-focus flex w-full items-center gap-4 text-left"
                    style={{ ...rowBtn, minHeight: 80, padding: "16px 24px" }}
                  >
                    <span
                      aria-hidden="true"
                      className="flex shrink-0 items-center justify-center"
                      style={{
                        width: 40,
                        height: 40,
                        border,
                        backgroundColor: h.done_today ? accent : "transparent",
                        color: paper,
                      }}
                    >
                      {h.done_today && <Icons.Check className="h-6 w-6" />}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                      <span className="min-w-0">
                        <span
                          style={{
                            display: "block",
                            fontSize: 18,
                            fontWeight: 700,
                            overflowWrap: "anywhere",
                            textDecoration: h.done_today ? "line-through" : "none",
                            textDecorationThickness: 2,
                          }}
                        >
                          {h.name}
                        </span>
                        <span
                          style={{
                            ...label,
                            color: h.done_today ? accent : quiet,
                            fontWeight: 700,
                          }}
                        >
                          {h.done_today ? "Done" : "Not done"}
                        </span>
                      </span>
                      <span
                        style={{
                          fontVariantNumeric: "tabular-nums",
                          whiteSpace: "nowrap",
                          fontSize: 14,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: brand.fontHeading,
                            fontSize: 32,
                            fontWeight: 700,
                            lineHeight: 1,
                          }}
                        >
                          {h.streak}
                        </span>
                        -day streak
                      </span>
                    </span>
                  </button>
                  {confirmId === h.id ? (
                    <div
                      role="group"
                      aria-label={`Confirm delete: ${h.name}`}
                      className="flex flex-wrap items-center gap-4"
                      style={{ borderTop: `1px dashed ${ink}`, padding: "8px 24px" }}
                    >
                      <span style={{ fontWeight: 700 }}>Delete this habit and its history?</span>
                      <button
                        type="button"
                        disabled={!!pending[h.id]}
                        onClick={() => onDelete(h)}
                        className="bs-focus"
                        style={{ ...rowBtn, minHeight: 48, fontWeight: 700, color: accent }}
                      >
                        Confirm delete
                      </button>
                      <button
                        type="button"
                        disabled={!!pending[h.id]}
                        onClick={() => setConfirmId(null)}
                        className="bs-focus"
                        style={{ ...rowBtn, minHeight: 48, fontWeight: 700 }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={!!pending[h.id]}
                      onClick={() => setConfirmId(h.id)}
                      className="bs-focus flex w-full items-center justify-center gap-2"
                      aria-label={`Delete habit: ${h.name}`}
                      style={{
                        ...rowBtn,
                        minHeight: 48,
                        borderTop: `1px dashed ${ink}`,
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                      }}
                    >
                      <Icons.X className="h-4 w-4" aria-hidden="true" />
                      Delete habit
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}

          {habits !== null && list.length === 0 && (
            <div
              data-wf="b-5-0"
              className="bs-enter"
              style={{ border, borderStyle: "dashed", padding: "48px 24px", textAlign: "left" }}
            >
              <p style={{ ...label, color: quiet, marginBottom: 12 }}>Nothing on the sheet</p>
              <p
                style={{
                  fontFamily: brand.fontHeading,
                  fontSize: 36,
                  fontWeight: 700,
                  lineHeight: 1.1,
                  marginBottom: 12,
                }}
              >
                No habits yet.
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.6, maxWidth: "48ch" }}>
                Add your first habit above. Tap it once a day to check it off, and watch the streak
                grow.
              </p>
            </div>
          )}

          <p
            style={{
              ...label,
              color: quiet,
              marginTop: 32,
              textTransform: "none",
              letterSpacing: 0,
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            Only today can be changed. A streak counts the days in a row ending today, or yesterday
            until you tick today.
          </p>
        </section>
      </main>
    </div>
  );
}
