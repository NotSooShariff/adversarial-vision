/**
 * OCR utilities using Tesseract.js
 */

import { createWorker, type Worker } from 'tesseract.js';
import type { OCRResult, OCRWord, PreprocessingOptions } from '@/types';

let worker: Worker | null = null;

/**
 * Initialize Tesseract worker
 */
export async function initOCR(): Promise<Worker> {
  if (worker) return worker;

  worker = await createWorker('eng', 1, {
    logger: (m) => {
      if (m.status === 'recognizing text') {
        console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
      }
    },
  });

  return worker;
}

/**
 * Perform OCR on an image element or data URL
 */
export async function performOCR(
  imageSource: string | HTMLImageElement | HTMLCanvasElement,
  options?: PreprocessingOptions
): Promise<OCRResult> {
  const startTime = performance.now();

  try {
    const ocrWorker = await initOCR();

    // Preprocess image if options are provided
    let processedSource = imageSource;
    if (options && typeof imageSource === 'string') {
      processedSource = await preprocessImage(imageSource, options);
    }

    const { data } = await ocrWorker.recognize(processedSource);

    const words: OCRWord[] = data.words.map((word) => ({
      text: word.text,
      confidence: word.confidence,
      bbox: {
        x0: word.bbox.x0,
        y0: word.bbox.y0,
        x1: word.bbox.x1,
        y1: word.bbox.y1,
      },
    }));

    const processingTime = performance.now() - startTime;

    return {
      text: data.text,
      confidence: data.confidence,
      words,
      processingTime,
    };
  } catch (error) {
    console.error('OCR error:', error);
    throw new Error('Failed to perform OCR');
  }
}

/**
 * Preprocess image using canvas filters
 */
async function preprocessImage(
  imageDataUrl: string,
  options: PreprocessingOptions
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      if (options.contrastStretch) {
        imageData = applyContrastStretch(imageData);
      }

      if (options.histogramEqualization) {
        imageData = applyHistogramEqualization(imageData);
      }

      if (options.highPassFilter) {
        imageData = applyHighPassFilter(imageData);
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL());
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageDataUrl;
  });
}

/**
 * Apply contrast stretch to image data
 */
function applyContrastStretch(imageData: ImageData): ImageData {
  const data = imageData.data;
  let min = 255;
  let max = 0;

  // Find min and max
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    min = Math.min(min, avg);
    max = Math.max(max, avg);
  }

  // Stretch
  const range = max - min;
  if (range === 0) return imageData;

  for (let i = 0; i < data.length; i += 4) {
    for (let j = 0; j < 3; j++) {
      data[i + j] = ((data[i + j] - min) * 255) / range;
    }
  }

  return imageData;
}

/**
 * Apply histogram equalization
 */
function applyHistogramEqualization(imageData: ImageData): ImageData {
  const data = imageData.data;
  const histogram = new Array(256).fill(0);

  // Build histogram
  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round((data[i] + data[i + 1] + data[i + 2]) / 3);
    histogram[gray]++;
  }

  // Build cumulative distribution
  const cdf = new Array(256).fill(0);
  cdf[0] = histogram[0];
  for (let i = 1; i < 256; i++) {
    cdf[i] = cdf[i - 1] + histogram[i];
  }

  // Normalize
  const totalPixels = data.length / 4;
  const lookupTable = cdf.map((val) => Math.round((val * 255) / totalPixels));

  // Apply transformation
  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round((data[i] + data[i + 1] + data[i + 2]) / 3);
    const newVal = lookupTable[gray];
    data[i] = newVal;
    data[i + 1] = newVal;
    data[i + 2] = newVal;
  }

  return imageData;
}

/**
 * Apply high-pass filter (edge enhancement)
 */
function applyHighPassFilter(imageData: ImageData): ImageData {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;

  // High-pass kernel
  const kernel = [
    [-1, -1, -1],
    [-1, 9, -1],
    [-1, -1, -1],
  ];

  const output = new Uint8ClampedArray(data);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4 + c;
            sum += data[idx] * kernel[ky + 1][kx + 1];
          }
        }
        const idx = (y * width + x) * 4 + c;
        output[idx] = Math.max(0, Math.min(255, sum));
      }
    }
  }

  return new ImageData(output, width, height);
}

/**
 * Cleanup OCR worker
 */
export async function cleanupOCR(): Promise<void> {
  if (worker) {
    await worker.terminate();
    worker = null;
  }
}

/**
 * Check if text contains potentially actionable content
 */
export function containsActionableContent(text: string): boolean {
  const actionablePatterns = [
    /transfer.*\$\d+/i,
    /send.*money/i,
    /password.*[:=]/i,
    /credit.*card/i,
    /social.*security/i,
    /login.*[:=]/i,
    /username.*[:=]/i,
    /click.*here.*now/i,
    /verify.*account/i,
    /confirm.*payment/i,
  ];

  return actionablePatterns.some((pattern) => pattern.test(text));
}
