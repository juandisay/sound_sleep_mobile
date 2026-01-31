// Brainwave frequency definitions for sleep and relaxation
export interface Frequency {
  id: string;
  name: string;
  frequency: number;
  description: string;
  benefits: string[];
  color: string;
  gradientColors: [string, string];
  icon: string;
}

export const FREQUENCIES: Frequency[] = [
  {
    id: 'schumann',
    name: 'Schumann Resonance',
    frequency: 7.83,
    description: "Earth's natural frequency",
    benefits: ['Deep meditation', 'Grounding', 'Stress relief', 'Mental clarity'],
    color: '#22c55e',
    gradientColors: ['#22c55e', '#16a34a'],
    icon: '🌍',
  },
  {
    id: 'deep-theta',
    name: 'Deep Theta',
    frequency: 4,
    description: 'Deep relaxation waves',
    benefits: ['REM sleep', 'Creativity', 'Deep relaxation', 'Subconscious access'],
    color: '#8b5cf6',
    gradientColors: ['#8b5cf6', '#7c3aed'],
    icon: '🌙',
  },
  {
    id: 'theta',
    name: 'Theta',
    frequency: 6,
    description: 'Light meditation state',
    benefits: ['Relaxation', 'Intuition', 'Memory', 'Light meditation'],
    color: '#6366f1',
    gradientColors: ['#6366f1', '#4f46e5'],
    icon: '✨',
  },
  {
    id: 'alpha',
    name: 'Alpha',
    frequency: 10,
    description: 'Calm alertness',
    benefits: ['Reduced anxiety', 'Calm focus', 'Stress reduction', 'Relaxation'],
    color: '#06b6d4',
    gradientColors: ['#06b6d4', '#0891b2'],
    icon: '💫',
  },
  {
    id: 'delta',
    name: 'Delta',
    frequency: 2,
    description: 'Deep sleep waves',
    benefits: ['Deep sleep', 'Healing', 'Regeneration', 'Immunity boost'],
    color: '#1e40af',
    gradientColors: ['#1e40af', '#1e3a8a'],
    icon: '😴',
  },
  {
    id: 'healing',
    name: 'Healing',
    frequency: 528,
    description: 'Solfeggio healing frequency',
    benefits: ['DNA repair', 'Transformation', 'Miracles', 'Love frequency'],
    color: '#f59e0b',
    gradientColors: ['#f59e0b', '#d97706'],
    icon: '💛',
  },
];

export const getFrequencyById = (id: string): Frequency | undefined => {
  return FREQUENCIES.find((f) => f.id === id);
};
