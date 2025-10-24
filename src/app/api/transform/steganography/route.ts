import { NextRequest, NextResponse } from 'next/server';
import { createCanvas, loadImage, CanvasRenderingContext2D } from 'canvas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      image,
      text,
      bitsPerChannel = 1,
      channels = 'rgb',
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

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Convert text to binary
    const binaryText = text
      .split('')
      .map((char: string) => char.charCodeAt(0).toString(2).padStart(8, '0'))
      .join('');

    // Embed text in LSBs
    const channelIndices: number[] = [];
    if (channels.includes('r')) channelIndices.push(0);
    if (channels.includes('g')) channelIndices.push(1);
    if (channels.includes('b')) channelIndices.push(2);

    const bitsPerPixel = channelIndices.length * bitsPerChannel;
    const maxBits = (data.length / 4) * bitsPerPixel;

    if (binaryText.length > maxBits) {
      return NextResponse.json(
        { error: 'Text too long for the given image and bit configuration' },
        { status: 400 }
      );
    }

    let bitIndex = 0;
    const mask = (1 << bitsPerChannel) - 1; // Create mask for the number of bits

    for (let i = 0; i < data.length && bitIndex < binaryText.length; i += 4) {
      for (const channelIndex of channelIndices) {
        if (bitIndex >= binaryText.length) break;

        // Extract the next bits from the binary text
        let bits = 0;
        for (let b = 0; b < bitsPerChannel && bitIndex < binaryText.length; b++) {
          bits = (bits << 1) | parseInt(binaryText[bitIndex]);
          bitIndex++;
        }

        // Clear the LSBs and set new value
        data[i + channelIndex] = (data[i + channelIndex] & ~mask) | bits;
      }
    }

    // Put modified image data back
    ctx.putImageData(imageData, 0, 0);

    // Convert to base64
    const resultImage = canvas.toDataURL('image/png');

    return NextResponse.json({
      success: true,
      image: resultImage,
      metadata: {
        technique: 'steganography',
        parameters: {
          text,
          bitsPerChannel,
          channels,
          textLength: text.length,
          bitsEmbedded: binaryText.length,
        },
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Steganography transformation error:', error);
    return NextResponse.json(
      { error: 'Failed to process image transformation' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    technique: 'steganography',
    description: 'Embed hidden text in image pixels using LSB (Least Significant Bit) technique',
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
        description: 'Text to embed in image pixels',
      },
      bitsPerChannel: {
        type: 'number',
        required: false,
        default: 1,
        range: '1 - 3',
        description: 'Number of LSBs to modify per color channel',
      },
      channels: {
        type: 'string',
        required: false,
        default: 'rgb',
        options: ['rgb', 'r', 'g', 'b', 'rg', 'rb', 'gb'],
        description: 'Which color channels to use for embedding',
      },
    },
    notes: [
      'Higher bitsPerChannel values increase capacity but also detectability',
      'Using all RGB channels provides 3x the capacity of a single channel',
      'Text is encoded as binary and embedded sequentially in pixel data',
      'Maximum text length depends on image size and bit configuration',
    ],
    example: {
      curl: `curl -X POST https://yoursite.com/api/transform/steganography \\
  -H "Content-Type: application/json" \\
  -d '{"image": "data:image/png;base64,...", "text": "Secret message", "bitsPerChannel": 1, "channels": "rgb"}'`,
    },
  });
}
