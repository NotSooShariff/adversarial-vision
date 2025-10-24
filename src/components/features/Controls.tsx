'use client';

import { useState } from 'react';
import { Plus, Image as ImageIcon } from 'lucide-react';
import type { TextLayer } from '@/types';
import { getContrastRatio } from '@/lib/contrast';

interface ControlsProps {
  backgroundColor: string;
  onBackgroundColorChange: (color: string) => void;
  onBackgroundImageUpload: (imageData: string) => void;
  onAddLayer: (layer: Omit<TextLayer, 'id'>) => void;
  layers: TextLayer[];
}

export default function Controls({
  backgroundColor,
  onBackgroundColorChange,
  onBackgroundImageUpload,
  onAddLayer,
  layers,
}: ControlsProps) {
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
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Background</h3>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => onBackgroundColorChange(e.target.value)}
                className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => onBackgroundColorChange(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="#FFFFFF"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Background Image
            </label>
            <label className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg cursor-pointer transition-colors">
              <ImageIcon className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">Upload Image</span>
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

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Add Text Layer</h3>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Text Content
            </label>
            <input
              type="text"
              value={newLayerText}
              onChange={(e) => setNewLayerText(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter text"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Text Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={newLayerColor}
                onChange={(e) => setNewLayerColor(e.target.value)}
                className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={newLayerColor}
                onChange={(e) => setNewLayerColor(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="#E8E8E8"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Font Size: {newLayerFontSize}px
            </label>
            <input
              type="range"
              min="8"
              max="72"
              value={newLayerFontSize}
              onChange={(e) => setNewLayerFontSize(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Opacity: {(newLayerOpacity * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={newLayerOpacity}
              onChange={(e) => setNewLayerOpacity(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="text-xs font-medium text-gray-700 mb-1">Contrast Ratio</div>
            <div className="text-2xl font-bold text-gray-900">
              {contrastRatio.toFixed(2)}:1
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {contrastRatio < 1.5 && '⚠️ Very low contrast - "sweet spot"'}
              {contrastRatio >= 1.5 && contrastRatio < 3 && '⚠️ Low contrast'}
              {contrastRatio >= 3 && contrastRatio < 4.5 && '✓ Moderate contrast'}
              {contrastRatio >= 4.5 && '✓✓ Good contrast (WCAG AA+)'}
            </div>
          </div>

          <button
            onClick={handleAddLayer}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Text Layer
          </button>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="text-xs text-gray-600 space-y-1">
          <p className="font-medium">Quick tips:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-500">
            <li>Contrast ratio 1.0-1.5: Nearly invisible</li>
            <li>Contrast ratio 1.5-3.0: Attacker sweet spot</li>
            <li>Contrast ratio 4.5+: WCAG compliant</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
