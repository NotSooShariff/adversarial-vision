/**
 * WCAG Contrast and Color Utilities
 * Implements WCAG 2.1 contrast ratio calculations and visual acuity approximations
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): RGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Calculate relative luminance using WCAG formula
 * https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
export function getLuminance(rgb: RGB): number {
  const rsRGB = rgb.r / 255;
  const gsRGB = rgb.g / 255;
  const bsRGB = rgb.b / 255;

  const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate WCAG contrast ratio between two colors
 * https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 0;

  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Get WCAG compliance level for a given contrast ratio
 */
export function getWCAGLevel(ratio: number, fontSize: number = 16, isBold: boolean = false): {
  AA: boolean;
  AAA: boolean;
  level: 'FAIL' | 'AA' | 'AAA';
} {
  const isLargeText = fontSize >= 18 || (fontSize >= 14 && isBold);
  const aaThreshold = isLargeText ? 3 : 4.5;
  const aaaThreshold = isLargeText ? 4.5 : 7;

  const AA = ratio >= aaThreshold;
  const AAA = ratio >= aaaThreshold;

  return {
    AA,
    AAA,
    level: AAA ? 'AAA' : AA ? 'AA' : 'FAIL',
  };
}

/**
 * Estimate human visibility on a 0-100 scale
 * Based on contrast ratio and visual acuity approximations
 */
export function estimateHumanVisibility(
  ratio: number,
  fontSize: number = 16,
  distance: number = 50 // viewing distance in cm
): number {
  // Visual acuity approximation
  // Higher contrast = easier to see
  // Larger text = easier to see
  // Closer distance = easier to see

  const contrastFactor = Math.min(ratio / 21, 1); // Normalize to 0-1 (21 is max theoretical contrast)
  const sizeFactor = Math.min(fontSize / 12, 2); // Normalize (12px baseline, cap at 2x)
  const distanceFactor = Math.max(1 - (distance - 30) / 100, 0.2); // Penalty for distance > 30cm

  const visibility = contrastFactor * 0.6 + sizeFactor * 0.25 + distanceFactor * 0.15;

  return Math.round(Math.min(visibility * 100, 100));
}

/**
 * Interpolate between two colors
 */
export function interpolateColor(color1: string, color2: string, factor: number): string {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return color1;

  const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * factor);
  const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * factor);
  const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * factor);

  return rgbToHex(r, g, b);
}

/**
 * Check if a color pair is in the "attacker sweet spot"
 * (low human visibility but potentially high OCR confidence)
 */
export function isAttackerSweetSpot(ratio: number, fontSize: number = 16): boolean {
  // Sweet spot: contrast ratio between 1.2 and 2.5 for normal text
  // or 1.1 and 2.0 for large text
  const isLargeText = fontSize >= 18;
  const lower = isLargeText ? 1.1 : 1.2;
  const upper = isLargeText ? 2.0 : 2.5;

  return ratio >= lower && ratio <= upper;
}

/**
 * Simplified luminance calculation (matches user's formula)
 */
export function luminance(rgb: [number, number, number]): number {
  const srgb = rgb.map(v => v / 255).map(v =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

/**
 * Simplified contrast ratio (matches user's formula)
 */
export function contrastRatio(hexA: string, hexB: string): number {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  if (!a || !b) return 0;
  const L1 = luminance([a.r, a.g, a.b]);
  const L2 = luminance([b.r, b.g, b.b]);
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
}

/**
 * Suggested low-contrast color pairs for adversarial testing
 */
export const LOW_CONTRAST_PRESETS = [
  { bg: '#FFFFE0', text: '#FDFDDF', ratio: 1.1, name: 'Barely There Yellow' },
  { bg: '#F7F7F7', text: '#F6F6F6', ratio: 1.06, name: 'Ghost White' },
  { bg: '#E8E8E8', text: '#E5E5E5', ratio: 1.08, name: 'Whisper Gray' },
  { bg: '#1A1A1A', text: '#1C1C1C', ratio: 1.05, name: 'Shadow Black' },
  { bg: '#2D2D2D', text: '#303030', ratio: 1.07, name: 'Charcoal Stealth' },
  { bg: '#FFE4E4', text: '#FFE1E1', ratio: 1.09, name: 'Faint Pink' },
  { bg: '#E4F0FF', text: '#E1EDFF', ratio: 1.08, name: 'Subtle Blue' },
];
