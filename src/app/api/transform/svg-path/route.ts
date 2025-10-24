import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      image,
      text,
      fontSize = 24,
      strokeWidth = 0.5,
      strokeColor = '#000000',
      strokeOpacity = 1.0,
      fillColor = '#000000',
      fillOpacity = 0.3,
      strokeDasharray = '',
      x = 50,
      y = 50,
    } = body;

    if (!image || !text) {
      return NextResponse.json(
        { error: 'Missing required parameters: image and text' },
        { status: 400 }
      );
    }

    // For SVG path, we need to return SVG overlay data
    // Client-side rendering is more appropriate for SVG manipulation
    // This endpoint returns configuration for client-side SVG rendering

    const svgConfig = {
      text,
      fontSize,
      strokeWidth,
      strokeColor,
      strokeOpacity,
      fillColor,
      fillOpacity,
      strokeDasharray,
      x,
      y,
    };

    return NextResponse.json({
      success: true,
      message: 'SVG path technique requires client-side rendering for best results',
      svgConfig,
      metadata: {
        technique: 'svg-path',
        parameters: svgConfig,
        timestamp: new Date().toISOString(),
        note: 'Apply this configuration client-side using SVG overlay on canvas',
      },
    });
  } catch (error) {
    console.error('SVG-path transformation error:', error);
    return NextResponse.json(
      { error: 'Failed to process SVG configuration' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    technique: 'svg-path',
    description: 'Apply SVG path text with customizable stroke and fill properties',
    method: 'POST',
    note: 'This technique is best implemented client-side for maximum control',
    parameters: {
      image: {
        type: 'string (base64)',
        required: true,
        description: 'Base64 encoded image data',
      },
      text: {
        type: 'string',
        required: true,
        description: 'Text to render as SVG path',
      },
      fontSize: {
        type: 'number',
        required: false,
        default: 24,
        description: 'Font size in pixels',
      },
      strokeWidth: {
        type: 'number',
        required: false,
        default: 0.5,
        range: '0.1 - 5.0',
        description: 'Stroke width in pixels',
      },
      strokeColor: {
        type: 'string',
        required: false,
        default: '#000000',
        description: 'Stroke color in hex format',
      },
      strokeOpacity: {
        type: 'number',
        required: false,
        default: 1.0,
        range: '0.0 - 1.0',
        description: 'Stroke opacity',
      },
      fillColor: {
        type: 'string',
        required: false,
        default: '#000000',
        description: 'Fill color in hex format',
      },
      fillOpacity: {
        type: 'number',
        required: false,
        default: 0.3,
        range: '0.0 - 1.0',
        description: 'Fill opacity',
      },
      strokeDasharray: {
        type: 'string',
        required: false,
        default: '',
        description: 'SVG stroke-dasharray value (e.g., "5,5" for dashed)',
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
      curl: `curl -X POST https://yoursite.com/api/transform/svg-path \\
  -H "Content-Type: application/json" \\
  -d '{"image": "data:image/png;base64,...", "text": "SVG text", "strokeWidth": 0.5}'`,
    },
  });
}
