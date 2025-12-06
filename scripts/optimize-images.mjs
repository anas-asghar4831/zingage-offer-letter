/**
 * Image Optimization Script for PDF Generation
 *
 * This script optimizes images for use in @react-pdf/renderer:
 * - Resizes oversized images (no image needs to be > 1920px for a 1920x1080 PDF)
 * - Converts to optimized PNG/JPEG with high quality settings
 * - Creates backup of originals before optimization
 *
 * Run: node scripts/optimize-images.mjs
 */

import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = path.join(__dirname, "..", "public", "assets");
const BACKUP_DIR = path.join(__dirname, "..", "public", "assets-backup");

// Most images in PDF are displayed smaller than full page width
// Team avatars ~150px, logos ~200px, larger images ~800px max
const MAX_DIMENSION = 1200; // Reduced from 1920

// Quality settings - 80% quality (good balance of size/quality)
const OPTIMIZATION_CONFIG = {
  png: {
    compressionLevel: 9,
    quality: 80, // For PNG quantization
  },
  jpeg: {
    quality: 80, // Good quality, smaller files
    mozjpeg: true,
  },
};

async function getAllImages(dir) {
  const images = [];

  async function scan(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        await scan(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if ([".png", ".jpg", ".jpeg"].includes(ext)) {
          images.push(fullPath);
        }
      }
    }
  }

  await scan(dir);
  return images;
}

async function copyDirectory(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function optimizeImage(imagePath) {
  const ext = path.extname(imagePath).toLowerCase();
  const originalStats = await fs.stat(imagePath);
  const originalSize = originalStats.size;

  try {
    let image = sharp(imagePath);
    const metadata = await image.metadata();

    // Check if image needs resizing
    const needsResize =
      metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION;

    if (needsResize) {
      image = image.resize({
        width: MAX_DIMENSION,
        height: MAX_DIMENSION,
        fit: "inside", // Maintain aspect ratio, fit within bounds
        withoutEnlargement: true, // Never upscale
      });
    }

    let optimized;

    if (ext === ".png") {
      // Check if image has transparency
      if (metadata.hasAlpha) {
        // Keep PNG for transparency
        optimized = await image.png(OPTIMIZATION_CONFIG.png).toBuffer();
      } else {
        // Convert to high-quality JPEG (smaller, no visible difference)
        optimized = await image.jpeg(OPTIMIZATION_CONFIG.jpeg).toBuffer();
      }
    } else if (ext === ".jpg" || ext === ".jpeg") {
      optimized = await image.jpeg(OPTIMIZATION_CONFIG.jpeg).toBuffer();
    } else {
      return { path: imagePath, skipped: true };
    }

    const newSize = optimized.length;

    // Always save if we resized, or if smaller
    if (needsResize || newSize < originalSize) {
      await fs.writeFile(imagePath, optimized);
      return {
        path: imagePath,
        originalSize,
        newSize,
        saved: originalSize - newSize,
        percent: ((1 - newSize / originalSize) * 100).toFixed(1),
        originalWidth: metadata.width,
        originalHeight: metadata.height,
        resized: needsResize,
      };
    } else {
      return {
        path: imagePath,
        originalSize,
        newSize: originalSize,
        saved: 0,
        percent: "0.0",
        alreadyOptimized: true,
      };
    }
  } catch (error) {
    return { path: imagePath, error: error.message };
  }
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

async function main() {
  console.log("=".repeat(60));
  console.log("Image Optimization Script for PDF Generation");
  console.log("=".repeat(60));
  console.log("");
  console.log(`Max dimension: ${MAX_DIMENSION}px (PDF is 1920x1080)`);
  console.log(`Quality: ${OPTIMIZATION_CONFIG.jpeg.quality}%`);
  console.log("");

  // Check if assets directory exists
  try {
    await fs.access(ASSETS_DIR);
  } catch {
    console.error(`Error: Assets directory not found at ${ASSETS_DIR}`);
    process.exit(1);
  }

  // Create backup first
  console.log("Creating backup of original images...");
  try {
    await fs.rm(BACKUP_DIR, { recursive: true, force: true });
    await copyDirectory(ASSETS_DIR, BACKUP_DIR);
    console.log(`Backup created at: ${BACKUP_DIR}`);
    console.log("");
  } catch (error) {
    console.error("Failed to create backup:", error.message);
    process.exit(1);
  }

  // Find all images
  console.log("Scanning for images...");
  const images = await getAllImages(ASSETS_DIR);
  console.log(`Found ${images.length} images to optimize`);
  console.log("");

  // Optimize each image
  let totalOriginal = 0;
  let totalNew = 0;
  let optimizedCount = 0;
  let resizedCount = 0;
  let alreadyOptimizedCount = 0;
  let errorCount = 0;

  console.log("Optimizing images...");
  console.log("-".repeat(60));

  for (const imagePath of images) {
    const result = await optimizeImage(imagePath);
    const relativePath = path.relative(ASSETS_DIR, imagePath);

    if (result.error) {
      console.log(`ERROR: ${relativePath} - ${result.error}`);
      errorCount++;
    } else if (result.skipped) {
      console.log(`SKIP:  ${relativePath}`);
    } else if (result.alreadyOptimized) {
      console.log(`OK:    ${relativePath} (already optimized)`);
      totalOriginal += result.originalSize;
      totalNew += result.newSize;
      alreadyOptimizedCount++;
    } else {
      const resizeInfo = result.resized
        ? ` [resized from ${result.originalWidth}x${result.originalHeight}]`
        : "";
      console.log(
        `SAVED: ${relativePath} - ${formatBytes(result.originalSize)} → ${formatBytes(result.newSize)} (${result.percent}% saved)${resizeInfo}`
      );
      totalOriginal += result.originalSize;
      totalNew += result.newSize;
      optimizedCount++;
      if (result.resized) resizedCount++;
    }
  }

  // Summary
  console.log("");
  console.log("=".repeat(60));
  console.log("SUMMARY");
  console.log("=".repeat(60));
  console.log(`Total images processed: ${images.length}`);
  console.log(`Images optimized:       ${optimizedCount}`);
  console.log(`Images resized:         ${resizedCount}`);
  console.log(`Already optimized:      ${alreadyOptimizedCount}`);
  console.log(`Errors:                 ${errorCount}`);
  console.log("");
  console.log(`Original total size:    ${formatBytes(totalOriginal)}`);
  console.log(`New total size:         ${formatBytes(totalNew)}`);
  console.log(`Total saved:            ${formatBytes(totalOriginal - totalNew)}`);
  if (totalOriginal > 0) {
    console.log(
      `Reduction:              ${((1 - totalNew / totalOriginal) * 100).toFixed(1)}%`
    );
  }
  console.log("");
  console.log(`Backup location: ${BACKUP_DIR}`);
  console.log("(Delete backup after verifying image quality is acceptable)");
  console.log("");
}

main().catch(console.error);
