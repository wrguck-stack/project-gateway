import { test, expect, type Page } from "@playwright/test";
import { answersSchema } from "../src/domain/model";

async function openUploads(page: Page) {
  await page.request.post("/api/session", { data: { role: "OWNER" } });
  const created = await page.request.post("/api/drafts", {
    data: { address: "QA Upload · Gewerbepark 10" },
  });
  expect(created.ok()).toBe(true);
  const project = await created.json();
  const saved = await page.request.patch(`/api/drafts/${project.id}`, {
    data: {
      revision: project.revision,
      step: 10,
      answers: answersSchema.parse({
        address: project.answers.address,
        locationConfirmed: true,
        buildingType: "Logistikhalle",
        area: 4800,
        areaNature: "ESTIMATED",
        role: "Eigentümer",
        authority: "Liegt vor",
        consumption: 620000,
        consumptionNature: "OBSERVED",
        usageProfile: "Tagsüber",
        roofCondition: "Keine Sanierung bekannt",
        pv: "Nein",
        battery: "Nein",
        goal: "Eigenverbrauch steigern",
        availableDocuments: ["Lastgang"],
      }),
    },
  });
  expect(saved.ok()).toBe(true);
  await page.goto(`/standortcheck/${project.id}/10`);
  return project.id as string;
}

const file = {
  name: "navigation-lastgang.csv",
  mimeType: "text/csv",
  buffer: Buffer.from("timestamp;load\n2026-01-01T00:00:00;10\n"),
};

test("an active upload locks forward, back and visited-step navigation until finalization", async ({
  page,
}) => {
  const id = await openUploads(page);
  let release!: () => void;
  const held = new Promise<void>((resolve) => (release = resolve));
  await page.route(`**/api/projects/${id}/transfers/*/0`, async (route) => {
    await held;
    await route.continue();
  });
  const saves: string[] = [];
  page.on("request", (request) => {
    if (
      request.method() === "PATCH" &&
      new URL(request.url()).pathname === `/api/drafts/${id}`
    )
      saves.push(request.url());
  });
  try {
    await page.getByLabel("Unterlagen hochladen").setInputFiles(file);
    await expect(
      page.getByText("Wird übertragen …", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Angaben prüfen", exact: true }),
    ).toBeDisabled();
    await expect(
      page.getByRole("button", { name: "Zurück", exact: true }),
    ).toBeDisabled();
    await page.getByText("Schritteübersicht", { exact: true }).click();
    for (const button of await page
      .getByRole("navigation", { name: "Besuchte Schritte" })
      .getByRole("button")
      .all())
      await expect(button).toBeDisabled();
    await expect(page.getByLabel("Unterlagen hochladen")).toBeDisabled();
    await expect(
      page.getByLabel("Ohne die nicht verfügbaren Dateien fortfahren."),
    ).toBeDisabled();
    // The save handler also protects submit events that bypass disabled controls.
    await page.locator(".check-form form").evaluate((form) => {
      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true }),
      );
    });
    expect(saves).toEqual([]);
    await expect(page).toHaveURL(new RegExp(`/standortcheck/${id}/10$`));
  } finally {
    release();
  }
  await expect(
    page.getByText("Technisch verfügbar · nicht fachlich geprüft", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Zurück", exact: true }),
  ).toBeEnabled();
  await page
    .getByRole("button", { name: "Angaben prüfen", exact: true })
    .click();
  await expect(page).toHaveURL(
    new RegExp(`/standortcheck/${id}/zusammenfassung$`),
  );
  expect(saves).toHaveLength(1);
});

test("an incomplete finalization can retry its missing chunk; unresolved files need explicit omission", async ({
  page,
}) => {
  const id = await openUploads(page);
  let chunkAttempts = 0;
  await page.route(`**/api/projects/${id}/transfers/*/0`, async (route) => {
    chunkAttempts += 1;
    if (chunkAttempts === 1) {
      // Acknowledgement without stored bytes forces the real completion route
      // to report an incomplete transfer. Retrying must send the chunk again.
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ received: 0, bytes: file.buffer.length }),
      });
    } else await route.continue();
  });
  await page.getByLabel("Unterlagen hochladen").setInputFiles(file);
  await expect(
    page.getByText("Die Datei ist noch nicht vollständig übertragen.", {
      exact: true,
    }),
  ).toBeVisible();
  const next = page.getByRole("button", {
    name: "Angaben prüfen",
    exact: true,
  });
  const back = page.getByRole("button", { name: "Zurück", exact: true });
  await expect(next).toBeDisabled();
  await expect(back).toBeDisabled();
  const omit = page.getByLabel(
    "Ohne die nicht verfügbaren Dateien fortfahren.",
  );
  await omit.check();
  await expect(next).toBeEnabled();
  await expect(back).toBeEnabled();
  await omit.uncheck();
  await expect(next).toBeDisabled();
  await page
    .getByRole("button", { name: "Erneut hochladen", exact: true })
    .click();
  await expect(
    page.getByText("Technisch verfügbar · nicht fachlich geprüft", {
      exact: true,
    }),
  ).toBeVisible();
  expect(chunkAttempts).toBe(2);
  await expect(next).toBeEnabled();
  const saved = await (await page.request.get(`/api/projects/${id}`)).json();
  expect(saved.documents).toHaveLength(1);
});

test("removing a failed transfer releases navigation and unavailable browser storage does not prevent saving", async ({
  page,
}) => {
  const id = await openUploads(page);
  await page.route(`**/api/projects/${id}/transfers/*/0`, async (route) => {
    await route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        error: "Test: Speicher vorübergehend nicht erreichbar.",
      }),
    });
  });
  await page.getByLabel("Unterlagen hochladen").setInputFiles(file);
  await expect(page.getByText("Fehlgeschlagen", { exact: true })).toBeVisible();
  const next = page.getByRole("button", {
    name: "Angaben prüfen",
    exact: true,
  });
  await expect(next).toBeDisabled();
  await page.getByRole("button", { name: "Entfernen", exact: true }).click();
  await expect(page.locator(".upload-local")).toHaveCount(0);
  await expect(next).toBeEnabled();
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("Browser storage unavailable", "SecurityError");
    };
  });
  await next.click();
  await expect(page).toHaveURL(
    new RegExp(`/standortcheck/${id}/zusammenfassung$`),
  );
});
