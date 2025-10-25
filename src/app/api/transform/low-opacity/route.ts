import { NextRequest, NextResponse } from 'next/server';
import { Canvas, loadImage } from '@napi-rs/canvas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      image,
      text,
      textColor = '#000000',
      opacity = 0.1,
      fontSize = 24,
      fontFamily = 'Arial',
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
    const canvas = new Canvas(img.width, img.height);
    const ctx = canvas.getContext('2d');

    // Draw base image
    ctx.drawImage(img, 0, 0);

    // Apply opacity and draw text
    ctx.globalAlpha = opacity;
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = textColor;
    ctx.fillText(text, x, y);
    ctx.globalAlpha = 1.0;

    // Convert to base64
    const resultImage = canvas.toDataURL('image/png');

    return NextResponse.json({
      success: true,
      image: resultImage,
      metadata: {
        technique: 'low-opacity',
        parameters: {
          text,
          textColor,
          opacity,
          fontSize,
          fontFamily,
          x,
          y,
        },
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Low-opacity transformation error:', error);
    return NextResponse.json(
      { error: 'Failed to process image transformation' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    technique: 'low-opacity',
    description: 'Apply low-opacity transparent text to images',
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
      textColor: {
        type: 'string',
        required: false,
        default: '#000000',
        description: 'Text color in hex format',
      },
      opacity: {
        type: 'number',
        required: false,
        default: 0.1,
        range: '0.0 - 1.0',
        description: 'Text opacity (lower = more transparent)',
      },
      fontSize: {
        type: 'number',
        required: false,
        default: 24,
        description: 'Font size in pixels',
      },
      fontFamily: {
        type: 'string',
        required: false,
        default: 'Arial',
        description: 'Font family name',
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
      curl: `curl -X POST https://yoursite.com/api/transform/low-opacity \\
  -H "Content-Type: application/json" \\
  -d '{"image": "data:image/png;base64,...", "text": "Transparent text", "opacity": 0.1}'`,
    },
  });
}
