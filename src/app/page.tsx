'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Upload, ArrowRight, Microscope, Shield, Zap, AlertTriangle, ImageDown } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

// Compress image to fit in sessionStorage (max 5MB)
function compressImage(dataUrl: string, maxSizeKB: number = 4096): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Calculate scaling to keep under size limit
      const maxDimension = 2000;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = (height / width) * maxDimension;
          width = maxDimension;
        } else {
          width = (width / height) * maxDimension;
          height = maxDimension;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Try different quality levels until we fit in size limit
      let quality = 0.9;
      let compressed = canvas.toDataURL('image/jpeg', quality);

      while (compressed.length > maxSizeKB * 1024 && quality > 0.1) {
        quality -= 0.1;
        compressed = canvas.toDataURL('image/jpeg', quality);
      }

      resolve(compressed);
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}

export default function Home() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const processFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type', {
        description: 'Please upload a valid image file (PNG, JPG, WebP, etc.)',
      });
      return;
    }

    // Validate file size (max 20MB original)
    if (file.size > 20 * 1024 * 1024) {
      toast.error('File too large', {
        description: 'Maximum file size is 20MB. Please choose a smaller image.',
      });
      return;
    }

    setIsUploading(true);
    const loadingToast = toast.loading('Processing image...', {
      description: 'Compressing and preparing your image',
    });

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const imageData = event.target?.result as string;

          // Compress image to fit in sessionStorage
          const compressed = await compressImage(imageData);

          if (typeof window !== 'undefined') {
            sessionStorage.setItem('uploadedImage', compressed);
          }

          toast.success('Image uploaded successfully', {
            description: 'Redirecting to playground...',
            id: loadingToast,
          });

          setTimeout(() => {
            router.push('/playground');
          }, 500);
        } catch (error) {
          console.error('Compression error:', error);
          toast.error('Failed to process image', {
            description: 'The image could not be compressed. Try a smaller file.',
            id: loadingToast,
          });
          setIsUploading(false);
        }
      };
      reader.onerror = () => {
        toast.error('Failed to read file', {
          description: 'Could not read the image file. Please try again.',
          id: loadingToast,
        });
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed', {
        description: 'An unexpected error occurred. Please try again.',
        id: loadingToast,
      });
      setIsUploading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isUploading) {
      setIsHovering(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set isHovering to false if we're actually leaving the drop zone
    // Check if the related target is outside the current target
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setIsHovering(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHovering(false);

    if (isUploading) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  const triggerUpload = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(102,217,239,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(102,217,239,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="max-w-4xl w-full relative z-10 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight font-mono leading-tight">
            <span className="text-foreground">Adversarial</span>{' '}
            <span className="text-primary">Vision</span>
          </h1>

          <p className="text-lg font-mono max-w-2xl mx-auto leading-relaxed">
            <span className="text-muted-foreground">Hide text in images that</span>{' '}
            <span className="text-[hsl(var(--monokai-green))]">AI can detect</span>{' '}
            <span className="text-muted-foreground">but</span>{' '}
            <span className="text-[hsl(var(--monokai-orange))]">humans cannot see</span>
          </p>
        </div>

        {/* Upload Area - More prominent */}
        <div
          className={`bg-card/30 border-2 border-dashed rounded-xl p-12 transition-all duration-300 ${
            isHovering
              ? 'border-primary/60 bg-primary/10 scale-[1.02]'
              : 'border-border/50 hover:border-primary/30 hover:bg-card/40'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="file-upload"
            disabled={isUploading}
          />

          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border border-primary/20 transition-transform duration-300">
              {isHovering ? (
                <ImageDown className="w-10 h-10 text-primary animate-bounce" />
              ) : (
                <Upload className="w-10 h-10 text-primary" />
              )}
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold font-mono">
                <span className="text-[hsl(var(--monokai-yellow))]">{isHovering ? 'Drop' : 'Upload'}</span>{' '}
                <span className="text-[hsl(var(--monokai-yellow))]">Image to Begin</span>
              </h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto font-mono">
                {isHovering ? (
                  'Drop your image here to get started'
                ) : (
                  <>
                    Drag & drop or upload an image, then experiment with <span className="text-primary">6 techniques</span> to hide text
                  </>
                )}
              </p>
            </div>

            <button
              onClick={triggerUpload}
              disabled={isUploading}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              className="group relative px-8 py-3.5 bg-primary text-background font-mono text-sm font-bold rounded-lg hover:bg-[hsl(var(--primary-hover))] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Choose Image</span>
                  <ArrowRight className={`w-4 h-4 transition-transform duration-200 ${isButtonHovered ? 'translate-x-1' : ''}`} />
                </>
              )}
            </button>

            <p className="text-xs text-muted-foreground/60">
              Max file size: 20MB • Supports PNG, JPG, WebP
            </p>

            <div className="pt-4 border-t border-border/30">
              <p className="text-xs text-muted-foreground/80 font-mono max-w-lg mx-auto">
                By using this tool, you agree to our{' '}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms & Conditions
                </Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-card/20 border border-border/50 rounded-lg hover:bg-card/30 hover:border-primary/20 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-lg bg-[hsl(var(--monokai-green))]/10 border border-[hsl(var(--monokai-green))]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Shield className="w-5 h-5 text-[hsl(var(--monokai-green))]" />
            </div>
            <h3 className="text-sm font-semibold font-mono mb-2 text-[hsl(var(--monokai-green))]">5 Techniques</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-mono">
              Contrast, opacity, micro-fonts, SVG paths, and microtext tiling
            </p>
          </div>

          <div className="p-6 bg-card/20 border border-border/50 rounded-lg hover:bg-card/30 hover:border-primary/20 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-sm font-semibold font-mono mb-2 text-primary">Real-Time Editing</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-mono">
              Drag text, adjust parameters, see results instantly
            </p>
          </div>

          <div className="p-6 bg-card/20 border border-border/50 rounded-lg hover:bg-card/30 hover:border-primary/20 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-lg bg-[hsl(var(--monokai-purple))]/10 border border-[hsl(var(--monokai-purple))]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Microscope className="w-5 h-5 text-[hsl(var(--monokai-purple))]" />
            </div>
            <h3 className="text-sm font-semibold font-mono mb-2 text-[hsl(var(--monokai-purple))]">Export & Test</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-mono">
              Export images with technique metadata for AI testing
            </p>
          </div>
        </div>

        {/* Responsible Use Disclaimer */}
        <div className="bg-[hsl(var(--monokai-orange))]/10 border-2 border-[hsl(var(--monokai-orange))]/30 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[hsl(var(--monokai-orange))]/20 border border-[hsl(var(--monokai-orange))]/30 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-[hsl(var(--monokai-orange))]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold font-mono text-[hsl(var(--monokai-orange))]">
                Use Responsibly
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-mono">
                This tool is designed for <strong>research and educational purposes only</strong>.
                Please use it ethically and responsibly. Do not use it to create deceptive content,
                bypass safety systems, or for any malicious purposes. By using this tool, you agree
                to our terms and conditions.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="pt-8 border-t border-border/30">
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm font-mono">
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Terms & Conditions
            </Link>
            <span className="text-border">•</span>
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-border">•</span>
            <span className="text-muted-foreground/60">
              Made for ethical research
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
