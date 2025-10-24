/**
 * Type definitions for Adversarial Vision
 */

export type TechniqueType =
  | 'low-contrast'
  | 'low-opacity'
  | 'micro-font'
  | 'svg-path'
  | 'microtext-tiling'
  | 'steganography';

export interface LowContrastConfig {
  technique: 'low-contrast';
  text: string;
  contrastRatio: number; // WCAG contrast ratio (1.0 - 21.0)
  fontSize: number;
  fontFamily: string;
  x: number;
  y: number;
}

export interface LowOpacityConfig {
  technique: 'low-opacity';
  text: string;
  textColor: string;
  opacity: number;
  fontSize: number;
  fontFamily: string;
  x: number;
  y: number;
}

export interface MicroFontConfig {
  technique: 'micro-font';
  text: string;
  fontSize: number; // Supports 1px minimum
  fontFamily: string;
  textColor: string;
  letterSpacing: number;
  opacity: number;
  x: number;
  y: number;
}

export interface SVGPathConfig {
  technique: 'svg-path';
  text: string;
  customSVG?: string; // User can provide custom SVG code
  fontSize: number;
  strokeWidth: number;
  strokeColor: string;
  strokeOpacity: number;
  fillColor: string;
  fillOpacity: number;
  strokeDasharray?: string; // e.g., "5,5" for dashed stroke
  x: number;
  y: number;
}

export interface MicrotextTilingConfig {
  technique: 'microtext-tiling';
  text: string;
  tileDensity: number;
  fontSize: number;
  opacity: number;
  rotation: number; // Tilt angle in degrees
  tileWidth: number;
  tileHeight: number;
}

export interface SteganographyConfig {
  technique: 'steganography';
  text: string;
  bitsPerChannel: number; // 1-3 LSBs to modify
  channels: 'rgb' | 'r' | 'g' | 'b'; // Which color channels to use
}

export type TechniqueConfig =
  | LowContrastConfig
  | LowOpacityConfig
  | MicroFontConfig
  | SVGPathConfig
  | MicrotextTilingConfig
  | SteganographyConfig;

export interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  opacity: number;
  zIndex: number;
  bold: boolean;
  italic: boolean;
}

export interface OCRResult {
  text: string;
  confidence: number;
  words: OCRWord[];
  processingTime?: number;
}

export interface OCRWord {
  text: string;
  confidence: number;
  bbox: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  };
}

export interface PreprocessingOptions {
  contrastStretch: boolean;
  histogramEqualization: boolean;
  highPassFilter: boolean;
  threshold?: number;
}

export interface CanvasState {
  backgroundColor: string;
  backgroundImage: string | null;
  width: number;
  height: number;
  layers: TextLayer[];
  currentTechnique: TechniqueType;
  techniqueConfig: TechniqueConfig | null;
}

export interface SafeModeConfig {
  enabled: boolean;
  blockActionable: boolean;
  requireAcknowledgment: boolean;
}

export interface TestCase {
  id: string;
  name: string;
  description: string;
  backgroundColor: string;
  textColor: string;
  text: string;
  fontSize: number;
  contrastRatio: number;
  category: 'sweet-spot' | 'barely-visible' | 'invisible' | 'visible';
}
