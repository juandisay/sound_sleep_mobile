import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import {
  Playlist,
  PlaylistCategory,
  CATEGORY_INFO,
  DEFAULT_PLAYLISTS,
  extractYouTubeId,
} from '../data/defaultPlaylists';

interface PlaylistManagerProps {
  playlists: Playlist[];
  customPlaylists: Playlist[];
  onSelectPlaylist: (playlist: Playlist) => void;
  onAddPlaylist: (playlist: Playlist) => void;
  onRemovePlaylist: (playlistId: string) => void;
}

export default function PlaylistManager({
  playlists,
  customPlaylists,
  onSelectPlaylist,
  onAddPlaylist,
  onRemovePlaylist,
}: PlaylistManagerProps) {
  const [selectedCategory, setSelectedCategory] = useState<PlaylistCategory | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  const [newPlaylistUrl, setNewPlaylistUrl] = useState('');

  const categories: (PlaylistCategory | 'all')[] = ['all', 'binaural', 'nature', 'rain', 'ambient', 'custom'];
  
  const allPlaylists = [...playlists, ...customPlaylists];
  
  const filteredPlaylists = selectedCategory === 'all'
    ? allPlaylists
    : allPlaylists.filter(p => p.category === selectedCategory);

  const handleAddPlaylist = () => {
    if (!newPlaylistTitle.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }
    if (!newPlaylistUrl.trim()) {
      Alert.alert('Error', 'Please enter a YouTube URL');
      return;
    }
    
    const videoId = extractYouTubeId(newPlaylistUrl);
    if (!videoId) {
      Alert.alert('Error', 'Invalid YouTube URL');
      return;
    }

    const newPlaylist: Playlist = {
      id: `custom-${Date.now()}`,
      title: newPlaylistTitle.trim(),
      description: 'Custom playlist',
      youtubeUrl: newPlaylistUrl.trim(),
      category: 'custom',
      isDefault: false,
    };

    onAddPlaylist(newPlaylist);
    setNewPlaylistTitle('');
    setNewPlaylistUrl('');
    setShowAddModal(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>🎵 Sound Library</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryTabs}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryTab,
              selectedCategory === cat && styles.categoryTabActive,
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={styles.categoryIcon}>
              {cat === 'all' ? '📚' : CATEGORY_INFO[cat].icon}
            </Text>
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat && styles.categoryTextActive,
              ]}
            >
              {cat === 'all' ? 'All' : CATEGORY_INFO[cat].name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Playlist Grid */}
      <ScrollView 
        style={styles.playlistGrid}
        showsVerticalScrollIndicator={false}
      >
        {filteredPlaylists.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎧</Text>
            <Text style={styles.emptyText}>No playlists in this category</Text>
            <TouchableOpacity 
              style={styles.emptyAddButton}
              onPress={() => setShowAddModal(true)}
            >
              <Text style={styles.emptyAddButtonText}>Add Custom Playlist</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.gridContainer}>
            {filteredPlaylists.map((playlist) => (
              <TouchableOpacity
                key={playlist.id}
                style={[
                  styles.playlistCard,
                  { borderColor: CATEGORY_INFO[playlist.category].color + '40' },
                ]}
                onPress={() => onSelectPlaylist(playlist)}
                onLongPress={() => {
                  if (!playlist.isDefault) {
                    Alert.alert(
                      'Remove Playlist',
                      `Remove "${playlist.title}"?`,
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { 
                          text: 'Remove', 
                          style: 'destructive',
                          onPress: () => onRemovePlaylist(playlist.id),
                        },
                      ]
                    );
                  }
                }}
              >
                <View
                  style={[
                    styles.cardIcon,
                    { backgroundColor: CATEGORY_INFO[playlist.category].color + '30' },
                  ]}
                >
                  <Text style={styles.cardIconText}>
                    {CATEGORY_INFO[playlist.category].icon}
                  </Text>
                </View>
                <Text style={styles.playlistTitle} numberOfLines={2}>
                  {playlist.title}
                </Text>
                <Text style={styles.playlistDescription} numberOfLines={1}>
                  {playlist.description}
                </Text>
                {!playlist.isDefault && (
                  <View style={styles.customBadge}>
                    <Text style={styles.customBadgeText}>Custom</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add Playlist Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add YouTube Playlist</Text>
            
            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter title..."
              placeholderTextColor="#64748b"
              value={newPlaylistTitle}
              onChangeText={setNewPlaylistTitle}
            />
            
            <Text style={styles.inputLabel}>YouTube URL</Text>
            <TextInput
              style={styles.input}
              placeholder="https://youtube.com/watch?v=..."
              placeholderTextColor="#64748b"
              value={newPlaylistUrl}
              onChangeText={setNewPlaylistUrl}
              autoCapitalize="none"
              keyboardType="url"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setShowAddModal(false);
                  setNewPlaylistTitle('');
                  setNewPlaylistUrl('');
                }}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalAddButton}
                onPress={handleAddPlaylist}
              >
                <Text style={styles.modalAddButtonText}>Add Playlist</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e2e8f0',
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#8b5cf6',
    borderRadius: 20,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  categoryTabs: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    gap: 6,
  },
  categoryTabActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
  },
  categoryIcon: {
    fontSize: 14,
  },
  categoryText: {
    fontSize: 13,
    color: '#94a3b8',
  },
  categoryTextActive: {
    color: '#e2e8f0',
    fontWeight: '600',
  },
  playlistGrid: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    paddingBottom: 40,
  },
  playlistCard: {
    width: '47%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIconText: {
    fontSize: 20,
  },
  playlistTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  playlistDescription: {
    fontSize: 12,
    color: '#94a3b8',
  },
  customBadge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderRadius: 8,
  },
  customBadgeText: {
    fontSize: 10,
    color: '#f59e0b',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 20,
  },
  emptyAddButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#8b5cf6',
    borderRadius: 12,
  },
  emptyAddButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  modalCancelButtonText: {
    color: '#94a3b8',
    fontWeight: '600',
  },
  modalAddButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
  },
  modalAddButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
