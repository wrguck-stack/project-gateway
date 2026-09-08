import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";

const output = "docs/qa/landing-product-pass/after";
const baseURL = process.argv[2] ?? "http://127.0.0.1:3000";
mkdirSync(output, { recursive: true });
const browser = await chromium.launch();
const records = [];
try {
  for (const width of [1440, 1280, 1024, 768, 390, 360, 320]) {
    const context = await browser.newContext({
      viewport: { width, height: width < 768 ? 844 : 900 },
      hasTouch: width < 768,
      isMobile: width < 768,
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(baseURL, { waitUntil: "networkidle" });
    await page.evaluate(async () => {
      await document.fonts.ready;
      for (const img of document.querySelectorAll("main img")) {
        img.loading = "eager";
        await img.decode();
      }
    });
    const metrics = await page.evaluate(() => {
      const box = (selector) => {
        const r = document.querySelector(selector).getBoundingClientRect();
        return {
          x: r.x,
          y: r.y,
          width: r.width,
          height: r.height,
          bottom: r.bottom,
        };
      };
      const h = document.querySelector(".hero-property");
      const range = document.createRange();
      range.selectNodeContents(h);
      return {
        width: innerWidth,
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        hero: box(".hero"),
        heading: box(".hero h1"),
        headingWordLines: range.getClientRects().length,
        input: box(".hero input"),
        cta: box(".hero .button"),
        process: box(".process-grid"),
        check: box(".landing-check"),
        checkContent: box(".check-preview"),
        score: box(".score-preview"),
        scoreContent: box(".preview-grid"),
        projectTypes: box(".project-types"),
        projectIntro: box("#projektarten .overline"),
        sectionInset: getComputedStyle(document.querySelector(".landing-check"))
          .paddingTop,
        factors: [...document.querySelectorAll(".preview-factor")].map(
          (el) => ({
            label: el.textContent,
            axis: el.querySelector(".mini-axis").getBoundingClientRect().width,
            max: el.querySelector(".bar-max").getBoundingClientRect().width,
            fill: el.querySelector("i").getBoundingClientRect().width,
          }),
        ),
        images: [...document.querySelectorAll("main img")].map((img) => ({
          src: img.getAttribute("src"),
          native: [img.naturalWidth, img.naturalHeight],
          display: [img.clientWidth, img.clientHeight],
        })),
      };
    });
    records.push({ ...metrics, errors });
    assert.equal(metrics.overflow, false, `${width}px: horizontal overflow`);
    assert.deepEqual(errors, [], `${width}px: browser errors`);
    assert.ok(
      metrics.cta.bottom < (width < 768 ? 844 : 900),
      `${width}px: CTA outside initial viewport`,
    );
    if (width >= 1280)
      assert.equal(metrics.headingWordLines, 1, "Desktop word split");
    await page.screenshot({ path: `${output}/viewport-${width}.png` });
    if (width === 1440 || width === 390) {
      await page.screenshot({
        path: `${output}/landing-${width}.png`,
        fullPage: true,
      });
      for (const [name, selector] of Object.entries({
        hero: ".hero",
        process: "#ablauf",
        check: ".landing-check",
        score: ".score-preview",
        types: ".project-types",
      })) {
        await page.locator(selector).screenshot({
          path: `${output}/${name}-${width}.png`,
          style: ".skip-link:not(:focus) { visibility: hidden; }",
        });
      }
    }
    console.log(
      JSON.stringify({
        width,
        overflow: metrics.overflow,
        ctaBottom: metrics.cta.bottom,
        errors,
      }),
    );
    await context.close();
  }
  writeFileSync(
    `${output}/metrics.json`,
    JSON.stringify(records, null, 2) + "\n",
  );
} finally {
  await browser.close();
}
