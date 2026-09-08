import { test, expect } from "@playwright/test";

for (const width of [1440, 390]) {
  test(`landing product preview, points geometry and entry links at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const preview = page.locator(".check-preview");
    await expect(preview).toContainText("Beispieldaten · Standortcheck");
    await expect(preview).toContainText("Auszug aus Schritt 3 von 10 · Objekt");
    await expect(preview.locator("img")).toHaveCount(0);
    await expect(preview.getByLabel("Verfügbare Fläche · m²")).toHaveValue(
      "4.800",
    );
    await expect(preview.getByLabel("Genauigkeit der Fläche")).toHaveValue(
      "Geschätzt",
    );
    await expect(
      preview.getByLabel("Dachzustand (Nutzerauskunft)"),
    ).toHaveValue("Unbekannt");
    for (const field of await preview.locator("input, select").all())
      await expect(field).toBeDisabled();

    const score = page.locator(".score-preview");
    await expect(
      score.getByRole("heading", { name: "4 von 9 Faktoren" }),
    ).toBeVisible();
    await expect(score.locator(".score-number")).toHaveText("82/100");
    await expect(score).toContainText("Synthetisches UI-Beispiel");
    await expect(score).toContainText("Vorläufig · enthält Schätzwerte");
    await expect(score).toContainText(
      "Netzanschluss und Tragfähigkeit noch nicht geprüft.",
    );
    const bars = await score.locator(".preview-factor").evaluateAll((rows) =>
      rows.map((row) => {
        const axis = row.querySelector(".mini-axis")!.getBoundingClientRect();
        const max = row.querySelector(".bar-max")!.getBoundingClientRect();
        const fill = row.querySelector("i")!.getBoundingClientRect();
        return {
          label: row.textContent,
          axis: axis.width,
          max: max.width,
          fill: fill.width,
          within: fill.right <= max.right + 0.1,
        };
      }),
    );
    // Independent contract values: a shared 0–20 points axis, not four normalized bars.
    for (const [i, [value, max]] of [
      [13, 15],
      [12, 15],
      [18, 20],
      [15, 15],
    ].entries()) {
      expect(bars[i].label).toContain(`${value}/${max}`);
      expect(bars[i].fill / bars[i].axis).toBeCloseTo(value / 20, 2);
      expect(bars[i].max / bars[i].axis).toBeCloseTo(max / 20, 2);
      expect(bars[i].fill / bars[i].max).toBeCloseTo(value / max, 2);
      expect(bars[i].within).toBe(true);
    }
    await score.getByRole("link", { name: /alle 9 Faktoren/ }).click();
    await expect(page).toHaveURL(/beispiel#score$/);
    const disclosure = page.locator(".factors-disclosure");
    if (!(await disclosure.evaluate((el) => (el as HTMLDetailsElement).open)))
      await disclosure.locator(":scope > summary").click();
    await expect(page.locator("[data-factor]")).toHaveCount(9);
    await expect(page.locator("[data-factor]").last()).toBeVisible();

    await page.goto("/", { waitUntil: "networkidle" });
    await page.getByRole("link", { name: "Eigenen Standort prüfen" }).click();
    await expect(page).toHaveURL(/#standort-start$/);
    const input = page.locator(".hero .address-form input");
    await expect(input).toBeInViewport();
    await input.fill("Muster");
    const option = page.getByRole("option", { name: /Musterstraße/ });
    await expect(option).toBeVisible();
    // Exercise the suggestion by pointer as well as the existing keyboard test.
    await option.click();
    await expect(input).toHaveValue("Musterstraße 18 · 76131 Karlsruhe");
    await expect(page.locator(".closing .address-form input")).toHaveValue(
      "Musterstraße 18 · 76131 Karlsruhe",
    );
    await page
      .locator(".hero")
      .getByRole("button", { name: "Standort prüfen", exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: "Ist das Ihr Standort?" }),
    ).toBeVisible();
    await expect(
      page.getByLabel("Adresse oder Standortbeschreibung"),
    ).toHaveValue("Musterstraße 18 · 76131 Karlsruhe");
  });
}
