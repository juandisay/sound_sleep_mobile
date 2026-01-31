// Pre-curated YouTube playlists for sleep sounds
export interface Playlist {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  category: PlaylistCategory;
  thumbnail?: string;
  isDefault: boolean;
}

export type PlaylistCategory = 'binaural' | 'nature' | 'rain' | 'ambient' | 'custom';

export const CATEGORY_INFO: Record<PlaylistCategory, { name: string; icon: string; color: string }> = {
  binaural: { name: 'Binaural Beats', icon: '🎧', color: '#8b5cf6' },
  nature: { name: 'Nature Sounds', icon: '🌿', color: '#22c55e' },
  rain: { name: 'Rain Sounds', icon: '🌧️', color: '#3b82f6' },
  ambient: { name: 'Ambient Music', icon: '🎵', color: '#06b6d4' },
  custom: { name: 'My Playlists', icon: '⭐', color: '#f59e0b' },
};

export const DEFAULT_PLAYLISTS: Playlist[] = [
  // Binaural Beats
  {
    id: 'binaural-1',
    title: '7.83Hz Schumann Resonance',
    description: "Earth's frequency for deep meditation",
    youtubeUrl: 'https://www.youtube.com/watch?v=1ZYbU82GVz4',
    category: 'binaural',
    isDefault: true,
  },
  {
    id: 'binaural-2',
    title: 'Deep Theta 4Hz Sleep',
    description: 'Pure theta waves for deep sleep',
    youtubeUrl: 'https://www.youtube.com/watch?v=aKT9WBZa_y4',
    category: 'binaural',
    isDefault: true,
  },
  {
    id: 'binaural-3',
    title: 'Delta Waves Deep Sleep',
    description: '2Hz delta waves for healing sleep',
    youtubeUrl: 'https://www.youtube.com/watch?v=8VnL6XnDudc',
    category: 'binaural',
    isDefault: true,
  },
  // Nature Sounds
  {
    id: 'nature-1',
    title: 'Forest Ambience',
    description: 'Birds chirping, gentle breeze',
    youtubeUrl: 'https://www.youtube.com/watch?v=eKFTSSKCzWA',
    category: 'nature',
    isDefault: true,
  },
  {
    id: 'nature-2',
    title: 'Ocean Waves',
    description: 'Relaxing beach waves',
    youtubeUrl: 'https://www.youtube.com/watch?v=bn9F19Hi1Lk',
    category: 'nature',
    isDefault: true,
  },
  // Rain Sounds
  {
    id: 'rain-1',
    title: 'Gentle Rain',
    description: 'Soft rain for sleep',
    youtubeUrl: 'https://www.youtube.com/watch?v=mPZkdNFkNps',
    category: 'rain',
    isDefault: true,
  },
  {
    id: 'rain-2',
    title: 'Thunderstorm',
    description: 'Rain with distant thunder',
    youtubeUrl: 'https://www.youtube.com/watch?v=nDq6TstdEi8',
    category: 'rain',
    isDefault: true,
  },
  // Ambient
  {
    id: 'ambient-1',
    title: 'Weightless - Marconi Union',
    description: 'Most relaxing song ever made',
    youtubeUrl: 'https://www.youtube.com/watch?v=UfcAVejslrU',
    category: 'ambient',
    isDefault: true,
  },
  {
    id: 'ambient-2',
    title: 'Deep Space Ambient',
    description: 'Cosmic sounds for relaxation',
    youtubeUrl: 'https://www.youtube.com/watch?v=HLsnPtRbkYY',
    category: 'ambient',
    isDefault: true,
  },
];

// Helper to extract YouTube video ID from URL
export const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/playlist\?list=([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

// Check if URL is a playlist
export const isYouTubePlaylist = (url: string): boolean => {
  return url.includes('playlist?list=');
};
