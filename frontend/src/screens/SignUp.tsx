// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";
import { signUp, authErrors } from "@/lib/auth";

const PRODUCT = "To Do app";
const SCREEN = "Sign up";
const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';

export default function Screen() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [done, setDone] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [formError, setFormError] = React.useState("");
  const thick = `3px solid ${brand.primaryColor}`;
  const hard = `8px 8px 0 ${brand.primaryColor}`;
  const field = {
    border: thick,
    borderRadius: brand.radius,
    height: 48,
    backgroundColor: "transparent",
    fontFamily: MONO,
  };

  return (
    <div
      className="flex min-h-screen flex-col px-12 py-8"
      style={{ color: brand.primaryColor, fontFamily: brand.fontBody }}
    >
      <header
        className="flex items-center justify-between pb-4"
        style={{ borderBottom: thick, fontFamily: MONO }}
      >
        <p className="text-sm font-bold uppercase tracking-[0.25em]">{PRODUCT}</p>
        <p className="text-xs uppercase">Vol. 01 — Issue 10 — 2026</p>
      </header>

      <div className="grid flex-1 grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-center gap-14 py-10">
        <h1
          className="text-[120px] font-bold leading-[0.85] tracking-tight"
          style={{ fontFamily: brand.fontHeading }}
        >
          {SCREEN}
          <span style={{ color: brand.accentColor }}>.</span>
        </h1>

        <main
          className="p-8"
          style={{
            border: thick,
            boxShadow: hard,
            borderRadius: brand.radius,
            backgroundColor: brand.backgroundColor,
          }}
        >
          <h2
            data-wf="b-0-0"
            className="mb-6 text-3xl font-bold leading-tight"
            style={{ fontFamily: brand.fontHeading }}
          >
            Create your account
          </h2>
          {done ? (
            <p
              role="status"
              className="text-2xl font-bold"
              style={{ fontFamily: brand.fontHeading }}
            >
              Welcome back. You are in.
            </p>
          ) : (
            <form
              className="space-y-6"
              noValidate
              aria-label="Sign up"
              onSubmit={(e) => {
                e.preventDefault();
                const next = {};
                const em = email.trim();
                if (!em) next.email = "Enter your email address.";
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em))
                  next.email = "That does not look like an email address.";
                if (!password) next.password = "Enter a password.";
                setErrors(next);
                setFormError("");
                if (Object.keys(next).length) return;
                signUp(em, password)
                  .then(() => navigate("today"))
                  .catch((err) => {
                    if (err && err.status === 409) {
                      setFormError("An account already exists for this email");
                      return;
                    }
                    const r = authErrors(err);
                    setErrors(r.fields);
                    if (r.form) setFormError(r.form);
                  });
              }}
            >
              <div className="space-y-2">
                <label
                  htmlFor="ed-email"
                  className="block text-xs font-bold uppercase tracking-[0.2em]"
                  style={{ fontFamily: MONO }}
                >
                  01 / Email
                </label>
                <input
                  id="ed-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "ed-email-err" : undefined}
                  className="w-full px-3 text-sm outline-none"
                  style={field}
                />
                {errors.email && (
                  <p id="ed-email-err" className="text-sm font-bold">
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="ed-password"
                  className="block text-xs font-bold uppercase tracking-[0.2em]"
                  style={{ fontFamily: MONO }}
                >
                  02 / Password
                </label>
                <input
                  id="ed-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "ed-password-err" : undefined}
                  className="w-full px-3 text-sm outline-none"
                  style={field}
                />
                {errors.password && (
                  <p id="ed-password-err" className="text-sm font-bold">
                    {errors.password}
                  </p>
                )}
              </div>
              {formError && (
                <p role="alert" className="text-sm font-bold">
                  {formError}
                </p>
              )}
              <button
                data-wf="b-3-0"
                type="submit"
                className="h-14 w-full text-sm font-bold uppercase tracking-[0.25em] transition-transform active:translate-x-1 active:translate-y-1"
                style={{
                  backgroundColor: brand.primaryColor,
                  color: brand.backgroundColor,
                  border: thick,
                  borderRadius: brand.radius,
                  boxShadow: `4px 4px 0 ${brand.accentColor}`,
                  fontFamily: MONO,
                }}
              >
                Enter →
              </button>
            </form>
          )}
          <p className="mt-6 text-xs uppercase" style={{ fontFamily: MONO }}>
            No account?{" "}
            <button type="button" className="font-bold underline underline-offset-4">
              Request access
            </button>
          </p>
          <p className="mt-4 text-xs uppercase" style={{ fontFamily: MONO }}>
            <button
              data-wf="b-4-0"
              type="button"
              onClick={() => navigate("sign-in")}
              className="font-bold underline underline-offset-4"
            >
              Already have an account? Sign in
            </button>
          </p>
        </main>
      </div>

      <footer
        className="flex justify-between pt-3 text-xs uppercase"
        style={{ borderTop: thick, fontFamily: MONO }}
      >
        <span>© {PRODUCT}</span>
        <span>Privacy · Terms · Help</span>
      </footer>
    </div>
  );
}
