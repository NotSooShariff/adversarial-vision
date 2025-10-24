'use client';

import { useState } from 'react';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import type { OCRResult, PreprocessingOptions } from '@/types';
import { performOCR, containsActionableContent } from '@/lib/ocr';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface OCRPanelProps {
  canvasDataUrl: string | null;
  onOCRComplete?: (result: OCRResult) => void;
}

export default function OCRPanel({ canvasDataUrl, onOCRComplete }: OCRPanelProps) {
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preprocessingOptions, setPreprocessingOptions] = useState<PreprocessingOptions>({
    contrastStretch: false,
    histogramEqualization: false,
    highPassFilter: false,
  });

  const handleRunOCR = async () => {
    if (!canvasDataUrl) {
      setError('No image available. Please create a screenshot first.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = await performOCR(canvasDataUrl, preprocessingOptions);
      setOcrResult(result);
      if (onOCRComplete) {
        onOCRComplete(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to perform OCR');
    } finally {
      setIsProcessing(false);
    }
  };

  const hasActionableContent = ocrResult && containsActionableContent(ocrResult.text);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">OCR Analysis</h3>
        <Button
          onClick={handleRunOCR}
          disabled={isProcessing || !canvasDataUrl}
          size="sm"
          className="gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Run OCR
            </>
          )}
        </Button>
      </div>

      {/* Preprocessing Options */}
      <div className="p-4 bg-card border border-border rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
        <div className="text-sm font-medium text-muted-foreground mb-3">Preprocessing</div>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <Checkbox
              checked={preprocessingOptions.contrastStretch}
              onCheckedChange={(checked) =>
                setPreprocessingOptions((prev) => ({
                  ...prev,
                  contrastStretch: !!checked,
                }))
              }
            />
            <span className="text-sm group-hover:text-foreground transition-colors">
              Contrast Stretch
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <Checkbox
              checked={preprocessingOptions.histogramEqualization}
              onCheckedChange={(checked) =>
                setPreprocessingOptions((prev) => ({
                  ...prev,
                  histogramEqualization: !!checked,
                }))
              }
            />
            <span className="text-sm group-hover:text-foreground transition-colors">
              Histogram Equalization
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <Checkbox
              checked={preprocessingOptions.highPassFilter}
              onCheckedChange={(checked) =>
                setPreprocessingOptions((prev) => ({
                  ...prev,
                  highPassFilter: !!checked,
                }))
              }
            />
            <span className="text-sm group-hover:text-foreground transition-colors">
              High-Pass Filter
            </span>
          </label>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3 shadow-[0_4px_12px_rgba(239,68,68,0.2)]">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-medium text-destructive">Error</div>
            <div className="text-xs text-destructive/80 mt-1">{error}</div>
          </div>
        </div>
      )}

      {/* Results */}
      {ocrResult && (
        <div className="space-y-4">
          {/* Confidence Score */}
          <div className="p-4 bg-card border border-border rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Confidence</span>
              <span
                className={`text-2xl font-bold ${
                  ocrResult.confidence > 80
                    ? 'text-green-400'
                    : ocrResult.confidence > 50
                    ? 'text-yellow-400'
                    : 'text-red-400'
                }`}
              >
                {ocrResult.confidence.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2.5 shadow-inner">
              <div
                className={`h-2.5 rounded-full transition-all shadow-glow-blue ${
                  ocrResult.confidence > 80
                    ? 'bg-green-500'
                    : ocrResult.confidence > 50
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(ocrResult.confidence, 100)}%` }}
              />
            </div>
          </div>

          {/* Actionable Content Warning */}
          {hasActionableContent && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-3 shadow-[0_4px_12px_rgba(245,158,11,0.2)]">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-amber-400">
                  Potentially Actionable Content
                </div>
                <div className="text-xs text-amber-400/80 mt-1">
                  Safe Mode detected patterns commonly used in phishing or fraud.
                </div>
              </div>
            </div>
          )}

          {/* Extracted Text */}
          <div className="p-4 bg-card border border-border rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
            <div className="text-sm font-medium text-muted-foreground mb-3">Extracted Text</div>
            {ocrResult.text.trim() ? (
              <div className="text-sm font-mono text-foreground whitespace-pre-wrap break-words p-3 bg-background rounded-lg border border-border shadow-inner">
                {ocrResult.text}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground italic">No text detected</div>
            )}
          </div>

          {/* Word-level Confidence */}
          {ocrResult.words.length > 0 && (
            <div className="p-4 bg-card border border-border rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
              <div className="text-sm font-medium text-muted-foreground mb-3">
                Word-level Confidence
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {ocrResult.words.map((word, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="font-mono text-foreground">{word.text}</span>
                    <span
                      className={`font-semibold ${
                        word.confidence > 80
                          ? 'text-green-400'
                          : word.confidence > 50
                          ? 'text-yellow-400'
                          : 'text-red-400'
                      }`}
                    >
                      {word.confidence.toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Processing Time */}
          {ocrResult.processingTime && (
            <div className="text-xs text-center text-muted-foreground">
              Processing time: {(ocrResult.processingTime / 1000).toFixed(2)}s
            </div>
          )}
        </div>
      )}

      {!ocrResult && !error && !isProcessing && (
        <div className="text-center py-12 text-muted-foreground">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <div className="text-sm">Capture a screenshot and run OCR to analyze text</div>
          <div className="text-xs mt-2">Uses Tesseract.js for client-side processing</div>
        </div>
      )}
    </div>
  );
}
