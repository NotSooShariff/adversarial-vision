'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AIHumanSlider } from '@/components/ui/ai-human-slider';
import { FontSizeControl } from '@/components/ui/font-size-control';
import { Palette, EyeOff, Type, Braces, Grid3x3, Lock } from 'lucide-react';
import type {
  TechniqueType,
  TechniqueConfig,
  LowContrastConfig,
  LowOpacityConfig,
  MicroFontConfig,
  SVGPathConfig,
  MicrotextTilingConfig,
  SteganographyConfig,
} from '@/types';

interface TechniqueControlsProps {
  currentTechnique: TechniqueType;
  config: TechniqueConfig | null;
  onTechniqueChange: (technique: TechniqueType) => void;
  onConfigChange: (config: TechniqueConfig) => void;
}

export default function TechniqueControls({
  currentTechnique,
  config,
  onTechniqueChange,
  onConfigChange,
}: TechniqueControlsProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-3 font-mono text-muted-foreground">
          <span className="text-accent">//</span> Select Technique
        </h3>
        <Tabs value={currentTechnique} onValueChange={(v) => onTechniqueChange(v as TechniqueType)}>
          <TabsList className="grid grid-cols-2 gap-2 h-auto p-2 bg-card/50">
            <TabsTrigger value="low-contrast" className="gap-2 font-mono text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:scale-105 transition-all">
              <Palette className="w-3 h-3" />
              contrast
            </TabsTrigger>
            <TabsTrigger value="low-opacity" className="gap-2 font-mono text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:scale-105 transition-all">
              <EyeOff className="w-3 h-3" />
              opacity
            </TabsTrigger>
            <TabsTrigger value="micro-font" className="gap-2 font-mono text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:scale-105 transition-all">
              <Type className="w-3 h-3" />
              micro
            </TabsTrigger>
            <TabsTrigger value="svg-path" className="gap-2 font-mono text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:scale-105 transition-all">
              <Braces className="w-3 h-3" />
              svg
            </TabsTrigger>
            <TabsTrigger value="microtext-tiling" className="gap-2 font-mono text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:scale-105 transition-all">
              <Grid3x3 className="w-3 h-3" />
              tile
            </TabsTrigger>
            <TabsTrigger value="steganography" className="gap-2 font-mono text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:scale-105 transition-all">
              <Lock className="w-3 h-3" />
              stego
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="border-t border-border pt-4">
        <h3 className="text-sm font-semibold mb-3 font-mono text-muted-foreground">
          <span className="text-[hsl(var(--monokai-yellow))]">configure</span>
          <span className="text-foreground">(</span>
          <span className="text-[hsl(var(--monokai-orange))]">params</span>
          <span className="text-foreground">)</span>
        </h3>
        {currentTechnique === 'low-contrast' && (
          <LowContrastControls
            config={config as LowContrastConfig}
            onChange={onConfigChange}
          />
        )}
        {currentTechnique === 'low-opacity' && (
          <LowOpacityControls
            config={config as LowOpacityConfig}
            onChange={onConfigChange}
          />
        )}
        {currentTechnique === 'micro-font' && (
          <MicroFontControls
            config={config as MicroFontConfig}
            onChange={onConfigChange}
          />
        )}
        {currentTechnique === 'svg-path' && (
          <SVGPathControls
            config={config as SVGPathConfig}
            onChange={onConfigChange}
          />
        )}
        {currentTechnique === 'microtext-tiling' && (
          <MicrotextTilingControls
            config={config as MicrotextTilingConfig}
            onChange={onConfigChange}
          />
        )}
        {currentTechnique === 'steganography' && (
          <SteganographyControls
            config={config as SteganographyConfig}
            onChange={onConfigChange}
          />
        )}
      </div>
    </div>
  );
}

function LowContrastControls({
  config,
  onChange,
}: {
  config: LowContrastConfig;
  onChange: (config: TechniqueConfig) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-mono text-muted-foreground mb-2 block">Text</label>
        <input
          type="text"
          value={config.text}
          onChange={(e) => onChange({ ...config, text: e.target.value })}
          className="w-full px-3 py-2 bg-card border border-border rounded text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <AIHumanSlider
        label="Contrast Ratio"
        value={[config.contrastRatio]}
        onValueChange={(v) => onChange({ ...config, contrastRatio: v[0] })}
        min={1.0}
        max={10.0}
        step={0.1}
        reversed={true}
      />

      <FontSizeControl
        value={config.fontSize}
        onChange={(v) => onChange({ ...config, fontSize: v })}
        min={8}
        max={72}
      />
    </div>
  );
}

function LowOpacityControls({
  config,
  onChange,
}: {
  config: LowOpacityConfig;
  onChange: (config: TechniqueConfig) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-mono text-muted-foreground mb-2 block">Text</label>
        <input
          type="text"
          value={config.text}
          onChange={(e) => onChange({ ...config, text: e.target.value })}
          className="w-full px-3 py-2 bg-card border border-border rounded text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <AIHumanSlider
        label="Opacity"
        value={[config.opacity * 100]}
        onValueChange={(v) => onChange({ ...config, opacity: v[0] / 100 })}
        min={1}
        max={50}
        step={1}
      />

      <div>
        <label className="text-xs font-mono text-muted-foreground mb-2 block">Text Color</label>
        <input
          type="color"
          value={config.textColor}
          onChange={(e) => onChange({ ...config, textColor: e.target.value })}
          className="w-full h-10 bg-card border border-border rounded cursor-pointer"
        />
      </div>

      <FontSizeControl
        value={config.fontSize}
        onChange={(v) => onChange({ ...config, fontSize: v })}
        min={8}
        max={72}
      />
    </div>
  );
}

function MicroFontControls({
  config,
  onChange,
}: {
  config: MicroFontConfig;
  onChange: (config: TechniqueConfig) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-mono text-muted-foreground mb-2 block">Text</label>
        <input
          type="text"
          value={config.text}
          onChange={(e) => onChange({ ...config, text: e.target.value })}
          className="w-full px-3 py-2 bg-card border border-border rounded text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <FontSizeControl
        value={config.fontSize}
        onChange={(v) => onChange({ ...config, fontSize: Math.max(1, v) })}
        min={1}
        max={12}
      />

      <AIHumanSlider
        label="Opacity"
        value={[config.opacity * 100]}
        onValueChange={(v) => onChange({ ...config, opacity: v[0] / 100 })}
        min={10}
        max={100}
        step={5}
      />

      <div>
        <label className="text-xs font-mono text-muted-foreground mb-2 block">Letter Spacing</label>
        <input
          type="number"
          value={config.letterSpacing}
          onChange={(e) => onChange({ ...config, letterSpacing: Number(e.target.value) })}
          min={-2}
          max={10}
          step={0.5}
          className="w-full px-3 py-2 bg-card border border-border rounded text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="text-xs font-mono text-muted-foreground mb-2 block">Text Color</label>
        <input
          type="color"
          value={config.textColor}
          onChange={(e) => onChange({ ...config, textColor: e.target.value })}
          className="w-full h-10 bg-card border border-border rounded cursor-pointer"
        />
      </div>
    </div>
  );
}

function SVGPathControls({
  config,
  onChange,
}: {
  config: SVGPathConfig;
  onChange: (config: TechniqueConfig) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-mono text-muted-foreground mb-2 block">Text</label>
        <input
          type="text"
          value={config.text}
          onChange={(e) => onChange({ ...config, text: e.target.value })}
          className="w-full px-3 py-2 bg-card border border-border rounded text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="text-xs font-mono text-muted-foreground mb-2 block">Custom SVG Code (optional)</label>
        <textarea
          value={config.customSVG || ''}
          onChange={(e) => onChange({ ...config, customSVG: e.target.value })}
          placeholder="<path d='M 10 10 L 100 100' />"
          rows={3}
          className="w-full px-3 py-2 bg-card border border-border rounded text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-mono text-muted-foreground mb-2 block">Stroke Width</label>
          <input
            type="number"
            value={config.strokeWidth}
            onChange={(e) => onChange({ ...config, strokeWidth: Number(e.target.value) })}
            min={0.1}
            max={5}
            step={0.1}
            className="w-full px-3 py-2 bg-card border border-border rounded text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="text-xs font-mono text-muted-foreground mb-2 block">Stroke Opacity</label>
          <input
            type="number"
            value={config.strokeOpacity}
            onChange={(e) => onChange({ ...config, strokeOpacity: Number(e.target.value) })}
            min={0}
            max={1}
            step={0.1}
            className="w-full px-3 py-2 bg-card border border-border rounded text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-mono text-muted-foreground mb-2 block">Stroke Color</label>
          <input
            type="color"
            value={config.strokeColor}
            onChange={(e) => onChange({ ...config, strokeColor: e.target.value })}
            className="w-full h-10 bg-card border border-border rounded cursor-pointer"
          />
        </div>

        <div>
          <label className="text-xs font-mono text-muted-foreground mb-2 block">Fill Color</label>
          <input
            type="color"
            value={config.fillColor}
            onChange={(e) => onChange({ ...config, fillColor: e.target.value })}
            className="w-full h-10 bg-card border border-border rounded cursor-pointer"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-mono text-muted-foreground mb-2 block">Fill Opacity</label>
        <input
          type="number"
          value={config.fillOpacity}
          onChange={(e) => onChange({ ...config, fillOpacity: Number(e.target.value) })}
          min={0}
          max={1}
          step={0.1}
          className="w-full px-3 py-2 bg-card border border-border rounded text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="text-xs font-mono text-muted-foreground mb-2 block">
          Stroke Dasharray (e.g., &quot;5,5&quot;)
        </label>
        <input
          type="text"
          value={config.strokeDasharray || ''}
          onChange={(e) => onChange({ ...config, strokeDasharray: e.target.value })}
          placeholder="5,5"
          className="w-full px-3 py-2 bg-card border border-border rounded text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <FontSizeControl
        value={config.fontSize}
        onChange={(v) => onChange({ ...config, fontSize: v })}
        min={8}
        max={72}
      />
    </div>
  );
}

function MicrotextTilingControls({
  config,
  onChange,
}: {
  config: MicrotextTilingConfig;
  onChange: (config: TechniqueConfig) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-mono text-muted-foreground mb-2 block">Text to Tile</label>
        <input
          type="text"
          value={config.text}
          onChange={(e) => onChange({ ...config, text: e.target.value })}
          className="w-full px-3 py-2 bg-card border border-border rounded text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <AIHumanSlider
        label="Tile Density"
        value={[config.tileDensity]}
        onValueChange={(v) => onChange({ ...config, tileDensity: v[0] })}
        min={5}
        max={50}
        step={1}
      />

      <FontSizeControl
        value={config.fontSize}
        onChange={(v) => onChange({ ...config, fontSize: Math.max(1, v) })}
        min={1}
        max={12}
      />

      <AIHumanSlider
        label="Opacity"
        value={[config.opacity * 100]}
        onValueChange={(v) => onChange({ ...config, opacity: v[0] / 100 })}
        min={5}
        max={100}
        step={5}
      />

      <div>
        <label className="text-xs font-mono text-muted-foreground mb-2 block">
          Rotation (degrees) - <span className="text-primary">{config.rotation}°</span>
        </label>
        <input
          type="number"
          value={config.rotation}
          onChange={(e) => onChange({ ...config, rotation: Number(e.target.value) })}
          min={-45}
          max={45}
          step={1}
          className="w-full px-3 py-2 bg-card border border-border rounded text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
    </div>
  );
}

function SteganographyControls({
  config,
  onChange,
}: {
  config: SteganographyConfig;
  onChange: (config: TechniqueConfig) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-mono text-muted-foreground mb-2 block">Secret Message</label>
        <textarea
          value={config.text}
          onChange={(e) => onChange({ ...config, text: e.target.value })}
          placeholder="Enter secret message to embed in image..."
          rows={3}
          className="w-full px-3 py-2 bg-card border border-border rounded text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
        <p className="text-xs text-muted-foreground/60 mt-1 font-mono">
          Max capacity depends on image size
        </p>
      </div>

      <div>
        <label className="text-xs font-mono text-muted-foreground mb-2 block">
          LSB Depth - <span className="text-primary">{config.bitsPerChannel} bit{config.bitsPerChannel > 1 ? 's' : ''}</span>
        </label>
        <input
          type="range"
          value={config.bitsPerChannel}
          onChange={(e) => onChange({ ...config, bitsPerChannel: Number(e.target.value) })}
          min={1}
          max={3}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] font-mono text-muted-foreground/60 mt-1">
          <span>1 LSB (most secure)</span>
          <span>3 LSBs (higher capacity)</span>
        </div>
      </div>

      <div>
        <label className="text-xs font-mono text-muted-foreground mb-2 block">Color Channels</label>
        <div className="grid grid-cols-2 gap-2">
          {(['rgb', 'r', 'g', 'b'] as const).map((channel) => (
            <button
              key={channel}
              onClick={() => onChange({ ...config, channels: channel })}
              className={`px-3 py-2 rounded text-xs font-mono border transition-all ${
                config.channels === channel
                  ? 'bg-primary/20 border-primary text-primary'
                  : 'bg-card border-border text-muted-foreground hover:border-primary/50'
              }`}
            >
              {channel.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 bg-card/30 border border-border rounded">
        <p className="text-xs text-muted-foreground/80 font-mono leading-relaxed">
          <span className="text-[hsl(var(--monokai-yellow))]">// Info:</span> LSB steganography embeds your message in the least significant bits of pixel values. Higher bit depth = more capacity but easier to detect.
        </p>
      </div>
    </div>
  );
}
