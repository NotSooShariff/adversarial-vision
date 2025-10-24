'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIHumanSliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  reversed?: boolean; // If true, left is human, right is AI
}

export function AIHumanSlider({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  reversed = false,
}: AIHumanSliderProps) {
  const percentage = ((value[0] - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono text-muted-foreground">{label}</label>
          {showValue && (
            <span className="text-xs font-mono text-primary font-semibold">
              {typeof value[0] === 'number' ? value[0].toFixed(step < 1 ? 1 : 0) : value[0]}
            </span>
          )}
        </div>
      )}

      <div className="relative px-6">
        {/* Icons on sides - inside the padding */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2">
          {reversed ? (
            <User className="w-3.5 h-3.5 text-[hsl(var(--monokai-orange))]" />
          ) : (
            <Bot className="w-3.5 h-3.5 text-[hsl(var(--monokai-green))]" />
          )}
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          {reversed ? (
            <Bot className="w-3.5 h-3.5 text-[hsl(var(--monokai-green))]" />
          ) : (
            <User className="w-3.5 h-3.5 text-[hsl(var(--monokai-orange))]" />
          )}
        </div>

        <SliderPrimitive.Root
          className={cn(
            'relative flex w-full touch-none select-none items-center'
          )}
          value={value}
          onValueChange={onValueChange}
          max={max}
          min={min}
          step={step}
        >
          <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-card border border-border">
            {/* Gradient fill based on slider position */}
            <div
              className="absolute h-full rounded-full"
              style={{
                width: `${percentage}%`,
                background: reversed
                  ? `linear-gradient(to right, hsl(var(--monokai-orange)), hsl(var(--monokai-green)))`
                  : `linear-gradient(to right, hsl(var(--monokai-green)), hsl(var(--monokai-orange)))`,
              }}
            />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-110 active:scale-95 cursor-grab active:cursor-grabbing shadow-lg" />
        </SliderPrimitive.Root>
      </div>

      {/* Helper text */}
      <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground/60 px-6">
        <span>{reversed ? 'More visible' : 'AI detects'}</span>
        <span>{reversed ? 'Less visible' : 'Humans see'}</span>
      </div>
    </div>
  );
}
