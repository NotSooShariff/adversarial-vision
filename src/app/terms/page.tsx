import { Metadata } from 'next';
import Link from 'next/link';
import { Shield, AlertTriangle, ArrowLeft, Scale, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms and Conditions - Adversarial Vision',
  description: 'Terms and conditions for using Adversarial Vision research toolkit. This tool is intended for ethical research and educational purposes only.',
};

export default function TermsPage() {
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
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-[hsl(var(--monokai-yellow))]/10 border border-[hsl(var(--monokai-yellow))]/20 rounded-lg">
              <Scale className="w-5 h-5 text-[hsl(var(--monokai-yellow))]" />
              <span className="text-sm font-mono font-semibold text-[hsl(var(--monokai-yellow))]">
                Legal Terms
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold font-mono">
              <span className="text-foreground">Terms and</span>{' '}
              <span className="text-primary">Conditions</span>
            </h1>

            <p className="text-sm text-muted-foreground font-mono">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Ethical Use Warning */}
        <div className="bg-[hsl(var(--monokai-orange))]/10 border-2 border-[hsl(var(--monokai-orange))]/30 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[hsl(var(--monokai-orange))]/20 border border-[hsl(var(--monokai-orange))]/30 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-[hsl(var(--monokai-orange))]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold font-mono text-[hsl(var(--monokai-orange))]">
                Ethical Use Only
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed font-mono">
                This tool is designed exclusively for <strong>research, education, and ethical security testing</strong>.
                Any malicious, deceptive, or unauthorized use is strictly prohibited and may violate applicable laws.
              </p>
            </div>
          </div>
        </div>

        {/* Terms Content */}
        <div className="space-y-8">
          {/* Section 1 */}
          <section className="bg-card/20 border border-border/50 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-xl font-bold font-mono text-foreground">1. Acceptable Use</h2>
            </div>
            <div className="pl-11 space-y-3 text-sm text-muted-foreground leading-relaxed font-mono">
              <p>By using Adversarial Vision, you agree to use this tool only for:</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Academic research and scientific study of AI vision systems</li>
                <li>Educational purposes to understand AI vulnerabilities</li>
                <li>Security testing of your own systems or with explicit authorization</li>
                <li>Defensive security research to improve AI robustness</li>
                <li>Personal experimentation in controlled environments</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-card/20 border border-border/50 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[hsl(var(--monokai-orange))]/10 border border-[hsl(var(--monokai-orange))]/20 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-[hsl(var(--monokai-orange))]" />
              </div>
              <h2 className="text-xl font-bold font-mono text-foreground">2. Prohibited Activities</h2>
            </div>
            <div className="pl-11 space-y-3 text-sm text-muted-foreground leading-relaxed font-mono">
              <p>You expressly agree <strong>NOT</strong> to use this tool for:</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Creating deceptive content intended to mislead or manipulate others</li>
                <li>Bypassing content moderation or safety systems without authorization</li>
                <li>Evading detection systems for malicious purposes</li>
                <li>Spreading misinformation, disinformation, or harmful content</li>
                <li>Violating terms of service of third-party platforms or services</li>
                <li>Any illegal activities under applicable local, state, or federal laws</li>
                <li>Harassment, fraud, identity theft, or privacy violations</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-card/20 border border-border/50 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[hsl(var(--monokai-green))]/10 border border-[hsl(var(--monokai-green))]/20 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-[hsl(var(--monokai-green))]" />
              </div>
              <h2 className="text-xl font-bold font-mono text-foreground">3. Disclaimer of Warranties</h2>
            </div>
            <div className="pl-11 space-y-3 text-sm text-muted-foreground leading-relaxed font-mono">
              <p>
                Adversarial Vision is provided <strong>&quot;AS IS&quot;</strong> and <strong>&quot;AS AVAILABLE&quot;</strong> without
                warranties of any kind, either express or implied. We do not guarantee:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>The effectiveness or reliability of any techniques</li>
                <li>Compatibility with any specific AI systems or platforms</li>
                <li>Uninterrupted or error-free operation</li>
                <li>That results will meet your expectations or requirements</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-card/20 border border-border/50 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[hsl(var(--monokai-purple))]/10 border border-[hsl(var(--monokai-purple))]/20 flex items-center justify-center">
                <Scale className="w-4 h-4 text-[hsl(var(--monokai-purple))]" />
              </div>
              <h2 className="text-xl font-bold font-mono text-foreground">4. Limitation of Liability</h2>
            </div>
            <div className="pl-11 space-y-3 text-sm text-muted-foreground leading-relaxed font-mono">
              <p>
                To the fullest extent permitted by law, Adversarial Vision and its creators shall not be liable for:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Any damages arising from your use or inability to use this tool</li>
                <li>Misuse of the tool by you or any third party</li>
                <li>Legal consequences resulting from violation of these terms</li>
                <li>Any indirect, incidental, special, or consequential damages</li>
              </ul>
              <p className="pt-2">
                <strong>You are solely responsible for your use of this tool and any consequences thereof.</strong>
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-card/20 border border-border/50 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-xl font-bold font-mono text-foreground">5. Compliance with Laws</h2>
            </div>
            <div className="pl-11 space-y-3 text-sm text-muted-foreground leading-relaxed font-mono">
              <p>
                You are responsible for ensuring your use of Adversarial Vision complies with all applicable laws and regulations
                in your jurisdiction, including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Computer fraud and abuse laws</li>
                <li>Intellectual property rights</li>
                <li>Data protection and privacy regulations</li>
                <li>Consumer protection laws</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section className="bg-card/20 border border-border/50 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[hsl(var(--monokai-yellow))]/10 border border-[hsl(var(--monokai-yellow))]/20 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-[hsl(var(--monokai-yellow))]" />
              </div>
              <h2 className="text-xl font-bold font-mono text-foreground">6. Modifications to Terms</h2>
            </div>
            <div className="pl-11 space-y-3 text-sm text-muted-foreground leading-relaxed font-mono">
              <p>
                We reserve the right to modify these terms at any time. Continued use of Adversarial Vision after
                changes constitutes acceptance of the modified terms. Please review this page periodically.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="bg-card/20 border border-border/50 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[hsl(var(--monokai-green))]/10 border border-[hsl(var(--monokai-green))]/20 flex items-center justify-center">
                <Shield className="w-4 h-4 text-[hsl(var(--monokai-green))]" />
              </div>
              <h2 className="text-xl font-bold font-mono text-foreground">7. Contact</h2>
            </div>
            <div className="pl-11 space-y-3 text-sm text-muted-foreground leading-relaxed font-mono">
              <p>
                If you have questions about these terms or need to report misuse of this tool, please contact us at:
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
        <div className="pt-8 border-t border-border/50">
          <p className="text-xs text-muted-foreground font-mono text-center">
            By using Adversarial Vision, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
          </p>
        </div>
      </div>
    </div>
  );
}
