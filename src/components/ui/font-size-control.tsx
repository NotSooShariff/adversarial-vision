'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

interface FontSizeControlProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
}

export function FontSizeControl({
  value,
  onChange,
  min = 1,
  max = 72,
  step = 1,
  label = 'Font Size (px)',
}: FontSizeControlProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  const handleSliderChange = (values: number[]) => {
    onChange(values[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    if (!isNaN(newValue)) {
      onChange(Math.max(min, Math.min(max, newValue)));
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label className="text-xs font-mono text-muted-foreground flex-shrink-0">{label}</label>
        <input
          type="number"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          step={step}
          className="w-16 px-2 py-1 bg-card border border-border rounded text-xs font-mono text-primary font-semibold text-right focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <SliderPrimitive.Root
        className={cn(
          'relative flex w-full touch-none select-none items-center'
        )}
        value={[value]}
        onValueChange={handleSliderChange}
        max={max}
        min={min}
        step={step}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-card border border-border">
          <div
            className="absolute h-full rounded-full bg-primary"
            style={{ width: `${percentage}%` }}
          />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border-2 border-primary bg-background ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-110 active:scale-95 cursor-grab active:cursor-grabbing shadow-md" />
      </SliderPrimitive.Root>

      <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground/60">
        <span>{min}px</span>
        <span>{max}px</span>
      </div>
    </div>
  );
}
