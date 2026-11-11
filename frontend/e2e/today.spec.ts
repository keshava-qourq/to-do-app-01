import { expect, test, type Page } from "@playwright/test";

import { adminCredentials } from "./support/admin";

const API = process.env.E2E_API_URL ?? "http://127.0.0.1:8000";

async function adminToken(): Promise<string> {
  const { email, password } = adminCredentials();
  const res = await fetch(`${API}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  expect(res.status).toBe(200);
  return (await res.json()).token;
}

async function addViaApi(token: string, name: string): Promise<string> {
  const res = await fetch(`${API}/habits`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name }),
  });
  expect(res.status).toBe(201);
  return (await res.json()).id;
}

async function signIn(page: Page) {
  const { email, password } = adminCredentials();
  await page.goto("/sign-in");
  await page.locator("#signin-email").fill(email);
  await page.locator("#signin-password").fill(password);
  await page.locator("#signin-password").press("Enter");
  await expect(page.getByRole("heading", { name: /^Today/ })).toBeVisible();
}

const uniq = (p: string) => `${p}-${crypto.randomUUID().slice(0, 8)}`;

test("[AC-012] adds a habit and it is listed", async ({ page }) => {
  await signIn(page);
  const name = uniq("add");
  await page.locator("#habit-name").fill(name);
  await page.getByRole("button", { name: "Add", exact: true }).click();
  await expect(page.getByText(name, { exact: true })).toBeVisible();
  const row = page.getByRole("listitem").filter({ hasText: name });
  await expect(row).toContainText("Not done");
  await expect(row).toContainText("0-day streak");
  await page.reload();
  await expect(page.getByText(name, { exact: true })).toBeVisible();
});

test("[AC-013] [NFR-013] empty name is rejected with a name message", async ({ page }) => {
  await signIn(page);
  await page.getByRole("button", { name: "Add", exact: true }).click();
  await expect(page.locator("#habit-name-err")).toContainText(/name/i);
  await page.locator("#habit-name").fill("   ");
  await page.getByRole("button", { name: "Add", exact: true }).click();
  await expect(page.locator("#habit-name-err")).toContainText(/required/i);
});

test("[AC-014] [NFR-013] name over 100 chars is rejected with a name message", async ({ page }) => {
  await signIn(page);
  // The input caps typing at 100, so set the value past the cap through the DOM.
  const input = page.locator("#habit-name");
  await input.evaluate((el: HTMLInputElement) => {
    const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
    el.removeAttribute("maxlength");
    set.call(el, "x".repeat(101));
    el.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.getByRole("button", { name: "Add", exact: true }).click();
  await expect(page.locator("#habit-name-err")).toContainText(/name.*100/i);
});

test("[AC-016] delete after confirm removes habit permanently", async ({ page }) => {
  const name = uniq("del");
  await addViaApi(await adminToken(), name);
  await signIn(page);
  await expect(page.getByText(name, { exact: true })).toBeVisible();
  await page.getByRole("button", { name: `Delete habit: ${name}` }).click();
  await page.getByRole("button", { name: "Confirm delete" }).click();
  await expect(page.getByText(name, { exact: true })).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole("heading", { name: /^Today/ })).toBeVisible();
  await expect(page.getByText(name, { exact: true })).toHaveCount(0);
});

test("[AC-018] cancel leaves the habit unchanged", async ({ page }) => {
  const name = uniq("keep");
  await addViaApi(await adminToken(), name);
  await signIn(page);
  await page.getByRole("button", { name: `Delete habit: ${name}` }).click();
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(page.getByText(name, { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText(name, { exact: true })).toBeVisible();
});

test("[AC-022] [AC-023] [AC-030] tapping toggles done and streak immediately", async ({ page }) => {
  const name = uniq("tick");
  await addViaApi(await adminToken(), name);
  await signIn(page);
  const row = page.getByRole("listitem").filter({ hasText: name });
  const tap = row.getByRole("button", { pressed: false }).first();
  await expect(row).toContainText("Not done");
  await expect(row).toContainText("0-day streak");
  await tap.click();
  await expect(row).toContainText("Done");
  await expect(row).toContainText("1-day streak");
  await row.getByRole("button", { pressed: true }).click();
  await expect(row).toContainText("Not done");
  await expect(row).toContainText("0-day streak");
});

test("[AC-025] no control to change a day other than today", async ({ page }) => {
  await addViaApi(await adminToken(), uniq("day"));
  await signIn(page);
  await expect(page.locator("input[type=date]")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: /yesterday|previous|prev|back|calendar/i }),
  ).toHaveCount(0);
  await expect(page.getByText(/Only today can be changed/)).toBeVisible();
});
