'use client';

import { useState } from 'react';
import { Shield } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface SafeModeDialogProps {
  isOpen: boolean;
  onAccept: () => void;
}

export default function SafeModeDialog({ isOpen, onAccept }: SafeModeDialogProps) {
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-amber-500/20 rounded-lg shadow-glow-blue">
              <Shield className="w-6 h-6 text-amber-400" />
            </div>
            <DialogTitle className="text-2xl">Responsible Use Notice</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            Please read and acknowledge before using PromptLens
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="prose prose-sm prose-invert max-w-none">
            <h3 className="text-lg font-semibold text-foreground">
              PromptLens: Defensive Research Tool
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              This tool is designed exclusively for <strong className="text-foreground">defensive security research</strong> and{' '}
              <strong className="text-foreground">educational purposes</strong>. By using PromptLens, you agree to:
            </p>

            <ul className="space-y-2 text-muted-foreground">
              <li>
                <strong className="text-foreground">Use responsibly:</strong> Only for studying and defending against adversarial vision
                attacks, not for creating malicious content.
              </li>
              <li>
                <strong className="text-foreground">No weaponization:</strong> Never use this tool to create deceptive images, fraudulent
                documents, or content intended to bypass security systems.
              </li>
              <li>
                <strong className="text-foreground">Respect laws:</strong> Comply with all applicable laws and regulations. Creating
                misleading content may be illegal in your jurisdiction.
              </li>
              <li>
                <strong className="text-foreground">Academic use:</strong> Ideal for security researchers, accessibility experts, and
                educators studying human vs. machine perception.
              </li>
              <li>
                <strong className="text-foreground">Safe Mode:</strong> The tool will warn or block exports containing potentially
                actionable content (e.g., login credentials, payment instructions).
              </li>
            </ul>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 my-4 shadow-[0_4px_12px_rgba(59,130,246,0.2)]">
              <p className="text-sm text-blue-400 leading-relaxed">
                <strong>Why this tool exists:</strong> As AI vision systems become more prevalent, understanding
                their limitations and vulnerabilities is critical for building robust defenses. PromptLens helps
                researchers visualize and quantify these gaps responsibly.
              </p>
            </div>

            <h4 className="text-md font-semibold text-foreground mt-4">Contact & Reporting</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              If you discover security issues or misuse of this tool, please report them responsibly through
              our GitHub repository. We take security and ethics seriously.
            </p>
          </div>

          {/* Acknowledgment checkbox */}
          <label className="flex items-start gap-3 p-4 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
            <Checkbox
              checked={acknowledged}
              onCheckedChange={(checked) => setAcknowledged(!!checked)}
              className="mt-1"
            />
            <span className="text-sm text-muted-foreground leading-relaxed">
              I acknowledge that I will use this tool responsibly for defensive research and educational
              purposes only. I understand the ethical and legal implications of creating adversarial content.
            </span>
          </label>
        </div>

        <DialogFooter>
          <Button
            onClick={onAccept}
            disabled={!acknowledged}
            size="lg"
            className="w-full sm:w-auto"
          >
            Accept & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
