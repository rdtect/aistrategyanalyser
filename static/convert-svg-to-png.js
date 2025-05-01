/**
 * This is a Node.js script to convert SVG to PNG
 * To use it, you need to install:
 * npm install puppeteer
 *
 * Then run:
 * node convert-svg-to-png.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  // Create icons directory if it doesn't exist
  const iconsDir = path.join(__dirname, "icons");
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir);
  }

  // Launch a headless browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Define the sizes to generate
  const sizes = [32, 64, 192, 512];
  const svgFiles = ["logo.svg", "logo-dark.svg"];

  for (const svgFile of svgFiles) {
    const svgPath = path.join(__dirname, svgFile);
    if (fs.existsSync(svgPath)) {
      const svgContent = fs.readFileSync(svgPath, "utf8");
      const baseName = path.basename(svgFile, ".svg");

      for (const size of sizes) {
        // Set viewport size
        await page.setViewport({ width: size, height: size });

        // Set the SVG as HTML content and wait for it to load
        await page.setContent(
          `<body style="margin:0;padding:0"><div style="width:${size}px;height:${size}px;">${svgContent}</div></body>`
        );
        await page.waitForSelector("svg");

        // Take a screenshot
        const outputPath = path.join(iconsDir, `${baseName}-${size}.png`);
        await page.screenshot({ path: outputPath });
        console.log(`Generated ${outputPath}`);

        // Create the manifest icon paths
        if (size === 192 || size === 512) {
          const manifestIconPath = path.join(
            __dirname,
            size === 192 ? "icon-192.png" : "icon-512.png"
          );
          if (baseName === "logo") {
            fs.copyFileSync(outputPath, manifestIconPath);
            console.log(`Copied to ${manifestIconPath}`);
          }
        }
      }
    } else {
      console.log(`SVG file not found: ${svgPath}`);
    }
  }

  await browser.close();
  console.log("All icons generated successfully");
})().catch((err) => {
  console.error("Error generating icons:", err);
  process.exit(1);
});
