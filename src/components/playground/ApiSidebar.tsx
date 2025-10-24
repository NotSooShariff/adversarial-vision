'use client';

import { useState } from 'react';
import { Code2, Copy, Check, ExternalLink, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import type { TechniqueType } from '@/types';

interface ApiSidebarProps {
  currentTechnique: TechniqueType;
}

export default function ApiSidebar({ currentTechnique }: ApiSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const baseUrl = 'https://adversarialvision.owaisshariff.com';

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(label);
    toast.success('Copied to clipboard', {
      description: `${label} copied`,
    });
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const techniques = [
    {
      id: 'low-contrast',
      name: 'Low Contrast',
      endpoint: `${baseUrl}/api/transform/low-contrast`,
      params: {
        text: 'string',
        contrastRatio: 'number (1.0-3.0)',
        fontSize: 'number',
        fontFamily: 'string',
        x: 'number',
        y: 'number',
      },
    },
    {
      id: 'low-opacity',
      name: 'Low Opacity',
      endpoint: `${baseUrl}/api/transform/low-opacity`,
      params: {
        text: 'string',
        textColor: 'string (hex)',
        opacity: 'number (0.0-1.0)',
        fontSize: 'number',
        fontFamily: 'string',
        x: 'number',
        y: 'number',
      },
    },
    {
      id: 'micro-font',
      name: 'Micro Font',
      endpoint: `${baseUrl}/api/transform/micro-font`,
      params: {
        text: 'string',
        fontSize: 'number (1-10)',
        fontFamily: 'string',
        textColor: 'string (hex)',
        letterSpacing: 'number',
        opacity: 'number (0.0-1.0)',
        x: 'number',
        y: 'number',
      },
    },
    {
      id: 'svg-path',
      name: 'SVG Path',
      endpoint: `${baseUrl}/api/transform/svg-path`,
      params: {
        text: 'string',
        fontSize: 'number',
        strokeWidth: 'number (0.1-5.0)',
        strokeColor: 'string (hex)',
        strokeOpacity: 'number (0.0-1.0)',
        fillColor: 'string (hex)',
        fillOpacity: 'number (0.0-1.0)',
        strokeDasharray: 'string',
        x: 'number',
        y: 'number',
      },
    },
    {
      id: 'microtext-tiling',
      name: 'Microtext Tiling',
      endpoint: `${baseUrl}/api/transform/microtext-tiling`,
      params: {
        text: 'string',
        tileDensity: 'number (5-100)',
        fontSize: 'number (2-12)',
        opacity: 'number (0.0-1.0)',
        rotation: 'number (0-360)',
        tileWidth: 'number',
        tileHeight: 'number',
      },
    },
    {
      id: 'steganography',
      name: 'Steganography',
      endpoint: `${baseUrl}/api/transform/steganography`,
      params: {
        text: 'string',
        bitsPerChannel: 'number (1-3)',
        channels: 'string (rgb|r|g|b)',
      },
    },
  ];

  const currentTechniqueData = techniques.find((t) => t.id === currentTechnique);

  const curlExample = currentTechniqueData
    ? `curl -X POST ${currentTechniqueData.endpoint} \\
  -H "Content-Type: application/json" \\
  -d '{
    "image": "data:image/png;base64,...",
    "text": "Hidden text",
    ${Object.keys(currentTechniqueData.params).slice(1, 3).map(key => `"${key}": ...`).join(',\n    ')}
  }'`
    : '';

  const pythonExample = currentTechniqueData
    ? `import requests
import base64

# Read and encode image
with open("image.png", "rb") as f:
    image_data = base64.b64encode(f.read()).decode()

# API request
response = requests.post(
    "${currentTechniqueData.endpoint}",
    json={
        "image": f"data:image/png;base64,{image_data}",
        "text": "Hidden text",
        ${Object.keys(currentTechniqueData.params).slice(1, 3).map(key => `"${key}": ...`).join(',\n        ')}
    }
)

result = response.json()
print(result)`
    : '';

  return (
    <>
      {/* Toggle Button - Vertical Text */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-1/2 -translate-y-1/2 z-50 transition-all duration-300 ${
          isOpen ? 'right-[450px]' : 'right-0'
        }`}
        aria-label="Toggle API Sidebar"
      >
        <div className="bg-card/95 backdrop-blur-sm border-l border-t border-b border-border rounded-l-xl px-3 py-6 hover:bg-primary/10 hover:border-primary/30 transition-all duration-200 shadow-lg">
          <div className="flex flex-col items-center gap-3">
            <Code2 className="w-5 h-5 text-primary" />
            <div
              className="text-xs font-bold font-mono tracking-wider text-muted-foreground whitespace-nowrap"
              style={{
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
              }}
            >
              {isOpen ? 'CLOSE API' : 'VIEW API'}
            </div>
            <BookOpen className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[450px] bg-[#0a0a0a] border-l-2 border-border z-50 transition-transform duration-300 overflow-y-auto shadow-2xl ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="space-y-3 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                <Code2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-mono text-foreground">API Documentation</h2>
                <p className="text-xs text-muted-foreground font-mono">
                  Programmatic access to transformation techniques
                </p>
              </div>
            </div>
          </div>

          {/* General API Info */}
          <div className="p-4 bg-[#1a1a1a] border-2 border-border rounded-lg space-y-3">
            <h3 className="text-sm font-semibold font-mono text-[hsl(var(--monokai-cyan))]">
              Base URL
            </h3>
            <div className="relative">
              <code className="block text-xs bg-[#0d0d0d] p-3 rounded font-mono overflow-x-auto border border-border/50">
                <span className="text-[hsl(var(--monokai-purple))]">{baseUrl}</span>
                <span className="text-muted-foreground">/api</span>
              </code>
              <button
                onClick={() => copyToClipboard(`${baseUrl}/api`, 'Base URL')}
                className="absolute top-2 right-2 p-1.5 hover:bg-primary/10 rounded transition-colors"
              >
                {copiedEndpoint === 'Base URL' ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          {/* Current Technique */}
          {currentTechniqueData && (
            <div className="p-5 bg-[#1a1a1a] border-2 border-primary/30 rounded-lg space-y-5">
              <div>
                <h3 className="text-base font-semibold font-mono text-primary mb-3 flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">Current:</span> {currentTechniqueData.name}
                </h3>
                <div className="relative">
                  <code className="block text-xs bg-[#0d0d0d] p-3 rounded-lg font-mono overflow-x-auto break-all border border-border">
                    <span className="text-[hsl(var(--monokai-green))]">POST</span>{' '}
                    <span className="text-[hsl(var(--monokai-purple))]">{currentTechniqueData.endpoint}</span>
                  </code>
                  <button
                    onClick={() => copyToClipboard(currentTechniqueData.endpoint, 'Endpoint')}
                    className="absolute top-2 right-2 p-1.5 hover:bg-primary/10 rounded transition-colors"
                  >
                    {copiedEndpoint === 'Endpoint' ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              {/* Parameters */}
              <div>
                <h4 className="text-sm font-semibold font-mono text-muted-foreground mb-3">
                  Parameters
                </h4>
                <div className="space-y-2">
                  <div className="text-xs font-mono p-2.5 bg-[#0d0d0d] rounded-lg border border-border/50">
                    <span className="text-[hsl(var(--monokai-orange))]">image</span>
                    <span className="text-muted-foreground">: </span>
                    <span className="text-[hsl(var(--monokai-cyan))]">string (base64)</span>{' '}
                    <span className="text-[hsl(var(--monokai-red))]">*required</span>
                  </div>
                  {Object.entries(currentTechniqueData.params).map(([key, type]) => (
                    <div key={key} className="text-xs font-mono p-2.5 bg-[#0d0d0d] rounded-lg border border-border/50">
                      <span className="text-[hsl(var(--monokai-orange))]">{key}</span>
                      <span className="text-muted-foreground">: </span>
                      <span className="text-[hsl(var(--monokai-cyan))]">{type}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* cURL Example */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold font-mono text-muted-foreground flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[hsl(var(--monokai-green))]/10 text-[hsl(var(--monokai-green))] rounded text-xs">cURL</span>
                    Example
                  </h4>
                  <button
                    onClick={() => copyToClipboard(curlExample, 'cURL Example')}
                    className="p-1.5 hover:bg-primary/10 rounded transition-colors"
                  >
                    {copiedEndpoint === 'cURL Example' ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
                <div className="relative bg-[#1e1e1e] rounded-lg p-4 border border-border/50 overflow-x-auto">
                  <pre className="text-xs font-mono">
                    <code>
                      <span className="text-[hsl(var(--monokai-purple))]">curl</span>{' '}
                      <span className="text-[hsl(var(--monokai-orange))]">-X</span>{' '}
                      <span className="text-[hsl(var(--monokai-green))]">POST</span>{' '}
                      <span className="text-[hsl(var(--monokai-yellow))]">{currentTechniqueData.endpoint}</span>{' '}
                      <span className="text-[hsl(var(--monokai-cyan))]">\</span>
                      {'\n  '}
                      <span className="text-[hsl(var(--monokai-orange))]">-H</span>{' '}
                      <span className="text-[hsl(var(--monokai-green))]">&quot;Content-Type: application/json&quot;</span>{' '}
                      <span className="text-[hsl(var(--monokai-cyan))]">\</span>
                      {'\n  '}
                      <span className="text-[hsl(var(--monokai-orange))]">-d</span>{' '}
                      <span className="text-[hsl(var(--monokai-green))]">&apos;{'{'}&quot;image&quot;: &quot;data:image/png;base64,...&quot;, &quot;text&quot;: &quot;Hidden text&quot;{'}'}&apos;</span>
                    </code>
                  </pre>
                </div>
              </div>

              {/* Python Example */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold font-mono text-muted-foreground flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[hsl(var(--monokai-yellow))]/10 text-[hsl(var(--monokai-yellow))] rounded text-xs">Python</span>
                    Example
                  </h4>
                  <button
                    onClick={() => copyToClipboard(pythonExample, 'Python Example')}
                    className="p-1.5 hover:bg-primary/10 rounded transition-colors"
                  >
                    {copiedEndpoint === 'Python Example' ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
                <div className="relative bg-[#1e1e1e] rounded-lg p-4 border border-border/50 overflow-x-auto">
                  <pre className="text-xs font-mono leading-relaxed">
                    <code>
                      <span className="text-[hsl(var(--monokai-purple))]">import</span>{' '}
                      <span className="text-foreground">requests</span>
                      {'\n'}
                      <span className="text-[hsl(var(--monokai-purple))]">import</span>{' '}
                      <span className="text-foreground">base64</span>
                      {'\n\n'}
                      <span className="text-[hsl(var(--monokai-gray))]"># Read and encode image</span>
                      {'\n'}
                      <span className="text-[hsl(var(--monokai-purple))]">with</span>{' '}
                      <span className="text-[hsl(var(--monokai-cyan))]">open</span>
                      <span className="text-muted-foreground">(</span>
                      <span className="text-[hsl(var(--monokai-green))]">&quot;image.png&quot;</span>
                      <span className="text-muted-foreground">, </span>
                      <span className="text-[hsl(var(--monokai-green))]">&quot;rb&quot;</span>
                      <span className="text-muted-foreground">)</span>{' '}
                      <span className="text-[hsl(var(--monokai-purple))]">as</span>{' '}
                      <span className="text-foreground">f</span>
                      <span className="text-muted-foreground">:</span>
                      {'\n    '}
                      <span className="text-foreground">image_data</span>{' '}
                      <span className="text-[hsl(var(--monokai-purple))]">=</span>{' '}
                      <span className="text-foreground">base64</span>
                      <span className="text-muted-foreground">.</span>
                      <span className="text-[hsl(var(--monokai-cyan))]">b64encode</span>
                      <span className="text-muted-foreground">(</span>
                      <span className="text-foreground">f</span>
                      <span className="text-muted-foreground">.</span>
                      <span className="text-[hsl(var(--monokai-cyan))]">read</span>
                      <span className="text-muted-foreground">()).</span>
                      <span className="text-[hsl(var(--monokai-cyan))]">decode</span>
                      <span className="text-muted-foreground">()</span>
                      {'\n\n'}
                      <span className="text-[hsl(var(--monokai-gray))]"># API request</span>
                      {'\n'}
                      <span className="text-foreground">response</span>{' '}
                      <span className="text-[hsl(var(--monokai-purple))]">=</span>{' '}
                      <span className="text-foreground">requests</span>
                      <span className="text-muted-foreground">.</span>
                      <span className="text-[hsl(var(--monokai-cyan))]">post</span>
                      <span className="text-muted-foreground">(</span>
                      {'\n    '}
                      <span className="text-[hsl(var(--monokai-green))]">&quot;{currentTechniqueData.endpoint}&quot;</span>
                      <span className="text-muted-foreground">,</span>
                      {'\n    '}
                      <span className="text-foreground">json</span>
                      <span className="text-[hsl(var(--monokai-purple))]">=</span>
                      <span className="text-muted-foreground">{'{'}</span>
                      <span className="text-[hsl(var(--monokai-green))]">&quot;image&quot;</span>
                      <span className="text-muted-foreground">: </span>
                      <span className="text-[hsl(var(--monokai-green))]">f&quot;data:image/png;base64,{'{'}image_data{'}'}&quot;</span>
                      <span className="text-muted-foreground">, </span>
                      <span className="text-[hsl(var(--monokai-green))]">&quot;text&quot;</span>
                      <span className="text-muted-foreground">: </span>
                      <span className="text-[hsl(var(--monokai-green))]">&quot;Hidden text&quot;</span>
                      <span className="text-muted-foreground">{'}'}</span>
                      {'\n'}
                      <span className="text-muted-foreground">)</span>
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* All Techniques */}
          <div className="space-y-3 pb-4 border-b border-border">
            <h3 className="text-sm font-semibold font-mono text-muted-foreground">
              All Techniques
            </h3>
            <div className="space-y-2">
              {techniques.map((technique) => (
                <div
                  key={technique.id}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    technique.id === currentTechnique
                      ? 'bg-[#1a1a1a] border-primary/40'
                      : 'bg-[#151515] border-border hover:border-primary/20 hover:bg-[#1a1a1a]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold font-mono text-foreground">{technique.name}</h4>
                    <a
                      href={technique.endpoint}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-[hsl(var(--monokai-cyan))] transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  <code className="text-xs text-muted-foreground font-mono break-all block bg-[#0d0d0d] p-2 rounded border border-border/50">
                    {technique.endpoint}
                  </code>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="p-5 bg-[#1a3a1a] border-2 border-[hsl(var(--monokai-green))]/30 rounded-lg">
            <h3 className="text-base font-semibold font-mono text-[hsl(var(--monokai-green))] mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Need Help?
            </h3>
            <p className="text-sm text-muted-foreground font-mono mb-3 leading-relaxed">
              For API support, integration help, or questions:
            </p>
            <a
              href="mailto:adversarialvision@owaisshariff.com"
              className="text-sm text-primary hover:text-[hsl(var(--monokai-cyan))] font-mono underline break-all"
            >
              adversarialvision@owaisshariff.com
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
