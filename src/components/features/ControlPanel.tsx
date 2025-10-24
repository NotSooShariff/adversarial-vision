'use client';

import { useState } from 'react';
import { Plus, Upload } from 'lucide-react';
import type { TextLayer } from '@/types';
import { getContrastRatio } from '@/lib/contrast';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface ControlPanelProps {
  backgroundColor: string;
  onBackgroundColorChange: (color: string) => void;
  onBackgroundImageUpload: (imageData: string) => void;
  onAddLayer: (layer: Omit<TextLayer, 'id'>) => void;
  layers: TextLayer[];
}

export default function ControlPanel({
  backgroundColor,
  onBackgroundColorChange,
  onBackgroundImageUpload,
  onAddLayer,
  layers,
}: ControlPanelProps) {
  const [newLayerText, setNewLayerText] = useState('Sample text');
  const [newLayerColor, setNewLayerColor] = useState('#E8E8E8');
  const [newLayerFontSize, setNewLayerFontSize] = useState(16);
  const [newLayerOpacity, setNewLayerOpacity] = useState(1);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
      onBackgroundImageUpload(imageData);
    };
    reader.readAsDataURL(file);
  };

  const handleAddLayer = () => {
    const newLayer: Omit<TextLayer, 'id'> = {
      text: newLayerText,
      x: 50,
      y: 100 + layers.length * 40,
      fontSize: newLayerFontSize,
      fontFamily: 'Arial',
      color: newLayerColor,
      opacity: newLayerOpacity,
      zIndex: layers.length,
      bold: false,
      italic: false,
    };
    onAddLayer(newLayer);
  };

  const contrastRatio = getContrastRatio(backgroundColor, newLayerColor);

  return (
    <div className="space-y-6">
      {/* Background Section */}
      <div className="p-6 bg-card border border-border rounded-xl shadow-brutal">
        <h3 className="text-lg font-semibold mb-4">Background</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Color
            </label>
            <div className="flex gap-3">
              <div className="relative">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => onBackgroundColorChange(e.target.value)}
                  className="w-14 h-14 rounded-lg border-2 border-border cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
                />
              </div>
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => onBackgroundColorChange(e.target.value)}
                className="flex-1 px-4 py-2 bg-background border border-border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                placeholder="#FFFFFF"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Image
            </label>
            <label className="flex items-center justify-center gap-2 px-4 py-3 bg-secondary hover:bg-secondary/80 border border-border rounded-lg cursor-pointer transition-all shadow-[0_4px_12px_rgba(0,0,0,0.4)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.5)]">
              <Upload className="w-4 h-4" />
              <span className="text-sm font-medium">Upload Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Text Layer Section */}
      <div className="p-6 bg-card border border-border rounded-xl shadow-brutal">
        <h3 className="text-lg font-semibold mb-4">Add Text Layer</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Text
            </label>
            <input
              type="text"
              value={newLayerText}
              onChange={(e) => setNewLayerText(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
              placeholder="Enter text"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Color
            </label>
            <div className="flex gap-3">
              <div className="relative">
                <input
                  type="color"
                  value={newLayerColor}
                  onChange={(e) => setNewLayerColor(e.target.value)}
                  className="w-14 h-14 rounded-lg border-2 border-border cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
                />
              </div>
              <input
                type="text"
                value={newLayerColor}
                onChange={(e) => setNewLayerColor(e.target.value)}
                className="flex-1 px-4 py-2 bg-background border border-border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                placeholder="#E8E8E8"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Font Size: {newLayerFontSize}px
            </label>
            <Slider
              value={[newLayerFontSize]}
              onValueChange={([value]) => setNewLayerFontSize(value)}
              min={8}
              max={72}
              step={1}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Opacity: {(newLayerOpacity * 100).toFixed(0)}%
            </label>
            <Slider
              value={[newLayerOpacity]}
              onValueChange={([value]) => setNewLayerOpacity(value)}
              min={0}
              max={1}
              step={0.01}
              className="w-full"
            />
          </div>

          {/* Contrast Ratio Display */}
          <div className="p-4 bg-secondary/50 border border-border rounded-lg shadow-inner">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Contrast Ratio</span>
              <span className="text-2xl font-bold text-primary">
                {contrastRatio.toFixed(2)}:1
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {contrastRatio < 1.5 && '⚠️ Very low - "Sweet Spot" for hidden text'}
              {contrastRatio >= 1.5 && contrastRatio < 3 && '⚠️ Low contrast'}
              {contrastRatio >= 3 && contrastRatio < 4.5 && '✓ Moderate contrast'}
              {contrastRatio >= 4.5 && '✓✓ WCAG AA compliant'}
            </div>
          </div>

          <Button onClick={handleAddLayer} className="w-full gap-2">
            <Plus className="w-4 h-4" />
            Add Text Layer
          </Button>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="p-4 bg-card/50 border border-border rounded-lg">
        <div className="text-xs text-muted-foreground space-y-1.5">
          <p className="font-semibold text-foreground">Quick Tips:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Ratio 1.0-1.5: Nearly invisible</li>
            <li>Ratio 1.5-3.0: Attacker sweet spot</li>
            <li>Ratio 4.5+: WCAG compliant</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
