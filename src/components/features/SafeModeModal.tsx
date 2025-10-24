'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

interface SafeModeModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline?: () => void;
}

export default function SafeModeModal({ isOpen, onAccept, onDecline }: SafeModeModalProps) {
  const [acknowledged, setAcknowledged] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-amber-500 text-white px-6 py-4 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6" />
          <h2 className="text-xl font-bold">Responsible Use Notice</h2>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="prose prose-sm">
            <h3 className="text-lg font-semibold text-gray-900">
              PromptLens: Defensive Research Tool
            </h3>
            <p className="text-gray-700">
              This tool is designed exclusively for <strong>defensive security research</strong> and{' '}
              <strong>educational purposes</strong>. By using PromptLens, you agree to:
            </p>

            <ul className="space-y-2 text-gray-700">
              <li>
                <strong>Use responsibly:</strong> Only for studying and defending against adversarial vision
                attacks, not for creating malicious content.
              </li>
              <li>
                <strong>No weaponization:</strong> Never use this tool to create deceptive images, fraudulent
                documents, or content intended to bypass security systems.
              </li>
              <li>
                <strong>Respect laws:</strong> Comply with all applicable laws and regulations. Creating
                misleading content may be illegal in your jurisdiction.
              </li>
              <li>
                <strong>Academic use:</strong> Ideal for security researchers, accessibility experts, and
                educators studying human vs. machine perception.
              </li>
              <li>
                <strong>Safe Mode:</strong> The tool will warn or block exports containing potentially
                actionable content (e.g., login credentials, payment instructions).
              </li>
            </ul>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
              <p className="text-sm text-blue-900">
                <strong>Why this tool exists:</strong> As AI vision systems become more prevalent, understanding
                their limitations and vulnerabilities is critical for building robust defenses. PromptLens helps
                researchers visualize and quantify these gaps responsibly.
              </p>
            </div>

            <h4 className="text-md font-semibold text-gray-900 mt-4">Further Reading</h4>
            <p className="text-gray-700 text-sm">
              This tool was inspired by research into prompt injection attacks and adversarial examples in
              vision systems. For more context, see Brave&apos;s research on vision-based prompt injection and
              the broader literature on adversarial machine learning.
            </p>

            <h4 className="text-md font-semibold text-gray-900 mt-4">Contact & Reporting</h4>
            <p className="text-gray-700 text-sm">
              If you discover security issues or misuse of this tool, please report them responsibly through
              our GitHub repository. We take security and ethics seriously.
            </p>
          </div>

          {/* Acknowledgment checkbox */}
          <label className="flex items-start gap-3 mt-6 cursor-pointer">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              I acknowledge that I will use this tool responsibly for defensive research and educational
              purposes only. I understand the ethical and legal implications of creating adversarial content.
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
          {onDecline && (
            <button
              onClick={onDecline}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Decline
            </button>
          )}
          <button
            onClick={onAccept}
            disabled={!acknowledged}
            className={`px-6 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
              acknowledged
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Accept & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
