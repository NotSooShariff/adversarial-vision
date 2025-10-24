import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return NextResponse.json({
    name: 'Adversarial Vision API',
    version: '1.0.0',
    description: 'Transform images with adversarial text techniques that AI can detect but humans cannot easily see',
    documentation: `${baseUrl}/playground`,
    contact: 'adversarialvision@owaisshariff.com',
    endpoints: {
      techniques: {
        'low-contrast': {
          url: `${baseUrl}/api/transform/low-contrast`,
          description: 'Apply low-contrast text using WCAG contrast ratios',
          methods: ['GET', 'POST'],
        },
        'low-opacity': {
          url: `${baseUrl}/api/transform/low-opacity`,
          description: 'Apply transparent text with configurable opacity',
          methods: ['GET', 'POST'],
        },
        'micro-font': {
          url: `${baseUrl}/api/transform/micro-font`,
          description: 'Apply extremely small text (1-6px)',
          methods: ['GET', 'POST'],
        },
        'svg-path': {
          url: `${baseUrl}/api/transform/svg-path`,
          description: 'Apply SVG path text with stroke and fill properties',
          methods: ['GET', 'POST'],
          note: 'Best implemented client-side',
        },
        'microtext-tiling': {
          url: `${baseUrl}/api/transform/microtext-tiling`,
          description: 'Tile small text repeatedly across the image',
          methods: ['GET', 'POST'],
        },
        'steganography': {
          url: `${baseUrl}/api/transform/steganography`,
          description: 'Embed text in image pixels using LSB technique',
          methods: ['GET', 'POST'],
        },
      },
    },
    usage: {
      GET: 'Send GET request to any technique endpoint to view parameters and documentation',
      POST: 'Send POST request with image (base64) and technique parameters to transform the image',
    },
    examples: {
      getDocumentation: `curl ${baseUrl}/api/transform/low-contrast`,
      postTransform: `curl -X POST ${baseUrl}/api/transform/low-contrast \\
  -H "Content-Type: application/json" \\
  -d '{"image": "data:image/png;base64,...", "text": "Hidden text", "contrastRatio": 1.5}'`,
    },
    rateLimits: 'No rate limits currently enforced',
    terms: `${baseUrl}/terms`,
    privacy: `${baseUrl}/privacy`,
  });
}
