import { Metadata } from 'next';
import Link from 'next/link';
import { Lock, Shield, ArrowLeft, Eye, Database, Server } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy - Adversarial Vision',
  description: 'Privacy policy for Adversarial Vision. We do not collect, store, or transmit any user data. All processing happens locally in your browser.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background p-6 relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(102,217,239,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(102,217,239,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="max-w-4xl mx-auto relative z-10 space-y-8 py-12">
        {/* Header */}
        <div className="space-y-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-[hsl(var(--monokai-green))]/10 border border-[hsl(var(--monokai-green))]/20 rounded-lg">
              <Lock className="w-5 h-5 text-[hsl(var(--monokai-green))]" />
              <span className="text-sm font-mono font-semibold text-[hsl(var(--monokai-green))]">
                Your Privacy
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold font-mono">
              <span className="text-foreground">Privacy</span>{' '}
              <span className="text-primary">Policy</span>
            </h1>

            <p className="text-sm text-muted-foreground font-mono">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Privacy First Banner */}
        <div className="bg-[hsl(var(--monokai-green))]/10 border-2 border-[hsl(var(--monokai-green))]/30 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[hsl(var(--monokai-green))]/20 border border-[hsl(var(--monokai-green))]/30 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-[hsl(var(--monokai-green))]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold font-mono text-[hsl(var(--monokai-green))]">
                Privacy-First Design
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed font-mono">
                <strong>We do not store or retain any of your data.</strong> The web interface processes images entirely in your browser.
                When using our API, images are processed server-side but are <strong>immediately discarded after transformation</strong> and never stored.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Content */}
        <div className="space-y-8">
          {/* Section 1 */}
          <section className="bg-card/20 border border-border/50 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Database className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-xl font-bold font-mono text-foreground">1. No Data Storage or Retention</h2>
            </div>
            <div className="pl-11 space-y-3 text-sm text-muted-foreground leading-relaxed font-mono">
              <p>Adversarial Vision operates with a strict no-storage policy:</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li><strong>No Database:</strong> We do not maintain any database to store user information or uploaded images</li>
                <li><strong>No File Storage:</strong> Images processed via our API are held in memory only during transformation and immediately discarded</li>
                <li><strong>No Logs:</strong> We do not log image data, transformation parameters, or user-specific information</li>
                <li><strong>No Analytics:</strong> We do not track your usage patterns, interactions, or behavior</li>
                <li><strong>No Accounts:</strong> No user accounts, profiles, or authentication systems are used</li>
                <li><strong>No Third-Party Services:</strong> We do not send your data to any third-party analytics or tracking services</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-card/20 border border-border/50 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[hsl(var(--monokai-green))]/10 border border-[hsl(var(--monokai-green))]/20 flex items-center justify-center">
                <Eye className="w-4 h-4 text-[hsl(var(--monokai-green))]" />
              </div>
              <h2 className="text-xl font-bold font-mono text-foreground">2. Processing Methods</h2>
            </div>
            <div className="pl-11 space-y-3 text-sm text-muted-foreground leading-relaxed font-mono">
              <p><strong>Web Interface (Client-Side):</strong></p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Images are loaded directly into your browser&apos;s memory</li>
                <li>All text manipulation and rendering happens client-side using HTML5 Canvas</li>
                <li>Modified images exist only in your browser session</li>
                <li>When you close the browser tab, all data is automatically cleared</li>
              </ul>
              <p className="pt-3"><strong>API (Server-Side):</strong></p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Images sent to our API are processed in-memory on the server</li>
                <li>Processing happens synchronously during the API request</li>
                <li>Images and results are <strong>immediately discarded</strong> after the response is sent</li>
                <li>No temporary files are written to disk</li>
                <li>No data is retained after the API response completes</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-card/20 border border-border/50 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[hsl(var(--monokai-purple))]/10 border border-[hsl(var(--monokai-purple))]/20 flex items-center justify-center">
                <Server className="w-4 h-4 text-[hsl(var(--monokai-purple))]" />
              </div>
              <h2 className="text-xl font-bold font-mono text-foreground">3. Local Storage</h2>
            </div>
            <div className="pl-11 space-y-3 text-sm text-muted-foreground leading-relaxed font-mono">
              <p>
                We use browser <strong>sessionStorage</strong> temporarily to transfer your uploaded image between pages.
                This storage:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Is stored only in your browser, not on any server</li>
                <li>Is automatically cleared when you close the browser tab</li>
                <li>Is not accessible to any other website or service</li>
                <li>Contains only your image data, no personal information</li>
              </ul>
              <p className="pt-2">
                You can manually clear this data at any time by closing the tab or clearing your browser&apos;s session storage.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-card/20 border border-border/50 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[hsl(var(--monokai-yellow))]/10 border border-[hsl(var(--monokai-yellow))]/20 flex items-center justify-center">
                <Lock className="w-4 h-4 text-[hsl(var(--monokai-yellow))]" />
              </div>
              <h2 className="text-xl font-bold font-mono text-foreground">4. Cookies</h2>
            </div>
            <div className="pl-11 space-y-3 text-sm text-muted-foreground leading-relaxed font-mono">
              <p>
                Adversarial Vision <strong>does not use cookies</strong> for tracking, analytics, or any other purpose.
                Your browser may store standard session information as part of normal web browsing, but we do not
                set or read any cookies.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-card/20 border border-border/50 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-xl font-bold font-mono text-foreground">5. Third-Party Services</h2>
            </div>
            <div className="pl-11 space-y-3 text-sm text-muted-foreground leading-relaxed font-mono">
              <p>
                This website may be hosted on third-party platforms (e.g., Vercel, Netlify, GitHub Pages). These hosting
                providers may collect:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Basic server logs (IP address, browser type, timestamps)</li>
                <li>Standard web traffic analytics</li>
              </ul>
              <p className="pt-2">
                However, <strong>no user-uploaded images or modified content</strong> are ever transmitted to our servers
                or these hosting providers. Please review the privacy policies of the hosting platform if you have concerns
                about server logs.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="bg-card/20 border border-border/50 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[hsl(var(--monokai-orange))]/10 border border-[hsl(var(--monokai-orange))]/20 flex items-center justify-center">
                <Eye className="w-4 h-4 text-[hsl(var(--monokai-orange))]" />
              </div>
              <h2 className="text-xl font-bold font-mono text-foreground">6. Your Responsibilities</h2>
            </div>
            <div className="pl-11 space-y-3 text-sm text-muted-foreground leading-relaxed font-mono">
              <p>
                While we do not collect your data, you are responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Not uploading images containing sensitive or private information</li>
                <li>Understanding that downloaded images may contain metadata you&apos;ve added</li>
                <li>Ensuring you have the right to use and modify any images you upload</li>
                <li>Securely storing any downloaded images on your device</li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section className="bg-card/20 border border-border/50 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[hsl(var(--monokai-green))]/10 border border-[hsl(var(--monokai-green))]/20 flex items-center justify-center">
                <Lock className="w-4 h-4 text-[hsl(var(--monokai-green))]" />
              </div>
              <h2 className="text-xl font-bold font-mono text-foreground">7. Open Source</h2>
            </div>
            <div className="pl-11 space-y-3 text-sm text-muted-foreground leading-relaxed font-mono">
              <p>
                This tool may be open-source. You can verify our privacy claims by reviewing the source code to confirm
                that no data collection, tracking, or server transmission occurs. Transparency is core to our privacy commitment.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="bg-card/20 border border-border/50 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-xl font-bold font-mono text-foreground">8. Changes to This Policy</h2>
            </div>
            <div className="pl-11 space-y-3 text-sm text-muted-foreground leading-relaxed font-mono">
              <p>
                We may update this privacy policy to reflect changes in our practices or for legal reasons. Any changes
                will be posted on this page with an updated &quot;Last updated&quot; date. If we ever introduce data collection,
                we will provide prominent notice and update this policy accordingly.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section className="bg-card/20 border border-border/50 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[hsl(var(--monokai-yellow))]/10 border border-[hsl(var(--monokai-yellow))]/20 flex items-center justify-center">
                <Lock className="w-4 h-4 text-[hsl(var(--monokai-yellow))]" />
              </div>
              <h2 className="text-xl font-bold font-mono text-foreground">9. Contact</h2>
            </div>
            <div className="pl-11 space-y-3 text-sm text-muted-foreground leading-relaxed font-mono">
              <p>
                If you have questions or concerns about this privacy policy or our data practices, please contact us at:
              </p>
              <a
                href="mailto:adversarialvision@owaisshariff.com"
                className="text-primary hover:text-[hsl(var(--monokai-cyan))] underline"
              >
                adversarialvision@owaisshariff.com
              </a>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-border/50 space-y-4">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-sm text-muted-foreground font-mono leading-relaxed">
              <strong className="text-primary">Summary:</strong> We respect your privacy. Your images and data stay on your device.
              No databases, no servers, no tracking. That&apos;s our promise.
            </p>
          </div>
          <p className="text-xs text-muted-foreground font-mono text-center">
            By using Adversarial Vision, you acknowledge that you have read and understood this Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
