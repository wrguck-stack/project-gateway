import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
const phase = process.argv[2] ?? "after";
if (!["before", "after"].includes(phase))
  throw new Error("Use before or after");
const baseURL = process.argv[3] ?? "http://127.0.0.1:3000";
const output = `docs/qa/landing-refinement/${phase}`;
mkdirSync(output, { recursive: true });
const browser = await chromium.launch();
const records = [];
try {
  for (const [width, height] of [
    [1440, 900],
    [1280, 800],
    [1024, 900],
    [768, 1024],
    [390, 844],
    [360, 800],
    [320, 800],
  ]) {
    const context = await browser.newContext({
      viewport: { width, height },
      hasTouch: width < 768,
      isMobile: width < 768,
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(baseURL, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    // Load below-the-fold thumbnails before full-page captures and asset QA.
    await page.evaluate(async () => {
      for (const img of document.querySelectorAll("main img")) {
        img.loading = "eager";
        await img.decode();
      }
    });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.screenshot({ path: `${output}/landing-${width}.png` });
    if (width === 1440 || width === 390)
      await page.screenshot({
        path: `${output}/landing-${width}-full.png`,
        fullPage: true,
      });
    const metrics = await page.evaluate(() => {
      const box = (selector) => {
        const el = document.querySelector(selector);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          x: r.x,
          y: r.y,
          width: r.width,
          height: r.height,
          bottom: r.bottom,
        };
      };
      const h = document.querySelector(".hero h1");
      const walker = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
      const words = [];
      while (walker.nextNode()) {
        const node = walker.currentNode;
        for (const m of node.textContent.matchAll(/\S+/g)) {
          const range = document.createRange();
          range.setStart(node, m.index);
          range.setEnd(node, m.index + m[0].length);
          words.push({
            word: m[0],
            rects: [...range.getClientRects()].map((r) => ({
              x: r.x,
              y: r.y,
              width: r.width,
              height: r.height,
            })),
          });
        }
      }
      return {
        viewport: { width: innerWidth, height: innerHeight },
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        heading: box(".hero h1"),
        hero: box(".hero"),
        subline: box(".hero .lead"),
        input: box(".hero input"),
        cta: box(".hero .address-form button"),
        image: box(".hero > .hero-site"),
        headingFont: {
          family: getComputedStyle(h).fontFamily,
          size: getComputedStyle(h).fontSize,
          lineHeight: getComputedStyle(h).lineHeight,
        },
        words,
        imageAssets: [...document.querySelectorAll("main img")].map((i) => ({
          src: i.getAttribute("src"),
          loaded: i.complete && i.naturalWidth > 0,
          width: i.naturalWidth,
          height: i.naturalHeight,
        })),
      };
    });
    const renderedFonts = {};
    if (width === 1440) {
      const cdp = await context.newCDPSession(page);
      await cdp.send("DOM.enable");
      await cdp.send("CSS.enable");
      const { root } = await cdp.send("DOM.getDocument");
      for (const selector of [
        ".hero h1",
        ".hero .lead",
        ".hero label",
        ".header .brand",
      ]) {
        const { nodeId } = await cdp.send("DOM.querySelector", {
          nodeId: root.nodeId,
          selector,
        });
        renderedFonts[selector] = (
          await cdp.send("CSS.getPlatformFontsForNode", { nodeId })
        ).fonts;
      }
      await cdp.detach();
    }
    records.push({ width, height, ...metrics, renderedFonts, errors });
    assert.equal(metrics.overflow, false, `${width}px: horizontal overflow`);
    assert.deepEqual(errors, [], `${width}px: browser errors`);
    if (phase === "after") {
      assert.ok(
        metrics.imageAssets.every((img) => img.loaded),
        `${width}px: image loading`,
      );
      assert.ok(metrics.cta.bottom < height, `${width}px: CTA below viewport`);
      if (width >= 1280) {
        const property = metrics.words.find(({ word }) =>
          word.includes("Gewerbe"),
        );
        assert.equal(
          property.rects.length,
          1,
          `${width}px: property word splits`,
        );
      }
    }
    console.log(
      JSON.stringify({
        phase,
        width,
        headingHeight: metrics.heading.height,
        ctaBottom: metrics.cta.bottom,
        overflow: metrics.overflow,
        errors,
      }),
    );
    if (width === 390) {
      await page.locator(".project-types").screenshot({
        path: `${output}/project-types-390.png`,
        // A tall element clip can pull fixed offscreen UI into the image.
        // The unfocused skip link is outside the real viewport already.
        style: ".skip-link:not(:focus) { visibility: hidden; }",
      });
    }
    await context.close();
  }
  writeFileSync(
    `${output}/metrics.json`,
    JSON.stringify(records, null, 2) + "\n",
  );
} finally {
  await browser.close();
}
