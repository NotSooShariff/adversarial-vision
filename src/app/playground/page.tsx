'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Upload,
  Download,
  Eye,
  EyeOff,
  Trash2,
  Camera,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdversarialCanvas from '@/components/playground/AdversarialCanvas';
import TechniqueControls from '@/components/playground/TechniqueControls';
import ApiSidebar from '@/components/playground/ApiSidebar';
import html2canvas from 'html2canvas';
import type { TechniqueType, TechniqueConfig } from '@/types';

export default function PlaygroundPage() {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [originalFileName, setOriginalFileName] = useState<string>('image');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [currentTechnique, setCurrentTechnique] = useState<TechniqueType>('low-contrast');
  const [techniqueConfig, setTechniqueConfig] = useState<TechniqueConfig | null>({
    technique: 'low-contrast',
    text: 'Hidden text that AI can read',
    contrastRatio: 1.5,
    fontSize: 24,
    fontFamily: 'Arial',
    x: 50,
    y: 50,
  });
  const canvasRef = useRef<HTMLDivElement | null>(null);

  // Auto-load uploaded image from landing page
  useEffect(() => {
    const uploadedImage = sessionStorage.getItem('uploadedImage');
    if (uploadedImage) {
      setBackgroundImage(uploadedImage);
      sessionStorage.removeItem('uploadedImage');

      toast.success('Image loaded', {
        description: 'Your image is ready. Start experimenting!',
      });
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Extract filename without extension
    const fileName = file.name.replace(/\.[^/.]+$/, '');
    setOriginalFileName(fileName);

    const reader = new FileReader();
    reader.onload = (event) => {
      setBackgroundImage(event.target?.result as string);
      toast.success('Image uploaded', {
        description: `Loaded ${file.name}`,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleTechniqueChange = (technique: TechniqueType) => {
    setCurrentTechnique(technique);

    // Initialize config based on technique
    switch (technique) {
      case 'low-contrast':
        setTechniqueConfig({
          technique: 'low-contrast',
          text: 'Hidden text that AI can read',
          contrastRatio: 1.5,
          fontSize: 24,
          fontFamily: 'Arial',
          x: 50,
          y: 50,
        });
        break;
      case 'low-opacity':
        setTechniqueConfig({
          technique: 'low-opacity',
          text: 'Transparent adversarial text',
          textColor: '#000000',
          opacity: 0.1,
          fontSize: 24,
          fontFamily: 'Arial',
          x: 50,
          y: 50,
        });
        break;
      case 'micro-font':
        setTechniqueConfig({
          technique: 'micro-font',
          text: 'Tiny hidden message',
          fontSize: 4,
          fontFamily: 'Arial',
          textColor: '#000000',
          letterSpacing: 0,
          opacity: 0.8,
          x: 50,
          y: 50,
        });
        break;
      case 'svg-path':
        setTechniqueConfig({
          technique: 'svg-path',
          text: 'SVG text',
          fontSize: 24,
          strokeWidth: 0.5,
          strokeColor: '#000000',
          strokeOpacity: 1.0,
          fillColor: '#000000',
          fillOpacity: 0.3,
          strokeDasharray: '',
          x: 50,
          y: 50,
        });
        break;
      case 'microtext-tiling':
        setTechniqueConfig({
          technique: 'microtext-tiling',
          text: 'TILE',
          tileDensity: 20,
          fontSize: 6,
          opacity: 0.5,
          rotation: 0,
          tileWidth: 800,
          tileHeight: 600,
        });
        break;
      case 'steganography':
        setTechniqueConfig({
          technique: 'steganography',
          text: 'Hidden message embedded in image pixels',
          bitsPerChannel: 1,
          channels: 'rgb',
        });
        break;
    }
  };

  const handleExport = async () => {
    if (!canvasRef.current || !techniqueConfig) return;

    const loadingToast = toast.loading('Exporting...', {
      description: 'Generating PNG and metadata file',
    });

    try {
      // Generate filename
      const timestamp = Date.now();
      const baseFileName = `advision-${originalFileName}-${timestamp}`;

      // Capture canvas as PNG
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: null,
        scale: 2,
      });

      const dataUrl = canvas.toDataURL('image/png');

      // Download PNG
      const pngLink = document.createElement('a');
      pngLink.download = `${baseFileName}.png`;
      pngLink.href = dataUrl;
      pngLink.click();

      // Generate metadata text file
      const metadata = `Adversarial Vision Export
Generated: ${new Date().toISOString()}
Filename: ${originalFileName}

Technique: ${currentTechnique}
Settings:
${JSON.stringify(techniqueConfig, null, 2)}

Instructions:
- This image contains adversarial text designed to be detected by AI vision models
- The text may not be visible or easily readable by humans
- Use this image to test AI vision system robustness
`;

      // Download TXT
      const blob = new Blob([metadata], { type: 'text/plain' });
      const txtUrl = URL.createObjectURL(blob);
      const txtLink = document.createElement('a');
      txtLink.download = `${baseFileName}.txt`;
      txtLink.href = txtUrl;
      txtLink.click();

      // Cleanup
      URL.revokeObjectURL(txtUrl);

      toast.success('Export complete', {
        description: 'PNG and metadata files downloaded',
        id: loadingToast,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed', {
        description: 'Could not capture the canvas. Please try again.',
        id: loadingToast,
      });
    }
  };

  const handleClear = () => {
    setBackgroundImage(null);
    setOriginalFileName('image');

    toast.success('Canvas cleared', {
      description: 'All images have been removed',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* API Sidebar */}
      <ApiSidebar currentTechnique={currentTechnique} />

      {/* Header */}
      <header className="border-b border-border bg-card backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2 font-mono">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-muted-foreground">cd</span> ~/
                </Button>
              </Link>
              <div className="h-6 w-px bg-border"></div>
              <div>
                <h1 className="text-lg font-bold font-mono">
                  <span className="text-muted-foreground">$</span> Adversarial <span className="text-primary">Vision</span>
                </h1>
                <p className="text-xs text-muted-foreground font-mono">// playground.tsx</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="gap-1 text-destructive hover:text-destructive font-mono group hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <Trash2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span className="text-xs">
                  <span className="text-destructive">clear</span>
                  <span>()</span>
                </span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 space-y-4">
              <div className="p-4 bg-card border border-border rounded-lg">
                <h3 className="text-sm font-semibold mb-3 font-mono text-muted-foreground">// Upload Image</h3>
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button
                    variant="outline"
                    className="w-full gap-2 font-mono text-xs group hover:scale-105 active:scale-95 transition-all duration-200 hover:border-primary"
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    <Upload className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    <span className="text-[hsl(var(--monokai-yellow))]">
                      {backgroundImage ? 'swap_image' : 'upload_image'}
                    </span>
                    <span>()</span>
                  </Button>
                </label>
                {backgroundImage && (
                  <div className="mt-3">
                    <img
                      src={backgroundImage}
                      alt="Background"
                      className="w-full h-20 object-cover rounded border border-border"
                    />
                  </div>
                )}
              </div>

              <div className="p-4 bg-card border border-border rounded-lg">
                <TechniqueControls
                  currentTechnique={currentTechnique}
                  config={techniqueConfig}
                  onTechniqueChange={handleTechniqueChange}
                  onConfigChange={setTechniqueConfig}
                />
              </div>
            </div>
          </div>

          {/* Right Panel - Canvas & Preview */}
          <div className="lg:col-span-9 space-y-4">
            {/* Canvas */}
            <div className="p-4 bg-card border border-border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold font-mono text-muted-foreground">
                    // Canvas <span className="text-primary">→</span> {currentTechnique.replace('-', '_')}
                  </h2>
                  <p className="text-xs text-muted-foreground/60 font-mono mt-1">
                    Click and drag text to reposition
                  </p>
                </div>
                <Button
                  onClick={handleExport}
                  size="sm"
                  className="gap-2 font-mono text-xs group hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  <Download className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                  <span className="text-[hsl(var(--monokai-yellow))]">export</span>
                  <span>(</span>
                  <span className="text-[hsl(var(--monokai-orange))]">&quot;png+txt&quot;</span>
                  <span>)</span>
                </Button>
              </div>

              <div className="rounded-lg overflow-hidden border-2 border-border shadow-inner-glow bg-secondary/20 flex items-center justify-center p-8">
                <AdversarialCanvas
                  backgroundImage={backgroundImage}
                  backgroundColor={backgroundColor}
                  techniqueConfig={techniqueConfig}
                  width={800}
                  height={600}
                  onCanvasReady={(canvas) => {
                    canvasRef.current = canvas;
                  }}
                  onConfigUpdate={setTechniqueConfig}
                />
              </div>
            </div>

            {/* Getting Started */}
            {!backgroundImage && !techniqueConfig?.text && (
              <div className="p-6 bg-card/30 border border-border rounded-lg">
                <div className="text-center space-y-3">
                  <div className="inline-flex p-3 bg-primary/10 rounded">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold font-mono">init_playground()</h3>
                    <p className="text-muted-foreground text-xs max-w-md mx-auto font-mono mt-2">
                      Upload an image and configure technique parameters to start experimenting.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Technique Info */}
            <div className="p-4 bg-card/30 border border-border rounded-lg">
              <h3 className="text-sm font-semibold mb-3 font-mono text-muted-foreground">// About this technique</h3>
              <div className="text-xs text-muted-foreground leading-relaxed font-mono whitespace-pre-line">
                {getTechniqueDescription(currentTechnique)}
              </div>
              <div className="mt-4 pt-3 border-t border-border/50">
                <p className="text-xs text-muted-foreground/80 font-mono">
                  <span className="text-[hsl(var(--monokai-cyan))]">→</span> Full research and methodology:{' '}
                  <a
                    href="https://github.com/NotSooShariff/adversarial-vision"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-[hsl(var(--monokai-cyan))] underline transition-colors"
                  >
                    github.com/NotSooShariff/adversarial-vision
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function getTechniqueDescription(technique: TechniqueType): string {
  switch (technique) {
    case 'low-contrast':
      return `Low-contrast text exploits the minimum perceptible difference in luminance between text and background. WCAG guidelines define 4.5:1 as minimum readable contrast for normal text. This technique uses ratios of 1.0-1.5:1, well below human perception thresholds.

Human Perception: At typical viewing distance (50-70cm), the human eye requires ~3-4% luminance difference to distinguish text. At 1.2:1 contrast ratio, this drops to <2%, approaching the just-noticeable difference (JND) threshold.

AI Detection: Vision models with histogram equalization, CLAHE (Contrast Limited Adaptive Histogram Equalization), or gamma correction can amplify subtle luminance differences, making sub-threshold text readable.

Research: This technique demonstrates that AI preprocessing pipelines can recover information invisible to human perception. See https://github.com/NotSooShariff/adversarial-vision for detailed experiments.`;

    case 'low-opacity':
      return `Low-opacity text uses alpha channel transparency to reduce visibility. At opacity values of 0.05-0.15 (5-15%), text becomes subliminal to human vision but remains detectable through computational methods.

Human Perception: The human visual system has limited dynamic range. At normal screen brightness (100-300 cd/m²), opacity below 10% falls below the contrast sensitivity function (CSF) for most viewing distances. Text becomes invisible at arm's length (60cm).

AI Detection: Vision models process images mathematically without perceptual limitations. By adjusting exposure levels or applying unsharp masking, even 3% opacity text can be recovered and recognized with high confidence.

Relevance: Demonstrates the gap between biological and computational vision. Useful for testing content moderation systems and watermarking robustness. See https://github.com/NotSooShariff/adversarial-vision.`;

    case 'micro-font':
      return `Micro-font technique uses text at 1-6px size, far below human visual acuity limits. The human eye's angular resolution is ~1 arcminute (1/60°), limiting readable text size based on viewing distance.

Human Perception: At 60cm viewing distance, 1px text subtends ~0.5 arcminutes, well below the 5-arcminute minimum for comfortable reading. Even with 20/20 vision, text below 4px becomes unreadable at normal distances. Users would need to view from <10cm to resolve 1px text.

AI Detection: Vision models don't have fixed resolution limits. With super-resolution algorithms (SRCNN, ESRGAN) or simple bicubic upscaling, 1px text can be magnified to readable sizes. OCR engines like Tesseract or modern transformer models then extract text with high accuracy.

Applications: Testing OCR robustness, invisible watermarking, anti-scraping measures. Research at https://github.com/NotSooShariff/adversarial-vision.`;

    case 'svg-path':
      return `SVG path manipulation creates text using vector strokes with customizable properties: ultra-thin strokes (0.1-0.5px), dashed patterns, and low fill opacity. This exploits edge detection sensitivity differences between human vision and AI.

Human Perception: The human visual system relies on contrast and spatial frequency. Strokes thinner than 0.5px at normal viewing distance become invisible as they approach the point spread function (PSF) limit of the eye. Dashed patterns at high frequency appear as solid gray due to spatial integration.

AI Detection: Edge detection algorithms (Canny, Sobel) operate on raw pixel gradients without perceptual filtering. Morphological operations can connect dashed segments, and adaptive thresholding reveals low-opacity fills. Modern vision transformers excel at detecting subtle geometric patterns.

Use Cases: Demonstrates vulnerability of watermark detection, CAPTCHA systems, and document authentication. See https://github.com/NotSooShariff/adversarial-vision for countermeasures.`;

    case 'microtext-tiling':
      return `Microtext tiling distributes tiny text (2-8px) across the entire image canvas. While individual instances are unreadable to humans, AI models aggregate detections to achieve high confidence through redundancy.

Human Perception: Tiled microtext appears as uniform texture or noise pattern to human observers. At 60cm viewing distance, 4px text requires ~3x magnification to resolve characters. The pattern blends into background due to spatial averaging in human vision.

AI Detection: Vision models process the entire image simultaneously. Multiple detections of the same text pattern are aggregated, increasing confidence scores. Even with 40% individual character accuracy, 100 repetitions yield >99.99% overall confidence through majority voting.

Statistical Advantage: AI doesn't suffer from attention limitations. Where humans focus on salient regions, vision models scan exhaustively. This technique demonstrates how redundancy overcomes individual detection noise.

Research: Explores ensemble detection and statistical inference in adversarial contexts. Full methodology at https://github.com/NotSooShariff/adversarial-vision.`;

    case 'steganography':
      return `LSB (Least Significant Bit) steganography embeds data in the lowest-order bits of pixel color values. Modifying only the LSB causes ±1 changes in RGB values (e.g., 200→201), creating visually imperceptible differences.

Human Perception: The human eye cannot distinguish single-bit color changes. With 8-bit color depth (256 values per channel), a ±1 change represents 0.4% difference—far below the ~2% just-noticeable difference (JND) for color. Even at 2-bit depth (±3 change, 1.2%), differences remain invisible under normal viewing.

AI Detection: Vision models analyze pixel values numerically. Statistical steganalysis techniques (Chi-square, RS analysis) detect non-random patterns in LSB distributions. Even 1-bit modifications create detectable statistical anomalies when analyzing sufficient pixels.

Capacity: With 3 color channels and 1 LSB per channel, each pixel stores 3 bits. A 1000x1000px image can hide ~375KB. Higher bit depths increase capacity but improve detectability.

Applications: Covert communication, watermarking, adversarial perturbations. See https://github.com/NotSooShariff/adversarial-vision for detection algorithms.`;

    default:
      return '';
  }
}
