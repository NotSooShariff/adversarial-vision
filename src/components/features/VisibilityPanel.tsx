'use client';

import { Eye, AlertTriangle } from 'lucide-react';
import type { TextLayer } from '@/types';
import { getContrastRatio, getWCAGLevel, estimateHumanVisibility } from '@/lib/contrast';

interface VisibilityPanelProps {
  backgroundColor: string;
  layers: TextLayer[];
}

export default function VisibilityPanel({ backgroundColor, layers }: VisibilityPanelProps) {
  if (layers.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Eye className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <div className="text-sm">Add text layers to analyze human visibility</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Visibility Analysis</h3>
        <Eye className="w-5 h-5 text-muted-foreground" />
      </div>

      <div className="space-y-4">
        {layers.map((layer) => {
          const contrastRatio = getContrastRatio(backgroundColor, layer.color);
          const wcagLevel = getWCAGLevel(contrastRatio, layer.fontSize, layer.bold);
          const visibility = estimateHumanVisibility(contrastRatio, layer.fontSize);

          return (
            <div
              key={layer.id}
              className="p-4 bg-card border border-border rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.4)] space-y-4"
            >
              {/* Layer Info */}
              <div>
                <div className="text-sm font-medium text-foreground truncate mb-1">
                  {layer.text}
                </div>
                <div className="text-xs text-muted-foreground">
                  {layer.fontSize}px · {layer.color}
                </div>
              </div>

              {/* Contrast Ratio */}
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  Contrast Ratio
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-xl font-bold text-foreground">
                    {contrastRatio.toFixed(2)}:1
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.3)] ${
                      wcagLevel.level === 'AAA'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : wcagLevel.level === 'AA'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {wcagLevel.level}
                  </span>
                </div>
              </div>

              {/* Visibility Estimation */}
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  Human Visibility
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-secondary rounded-full h-2.5 shadow-inner overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full transition-all ${
                        visibility > 70
                          ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.5)]'
                          : visibility > 40
                          ? 'bg-yellow-500 shadow-[0_0_12px_rgba(234,179,8,0.5)]'
                          : 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                      }`}
                      style={{ width: `${visibility}%` }}
                    />
                  </div>
                  <span
                    className={`text-sm font-bold min-w-[3rem] text-right ${
                      visibility > 70
                        ? 'text-green-400'
                        : visibility > 40
                        ? 'text-yellow-400'
                        : 'text-red-400'
                    }`}
                  >
                    {visibility}%
                  </span>
                </div>
              </div>

              {/* Warnings */}
              {contrastRatio < 3.0 && (
                <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-400/90 leading-relaxed">
                    {contrastRatio < 1.5 ? (
                      <>
                        <strong>Very low contrast.</strong> Nearly invisible to most users. In the
                        &quot;attacker sweet spot&quot; for hidden content.
                      </>
                    ) : (
                      <>
                        <strong>Low contrast.</strong> Difficult to read for users with visual
                        impairments or on certain displays.
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* WCAG Compliance */}
              <div className="flex gap-3 pt-2">
                <div className="flex items-center gap-2 flex-1">
                  <div
                    className={`w-2.5 h-2.5 rounded-full shadow-glow-blue ${
                      wcagLevel.AA ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  <span className="text-xs text-muted-foreground">WCAG AA</span>
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <div
                    className={`w-2.5 h-2.5 rounded-full shadow-glow-blue ${
                      wcagLevel.AAA ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  <span className="text-xs text-muted-foreground">WCAG AAA</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg shadow-[0_4px_12px_rgba(59,130,246,0.2)]">
        <div className="text-xs text-blue-400 leading-relaxed">
          <strong>About this analysis:</strong> Visibility estimates use WCAG 2.1 contrast calculations
          and visual acuity approximations. Actual visibility varies by display, lighting, viewing distance,
          and individual vision.
        </div>
      </div>
    </div>
  );
}
