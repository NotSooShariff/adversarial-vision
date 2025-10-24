'use client';

import { useRef, useEffect, useState } from 'react';
import type { TechniqueConfig, SteganographyConfig } from '@/types';

interface AdversarialCanvasProps {
  backgroundImage: string | null;
  backgroundColor: string;
  techniqueConfig: TechniqueConfig | null;
  width: number;
  height: number;
  onCanvasReady?: (canvas: HTMLDivElement) => void;
  onConfigUpdate?: (config: TechniqueConfig) => void;
}

export default function AdversarialCanvas({
  backgroundImage,
  backgroundColor,
  techniqueConfig,
  width,
  height,
  onCanvasReady,
  onConfigUpdate,
}: AdversarialCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [stegoImage, setStegoImage] = useState<string | null>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current && onCanvasReady) {
      onCanvasReady(canvasRef.current);
    }
  }, [onCanvasReady]);

  useEffect(() => {
    if (techniqueConfig && 'x' in techniqueConfig && 'y' in techniqueConfig) {
      setCurrentPos({ x: techniqueConfig.x, y: techniqueConfig.y });
    }
  }, [techniqueConfig]);

  // Process steganography when config changes
  useEffect(() => {
    if (techniqueConfig?.technique === 'steganography' && backgroundImage) {
      applySteganography(techniqueConfig as SteganographyConfig, backgroundImage);
    } else {
      setStegoImage(null);
    }
  }, [techniqueConfig, backgroundImage]);

  const applySteganography = async (config: SteganographyConfig, imageUrl: string) => {
    try {
      // Create hidden canvas for processing
      if (!hiddenCanvasRef.current) {
        hiddenCanvasRef.current = document.createElement('canvas');
      }
      const canvas = hiddenCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Load image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Get pixel data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Convert text to binary
        const binaryMessage = textToBinary(config.text);

        // Embed message in LSBs
        embedMessage(data, binaryMessage, config.bitsPerChannel, config.channels);

        // Put modified data back
        ctx.putImageData(imageData, 0, 0);

        // Set as background
        setStegoImage(canvas.toDataURL());
      };
      img.src = imageUrl;
    } catch (error) {
      console.error('Steganography error:', error);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!techniqueConfig || !('x' in techniqueConfig)) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - currentPos.x,
      y: e.clientY - currentPos.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !techniqueConfig || !('x' in techniqueConfig)) return;
    const newX = Math.max(0, Math.min(width - 100, e.clientX - dragStart.x));
    const newY = Math.max(0, Math.min(height - 50, e.clientY - dragStart.y));
    setCurrentPos({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    if (isDragging && techniqueConfig && 'x' in techniqueConfig && onConfigUpdate) {
      setIsDragging(false);
      onConfigUpdate({
        ...techniqueConfig,
        x: currentPos.x,
        y: currentPos.y,
      });
    } else {
      setIsDragging(false);
    }
  };

  // Use steganographically modified image for steganography technique
  const displayImage = techniqueConfig?.technique === 'steganography' && stegoImage
    ? stegoImage
    : backgroundImage;

  return (
    <div
      ref={canvasRef}
      className="relative mx-auto overflow-hidden"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: displayImage ? 'transparent' : backgroundColor,
        backgroundImage: displayImage ? `url(${displayImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {techniqueConfig && techniqueConfig.technique !== 'steganography' && renderTechnique(techniqueConfig, currentPos, handleMouseDown, isDragging, width, height)}
    </div>
  );
}

function renderTechnique(
  config: TechniqueConfig,
  currentPos: { x: number; y: number },
  handleMouseDown: (e: React.MouseEvent) => void,
  isDragging: boolean,
  canvasWidth: number,
  canvasHeight: number
) {
  const draggableStyle = {
    cursor: isDragging ? 'grabbing' : 'grab',
    userSelect: 'none' as const,
  };

  switch (config.technique) {
    case 'low-contrast':
      // For low-contrast, we use CSS mix-blend-mode to approximate dynamic color adjustment
      // True pixel-level adjustment would require canvas-based image processing
      return (
        <div
          onMouseDown={handleMouseDown}
          style={{
            position: 'absolute',
            left: `${currentPos.x}px`,
            top: `${currentPos.y}px`,
            fontSize: `${config.fontSize}px`,
            fontFamily: config.fontFamily,
            whiteSpace: 'pre-wrap',
            maxWidth: `${canvasWidth - currentPos.x - 20}px`,
            overflow: 'hidden',
            mixBlendMode: 'difference',
            opacity: Math.max(0.1, 1 - (config.contrastRatio - 1) / 3),
            color: '#888888',
            filter: `contrast(${1 / config.contrastRatio})`,
            ...draggableStyle,
          }}
        >
          {config.text}
        </div>
      );

    case 'low-opacity':
      return (
        <div
          onMouseDown={handleMouseDown}
          style={{
            position: 'absolute',
            left: `${currentPos.x}px`,
            top: `${currentPos.y}px`,
            color: config.textColor,
            fontSize: `${config.fontSize}px`,
            fontFamily: config.fontFamily,
            opacity: config.opacity,
            whiteSpace: 'pre-wrap',
            maxWidth: `${canvasWidth - currentPos.x - 20}px`,
            overflow: 'hidden',
            ...draggableStyle,
          }}
        >
          {config.text}
        </div>
      );

    case 'micro-font':
      return (
        <div
          onMouseDown={handleMouseDown}
          style={{
            position: 'absolute',
            left: `${currentPos.x}px`,
            top: `${currentPos.y}px`,
            color: config.textColor,
            fontSize: `${config.fontSize}px`,
            fontFamily: config.fontFamily,
            letterSpacing: `${config.letterSpacing}px`,
            opacity: config.opacity,
            whiteSpace: 'pre-wrap',
            maxWidth: `${canvasWidth - currentPos.x - 20}px`,
            overflow: 'hidden',
            lineHeight: 1.2,
            ...draggableStyle,
          }}
        >
          {config.text}
        </div>
      );

    case 'svg-path':
      if (config.customSVG) {
        // User provided custom SVG
        return (
          <div
            onMouseDown={handleMouseDown}
            style={{
              position: 'absolute',
              left: `${currentPos.x}px`,
              top: `${currentPos.y}px`,
              maxWidth: `${canvasWidth - currentPos.x - 20}px`,
              maxHeight: `${canvasHeight - currentPos.y - 20}px`,
              overflow: 'hidden',
              ...draggableStyle,
            }}
            dangerouslySetInnerHTML={{
              __html: `<svg width="100%" height="100%" viewBox="0 0 200 100" style="overflow: visible;">${config.customSVG}</svg>`,
            }}
          />
        );
      }

      // Default: Render text as SVG with customizable properties
      return (
        <svg
          onMouseDown={handleMouseDown}
          style={{
            position: 'absolute',
            left: `${currentPos.x}px`,
            top: `${currentPos.y}px`,
            overflow: 'visible',
            maxWidth: `${canvasWidth - currentPos.x - 20}px`,
            ...draggableStyle,
          }}
        >
          <text
            x="0"
            y={config.fontSize}
            fontSize={config.fontSize}
            stroke={config.strokeColor}
            strokeWidth={config.strokeWidth}
            strokeOpacity={config.strokeOpacity}
            strokeDasharray={config.strokeDasharray || undefined}
            fill={config.fillColor}
            fillOpacity={config.fillOpacity}
            fontFamily="Arial"
          >
            {config.text}
          </text>
        </svg>
      );

    case 'microtext-tiling':
      const tiles = [];
      // Estimate text width: average character width is ~0.6 * fontSize for monospace
      const estimatedTextWidth = config.text.length * config.fontSize * 0.6;

      // Calculate spacing based on tile density and text width
      // Ensure spacing is at least 1.2x the text width to prevent overlap
      const minSpacingX = Math.max(estimatedTextWidth * 1.2, config.fontSize * 2);
      const spacingX = Math.max(minSpacingX, canvasWidth / config.tileDensity);
      const spacingY = Math.max(config.fontSize * 1.8, canvasHeight / config.tileDensity);

      const cols = Math.floor(canvasWidth / spacingX);
      const rows = Math.floor(canvasHeight / spacingY);

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          tiles.push(
            <div
              key={`${row}-${col}`}
              style={{
                position: 'absolute',
                left: `${col * spacingX}px`,
                top: `${row * spacingY}px`,
                fontSize: `${config.fontSize}px`,
                whiteSpace: 'nowrap',
                opacity: config.opacity,
                transform: `rotate(${config.rotation}deg)`,
                transformOrigin: 'center',
                color: '#888888',
                fontFamily: 'monospace',
                maxWidth: `${spacingX * 0.9}px`,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {config.text}
            </div>
          );
        }
      }

      return (
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            cursor: 'default',
            overflow: 'hidden',
          }}
        >
          {tiles}
        </div>
      );

    default:
      return null;
  }
}

// Helper functions for LSB steganography
function textToBinary(text: string): string {
  let binary = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    binary += charCode.toString(2).padStart(8, '0');
  }
  // Add delimiter to mark end of message
  binary += '00000000'; // Null terminator
  return binary;
}

function embedMessage(
  pixelData: Uint8ClampedArray,
  binaryMessage: string,
  bitsPerChannel: number,
  channels: 'rgb' | 'r' | 'g' | 'b'
): void {
  const channelIndices: number[] = [];
  if (channels === 'rgb') {
    channelIndices.push(0, 1, 2); // R, G, B
  } else if (channels === 'r') {
    channelIndices.push(0);
  } else if (channels === 'g') {
    channelIndices.push(1);
  } else if (channels === 'b') {
    channelIndices.push(2);
  }

  let messageIndex = 0;
  const totalChannels = channelIndices.length;

  // Iterate through pixels
  for (let i = 0; i < pixelData.length; i += 4) {
    if (messageIndex >= binaryMessage.length) break;

    // Process each selected channel
    for (const channelOffset of channelIndices) {
      if (messageIndex >= binaryMessage.length) break;

      const pixelIndex = i + channelOffset;
      let pixelValue = pixelData[pixelIndex];

      // Clear the LSBs
      const mask = ~((1 << bitsPerChannel) - 1);
      pixelValue = pixelValue & mask;

      // Extract bits from message
      let bits = 0;
      for (let b = 0; b < bitsPerChannel && messageIndex < binaryMessage.length; b++) {
        bits = (bits << 1) | parseInt(binaryMessage[messageIndex]);
        messageIndex++;
      }

      // Embed bits in LSBs
      pixelData[pixelIndex] = pixelValue | bits;
    }
  }
}
