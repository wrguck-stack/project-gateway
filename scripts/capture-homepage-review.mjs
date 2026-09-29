import { chromium, expect as baseExpect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdirSync, writeFileSync } from "node:fs";

const baseURL = process.argv[2] ?? "http://127.0.0.1:3000";
const output = "docs/qa/homepage-overhaul/browser-review";
// The development preview compiles each route on its first visit.
const expect = baseExpect.configure({ timeout: 30000 });
mkdirSync(output, { recursive: true });
const browser = await chromium.launch();
const records = [];
try {
  for (const width of [1440, 1280, 1024, 768, 390, 360, 320]) {
    const context = await browser.newContext({
      baseURL,
      viewport: { width, height: width < 768 ? 844 : 1000 },
      hasTouch: width < 768,
      isMobile: width < 768,
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    const activate = (locator) =>
      width < 768 ? locator.tap() : locator.click();
    async function capture(name, locator) {
      console.log(`${width}px: ${name}`);
      await page.evaluate(async () => {
        await document.fonts.ready;
        for (const img of document.querySelectorAll("main img")) {
          const loaded = new Image();
          loaded.src = img.currentSrc || img.src;
          await loaded.decode();
        }
      });
      const target = locator ?? page;
      await target.screenshot({
        path: `${output}/${name}-${width}.png`,
        style: ".skip-link:not(:focus) { visibility: hidden; }",
      });
    }
    await page.goto("/");
    await expect(page.locator("h1[data-route-heading]")).toBeVisible();
    await capture("01-home");
    const metrics = await page.evaluate(() => {
      const cta = document
        .querySelector(".hero button[type=submit]")
        .getBoundingClientRect();
      const visual = document
        .querySelector(".hero-site")
        .getBoundingClientRect();
      return {
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        ctaBottom: cta.bottom,
        imageTop: visual.top,
        font: getComputedStyle(document.querySelector("h1")).fontFamily,
      };
    });
    expect(metrics.overflow, `${width}px horizontal reflow`).toBe(false);
    expect(metrics.ctaBottom).toBeLessThan(width < 768 ? 844 : 1000);
    expect(metrics.font).toContain("IBM Plex Sans Condensed");
    if (width < 768) expect(metrics.ctaBottom).toBeLessThan(metrics.imageTop);

    if (width === 1440 || width === 390) {
      await capture("02-dossier", page.locator(".dossier-section"));
      await capture("03-check", page.locator(".landing-check"));
      await capture("04-score", page.locator(".score-preview"));
      await capture("05-closing", page.locator(".closing"));
      const mainNav = async (name) => {
        await page.locator("body").ariaSnapshot();
        if (width < 768) {
          await activate(page.getByRole("button", { name: "Menü öffnen" }));
          await expect(
            page.getByRole("dialog", { name: "Navigation" }),
          ).toBeVisible();
          await capture("06-menu", page.getByRole("dialog"));
          await page.getByRole("dialog").ariaSnapshot();
          await activate(
            page.getByRole("dialog").getByRole("link", { name, exact: true }),
          );
          await expect(page.getByRole("dialog")).toHaveCount(0);
        } else {
          await activate(
            page
              .getByRole("navigation", { name: "Hauptnavigation" })
              .getByRole("link", { name, exact: true }),
          );
        }
      };
      await mainNav("So funktioniert’s");
      await expect(page).toHaveURL(/#ablauf$/);
      await capture("06-after-process-navigation");
      await expect(page.locator("#ablauf h2")).toBeInViewport();
      await mainNav("Für Projektpartner");
      await expect(page.locator("#projektpartner h2")).toBeInViewport();
      if (width < 768) {
        const menu = page.getByRole("button", { name: "Menü öffnen" });
        await activate(menu);
        await page.keyboard.press("Escape");
        await expect(menu).toBeFocused();
      }
      for (const name of [
        "Eigenen Standort prüfen",
        "Meinen Standort erfassen",
      ]) {
        await page.locator("body").ariaSnapshot();
        await activate(page.getByRole("button", { name, exact: true }));
        await expect(page.locator("#gateway-address-hero")).toBeFocused();
        await expect(page.locator("#gateway-address-hero")).toBeInViewport();
      }
      for (const [index, name] of [
        "Gewerbedach-PV",
        "PV-Erweiterung",
        "Speicherprojekt",
        "Freiflächenprojekt",
      ].entries()) {
        const toggle = page
          .locator(".project-types h3")
          .getByRole("button", { name: new RegExp(name) });
        await page.locator(".project-types").ariaSnapshot();
        if ((await toggle.getAttribute("aria-expanded")) !== "true")
          await activate(toggle);
        await expect(toggle).toHaveAttribute("aria-expanded", "true");
        await capture(`07-type-${index + 1}`, page.locator(".project-types"));
        await activate(toggle);
        await expect(page.locator(".project-type-detail:visible")).toHaveCount(
          0,
        );
      }
      const faq = page.locator(".faq details");
      for (const item of await faq.all()) {
        await item.ariaSnapshot();
        await activate(item.locator("summary"));
        await expect(item).toHaveAttribute("open", "");
        await expect(item.locator("p")).toBeVisible();
      }
      await capture("08-faq", page.locator(".faq"));
      const violations = (await new AxeBuilder({ page }).analyze()).violations;
      expect(violations).toEqual([]);
      await activate(
        page.getByRole("link", {
          name: "Zusammenarbeit besprechen",
          exact: true,
        }),
      );
      await expect(page).toHaveURL(/\/kontakt\?anliegen=partnerschaft$/);
      await capture("09-contact", page.locator("main"));
      await expect(page.locator("main")).toContainText("Zusammenarbeit");
      await activate(
        page
          .getByRole("banner")
          .getByRole("link", { name: "Project Gateway – Startseite" }),
      );
      await mainNav("Beispiel ansehen");
      await expect(page).toHaveURL(/\/beispiel$/);
      await capture("10-example");
      const factors = page.locator(".factors-disclosure");
      if (!(await factors.evaluate((element) => element.open)))
        await activate(factors.locator(":scope > summary"));
      await expect(page.locator("[data-factor]")).toHaveCount(9);
      await capture("11-factors", factors);
      await activate(
        page
          .getByRole("banner")
          .getByRole("link", { name: "Project Gateway – Startseite" }),
      );
      await mainNav("Partner-Login");
      await expect(page).toHaveURL(/\/partner\/login$/);
      await expect(
        page.getByRole("button", { name: "Arbeitsbereich öffnen" }),
      ).toBeVisible();
      await capture("12-partner-login", page.locator("main"));
    }
    expect(errors, `${width}px browser errors`).toEqual([]);
    records.push({ width, ...metrics, errors });
    console.log(JSON.stringify(records.at(-1)));
    await context.close();
  }
  writeFileSync(
    `${output}/metrics.json`,
    JSON.stringify(records, null, 2) + "\n",
  );
} finally {
  await browser.close();
}
