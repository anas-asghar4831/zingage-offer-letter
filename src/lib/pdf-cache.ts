import crypto from "crypto";
import type { OfferLetterData } from "./types";

// Simple in-memory LRU cache for PDFs
interface CacheEntry {
  buffer: Buffer;
  etag: string;
  timestamp: number;
}

class PDFCache {
  private cache = new Map<string, CacheEntry>();
  private maxSize: number;
  private maxAge: number; // milliseconds

  constructor(maxSize = 50, maxAgeMs = 3600000) {
    // 50 PDFs, 1 hour default
    this.maxSize = maxSize;
    this.maxAge = maxAgeMs;
  }

  // Generate cache key from offer data - different data = different key
  generateKey(data: OfferLetterData): string {
    // Sort keys for consistent hashing
    const normalized = JSON.stringify(data, Object.keys(data).sort());
    return crypto.createHash("md5").update(normalized).digest("hex");
  }

  // Generate ETag from PDF buffer
  generateETag(buffer: Buffer): string {
    return `"${crypto.createHash("md5").update(buffer).digest("hex")}"`;
  }

  // Get cached PDF if exists and not expired
  get(key: string): CacheEntry | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }

    // Move to end (LRU)
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry;
  }

  // Store PDF in cache
  set(key: string, buffer: Buffer): CacheEntry {
    // Enforce max size (remove oldest)
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    const entry: CacheEntry = {
      buffer,
      etag: this.generateETag(buffer),
      timestamp: Date.now(),
    };

    this.cache.set(key, entry);
    return entry;
  }

  // Check if ETag matches (for 304 responses)
  validateETag(key: string, clientETag: string): boolean {
    const entry = this.get(key);
    return entry !== null && entry.etag === clientETag;
  }

  // Get cache stats for monitoring
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      maxAgeMs: this.maxAge,
    };
  }

  // Clear cache (for testing/admin)
  clear() {
    this.cache.clear();
  }
}

// Singleton instance - persists across requests
export const pdfCache = new PDFCache();
