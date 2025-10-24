'use client';

import { useRef, useEffect } from 'react';
import type { TextLayer } from '@/types';

interface ImageCanvasProps {
  width: number;
  height: number;
  backgroundColor: string;
  backgroundImage: string | null;
  layers: TextLayer[];
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

export default function ImageCanvas({
  width,
  height,
  backgroundColor,
  backgroundImage,
  layers,
  onCanvasReady,
}: ImageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    if (backgroundImage) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
        drawLayers(ctx, layers);
      };
      img.src = backgroundImage;
    } else {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
      drawLayers(ctx, layers);
    }

    // Notify parent when canvas is ready
    if (onCanvasReady) {
      onCanvasReady(canvas);
    }
  }, [width, height, backgroundColor, backgroundImage, layers, onCanvasReady]);

  const drawLayers = (ctx: CanvasRenderingContext2D, layers: TextLayer[]) => {
    // Sort by z-index
    const sortedLayers = [...layers].sort((a, b) => a.zIndex - b.zIndex);

    sortedLayers.forEach((layer) => {
      ctx.save();

      // Set text properties
      ctx.font = `${layer.italic ? 'italic ' : ''}${layer.bold ? 'bold ' : ''}${layer.fontSize}px ${layer.fontFamily}`;
      ctx.fillStyle = layer.color;
      ctx.globalAlpha = layer.opacity;

      // Draw text
      ctx.fillText(layer.text, layer.x, layer.y);

      ctx.restore();
    });
  };

  return (
    <div className="flex items-center justify-center bg-secondary/30 border-2 border-border rounded-xl overflow-hidden shadow-brutal">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="max-w-full h-auto"
        style={{ imageRendering: 'crisp-edges' }}
      />
    </div>
  );
}
