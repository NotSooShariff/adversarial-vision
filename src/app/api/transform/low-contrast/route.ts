import { NextRequest, NextResponse } from 'next/server';
import { Canvas, loadImage } from '@napi-rs/canvas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      image,
      text,
      contrastRatio = 1.5,
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

    // Calculate low-contrast color
    // Sample background color at text position
    const imageData = ctx.getImageData(x, y, 1, 1);
    const bgColor = imageData.data;
    const bgLuminance = (0.299 * bgColor[0] + 0.587 * bgColor[1] + 0.114 * bgColor[2]) / 255;

    // Calculate text color based on contrast ratio
    let textLuminance: number;
    if (bgLuminance > 0.5) {
      // Dark text on light background
      textLuminance = (bgLuminance - (contrastRatio - 1)) / contrastRatio;
    } else {
      // Light text on dark background
      textLuminance = bgLuminance * contrastRatio + (contrastRatio - 1);
    }

    textLuminance = Math.max(0, Math.min(1, textLuminance));
    const textGray = Math.round(textLuminance * 255);
    const textColor = `rgb(${textGray}, ${textGray}, ${textGray})`;

    // Draw text
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = textColor;
    ctx.fillText(text, x, y);

    // Convert to base64
    const resultImage = canvas.toDataURL('image/png');

    return NextResponse.json({
      success: true,
      image: resultImage,
      metadata: {
        technique: 'low-contrast',
        parameters: {
          text,
          contrastRatio,
          fontSize,
          fontFamily,
          x,
          y,
          calculatedTextColor: textColor,
        },
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Low-contrast transformation error:', error);
    return NextResponse.json(
      { error: 'Failed to process image transformation' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    technique: 'low-contrast',
    description: 'Apply low-contrast text to images that AI can detect but humans cannot easily see',
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
      contrastRatio: {
        type: 'number',
        required: false,
        default: 1.5,
        range: '1.0 - 3.0',
        description: 'WCAG contrast ratio (lower = less visible)',
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
      curl: `curl -X POST https://yoursite.com/api/transform/low-contrast \\
  -H "Content-Type: application/json" \\
  -d '{"image": "data:image/png;base64,...", "text": "Hidden text", "contrastRatio": 1.5}'`,
    },
  });
}
