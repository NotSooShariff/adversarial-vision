'use client';

import { useState } from 'react';
import { Search, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import type { OCRResult, PreprocessingOptions } from '@/types';
import { performOCR, containsActionableContent } from '@/lib/ocr';

interface OCRPaneProps {
  canvasDataUrl: string | null;
  onOCRComplete?: (result: OCRResult) => void;
}

export default function OCRPane({ canvasDataUrl, onOCRComplete }: OCRPaneProps) {
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
        <h3 className="text-sm font-semibold text-gray-900">OCR Analysis</h3>
        <button
          onClick={handleRunOCR}
          disabled={isProcessing || !canvasDataUrl}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-sm font-medium rounded-lg transition-colors"
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
        </button>
      </div>

      {/* Preprocessing Options */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <div className="text-xs font-medium text-gray-700 mb-2">Preprocessing</div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={preprocessingOptions.contrastStretch}
              onChange={(e) =>
                setPreprocessingOptions((prev) => ({
                  ...prev,
                  contrastStretch: e.target.checked,
                }))
              }
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-xs text-gray-700">Contrast Stretch</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={preprocessingOptions.histogramEqualization}
              onChange={(e) =>
                setPreprocessingOptions((prev) => ({
                  ...prev,
                  histogramEqualization: e.target.checked,
                }))
              }
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-xs text-gray-700">Histogram Equalization</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={preprocessingOptions.highPassFilter}
              onChange={(e) =>
                setPreprocessingOptions((prev) => ({
                  ...prev,
                  highPassFilter: e.target.checked,
                }))
              }
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-xs text-gray-700">High-Pass Filter</span>
          </label>
        </div>
      </div>

      {/* Results */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-sm font-medium text-red-900">Error</div>
            <div className="text-xs text-red-700 mt-1">{error}</div>
          </div>
        </div>
      )}

      {ocrResult && (
        <div className="space-y-3">
          {/* Confidence Score */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-medium text-gray-700">Overall Confidence</div>
              <div className={`text-lg font-bold ${
                ocrResult.confidence > 80 ? 'text-green-600' :
                ocrResult.confidence > 50 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {ocrResult.confidence.toFixed(1)}%
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  ocrResult.confidence > 80 ? 'bg-green-600' :
                  ocrResult.confidence > 50 ? 'bg-yellow-600' :
                  'bg-red-600'
                }`}
                style={{ width: `${Math.min(ocrResult.confidence, 100)}%` }}
              />
            </div>
          </div>

          {/* Actionable Content Warning */}
          {hasActionableContent && (
            <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm font-medium text-amber-900">
                  Potentially Actionable Content Detected
                </div>
                <div className="text-xs text-amber-700 mt-1">
                  Safe Mode has detected patterns that may be used in phishing or fraud attempts.
                </div>
              </div>
            </div>
          )}

          {/* Extracted Text */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs font-medium text-gray-700 mb-2">Extracted Text</div>
            {ocrResult.text.trim() ? (
              <div className="text-sm text-gray-900 font-mono whitespace-pre-wrap break-words">
                {ocrResult.text}
              </div>
            ) : (
              <div className="text-xs text-gray-500 italic">No text detected</div>
            )}
          </div>

          {/* Word-level Confidence */}
          {ocrResult.words.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="text-xs font-medium text-gray-700 mb-2">
                Word-level Confidence
              </div>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {ocrResult.words.map((word, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="text-gray-900 font-mono">{word.text}</span>
                    <span
                      className={`font-medium ${
                        word.confidence > 80
                          ? 'text-green-600'
                          : word.confidence > 50
                          ? 'text-yellow-600'
                          : 'text-red-600'
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
            <div className="text-xs text-gray-500 text-center">
              Processing time: {(ocrResult.processingTime / 1000).toFixed(2)}s
            </div>
          )}
        </div>
      )}

      {!ocrResult && !error && !isProcessing && (
        <div className="text-center py-8 text-gray-500">
          <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <div className="text-sm">Capture a screenshot and run OCR to analyze text visibility</div>
          <div className="text-xs mt-2">
            Uses Tesseract.js for client-side OCR processing
          </div>
        </div>
      )}
    </div>
  );
}
