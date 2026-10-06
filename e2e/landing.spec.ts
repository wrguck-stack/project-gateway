import { test, expect } from "@playwright/test";

const heroFactorLabels = [
  "Ihre Dachfläche",
  "Ihr Stromverbrauch",
  "Ihr Netzanschluss",
] as const;

test("the complete hero and its illustrations fit desktop, tablet and mobile viewports", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const [width, height] of [
    [1366, 768],
    [768, 1024],
    [820, 1180],
    [375, 667],
    [320, 640],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const hero = page.locator(".nightshift-hero");
    await expect(hero).toBeVisible();
    await expect(hero.locator("figure.gateway-hero-factor")).toHaveCount(3);
    await expect(hero.locator("figure.gateway-hero-system")).toHaveCount(1);
    await expect
      .poll(() =>
        hero.locator("img").evaluateAll(
          (images) =>
            images.length >= 3 &&
            images.every((image) => {
              const asset = image as HTMLImageElement;
              return asset.complete && asset.naturalWidth > 0;
            }),
        ),
      )
      .toBe(true);
    await page.evaluate(() => scrollTo(0, 0));
    const box = await hero.boundingBox();
    expect(box, `${width}×${height}: hero`).not.toBeNull();
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(
      box!.y + box!.height,
      `${width}×${height}: complete hero`,
    ).toBeLessThanOrEqual(height + 1);
    // Use each rendered figure and the real CTA, without depending on a controls wrapper.
    const contents = hero.locator(
      ".gateway-hero-factor, .gateway-hero-system, .nightshift-hero-primary",
    );
    await expect(contents).toHaveCount(5);
    for (const content of await contents.all()) {
      await expect(content).toBeVisible();
      const contentBox = await content.boundingBox();
      expect(contentBox, `${width}×${height}: hero content`).not.toBeNull();
      expect(contentBox!.x).toBeGreaterThanOrEqual(box!.x - 1);
      expect(contentBox!.y).toBeGreaterThanOrEqual(box!.y - 1);
      expect(contentBox!.x + contentBox!.width).toBeLessThanOrEqual(
        box!.x + box!.width + 1,
      );
      expect(contentBox!.y + contentBox!.height).toBeLessThanOrEqual(
        box!.y + box!.height + 1,
      );
    }
    for (const caption of await hero
      .locator(".gateway-hero-factor > figcaption")
      .all()) {
      await expect(caption).toBeInViewport();
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width + 1);
  }
});

for (const width of [1440, 390]) {
  test.describe(`Landing at ${width}px`, () => {
    test.use({ hasTouch: width < 768, isMobile: width < 768 });
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      await page.goto("/");
      await expect(
        page.getByRole("heading", {
          level: 1,
          name: /PV geplant\.\s*Die richtigen\s*Fragen zuerst\./,
          exact: true,
        }),
      ).toBeVisible();
    });

    test("the main hero action opens a neutral entry without creating a draft and restores focus", async ({
      page,
    }) => {
      const writes: string[] = [];
      page.on("request", (request) => {
        if (
          request.method() === "POST" &&
          new URL(request.url()).pathname.startsWith("/api/")
        )
          writes.push(request.url());
      });
      const action = page
        .locator(".nightshift-hero .nightshift-hero-primary")
        .filter({ hasText: "Standortcheck starten" });
      await expect(action).toHaveAccessibleName("Standortcheck starten");
      const dialog = page.getByRole("dialog", {
        name: "Wo liegt Ihr Standort?",
        exact: true,
      });
      // Reopening the general entry must clear any earlier project preference.
      for (let attempt = 0; attempt < 2; attempt += 1) {
        if (width < 768) await action.tap();
        else await action.click();
        await expect(dialog).toBeVisible();
        const intent = dialog.getByLabel("Projektvorhaben", { exact: true });
        await expect(intent).toHaveValue("");
        await expect(
          dialog.getByRole("combobox", {
            name: "Adresse Ihrer Immobilie oder Fläche",
            exact: true,
          }),
        ).toBeVisible();
        if (attempt === 0) await intent.selectOption("roof");
        await page.keyboard.press("Escape");
        await expect(dialog).toHaveCount(0);
        await expect(action).toBeFocused();
      }
      expect(writes).toEqual([]);
    });

    test("public navigation reaches its pages and the opportunities section from the example", async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      const navigate = async (name: string, target: RegExp) => {
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
        await expect(page).toHaveURL(target);
      };
      await navigate("Standort", /\/#ausgangslage$/);
      await expect(page.locator("#ausgangslage h2")).toBeInViewport();
      await navigate("Projektakte", /\/#projektakte$/);
      await expect(page.locator("#projektakte h2")).toBeInViewport();
      await page
        .locator("#projektakte")
        .getByRole("link", { name: "Beispielakte öffnen", exact: true })
        .click();
      await expect(page).toHaveURL(/\/beispiel$/);
      await expect(page.locator("#score")).toBeVisible();
      await navigate("Möglichkeiten", /\/#ausgangslage$/);
      await expect(page.locator("#ausgangslage h2")).toBeInViewport();
      await navigate("Kontakt", /\/kontakt$/);
      await expect(page.locator("main h1")).toBeVisible();
      if (width < 768) {
        const menu = page.getByRole("button", { name: "Menü öffnen" });
        await menu.tap();
        await page.keyboard.press("Escape");
        await expect(page.getByRole("dialog")).toHaveCount(0);
        await expect(menu).toBeFocused();
      }
    });

    test("the site record keeps provenance and open questions accessible by keyboard", async ({
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
      const record = page.locator("#projektakte");
      const tabs = record.getByRole("tablist", {
        name: "Bereiche der Projektakte",
        exact: true,
      });
      const roof = tabs.getByRole("tab", { name: "Dach", exact: true });
      const consumption = tabs.getByRole("tab", {
        name: "Verbrauch",
        exact: true,
      });
      const grid = tabs.getByRole("tab", { name: "Anschluss", exact: true });
      await expect(grid).toHaveAttribute("aria-selected", "true");
      await expect(
        record.getByRole("tabpanel", { name: "Anschluss", exact: true }),
      ).toContainText("Noch zu klären");
      await expect(record.getByRole("tabpanel")).toContainText(
        "Anschlussunterlagen",
      );
      await grid.focus();
      await grid.press("ArrowRight");
      await expect(roof).toBeFocused();
      await expect(roof).toHaveAttribute("aria-selected", "true");
      await expect(grid).toHaveAttribute("tabindex", "-1");
      await expect(record.getByRole("tabpanel")).toHaveCount(1);
      await roof.press("ArrowRight");
      await expect(consumption).toBeFocused();
      await expect(consumption).toHaveAttribute("aria-selected", "true");
      await expect(
        record.getByRole("tabpanel", { name: "Verbrauch", exact: true }),
      ).toBeVisible();
      await consumption.press("End");
      await expect(grid).toBeFocused();
      await grid.press("Home");
      await expect(roof).toBeFocused();
      await roof.press("ArrowLeft");
      await expect(grid).toBeFocused();
      await expect(record.getByRole("tabpanel")).toContainText(
        "Verfügbare Leistung erfassen",
      );
      expect(writes).toEqual([]);
      await record
        .getByRole("link", { name: "Beispielakte öffnen", exact: true })
        .click();
      await expect(page).toHaveURL(/\/beispiel$/);
      await expect(page.locator("#score")).toBeVisible();
    });

    test("site situations open the matching entry and clear stale project intent", async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      const situations = page.locator("#ausgangslage");
      const dialog = page.getByRole("dialog", {
        name: "Wo liegt Ihr Standort?",
        exact: true,
      });
      const draftWrites: string[] = [];
      page.on("request", (request) => {
        if (
          request.method() === "POST" &&
          new URL(request.url()).pathname === "/api/drafts"
        )
          draftWrites.push(request.url());
      });
      await expect(
        situations.getByRole("tab", {
          name: "PV bereits vorhanden",
          exact: true,
        }),
      ).toHaveAttribute("aria-selected", "true");

      const firstTab = situations.getByRole("tab", {
        name: "Hoher Stromverbrauch",
        exact: true,
      });
      const lastTab = situations.getByRole("tab", {
        name: "Ungenutzte Dachfläche",
        exact: true,
      });
      const existingTab = situations.getByRole("tab", {
        name: "PV bereits vorhanden",
        exact: true,
      });
      await existingTab.focus();
      await existingTab.press("Home");
      await expect(firstTab).toBeFocused();
      await expect(firstTab).toHaveAttribute("aria-selected", "true");
      await firstTab.press("ArrowLeft");
      await expect(lastTab).toBeFocused();
      await expect(lastTab).toHaveAttribute("aria-selected", "true");
      await lastTab.press("ArrowRight");
      await expect(firstTab).toBeFocused();
      await firstTab.press("End");
      await expect(lastTab).toBeFocused();

      for (const scenario of [
        {
          title: "PV bereits vorhanden",
          action: "Standort angeben",
          selected: "extension",
        },
        {
          title: "Ungenutzte Dachfläche",
          action: "Standort angeben",
          selected: "roof",
        },
        {
          title: "Hoher Stromverbrauch",
          action: "Standort angeben",
          selected: undefined,
        },
      ]) {
        const toggle = situations.getByRole("tab", {
          name: scenario.title,
          exact: true,
        });
        if (width < 768) await toggle.tap();
        else await toggle.click();
        await expect(toggle).toHaveAttribute("aria-selected", "true");
        await expect(situations.getByRole("tabpanel")).toHaveCount(1);
        const panel = situations.getByRole("tabpanel", {
          name: scenario.title,
          exact: true,
        });
        const action = panel.getByRole("button", {
          name: scenario.action,
          exact: true,
        });
        if (width < 768) await action.tap();
        else await action.click();
        await expect(dialog).toBeVisible();
        await expect(
          dialog.getByRole("combobox", {
            name: "Adresse Ihrer Immobilie oder Fläche",
            exact: true,
          }),
        ).toBeVisible();
        await expect(
          dialog.getByLabel("Projektvorhaben", { exact: true }),
        ).toHaveValue(scenario.selected ?? "");
        if (scenario.selected) {
          const close = dialog.getByRole("button", {
            name: "Schließen",
            exact: true,
          });
          if (width < 768) await close.tap();
          else await close.click();
          await expect(dialog).toHaveCount(0);
          await expect(action).toBeFocused();
        }
        expect(draftWrites).toEqual([]);
      }

      const address = "QA Verbrauchsprofil · Gewerbepark 2";
      const input = dialog.getByRole("combobox", {
        name: "Adresse Ihrer Immobilie oder Fläche",
        exact: true,
      });
      await input.fill(address);
      const created = page.waitForResponse(
        (response) =>
          new URL(response.url()).pathname === "/api/drafts" &&
          response.request().method() === "POST",
      );
      await input.press("Enter");
      const response = await created;
      expect(response.ok()).toBeTruthy();
      expect(response.request().postDataJSON()).toEqual({ address });
      const project = await response.json();
      await expect(page).toHaveURL(
        new RegExp(`/standortcheck/${project.id}/1$`),
      );
      await expect(
        page.getByLabel("Adresse oder Standortbeschreibung", { exact: true }),
      ).toHaveValue(address);
      expect(draftWrites).toHaveLength(1);
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
      test(`${scenario.title} starts through the entry form with editable intent defaults`, async ({
        page,
      }) => {
        const draftWrites: string[] = [];
        page.on("request", (request) => {
          if (
            request.method() === "POST" &&
            new URL(request.url()).pathname === "/api/drafts"
          )
            draftWrites.push(request.url());
        });
        await page
          .getByRole("button", { name: "Standortcheck starten", exact: true })
          .click();
        const dialog = page.getByRole("dialog", {
          name: "Wo liegt Ihr Standort?",
          exact: true,
        });
        await expect(dialog).toBeVisible();
        const input = dialog.getByRole("combobox", {
          name: "Adresse Ihrer Immobilie oder Fläche",
          exact: true,
        });
        await expect(input).toBeVisible();
        const projectIntent = dialog.getByLabel("Projektvorhaben", {
          exact: true,
        });
        await expect(projectIntent).toHaveValue("");
        await projectIntent.selectOption(scenario.intent);
        await expect(projectIntent).toHaveValue(scenario.intent);
        const address = `QA ${scenario.title} · Gewerbepark 1`;
        await input.fill(address);
        await expect(page.locator(".closing .address-form input")).toHaveValue(
          address,
        );
        if (scenario.intent === "roof") {
          const closing = page.locator(".closing");
          const changeIntent = closing.getByRole("button", {
            name: "Projektvorhaben ändern",
            exact: true,
          });
          const closeDialog = dialog.getByRole("button", {
            name: "Schließen",
            exact: true,
          });
          await closeDialog.click();
          await expect(dialog).toHaveCount(0);
          await changeIntent.click();
          await expect(projectIntent).toHaveValue("roof");
          await projectIntent.selectOption("storage");
          await closeDialog.click();
          await expect(dialog).toHaveCount(0);
          await expect(changeIntent).toBeFocused();
          await expect(closing).toContainText("Speicherprojekt");
          await changeIntent.click();
          await expect(projectIntent).toHaveValue("storage");
          await expect(input).toHaveValue(address);
          await projectIntent.selectOption(scenario.intent);
        }
        expect(draftWrites).toEqual([]);
        const created = page.waitForResponse(
          (response) =>
            new URL(response.url()).pathname === "/api/drafts" &&
            response.request().method() === "POST",
        );
        await input.press("Enter");
        const response = await created;
        expect(response.ok()).toBeTruthy();
        expect(draftWrites).toHaveLength(1);
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
        name: "Weiter zu den Standortangaben",
        exact: true,
      });
      const address = "QA Rückkehr · Gewerbepark 5";
      await input.fill(address);
      await button.click();
      const error = closing.getByRole("alert");
      await expect(error).toContainText("HTTP 502");
      await expect(error).toBeFocused();
      await expect(error).toBeInViewport();
      await expect(page.getByRole("dialog")).toHaveCount(0);
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

    test("the full example preserves all nine factors on a common points axis", async ({
      page,
    }) => {
      await page.goto("/beispiel");
      await page.evaluate(() => document.fonts.ready);
      const score = page.locator(".score-summary");
      await expect(score.locator(".score-number")).toHaveText("82/100");
      await expect(score).toContainText("Vorläufig · enthält Schätzwerte");
      await expect(score).toContainText("Keine technische Freigabe");
      await expect(score).toContainText(
        "Netzanschluss und Tragfähigkeit sind noch nicht geprüft.",
      );
      const disclosure = page.locator(".factors-disclosure");
      if (!(await disclosure.evaluate((el) => (el as HTMLDetailsElement).open)))
        await disclosure.locator(":scope > summary").click();
      await expect(page.locator("[data-factor]")).toHaveCount(9);
      const bars = await page.locator("[data-factor]").evaluateAll((rows) =>
        rows.map((row) => {
          const contentWidth = (element: Element) => {
            const style = getComputedStyle(element);
            return (
              element.getBoundingClientRect().width -
              parseFloat(style.borderLeftWidth) -
              parseFloat(style.borderRightWidth) -
              parseFloat(style.paddingLeft) -
              parseFloat(style.paddingRight)
            );
          };
          const axis = row.querySelector(".factor-axis")!;
          const maximumElement = row.querySelector(".bar-max")!;
          const maximum = maximumElement.getBoundingClientRect();
          const fill = row.querySelector("i")!.getBoundingClientRect();
          return {
            label: row.textContent,
            axis: contentWidth(axis),
            maximum: maximum.width,
            maximumContent: contentWidth(maximumElement),
            fill: fill.width,
            within: fill.right <= maximum.right + 0.1,
          };
        }),
      );
      // Independent acceptance values: shared 0–20 points, not normalized percentages.
      expect(bars).toHaveLength(9);
      for (const [index, [value, maximum]] of [
        [13, 15],
        [12, 15],
        [18, 20],
        [15, 15],
        [6, 10],
        [4, 5],
        [7, 10],
        [3, 5],
        [4, 5],
      ].entries()) {
        expect(bars[index].label).toContain(`${value} / ${maximum}`);
        expect(bars[index].axis).toBeGreaterThan(0);
        expect(bars[index].maximumContent).toBeGreaterThan(0);
        // The inner fill percentage uses the maximum bar's content box;
        // its 1px borders do not encode points. Check that fraction separately
        // and then place it on the shared 0–20 axis via the maximum's width.
        const contributionFraction =
          bars[index].fill / bars[index].maximumContent;
        expect(contributionFraction).toBeCloseTo(value / maximum, 2);
        expect(
          contributionFraction * (bars[index].maximum / bars[index].axis),
        ).toBeCloseTo(value / 20, 2);
        expect(bars[index].maximum / bars[index].axis).toBeCloseTo(
          maximum / 20,
          2,
        );
        expect(bars[index].within).toBe(true);
      }
      await page
        .locator("[data-factor]")
        .first()
        .locator("details > summary")
        .click();
      await expect(
        page.locator("[data-factor]").first().locator(".factor-rule"),
      ).toContainText("Belegreferenz:");
    });
  });
}

test("the hero explains three factors without presenting illustrations as interactive controls", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const hero = page.locator(".nightshift-hero");
  const factors = hero.locator("figure.gateway-hero-factor");
  await expect(factors).toHaveCount(3);
  await expect(factors.locator(":scope > figcaption")).toHaveText([
    ...heroFactorLabels,
  ]);
  for (const factor of await factors.all()) {
    await expect(factor).toBeVisible();
    await expect(factor.locator("img")).toHaveCount(1);
    await expect(factor.locator("img")).toHaveAttribute("alt", "");
  }
  const system = hero.locator("figure.gateway-hero-system");
  await expect(system).toBeVisible();
  await expect(system).toHaveAccessibleDescription(/qualitativ/i);
  await expect(hero.getByRole("tablist")).toHaveCount(0);
  await expect(hero.getByRole("tab")).toHaveCount(0);
  await expect(hero.getByRole("tabpanel")).toHaveCount(0);
  // Explanatory graphics must not offer the removed tabs, hotspots or keyboard stops.
  expect(
    await hero
      .locator(".gateway-hero-factor, .gateway-hero-system")
      .evaluateAll((figures) =>
        figures.some((figure) =>
          [figure, ...figure.querySelectorAll("*")].some((element) => {
            const node = element as HTMLElement;
            return (
              node.tabIndex >= 0 ||
              node.matches(
                'a[href], button, input, select, textarea, [role="button"], [role="tab"], [role="link"]',
              )
            );
          }),
        ),
      ),
  ).toBe(false);

  const action = hero.getByRole("button", {
    name: "Standortcheck starten",
    exact: true,
  });
  const target = await action.boundingBox();
  expect(target!.width).toBeGreaterThanOrEqual(44);
  expect(target!.height).toBeGreaterThanOrEqual(44);
  await action.focus();
  await action.press("Enter");
  const dialog = page.getByRole("dialog", {
    name: "Wo liegt Ihr Standort?",
    exact: true,
  });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByLabel("Projektvorhaben", { exact: true }),
  ).toHaveValue("");
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(action).toBeFocused();
});
