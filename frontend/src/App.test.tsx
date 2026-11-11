import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";

import App from "./App";
import { clearSessionToken, setSessionToken } from "@/lib/api";

describe("App", () => {
  beforeEach(() => clearSessionToken());

  it("renders a screen inside the app shell and shows its menu", () => {
    setSessionToken(crypto.randomUUID());
    render(
      <MemoryRouter initialEntries={["/today"]}>
        <App />
      </MemoryRouter>,
    );
    // getAllByText, not getByText: the page may repeat its menu item's text.
    expect(screen.getAllByText("Today").length).toBeGreaterThan(0);
  });

  it("[AC-009] redirects /today to sign-in when there is no session token", () => {
    render(
      <MemoryRouter initialEntries={["/today"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByRole("form", { name: "Sign in" })).toBeInTheDocument();
  });
});
