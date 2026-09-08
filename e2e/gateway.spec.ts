import {
  test,
  expect,
  type Page,
  type APIRequestContext,
} from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdirSync } from "node:fs";
import { answersSchema } from "../src/domain/model";
const address = "Musterstraße 18 · 76131 Karlsruhe";
const baseAnswers = answersSchema.parse({
  address,
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
  availableDocuments: ["Dach-/Lageplan", "Stromabrechnung"],
});
async function fixture(request: APIRequestContext, overrides = {}) {
  await request.post("/api/session", { data: { role: "OWNER" } });
  const created = await request.post("/api/drafts", { data: { address } });
  expect(created.ok()).toBeTruthy();
  let p = await created.json();
  const saved = await request.patch(`/api/drafts/${p.id}`, {
    data: {
      revision: p.revision,
      step: 10,
      answers: { ...baseAnswers, ...overrides },
    },
  });
  expect(saved.ok()).toBeTruthy();
  p = await saved.json();
  const qualified = await request.post(`/api/projects/${p.id}/qualify`, {
    data: { revision: p.revision },
  });
  expect(qualified.ok()).toBeTruthy();
  return qualified.json();
}
async function partnerLogin(page: Page) {
  await page.goto("/partner/login");
  await page.getByRole("button", { name: "Demo-Arbeitsplatz öffnen" }).click();
  await expect(page).toHaveURL(/partner\/projekte/);
}
async function screenshot(page: Page, name: string, fullPage = true) {
  await page.evaluate(() => document.fonts.ready);
  mkdirSync("docs/qa/screenshots", { recursive: true });
  await page.screenshot({
    path: `docs/qa/screenshots/${name}.png`,
    fullPage,
  });
}
test("complete public roof journey with actual file upload, review, result, consent and receipt", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.getByRole("combobox").first().fill(address);
  await page
    .getByRole("button", { name: "Standort prüfen", exact: true })
    .first()
    .click();
  await expect(
    page.getByRole("heading", { name: "Ist das Ihr Standort?" }),
  ).toBeVisible();
  await page.getByLabel("Ich bestätige die Standortangabe.").check();
  await page
    .getByRole("button", { name: "Standort bestätigen", exact: true })
    .click();
  await page.getByRole("radio", { name: "Logistikhalle", exact: true }).check();
  await page.getByRole("button", { name: "Weiter", exact: true }).click();
  await page.getByLabel("Genauigkeit der Fläche").selectOption("Geschätzt");
  await page.getByLabel("Verfügbare Fläche").fill("4.800");
  await page
    .getByLabel("Dachzustand (Nutzerauskunft)")
    .selectOption("Keine Sanierung bekannt");
  await page.getByLabel("Dachform").selectOption("Flachdach");
  await screenshot(page, "check-objekt-1440");
  await page.getByRole("button", { name: "Weiter", exact: true }).click();
  await page.getByRole("radio", { name: "Eigentümer", exact: true }).check();
  await page.getByRole("radio", { name: "Liegt vor", exact: true }).check();
  await page.getByRole("button", { name: "Weiter", exact: true }).click();
  await page
    .getByLabel("Herkunft des Verbrauchswerts")
    .selectOption("Wert aus Abrechnung");
  await page.getByLabel("Jahresverbrauch").fill("620.000");
  await page.getByRole("radio", { name: "Tagsüber", exact: true }).check();
  await screenshot(page, "check-energie-1440");
  await page.getByRole("button", { name: "Weiter", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Gibt es bereits eine PV-Anlage?" }),
  ).toBeVisible();
  await page.getByRole("radio", { name: "Nein", exact: true }).check();
  await page.getByRole("button", { name: "Weiter", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Ist ein Speicher vorhanden?" }),
  ).toBeVisible();
  await page.getByRole("radio", { name: "Nein", exact: true }).check();
  await page.getByRole("button", { name: "Weiter", exact: true }).click();
  await page
    .getByRole("radio", { name: "Eigenverbrauch steigern", exact: true })
    .check();
  await page
    .getByRole("button", { name: "Zu den Unterlagen", exact: true })
    .click();
  await page
    .getByRole("checkbox", { name: "Dach-/Lageplan", exact: true })
    .check();
  await page
    .getByRole("checkbox", { name: "Stromabrechnung", exact: true })
    .check();
  await page
    .getByRole("button", { name: "Dateien hinzufügen", exact: true })
    .click();
  await page.getByLabel("Unterlagen hochladen").setInputFiles({
    name: "lastgang.csv",
    mimeType: "text/csv",
    buffer: Buffer.from("timestamp;load\n2025-01-01T00:00:00;10\n"),
  });
  await expect(
    page.getByText("Technisch verfügbar · nicht fachlich geprüft", {
      exact: true,
    }),
  ).toBeVisible();
  await screenshot(page, "check-dokumente-1440");
  await page
    .getByRole("button", { name: "Angaben prüfen", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Ihre Angaben auf einen Blick." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Energie bearbeiten" }).click();
  await expect(page.getByLabel("Jahresverbrauch")).toHaveValue("620.000");
  await page
    .getByRole("button", { name: "Zur Zusammenfassung", exact: true })
    .click();
  await page.getByRole("link", { name: /^Projekt qualifizieren/ }).click();
  await expect(page).toHaveURL(/ergebnis$/);
  await expect(page.locator('[data-score-state="ESTIMATED"]')).toBeVisible();
  await expect(page.locator(".score-number").first()).toContainText("82");
  await expect(page.locator(".factors-disclosure")).toHaveAttribute("open", "");
  await expect(page.locator("[data-factor]")).toHaveCount(9);
  await screenshot(page, "ergebnis-1440");
  await page
    .getByRole("link", { name: "Zur fachlichen Prüfung übermitteln" })
    .click();
  await expect(page.getByRole("checkbox").last()).not.toBeChecked();
  await page.getByLabel("Firma / Organisation").fill("Demo Firma");
  await page.getByLabel("Vorname", { exact: true }).fill("Alex");
  await page.getByLabel("Nachname", { exact: true }).fill("Beispiel");
  await page.getByLabel("Geschäftliche E-Mail").fill("alex@example.invalid");
  await page.getByRole("checkbox").last().check();
  await page
    .getByRole("button", { name: "Projekt einreichen", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Übermittlung simuliert", exact: true }),
  ).toBeVisible();
  await screenshot(page, "beleg-1440");
  expect(errors).toEqual([]);
});
test("ground branch removes roof fields, unknown and zero consumption remain distinct", async ({
  page,
  request,
}) => {
  const unknown = await fixture(page.request, {
    buildingType: "Freifläche",
    areaKind: "Freifläche",
    currentUse: "Brachfläche",
    consumption: null,
    consumptionNature: "UNKNOWN",
  });
  await page.goto(`/standortcheck/${unknown.id}/3`);
  await expect(page.getByLabel("Dachform")).toHaveCount(0);
  await expect(page.getByLabel("Aktuelle Flächennutzung")).toHaveValue(
    "Brachfläche",
  );
  await page.goto(`/projekte/${unknown.id}/ergebnis`);
  await expect(page.locator('[data-score-state="PARTIAL"]')).toBeVisible();
  await expect(page.locator(".score-number")).toHaveCount(0);
  const zero = await fixture(page.request, {
    consumption: 0,
    zeroConfirmed: true,
  });
  await page.goto(`/projekte/${zero.id}/ergebnis`);
  await expect(page.getByText("0 kWh/Jahr", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Vom Nutzer angegeben · bestätigter Nullwert", {
      exact: true,
    }),
  ).toBeVisible();
});
test("missing documents and manual location produce an honest partial score", async ({
  page,
  request,
}) => {
  const p = await fixture(page.request, {
    address: "Echteingabe ohne Kartenanbieter · Test",
    availableDocuments: [],
    noDocuments: true,
  });
  await page.goto(`/projekte/${p.id}/ergebnis`);
  await expect(page.locator('[data-score-state="PARTIAL"]')).toBeVisible();
  await expect(
    page.getByText("Noch kein Gesamtscore", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Kartendaten nicht verfügbar.", { exact: false }).first(),
  ).toBeVisible();
  expect(p.score.factors[1].contribution).toBeNull();
  expect(p.score.factors[7].contribution).toBe(0);
});
test("back navigation preserves current edits and review returns directly", async ({
  page,
  request,
}) => {
  const p = await fixture(page.request);
  await page.goto(`/standortcheck/${p.id}/5`);
  await page.getByLabel("Jahresverbrauch").fill("700.000");
  await page.getByRole("button", { name: "Zurück", exact: true }).click();
  await expect(page).toHaveURL(/\/4$/);
  await page.getByRole("button", { name: "Weiter", exact: true }).click();
  await expect(page.getByLabel("Jahresverbrauch")).toHaveValue("700.000");
});
test("partner login, filtering, pagination, dossier and preserved list state", async ({
  page,
  request,
}) => {
  await partnerLogin(page);
  const all = await (await page.request.get("/api/partner/projects")).json();
  const qualifiedCount = all.filter(
    (p: { status: string }) => p.status === "QUALIFIED",
  ).length;
  await expect(page.locator(".queue-row")).toHaveCount(50);
  await page
    .locator(".pagination")
    .getByRole("button", { name: "Weiter", exact: true })
    .click();
  await expect(page).toHaveURL(/page=2/);
  await expect(
    page.getByText(`51–100 von ${all.length} Projekten`, { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Filter", exact: true }).click();
  await page.getByLabel("Status", { exact: true }).selectOption("QUALIFIED");
  await page.getByRole("button", { name: "Filter anwenden" }).click();
  await expect(page).toHaveURL(/status=QUALIFIED/);
  await expect(page.locator(".queue-row")).toHaveCount(qualifiedCount);
  await page
    .getByRole("link", { name: "Vollständige Projektakte öffnen" })
    .click();
  await page.getByRole("link", { name: "← Zur Projektliste" }).click();
  await expect(page).toHaveURL(/status=QUALIFIED/);
  await expect(page.locator(".queue-row")).toHaveCount(qualifiedCount);
  await screenshot(page, "partner-workspace-1440");
});
test("partner request info, acceptance, OTHER rejection, conflict and reopening", async ({
  page,
  request,
}) => {
  await partnerLogin(page);
  const id = "SNAPSHOT-QUALIFIED-004";
  await page.goto(`/partner/projekte/${id}`);
  await page
    .getByRole("button", { name: "Entscheidung", exact: true })
    .first()
    .click();
  await page
    .getByRole("button", { name: "Informationen anfordern", exact: true })
    .click();
  await page.getByRole("checkbox", { name: "Lastgang", exact: true }).check();
  await page
    .getByLabel("Nachricht an Projektkontakt")
    .fill("Bitte den zeitlich zugeordneten Lastgang ergänzen.");
  await page
    .getByRole("button", { name: "Anfrage senden", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("Rückfrage simuliert");
  await page.getByRole("button", { name: "Schließen", exact: true }).click();
  await expect(
    page.getByText("Lastgang · Antwort offen", { exact: true }),
  ).toBeVisible();
  await page.goto("/partner/projekte/SNAPSHOT-QUALIFIED-005");
  await page
    .getByRole("button", { name: "Entscheidung", exact: true })
    .first()
    .click();
  await page
    .getByRole("button", { name: "Projekt übernehmen", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Übernahme bestätigen", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("Übernahme simuliert");
  await page.getByRole("button", { name: "Schließen", exact: true }).click();
  await page.goto("/partner/projekte/SNAPSHOT-QUALIFIED-006");
  await page
    .getByRole("button", { name: "Entscheidung", exact: true })
    .first()
    .click();
  await page
    .getByRole("button", { name: "Projekt begründet ablehnen", exact: true })
    .click();
  await page.getByLabel("Primärer Ablehnungsgrund").selectOption("OTHER");
  await page
    .getByLabel("Erläuterung", { exact: true })
    .fill("Demo-Prüfung: Das Vorhaben passt zeitlich nicht.");
  await page
    .getByRole("button", { name: "Projekt ablehnen", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("Ablehnung simuliert");
  await page
    .getByRole("button", { name: "Projekt wiederaufnehmen", exact: true })
    .click();
  await page
    .getByLabel("Erläuterung", { exact: true })
    .fill("Neue Projektgrundlage ist eingegangen.");
  await page
    .getByRole("button", { name: "Aktion bestätigen", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("wiederaufgenommen");
  await page.getByRole("button", { name: "Schließen", exact: true }).click();
  const conflictId = "SNAPSHOT-QUALIFIED-007";
  await page.goto(`/partner/projekte/${conflictId}`);
  await page
    .getByRole("button", { name: "Entscheidung", exact: true })
    .first()
    .click();
  await page
    .getByRole("button", { name: "Projekt übernehmen", exact: true })
    .click();
  const current = await (
    await page.request.get(`/api/partner/projects/${conflictId}`)
  ).json();
  await page.request.post(`/api/partner/projects/${conflictId}/actions`, {
    data: {
      requestId: crypto.randomUUID(),
      revision: current.revision,
      action: "note",
      note: "Paralleler fachlicher Vermerk.",
    },
  });
  await page
    .getByRole("button", { name: "Übernahme bestätigen", exact: true })
    .click();
  await expect(page.getByRole("dialog").getByRole("alert")).toContainText(
    "inzwischen geändert",
  );
  await expect(
    page.getByRole("button", { name: "Übernahme bestätigen" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Neuen Stand laden" }).click();
  await page
    .getByRole("button", { name: "Übernahme bestätigen", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("Übernahme simuliert");
});
test("six result score states and blocked high score render as distinct states", async ({
  page,
}) => {
  await partnerLogin(page);
  for (const [id, state] of [
    ["PG-DEMO-82", "ESTIMATED"],
    ["PG-DEMO-PARTIAL", "PARTIAL"],
    ["PG-DEMO-STALE", "STALE"],
    ["PG-DEMO-ERROR", "ERROR"],
    ["PG-DEMO-NOT-READY", "NOT_READY"],
    ["PG-DEMO-READY", "READY"],
  ]) {
    await page.goto(`/partner/projekte/${id}`);
    await expect(page.locator(`[data-score-state="${state}"]`)).toBeVisible();
    if (state === "PARTIAL")
      await expect(page.locator(".partial-number")).toHaveText("70–85");
  }
  await page.goto("/partner/projekte/PG-DEMO-BLOCKED");
  await expect(page.locator(".score-number")).toContainText("82");
  await expect(
    page.getByText("Bestätigter Blocker", { exact: true }),
  ).toBeVisible();
});
test("authorization, missing routes and legal pages", async ({
  page,
  request,
}) => {
  expect((await page.request.get("/api/partner/projects")).status()).toBe(401);
  await page.goto("/partner/projekte");
  await expect(page).toHaveURL(/partner\/login/);
  for (const url of ["/kontakt", "/datenschutz", "/impressum"]) {
    await page.goto(url);
    await expect(page.locator("main h1")).toBeVisible();
  }
  await page.goto("/unbekannte-seite");
  await expect(
    page.getByRole("heading", { name: "Seite nicht gefunden." }),
  ).toBeVisible();
});
test("keyboard combobox and native dialog focus return; accessibility smoke", async ({
  page,
  request,
}) => {
  await page.goto("/");
  const input = page.getByRole("combobox").first();
  await input.fill("Muster");
  await expect(page.getByRole("option")).toHaveCount(1);
  await input.press("ArrowDown");
  await input.press("Enter");
  await expect(input).toHaveValue(address);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  const p = await fixture(page.request);
  await page.goto(`/standortcheck/${p.id}/5`);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await partnerLogin(page);
  await page.getByRole("button", { name: "Filter", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(
    (await new AxeBuilder({ page }).include("dialog").analyze()).violations,
  ).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Filter", exact: true }),
  ).toBeFocused();
});
test("responsive browser screenshots and reflow across every required width", async ({
  page,
  request,
}) => {
  test.setTimeout(180000);
  const p = await fixture(page.request);
  await page.request.post("/api/session", { data: { role: "PARTNER" } });
  for (const width of [1440, 1280, 1024, 768, 390, 360, 320]) {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
    for (const [name, url] of [
      ["landing", "/"],
      ["check", `/standortcheck/${p.id}/3`],
      ["score", `/projekte/${p.id}/ergebnis`],
      ["partner", "/partner/projekte"],
      ["dossier", "/partner/projekte/PG-DEMO-82"],
      ["pipeline", "/partner/pipeline"],
    ]) {
      await page.goto(url);
      await page.evaluate(() => document.fonts.ready);
      if (name === "landing" && width === 1440) {
        const typography = await page.evaluate(() =>
          Object.fromEntries(
            ["body", "h1", "p.lead", "button", "input"].map((selector) => [
              selector,
              {
                family: getComputedStyle(document.querySelector(selector)!)
                  .fontFamily,
                size: getComputedStyle(document.querySelector(selector)!)
                  .fontSize,
              },
            ]),
          ),
        );
        console.log("Typography QA:", typography);
        const cdp = await page.context().newCDPSession(page);
        await cdp.send("DOM.enable");
        await cdp.send("CSS.enable");
        const { root } = await cdp.send("DOM.getDocument");
        for (const selector of ["h1", "p.lead", "button", "input"]) {
          const { nodeId } = await cdp.send("DOM.querySelector", {
            nodeId: root.nodeId,
            selector,
          });
          console.log(
            "Rendered fonts",
            selector,
            await cdp.send("CSS.getPlatformFontsForNode", { nodeId }),
          );
        }
        await cdp.detach();
        for (const value of Object.values(typography))
          expect(value.family).toContain("IBM Plex Sans Condensed");
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth + 1,
        ),
        `${name} ${width}px horizontal reflow`,
      ).toBe(true);
      await screenshot(page, `${name}-${width}`);
    }
  }
});
test("200% text, touch without hover, reduced motion and map landscape", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("/");
  await page
    .locator("summary")
    .filter({ hasText: "Was benötige ich für den Standortcheck?" })
    .tap();
  await expect(
    page.getByText(
      "Die Adresse und erste Angaben zu Objekt, Fläche und Stromverbrauch.",
      { exact: false },
    ),
  ).toBeVisible();
  await page.addStyleTag({ content: ":root {font-size:32px !important;}" });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  await screenshot(page, "landing-text-200-touch");
  await page.goto("/beispiel");
  await page.setViewportSize({ width: 844, height: 390 });
  await page.getByRole("button", { name: "Karte öffnen", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Vergrößern", exact: true }).click();
  await page
    .getByRole("button", { name: "Ansicht einpassen", exact: true })
    .click();
  await screenshot(page, "map-landscape-844x390", false);
  await page
    .getByRole("button", { name: "Zurück zum Projekt", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await context.close();
});

test("pending qualification request stays honest and completes without fake percentages", async ({
  page,
}) => {
  await page.request.post("/api/session", { data: { role: "OWNER" } });
  const p = await (
    await page.request.post("/api/drafts", { data: { address } })
  ).json();
  const saved = await (
    await page.request.patch(`/api/drafts/${p.id}`, {
      data: { revision: p.revision, step: 10, answers: baseAnswers },
    })
  ).json();
  let release!: () => void;
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(`**/api/projects/${p.id}/qualify`, async (route) => {
    await held;
    await route.continue();
  });
  try {
    await page.goto(`/standortcheck/${saved.id}/analyse`);
    await expect(
      page.getByText("Qualifizierungsauftrag wird ausgeführt.", {
        exact: true,
      }),
    ).toBeVisible();
    await expect(page.getByRole("progressbar")).toHaveCount(0);
    await expect(
      page.getByText("Externe Solardaten noch nicht verfügbar.", {
        exact: false,
      }),
    ).toBeVisible();
    await screenshot(page, "analyse-pending-1280");
  } finally {
    release();
  }
  await expect(page).toHaveURL(/ergebnis$/);
});

test("separate annual energy scenario and retained stale values", async ({
  page,
}) => {
  await partnerLogin(page);
  await page.goto("/partner/projekte/PG-DEMO-ENERGY");
  await expect(page.locator("[data-energy]")).toHaveCount(3);
  await expect(
    page.getByText("350–450 MWh/Jahr", { exact: true }),
  ).toBeVisible();
  expect(
    await page
      .locator(".energy-interval")
      .evaluate(
        (el) =>
          el.getBoundingClientRect().width /
          el.parentElement!.getBoundingClientRect().width,
      ),
  ).toBeCloseTo(100 / 620, 2);
  await screenshot(page, "energy-scenario-1280");
  await page.goto("/partner/projekte/PG-DEMO-ERROR");
  await expect(page.locator("[data-energy]")).toContainText("980 kWh/kWp/Jahr");
  await expect(page.locator("[data-energy]")).toContainText(
    "Aktualisierung fehlgeschlagen",
  );
});
