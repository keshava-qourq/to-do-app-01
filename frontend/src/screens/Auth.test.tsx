import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { clearSessionToken, getSessionToken } from "@/lib/api";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

const json = (status: number, body: unknown) =>
  Promise.resolve(new Response(JSON.stringify(body), { status }));

function setup(ui: React.ReactElement) {
  return render(
    <MemoryRouter initialEntries={["/x"]}>
      <Routes>
        <Route path="/x" element={ui} />
        <Route path="/today" element={<p>TODAY PAGE</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

function fill(email: string, password: string) {
  const [e, p] = [
    document.querySelector('input[type="email"]'),
    document.querySelector('input[type="password"]'),
  ];
  fireEvent.change(e!, { target: { value: email } });
  fireEvent.change(p!, { target: { value: password } });
  fireEvent.submit(e!.closest("form")!);
}

describe("auth screens", () => {
  beforeEach(() => clearSessionToken());
  afterEach(() => vi.unstubAllGlobals());

  it("[AC-003] sign-up shows linked field errors for empty input", () => {
    setup(<SignUp />);
    fill("bad", "");
    const email = document.querySelector('input[type="email"]')!;
    expect(email).toHaveAttribute("aria-invalid", "true");
    const id = email.getAttribute("aria-describedby")!;
    expect(document.getElementById(id)).toHaveTextContent(/email/i);
    expect(document.querySelector('input[type="password"]')).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("[AC-001] sign-up stores token, sends timezone and navigates", async () => {
    const token = crypto.randomUUID();
    const f = vi.fn(() => json(201, { token, user: { id: 1, email: "a@b.co", timezone: "UTC" } }));
    vi.stubGlobal("fetch", f);
    setup(<SignUp />);
    fill("a@b.co", crypto.randomUUID());
    await screen.findByText("TODAY PAGE");
    expect(getSessionToken()).toBe(token);
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toMatch(/\/auth\/signup$/);
    expect(JSON.parse(init.body as string).timezone).toBeTruthy();
  });

  it("[AC-002] sign-up shows the 409 message and stays", async () => {
    vi.stubGlobal("fetch", () => json(409, { detail: "An account already exists for this email" }));
    setup(<SignUp />);
    fill("a@b.co", crypto.randomUUID());
    expect(await screen.findByText("An account already exists for this email")).toBeInTheDocument();
  });

  it("[AC-003] sign-up maps a 422 to the email field", async () => {
    vi.stubGlobal("fetch", () =>
      json(422, { detail: [{ loc: ["body", "email"], msg: "bad email", type: "x" }] }),
    );
    setup(<SignUp />);
    fill("a@b.co", crypto.randomUUID());
    expect(await screen.findByText("bad email")).toBeInTheDocument();
    expect(document.querySelector('input[type="email"]')).toHaveAttribute("aria-invalid", "true");
  });

  it("[AC-005] sign-in stores token and navigates", async () => {
    const token = crypto.randomUUID();
    vi.stubGlobal("fetch", () =>
      json(200, { token, user: { id: 1, email: "a@b.co", timezone: "UTC" } }),
    );
    setup(<SignIn />);
    fill("a@b.co", crypto.randomUUID());
    await screen.findByText("TODAY PAGE");
    expect(getSessionToken()).toBe(token);
  });

  it("[AC-006] sign-in 401 shows one generic message", async () => {
    vi.stubGlobal("fetch", () => json(401, { detail: "Invalid email or password" }));
    setup(<SignIn />);
    fill("a@b.co", crypto.randomUUID());
    await waitFor(() => expect(screen.getByText("Invalid email or password")).toBeInTheDocument());
  });
});
