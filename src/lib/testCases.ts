/**
 * Sample test cases demonstrating various contrast ratios and visibility levels
 * These examples are for defensive research and education purposes only
 */

import type { TestCase } from '@/types';

export const testCases: TestCase[] = [
  // Sweet spot examples - low human visibility, potentially high OCR confidence
  {
    id: 'sweet-1',
    name: 'Light Gray on White',
    description: 'Barely visible to humans but OCR may detect',
    backgroundColor: '#FFFFFF',
    textColor: '#E8E8E8',
    text: 'Hidden message in light gray',
    fontSize: 16,
    contrastRatio: 1.2,
    category: 'sweet-spot',
  },
  {
    id: 'sweet-2',
    name: 'Dark Gray on Black',
    description: 'Low contrast dark palette',
    backgroundColor: '#000000',
    textColor: '#1A1A1A',
    text: 'Barely visible dark text',
    fontSize: 14,
    contrastRatio: 1.3,
    category: 'sweet-spot',
  },
  {
    id: 'sweet-3',
    name: 'Pale Yellow on White',
    description: 'Very subtle warm tone difference',
    backgroundColor: '#FFFFFF',
    textColor: '#F5F5DC',
    text: 'Almost invisible warm tint',
    fontSize: 16,
    contrastRatio: 1.15,
    category: 'sweet-spot',
  },
  {
    id: 'sweet-4',
    name: 'Navy on Black',
    description: 'Subtle blue-black difference',
    backgroundColor: '#000000',
    textColor: '#0A0A14',
    text: 'Hidden in darkness',
    fontSize: 18,
    contrastRatio: 1.25,
    category: 'sweet-spot',
  },

  // Barely visible - approaching invisibility
  {
    id: 'barely-1',
    name: 'Very Light Gray on White',
    description: 'Extremely low contrast',
    backgroundColor: '#FFFFFF',
    textColor: '#F8F8F8',
    text: 'Nearly invisible text',
    fontSize: 16,
    contrastRatio: 1.05,
    category: 'barely-visible',
  },
  {
    id: 'barely-2',
    name: 'Almost Black on Black',
    description: 'Minimal differentiation',
    backgroundColor: '#000000',
    textColor: '#0D0D0D',
    text: 'Barely there',
    fontSize: 14,
    contrastRatio: 1.08,
    category: 'barely-visible',
  },

  // Invisible - contrast ratio < 1.05
  {
    id: 'invisible-1',
    name: 'White on White',
    description: 'Completely invisible',
    backgroundColor: '#FFFFFF',
    textColor: '#FFFFFF',
    text: 'You cannot see this',
    fontSize: 16,
    contrastRatio: 1.0,
    category: 'invisible',
  },
  {
    id: 'invisible-2',
    name: 'Near-White on White',
    description: 'Imperceptible to human eye',
    backgroundColor: '#FFFFFF',
    textColor: '#FEFEFE',
    text: 'Invisible payload',
    fontSize: 12,
    contrastRatio: 1.01,
    category: 'invisible',
  },

  // Visible - for comparison
  {
    id: 'visible-1',
    name: 'Black on White (WCAG AAA)',
    description: 'Maximum contrast, fully readable',
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
    text: 'Perfect readability',
    fontSize: 16,
    contrastRatio: 21,
    category: 'visible',
  },
  {
    id: 'visible-2',
    name: 'Dark Gray on White (WCAG AA)',
    description: 'Good contrast, easily readable',
    backgroundColor: '#FFFFFF',
    textColor: '#595959',
    text: 'Clearly visible text',
    fontSize: 16,
    contrastRatio: 7.0,
    category: 'visible',
  },
];

/**
 * Get test cases by category
 */
export function getTestCasesByCategory(category: TestCase['category']): TestCase[] {
  return testCases.filter((tc) => tc.category === category);
}

/**
 * Get a specific test case by ID
 */
export function getTestCaseById(id: string): TestCase | undefined {
  return testCases.find((tc) => tc.id === id);
}
