import { NextRequest, NextResponse } from 'next/server';
import { createCanvas, loadImage, CanvasRenderingContext2D } from 'canvas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      image,
      text,
      fontSize = 4,
      fontFamily = 'Arial',
      textColor = '#000000',
      letterSpacing = 0,
      opacity = 0.8,
      x = 50,
      y = 50,
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

    // Apply micro-font text
    ctx.globalAlpha = opacity;
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = textColor;

    // Handle letter spacing
    if (letterSpacing !== 0) {
      let currentX = x;
      for (const char of text) {
        ctx.fillText(char, currentX, y);
        const metrics = ctx.measureText(char);
        currentX += metrics.width + letterSpacing;
      }
    } else {
      ctx.fillText(text, x, y);
    }

    ctx.globalAlpha = 1.0;

    // Convert to base64
    const resultImage = canvas.toDataURL('image/png');

    return NextResponse.json({
      success: true,
      image: resultImage,
      metadata: {
        technique: 'micro-font',
        parameters: {
          text,
          fontSize,
          fontFamily,
          textColor,
          letterSpacing,
          opacity,
          x,
          y,
        },
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Micro-font transformation error:', error);
    return NextResponse.json(
      { error: 'Failed to process image transformation' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    technique: 'micro-font',
    description: 'Apply extremely small text (1-6px) to images',
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
        description: 'Text to overlay on image',
      },
      fontSize: {
        type: 'number',
        required: false,
        default: 4,
        range: '1 - 10',
        description: 'Font size in pixels (supports 1px minimum)',
      },
      fontFamily: {
        type: 'string',
        required: false,
        default: 'Arial',
        description: 'Font family name',
      },
      textColor: {
        type: 'string',
        required: false,
        default: '#000000',
        description: 'Text color in hex format',
      },
      letterSpacing: {
        type: 'number',
        required: false,
        default: 0,
        description: 'Letter spacing in pixels',
      },
      opacity: {
        type: 'number',
        required: false,
        default: 0.8,
        range: '0.0 - 1.0',
        description: 'Text opacity',
      },
      x: {
        type: 'number',
        required: false,
        default: 50,
        description: 'X position of text',
      },
      y: {
        type: 'number',
        required: false,
        default: 50,
        description: 'Y position of text',
      },
    },
    example: {
      curl: `curl -X POST https://yoursite.com/api/transform/micro-font \\
  -H "Content-Type: application/json" \\
  -d '{"image": "data:image/png;base64,...", "text": "Tiny text", "fontSize": 2}'`,
    },
  });
}
