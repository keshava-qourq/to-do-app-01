import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiFetch, ApiError } from "@/lib/api";
import Today from "./Today";

vi.mock("@/lib/api", async (orig) => ({ ...(await orig<object>()), apiFetch: vi.fn() }));
const mocked = vi.mocked(apiFetch);
const me = { id: 1, email: "a@b.co", timezone: "UTC" };

function setup(habits: unknown, status = 0) {
  mocked.mockImplementation((async (path: string) => {
    if (path === "/auth/me") return me;
    if (path === "/auth/signout") return undefined;
    if (status && path === "/habits") throw new ApiError(status, null, "x");
    return habits;
  }) as never);
  return render(
    <MemoryRouter initialEntries={["/today"]}>
      <Routes>
        <Route path="/today" element={<Today />} />
        <Route path="/sign-in" element={<p>SIGN IN PAGE</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("Today", () => {
  beforeEach(() => mocked.mockReset());

  it("[AC-019] lists habits with done state and streak, one GET /habits", async () => {
    setup([
      { id: 1, name: "Water", done_today: true, streak: 3 },
      { id: 2, name: "Read", done_today: false, streak: 0 },
    ]);
    expect(screen.getByText(/Loading/)).toBeInTheDocument();
    expect(await screen.findByText("Water")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();
    expect(screen.getByText("Not done")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(await screen.findByText(/a@b\.co/)).toBeInTheDocument();
    expect(mocked.mock.calls.filter((c) => c[0] === "/habits")).toHaveLength(1);
    expect(screen.getByLabelText(/Habit name/)).toBeEnabled();
  });

  function withApi(habits: unknown[], handler: (path: string, init?: RequestInit) => unknown) {
    mocked.mockImplementation((async (path: string, init?: RequestInit) => {
      if (path === "/auth/me") return me;
      if (path === "/habits" && !init?.method) return habits;
      if (!init?.method) return undefined;
      return handler(path, init);
    }) as never);
    return render(
      <MemoryRouter initialEntries={["/today"]}>
        <Routes>
          <Route path="/today" element={<Today />} />
        </Routes>
      </MemoryRouter>,
    );
  }

  it("[AC-012] adds a habit and clears the input", async () => {
    withApi([], () => ({ id: "h1", name: "Read", done_today: false, streak: 0 }));
    await screen.findByText("No habits yet.");
    const input = screen.getByLabelText(/Habit name/) as HTMLInputElement;
    expect(input).toHaveAttribute("maxLength", "100");
    fireEvent.change(input, { target: { value: " Read " } });
    fireEvent.click(screen.getByRole("button", { name: /Add/ }));
    expect(await screen.findByText("Not done")).toBeInTheDocument();
    expect(mocked).toHaveBeenCalledWith("/habits", {
      method: "POST",
      body: JSON.stringify({ name: "Read" }),
    });
    expect(input.value).toBe("");
  });

  it("[AC-013] [NFR-013] blank name shows a name message and sends nothing", async () => {
    withApi([], () => undefined);
    await screen.findByText("No habits yet.");
    fireEvent.change(screen.getByLabelText(/Habit name/), { target: { value: "   " } });
    fireEvent.click(screen.getByRole("button", { name: /Add/ }));
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(mocked.mock.calls.filter((c) => c[1])).toHaveLength(0);
  });

  it("[AC-014] a 422 on name shows the field message", async () => {
    withApi([], () => {
      throw new ApiError(422, { detail: [{ loc: ["body", "name"], msg: "too long" }] }, "x");
    });
    await screen.findByText("No habits yet.");
    fireEvent.change(screen.getByLabelText(/Habit name/), { target: { value: "x" } });
    fireEvent.click(screen.getByRole("button", { name: /Add/ }));
    expect(await screen.findByText(/Habit name: too long/)).toBeInTheDocument();
    expect(screen.getByText("No habits yet.")).toBeInTheDocument();
  });

  it("[AC-022] [AC-023] [AC-030] tapping sends desired state and shows streak", async () => {
    let done = false;
    withApi([{ id: "h1", name: "Water", done_today: false, streak: 0 }], (_p, init) => {
      done = JSON.parse(init!.body as string).done;
      return { id: "h1", name: "Water", done_today: done, streak: done ? 1 : 0 };
    });
    fireEvent.click(
      await screen.findByText("Water").then(() => document.querySelector("button[aria-pressed]")!),
    );
    expect(await screen.findByText("Done")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(mocked).toHaveBeenCalledWith("/habits/h1/today", {
      method: "PUT",
      body: JSON.stringify({ done: true }),
    });
    fireEvent.click(document.querySelector("button[aria-pressed]")!);
    expect(await screen.findByText("Not done")).toBeInTheDocument();
    expect(done).toBe(false);
  });

  it("[AC-024] the row is disabled while the request is in flight", async () => {
    let release: (v: unknown) => void = () => {};
    withApi(
      [{ id: "h1", name: "Water", done_today: false, streak: 0 }],
      () => new Promise((r) => (release = r)),
    );
    const row = await screen
      .findByText("Water")
      .then(() => document.querySelector("button[aria-pressed]")!);
    fireEvent.click(row);
    await waitFor(() => expect(row).toBeDisabled());
    release({ id: "h1", name: "Water", done_today: true, streak: 1 });
    await waitFor(() => expect(row).toBeEnabled());
  });

  it("[AC-016] deleting after confirming removes the habit", async () => {
    withApi([{ id: "h1", name: "Water", done_today: false, streak: 0 }], () => undefined);
    fireEvent.click(await screen.findByRole("button", { name: /Delete habit: Water/ }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm delete" }));
    expect(await screen.findByText("No habits yet.")).toBeInTheDocument();
    expect(mocked).toHaveBeenCalledWith("/habits/h1", { method: "DELETE" });
  });

  it("[AC-018] cancelling the confirmation keeps the habit", async () => {
    withApi([{ id: "h1", name: "Water", done_today: false, streak: 0 }], () => undefined);
    fireEvent.click(await screen.findByRole("button", { name: /Delete habit: Water/ }));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.getByText("Water")).toBeInTheDocument();
    expect(mocked.mock.calls.filter((c) => c[1])).toHaveLength(0);
  });

  it("[AC-025] offers no date controls", async () => {
    withApi([{ id: "h1", name: "Water", done_today: false, streak: 0 }], () => undefined);
    await screen.findByText("Water");
    expect(document.querySelector('input[type="date"]')).toBeNull();
  });

  it("[AC-019] shows an error state", async () => {
    setup(null, 500);
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(/Could not load/));
  });

  it("[AC-020] shows the empty state", async () => {
    setup([]);
    expect(await screen.findByText("No habits yet.")).toBeInTheDocument();
  });

  it("[AC-021] shows the local ISO date", async () => {
    setup([]);
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, "0");
    const iso = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
    expect(await screen.findByText(new RegExp(iso))).toBeInTheDocument();
  });

  it("[AC-008] a failed 401 renders no habit data", async () => {
    setup(null, 401);
    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
    expect(screen.queryByText("Drink water")).toBeNull();
  });

  it("[AC-007] sign out calls the API and goes to sign-in", async () => {
    setup([]);
    fireEvent.click(screen.getByRole("button", { name: "Sign out" }));
    expect(await screen.findByText("SIGN IN PAGE")).toBeInTheDocument();
    expect(mocked).toHaveBeenCalledWith("/auth/signout", { method: "POST" });
  });
});
