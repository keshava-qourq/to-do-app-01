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
    expect(screen.getByLabelText(/Habit name/)).toHaveAttribute("aria-disabled", "true");
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
