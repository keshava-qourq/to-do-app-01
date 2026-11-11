// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.

import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

import { signIn, authErrors } from "@/lib/auth";

export default function Screen() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState({});
  const [failed, setFailed] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const timer = React.useRef(null);

  React.useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const ink = brand.primaryColor;
  const paper = brand.backgroundColor;
  const accent = brand.accentColor;
  const muted = brand.neutralColor;

  const monoLabel = {
    fontFamily: brand.fontBody,
    fontSize: 12,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    fontWeight: 700,
    color: ink,
  };

  const fieldStyle = (bad) => ({
    width: "100%",
    minHeight: 48,
    padding: "12px 16px",
    border: "3px solid " + ink,
    borderRadius: 0,
    backgroundColor: "transparent",
    color: ink,
    fontFamily: brand.fontBody,
    fontSize: 16,
    boxShadow: bad ? "4px 4px 0 0 " + ink : "none",
  });

  function validate() {
    const next = {};
    const e = email.trim();
    if (!e) next.email = "Enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))
      next.email = "That does not look like an email address.";
    if (!password) next.password = "Enter your password.";
    return next;
  }

  function onSubmit(ev) {
    ev.preventDefault();
    if (loading) return;
    const next = validate();
    setErrors(next);
    setFailed(false);
    if (Object.keys(next).length) return;
    setLoading(true);
    signIn(email.trim(), password)
      .then(() => navigate("today"))
      .catch((err) => {
        setLoading(false);
        if (err && err.status === 422) setErrors(authErrors(err).fields);
        else setFailed(true);
      });
  }

  return (
    <div
      style={{ backgroundColor: paper, color: ink, fontFamily: brand.fontBody, minHeight: "100vh" }}
    >
      <style>{`
        .bs-focus:focus-visible { outline: 3px solid ${accent}; outline-offset: 3px; }
        .bs-btn { transition: transform 120ms ease, box-shadow 120ms ease; box-shadow: 6px 6px 0 0 ${accent}; }
        .bs-btn:hover:not(:disabled) { transform: translate(-2px, -2px); box-shadow: 8px 8px 0 0 ${accent}; }
        .bs-btn:active:not(:disabled) { transform: translate(4px, 4px); box-shadow: 2px 2px 0 0 ${accent}; }
        .bs-btn:disabled { cursor: progress; opacity: 0.85; }
        .bs-link { text-decoration: underline; text-decoration-thickness: 3px; text-underline-offset: 6px; }
        .bs-link:hover { background-color: ${ink}; color: ${paper}; text-decoration-color: ${paper}; }
        .bs-alert { animation: bs-in 180ms ease-out; }
        @keyframes bs-in { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
        @keyframes bs-bar { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @media (prefers-reduced-motion: reduce) {
          .bs-btn, .bs-alert { transition: none; animation: none; }
          .bs-bar { animation: none !important; }
        }
      `}</style>

      <main
        className="mx-auto w-full px-4 py-6 sm:px-8 md:px-12 md:py-12"
        style={{ maxWidth: 880 }}
      >
        <div
          className="flex flex-wrap items-center justify-between gap-2 pb-3"
          style={{ borderBottom: "3px solid " + ink, ...monoLabel }}
        >
          <span>Habit Ledger</span>
          <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 400 }}>
            Wed 11 Nov 2026
          </span>
        </div>

        <div data-wf="b-0-0" className="pt-8 pb-8 md:pt-12 md:pb-12">
          <p style={{ ...monoLabel, color: muted, marginBottom: 12 }}>Nº 01 — Returning readers</p>
          <h1
            style={{
              fontFamily: brand.fontHeading,
              fontSize: "clamp(56px, 14vw, 136px)",
              lineHeight: 0.92,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            Sign in
          </h1>
          <hr style={{ border: 0, borderTop: "3px double " + ink, marginTop: 24 }} />
        </div>

        <section
          aria-label="Sign in form"
          style={{
            border: "3px solid " + ink,
            boxShadow: "6px 6px 0 0 " + ink,
            backgroundColor: paper,
          }}
          className="p-4 sm:p-8"
        >
          <form
            id="signin-form"
            data-wf="b-1-0"
            onSubmit={onSubmit}
            noValidate
            aria-label="Sign in"
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <UI.Label htmlFor="signin-email" style={monoLabel}>
                  01 — Email
                </UI.Label>
                <UI.Input
                  id="signin-email"
                  data-wf="i-1-0-0"
                  className="bs-focus"
                  type="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((p) => ({ ...p, email: undefined }));
                    setFailed(false);
                  }}
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "signin-email-err" : undefined}
                  placeholder="you@example.com"
                  style={fieldStyle(!!errors.email)}
                />
                {errors.email && (
                  <p
                    id="signin-email-err"
                    className="flex items-center gap-2"
                    style={{ fontSize: 14, fontWeight: 700, margin: 0 }}
                  >
                    <Icons.AlertCircle aria-hidden="true" width={16} height={16} />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <UI.Label htmlFor="signin-password" style={monoLabel}>
                  02 — Password
                </UI.Label>
                <UI.Input
                  id="signin-password"
                  data-wf="i-1-0-1"
                  className="bs-focus"
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((p) => ({ ...p, password: undefined }));
                    setFailed(false);
                  }}
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "signin-password-err" : undefined}
                  style={fieldStyle(!!errors.password)}
                />
                {errors.password && (
                  <p
                    id="signin-password-err"
                    className="flex items-center gap-2"
                    style={{ fontSize: 14, fontWeight: 700, margin: 0 }}
                  >
                    <Icons.AlertCircle aria-hidden="true" width={16} height={16} />
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>
            </div>
          </form>

          <div
            data-wf="b-2-0"
            role="alert"
            aria-live="assertive"
            className="mt-6"
            style={{ minHeight: 0 }}
          >
            {failed && (
              <div
                className="bs-alert flex items-start gap-3 p-4"
                style={{ backgroundColor: ink, color: paper, border: "3px solid " + ink }}
              >
                <Icons.AlertCircle
                  aria-hidden="true"
                  width={20}
                  height={20}
                  style={{ flexShrink: 0, marginTop: 1 }}
                />
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>
                  Invalid email or password
                </p>
              </div>
            )}
          </div>

          <div className="mt-6">
            <UI.Button
              data-wf="b-3-0"
              type="submit"
              form="signin-form"
              disabled={loading}
              aria-busy={loading ? "true" : "false"}
              className="bs-btn bs-focus w-full flex items-center justify-center gap-3"
              style={{
                minHeight: 56,
                backgroundColor: ink,
                color: paper,
                border: "3px solid " + ink,
                borderRadius: 0,
                fontFamily: brand.fontBody,
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <span>{loading ? "Checking your details…" : "Sign in"}</span>
              {!loading && <Icons.ArrowRight aria-hidden="true" width={18} height={18} />}
              {loading && (
                <span
                  aria-hidden="true"
                  className="bs-bar"
                  style={{
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    height: 4,
                    width: "100%",
                    backgroundColor: accent,
                    animation: "bs-bar 900ms linear infinite",
                  }}
                />
              )}
            </UI.Button>
          </div>
        </section>

        <div className="mt-8 md:mt-12 pt-6" style={{ borderTop: "3px dashed " + ink }}>
          <button
            type="button"
            data-wf="b-4-0"
            onClick={() => navigate("sign-up")}
            className="bs-link bs-focus"
            style={{
              background: "transparent",
              border: 0,
              padding: "12px 4px",
              minHeight: 48,
              fontFamily: brand.fontHeading,
              fontSize: 24,
              fontWeight: 700,
              color: accent,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            New here? Create an account
          </button>
        </div>
      </main>
    </div>
  );
}
