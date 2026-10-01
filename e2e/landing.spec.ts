import { test, expect } from "@playwright/test";

for (const width of [1440, 390]) {
  test.describe(`Landing at ${width}px`, () => {
    test.use({ hasTouch: width < 768, isMobile: width < 768 });
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      await page.goto("/");
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });

    test("section navigation scrolls to its target on the homepage and from the example", async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      const navigate = async (name: string, target: string) => {
        if (width < 768) {
          await page.getByRole("button", { name: "Menü öffnen" }).tap();
          await page
            .getByRole("dialog", { name: "Navigation" })
            .getByRole("link", { name, exact: true })
            .tap();
          await expect(page.getByRole("dialog")).toHaveCount(0);
        } else {
          await page
            .getByRole("navigation", { name: "Hauptnavigation" })
            .getByRole("link", { name, exact: true })
            .click();
        }
        await expect(page).toHaveURL(new RegExp(`#${target}$`));
        await expect(page.locator(`#${target} h2`)).toBeInViewport();
      };
      await page.locator(".closing").scrollIntoViewIfNeeded();
      await navigate("So funktioniert’s", "ablauf");
      await navigate("Für Projektpartner", "projektpartner");
      await page.goto("/beispiel");
      await navigate("So funktioniert’s", "ablauf");
      if (width < 768) {
        const menu = page.getByRole("button", { name: "Menü öffnen" });
        await menu.tap();
        await page.keyboard.press("Escape");
        await expect(page.getByRole("dialog")).toHaveCount(0);
        await expect(menu).toBeFocused();
      }
    });

    test("the interactive check changes its summary without saving or changing the score", async ({
      page,
    }) => {
      const writes: string[] = [];
      page.on("request", (request) => {
        if (
          request.method() !== "GET" &&
          new URL(request.url()).pathname.startsWith("/api/")
        )
          writes.push(request.url());
      });
      const preview = page.locator(".check-preview");
      const summary = preview.getByRole("status");
      const area = preview.getByLabel("Verfügbare Fläche · m²", {
        exact: true,
      });
      const nature = preview.getByLabel("Genauigkeit der Fläche", {
        exact: true,
      });
      const score = page.locator(".score-preview .score-number");
      await expect(area).toBeEnabled();
      await area.fill("8.250,5");
      await expect(summary).toContainText("ca. 8.250,5 m² Dachfläche");
      await nature.selectOption("Genau bekannt");
      await expect(summary).toContainText("8.250,5 m² Dachfläche");
      await expect(summary).not.toContainText("ca.");
      await preview
        .getByLabel("Dachzustand (Nutzerauskunft)")
        .selectOption("Sanierung geplant");
      await expect(summary).toContainText("Dachzustand: Sanierung geplant");

      await preview
        .getByRole("radio", { name: "Freifläche", exact: true })
        .check();
      await expect(summary).toContainText("8.250,5 m² Freifläche");
      await expect(summary).toContainText("Genehmigung");
      await expect(summary).not.toContainText("Dachzustand");
      await expect(
        preview.getByLabel("Dachzustand (Nutzerauskunft)"),
      ).toHaveCount(0);

      await nature.selectOption("Noch unbekannt");
      await expect(area).toHaveCount(0);
      await expect(summary).toContainText("Fläche noch offen");
      await expect(summary).not.toContainText("8.250");
      await nature.selectOption("Geschätzt");
      await area.fill("-20");
      await expect(summary).toContainText(
        "Bitte eine positive Fläche eingeben",
      );
      await expect(area).toHaveAttribute("aria-invalid", "true");
      await area.fill("2.000");
      await expect(summary).toContainText("ca. 2.000 m² Freifläche");
      await expect(area).not.toHaveAttribute("aria-invalid", "true");
      await expect(score).toHaveText("82/100");
      await expect(preview).toContainText("verändern keinen Score");
      expect(writes).toEqual([]);
    });

    test("the dossier tabs expose their content by keyboard and link to the full example", async ({
      page,
    }) => {
      const dossier = page.locator(".dossier-preview");
      const objectTab = dossier.getByRole("tab", {
        name: "Objekt",
        exact: true,
      });
      const energyTab = dossier.getByRole("tab", {
        name: "Energie",
        exact: true,
      });
      const nextTab = dossier.getByRole("tab", {
        name: "Nächste Schritte",
        exact: true,
      });
      await objectTab.focus();
      await objectTab.press("ArrowRight");
      await expect(energyTab).toBeFocused();
      await expect(energyTab).toHaveAttribute("aria-selected", "true");
      await expect(objectTab).toHaveAttribute("tabindex", "-1");
      await expect(dossier.getByRole("tabpanel")).toHaveCount(1);
      await expect(
        dossier.getByRole("tabpanel", { name: "Energie", exact: true }),
      ).toContainText("620.000 kWh");
      await energyTab.press("End");
      await expect(nextTab).toBeFocused();
      await expect(
        dossier.getByRole("tabpanel", {
          name: "Nächste Schritte",
          exact: true,
        }),
      ).toContainText("Tragfähigkeit");
      await nextTab.press("ArrowRight");
      await expect(objectTab).toBeFocused();
      await objectTab.press("ArrowLeft");
      await expect(nextTab).toBeFocused();
      await nextTab.press("Home");
      await expect(objectTab).toBeFocused();
      await expect(
        dossier.getByRole("tabpanel", { name: "Objekt", exact: true }),
      ).toContainText("ca. 4.800 m²");
      await dossier
        .getByRole("link", { name: "Vollständige Beispielakte öffnen" })
        .click();
      await expect(page).toHaveURL(/\/beispiel$/);
      await expect(page.locator("#score")).toBeVisible();
    });

    for (const scenario of [
      {
        intent: "roof",
        title: "Gewerbedach-PV",
        action: "Dachprojekt vorbereiten",
        goal: "Möglichkeiten zunächst prüfen",
      },
      {
        intent: "extension",
        title: "PV-Erweiterung",
        action: "Erweiterung vorbereiten",
        goal: "Bestehende PV erweitern",
      },
      {
        intent: "storage",
        title: "Speicherprojekt",
        action: "Speicherprojekt vorbereiten",
        goal: "Speicher ergänzen",
      },
      {
        intent: "ground",
        title: "Freiflächenprojekt",
        action: "Freifläche vorbereiten",
        goal: "Dach oder Fläche bereitstellen",
      },
    ]) {
      test(`${scenario.title} starts a real check with editable intent defaults`, async ({
        page,
      }) => {
        const types = page.locator(".project-types");
        const toggle = types
          .locator("h3")
          .getByRole("button", { name: new RegExp(scenario.title) });
        if ((await toggle.getAttribute("aria-expanded")) !== "true")
          await toggle.click();
        await expect(toggle).toHaveAttribute("aria-expanded", "true");
        await expect(types.locator(".project-type-detail:visible")).toHaveCount(
          1,
        );
        await types
          .getByRole("button", { name: scenario.action, exact: true })
          .click();
        const hero = page.locator(".hero");
        const input = hero.getByRole("combobox", {
          name: "Adresse Ihrer Immobilie oder Fläche",
          exact: true,
        });
        await expect(input).toBeFocused();
        await expect(hero.getByRole("status")).toContainText(
          `${scenario.title} ausgewählt`,
        );
        const address = `QA ${scenario.title} · Gewerbepark 1`;
        await input.fill(address);
        await expect(page.locator(".closing .address-form input")).toHaveValue(
          address,
        );
        const created = page.waitForResponse(
          (response) =>
            new URL(response.url()).pathname === "/api/drafts" &&
            response.request().method() === "POST",
        );
        await input.press("Enter");
        const response = await created;
        expect(response.ok()).toBeTruthy();
        expect(response.request().postDataJSON()).toEqual({
          address,
          projectIntent: scenario.intent,
        });
        const project = await response.json();
        expect(project.answers.goal).toBe(scenario.goal);
        expect(project.answers.pv).toBe("Unbekannt");
        expect(project.answers.battery).toBe("Unbekannt");
        expect(project.answers.area).toBeNull();
        expect(project.answers.locationConfirmed).toBe(false);
        await expect(page).toHaveURL(
          new RegExp(`/standortcheck/${project.id}/1$`),
        );
        await expect(
          page.getByLabel("Adresse oder Standortbeschreibung", { exact: true }),
        ).toHaveValue(address);
        await page
          .getByLabel("Ich bestätige die Standortangabe.", { exact: true })
          .check();
        await page
          .getByRole("button", { name: "Standort bestätigen", exact: true })
          .click();
        await expect(page).toHaveURL(
          new RegExp(`/standortcheck/${project.id}/2$`),
        );
        if (scenario.intent === "ground") {
          await expect(
            page.getByRole("radio", { name: "Freifläche", exact: true }),
          ).toBeChecked();
        } else {
          await expect(page.getByRole("radio", { checked: true })).toHaveCount(
            0,
          );
          await page
            .getByRole("radio", { name: "Logistikhalle", exact: true })
            .check();
        }
        await page.getByRole("button", { name: "Weiter", exact: true }).click();
        await expect(page).toHaveURL(
          new RegExp(`/standortcheck/${project.id}/3$`),
        );
        await expect(
          page.getByRole("radio", {
            name: scenario.intent === "ground" ? "Freifläche" : "Dach",
            exact: true,
          }),
        ).toBeChecked();
        await expect(
          page.getByLabel("Genauigkeit der Fläche", { exact: true }),
        ).toHaveValue("Noch unbekannt");
        if (scenario.intent === "ground") {
          await expect(
            page.getByLabel("Aktuelle Flächennutzung", { exact: true }),
          ).toBeVisible();
          await expect(
            page.getByLabel("Dachzustand (Nutzerauskunft)"),
          ).toHaveCount(0);
          // Preselection remains an editable answer rather than a locked product type.
          await page.getByRole("radio", { name: "Dach", exact: true }).check();
          await expect(
            page.getByLabel("Dachzustand (Nutzerauskunft)"),
          ).toBeVisible();
        }
      });
    }

    test("a failed closing-form request shows a nearby error and allows a real retry", async ({
      page,
    }) => {
      let draftAttempts = 0;
      await page.route("**/api/drafts", async (route) => {
        if (route.request().method() !== "POST") return route.continue();
        draftAttempts += 1;
        if (draftAttempts === 1) {
          await route.fulfill({
            status: 502,
            contentType: "text/html",
            body: "<html>Bad Gateway</html>",
          });
        } else {
          await route.continue();
        }
      });
      const closing = page.locator(".closing .address-form");
      const input = closing.getByRole("combobox");
      const button = closing.getByRole("button", {
        name: "Meine Möglichkeiten prüfen",
        exact: true,
      });
      const address = "QA Rückkehr · Gewerbepark 5";
      await input.fill(address);
      await button.click();
      const error = closing.getByRole("alert");
      await expect(error).toContainText("HTTP 502");
      await expect(error).toBeFocused();
      await expect(error).toBeInViewport();
      await expect(page.locator(".hero").getByRole("alert")).toHaveCount(0);
      await expect(input).toHaveValue(address);
      await expect(input).toBeEnabled();
      await expect(button).toBeEnabled();
      const errorId = await error.getAttribute("id");
      expect(errorId).toBeTruthy();
      await expect(input).toHaveAttribute(
        "aria-describedby",
        new RegExp(errorId!),
      );
      await button.click();
      await expect(
        page.getByRole("heading", {
          name: "Ist das Ihr Standort?",
          exact: true,
        }),
      ).toBeVisible();
      await expect(
        page.getByLabel("Adresse oder Standortbeschreibung", { exact: true }),
      ).toHaveValue(address);
      expect(draftAttempts).toBe(2);
    });

    test("the score preserves the common points axis and opens all nine factors", async ({
      page,
    }) => {
      await page.evaluate(() => document.fonts.ready);
      const score = page.locator(".score-preview");
      await expect(
        score.getByRole("heading", { name: "4 von 9 Faktoren" }),
      ).toBeVisible();
      await expect(score.locator(".score-number")).toHaveText("82/100");
      await expect(score).toContainText("Beispielbewertung");
      await expect(score).toContainText("Vorläufig · enthält Schätzwerte");
      await expect(score).toContainText(
        "Netzanschluss und Tragfähigkeit noch nicht geprüft.",
      );
      const bars = await score.locator(".preview-factor").evaluateAll((rows) =>
        rows.map((row) => {
          const axis = row.querySelector(".mini-axis")!.getBoundingClientRect();
          const maximum = row
            .querySelector(".bar-max")!
            .getBoundingClientRect();
          const fill = row.querySelector("i")!.getBoundingClientRect();
          return {
            label: row.textContent,
            axis: axis.width,
            maximum: maximum.width,
            fill: fill.width,
            within: fill.right <= maximum.right + 0.1,
          };
        }),
      );
      // Independent acceptance values: shared 0–20 points, not normalized percentages.
      expect(bars).toHaveLength(4);
      for (const [index, [value, maximum]] of [
        [13, 15],
        [12, 15],
        [18, 20],
        [15, 15],
      ].entries()) {
        expect(bars[index].label).toContain(`${value}/${maximum}`);
        expect(bars[index].axis).toBeGreaterThan(0);
        expect(bars[index].fill / bars[index].axis).toBeCloseTo(value / 20, 2);
        expect(bars[index].maximum / bars[index].axis).toBeCloseTo(
          maximum / 20,
          2,
        );
        expect(bars[index].within).toBe(true);
      }
      await score.getByRole("link", { name: /alle 9 Faktoren/ }).click();
      await expect(page).toHaveURL(/\/beispiel#score$/);
      const disclosure = page.locator(".factors-disclosure");
      if (!(await disclosure.evaluate((el) => (el as HTMLDetailsElement).open)))
        await disclosure.locator(":scope > summary").click();
      await expect(page.locator("[data-factor]")).toHaveCount(9);
      await expect(page.locator("[data-factor]").last()).toBeVisible();
    });
  });
}
