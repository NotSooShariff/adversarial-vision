import { NextRequest, NextResponse } from 'next/server';
import { createCanvas, loadImage, CanvasRenderingContext2D } from 'canvas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      image,
      text,
      tileDensity = 20,
      fontSize = 6,
      opacity = 0.5,
      rotation = 0,
      tileWidth,
      tileHeight,
    } = body;

    if (!image || !text) {
      return NextResponse.json(
        { error: 'Missing required parameters: image and text' },
        { status: 400 }
      );
    }

    // Load the base image
    const img = await loadImage(image);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d') as unknown as CanvasRenderingContext2D;

    // Draw base image
    ctx.drawImage(img, 0, 0);

    // Apply tiled microtext
    ctx.globalAlpha = opacity;
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = '#000000';

    const width = tileWidth || img.width;
    const height = tileHeight || img.height;
    const spacing = Math.max(width / tileDensity, fontSize * 2);

    for (let y = 0; y < height; y += spacing) {
      for (let x = 0; x < width; x += spacing) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.fillText(text, 0, 0);
        ctx.restore();
      }
    }

    ctx.globalAlpha = 1.0;

    // Convert to base64
    const resultImage = canvas.toDataURL('image/png');

    return NextResponse.json({
      success: true,
      image: resultImage,
      metadata: {
        technique: 'microtext-tiling',
        parameters: {
          text,
          tileDensity,
          fontSize,
          opacity,
          rotation,
          tileWidth: width,
          tileHeight: height,
        },
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Microtext-tiling transformation error:', error);
    return NextResponse.json(
      { error: 'Failed to process image transformation' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    technique: 'microtext-tiling',
    description: 'Tile small text repeatedly across the entire image',
    method: 'POST',
    parameters: {
      image: {
        type: 'string (base64)',
        required: true,
        description: 'Base64 encoded image data',
      },
      text: {
        type: 'string',
        required: true,
        description: 'Text to tile across image',
      },
      tileDensity: {
        type: 'number',
        required: false,
        default: 20,
        range: '5 - 100',
        description: 'Number of tiles per dimension (higher = more repetitions)',
      },
      fontSize: {
        type: 'number',
        required: false,
        default: 6,
        range: '2 - 12',
        description: 'Font size in pixels',
      },
      opacity: {
        type: 'number',
        required: false,
        default: 0.5,
        range: '0.0 - 1.0',
        description: 'Text opacity',
      },
      rotation: {
        type: 'number',
        required: false,
        default: 0,
        range: '0 - 360',
        description: 'Rotation angle in degrees',
      },
      tileWidth: {
        type: 'number',
        required: false,
        default: 'image width',
        description: 'Width of tiling area',
      },
      tileHeight: {
        type: 'number',
        required: false,
        default: 'image height',
        description: 'Height of tiling area',
      },
    },
    example: {
      curl: `curl -X POST https://yoursite.com/api/transform/microtext-tiling \\
  -H "Content-Type: application/json" \\
  -d '{"image": "data:image/png;base64,...", "text": "TILE", "tileDensity": 20}'`,
    },
  });
}
