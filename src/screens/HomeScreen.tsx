import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FrequencySelector from '../components/FrequencySelector';
import PlaylistManager from '../components/PlaylistManager';
import YouTubePlayer from '../components/YouTubePlayer';
import { Frequency, FREQUENCIES } from '../data/frequencies';
import { Playlist, DEFAULT_PLAYLISTS } from '../data/defaultPlaylists';

const CUSTOM_PLAYLISTS_KEY = '@sound_sleep_custom_playlists';

export default function HomeScreen() {
  const [selectedFrequency, setSelectedFrequency] = useState<Frequency | null>(FREQUENCIES[0]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [customPlaylists, setCustomPlaylists] = useState<Playlist[]>([]);
  const [showPlayer, setShowPlayer] = useState(false);

  // Load custom playlists from storage
  useEffect(() => {
    loadCustomPlaylists();
  }, []);

  const loadCustomPlaylists = async () => {
    try {
      const saved = await AsyncStorage.getItem(CUSTOM_PLAYLISTS_KEY);
      if (saved) {
        setCustomPlaylists(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load playlists:', error);
    }
  };

  const saveCustomPlaylists = async (playlists: Playlist[]) => {
    try {
      await AsyncStorage.setItem(CUSTOM_PLAYLISTS_KEY, JSON.stringify(playlists));
    } catch (error) {
      console.error('Failed to save playlists:', error);
    }
  };

  const handleAddPlaylist = (playlist: Playlist) => {
    const updated = [...customPlaylists, playlist];
    setCustomPlaylists(updated);
    saveCustomPlaylists(updated);
  };

  const handleRemovePlaylist = (playlistId: string) => {
    const updated = customPlaylists.filter(p => p.id !== playlistId);
    setCustomPlaylists(updated);
    saveCustomPlaylists(updated);
  };

  const handleSelectPlaylist = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setShowPlayer(true);
  };

  const currentTime = new Date();
  const hour = currentTime.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.title}>Sound Sleep</Text>
        </View>
        <View style={styles.sleepIcon}>
          <Text style={styles.sleepIconText}>🌙</Text>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Active Frequency Display */}
        {selectedFrequency && (
          <View style={styles.activeFrequency}>
            <View style={styles.activeFrequencyHeader}>
              <Text style={styles.activeIcon}>{selectedFrequency.icon}</Text>
              <View>
                <Text style={styles.activeLabel}>Active Frequency</Text>
                <Text style={styles.activeValue}>
                  {selectedFrequency.frequency} Hz - {selectedFrequency.name}
                </Text>
              </View>
            </View>
            <View style={[styles.frequencyWave, { backgroundColor: `${selectedFrequency.color}20` }]}>
              <Text style={styles.waveText}>〰️ 〰️ 〰️</Text>
            </View>
          </View>
        )}

        {/* Frequency Selector */}
        <FrequencySelector
          selectedFrequency={selectedFrequency}
          onSelectFrequency={setSelectedFrequency}
        />

        {/* Playlist Manager */}
        <PlaylistManager
          playlists={DEFAULT_PLAYLISTS}
          customPlaylists={customPlaylists}
          onSelectPlaylist={handleSelectPlaylist}
          onAddPlaylist={handleAddPlaylist}
          onRemovePlaylist={handleRemovePlaylist}
        />
      </ScrollView>

      {/* YouTube Player Overlay */}
      {showPlayer && (
        <YouTubePlayer
          playlist={selectedPlaylist}
          onClose={() => {
            setShowPlayer(false);
            setSelectedPlaylist(null);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0b1e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  sleepIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sleepIconText: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  activeFrequency: {
    margin: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  activeFrequencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activeIcon: {
    fontSize: 36,
    marginRight: 16,
  },
  activeLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 2,
  },
  activeValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e2e8f0',
  },
  frequencyWave: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  waveText: {
    fontSize: 20,
    letterSpacing: 8,
  },
});
