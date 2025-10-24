'use client';

import { Eye, AlertTriangle } from 'lucide-react';
import type { TextLayer } from '@/types';
import { getContrastRatio, getWCAGLevel, estimateHumanVisibility } from '@/lib/contrast';

interface HumanSimPaneProps {
  backgroundColor: string;
  layers: TextLayer[];
}

export default function HumanSimPane({ backgroundColor, layers }: HumanSimPaneProps) {
  if (layers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Eye className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <div className="text-sm">Add text layers to see human visibility analysis</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Human Visibility</h3>
        <Eye className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-3">
        {layers.map((layer) => {
          const contrastRatio = getContrastRatio(backgroundColor, layer.color);
          const wcagLevel = getWCAGLevel(contrastRatio, layer.fontSize, layer.bold);
          const visibility = estimateHumanVisibility(contrastRatio, layer.fontSize);

          return (
            <div key={layer.id} className="bg-white border border-gray-200 rounded-lg p-3 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {layer.text}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {layer.fontSize}px · {layer.color}
                  </div>
                </div>
              </div>

              {/* Contrast Ratio */}
              <div>
                <div className="text-xs font-medium text-gray-700 mb-1">
                  Contrast Ratio
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-gray-900">
                    {contrastRatio.toFixed(2)}:1
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded ${
                      wcagLevel.level === 'AAA'
                        ? 'bg-green-100 text-green-800'
                        : wcagLevel.level === 'AA'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {wcagLevel.level}
                  </span>
                </div>
              </div>

              {/* Visibility Estimation */}
              <div>
                <div className="text-xs font-medium text-gray-700 mb-1">
                  Estimated Human Visibility
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        visibility > 70
                          ? 'bg-green-600'
                          : visibility > 40
                          ? 'bg-yellow-600'
                          : 'bg-red-600'
                      }`}
                      style={{ width: `${visibility}%` }}
                    />
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      visibility > 70
                        ? 'text-green-600'
                        : visibility > 40
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {visibility}%
                  </span>
                </div>
              </div>

              {/* Warnings */}
              {contrastRatio < 3.0 && (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded p-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-800">
                    {contrastRatio < 1.5 ? (
                      <>
                        <strong>Very low contrast.</strong> Nearly invisible to most users. This is
                        in the &quot;attacker sweet spot&quot; for hidden content.
                      </>
                    ) : (
                      <>
                        <strong>Low contrast.</strong> May be difficult to read for users with
                        visual impairments or on certain displays.
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* WCAG Compliance */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      wcagLevel.AA ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  <span className="text-gray-700">WCAG AA</span>
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      wcagLevel.AAA ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  <span className="text-gray-700">WCAG AAA</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="text-xs text-blue-900">
          <strong>About this analysis:</strong> Human visibility estimates use WCAG 2.1 contrast
          ratio calculations and visual acuity approximations. Actual visibility varies based on
          display quality, ambient lighting, viewing distance, and individual vision.
        </div>
      </div>
    </div>
  );
}
