import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { FREQUENCIES, Frequency } from '../data/frequencies';

interface FrequencySelectorProps {
  selectedFrequency: Frequency | null;
  onSelectFrequency: (frequency: Frequency) => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

export default function FrequencySelector({
  selectedFrequency,
  onSelectFrequency,
}: FrequencySelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>🧠 Brainwave Frequencies</Text>
      <Text style={styles.sectionSubtitle}>
        Select a frequency for deep relaxation
      </Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {FREQUENCIES.map((freq) => (
          <TouchableOpacity
            key={freq.id}
            style={[
              styles.card,
              { borderColor: freq.color },
              selectedFrequency?.id === freq.id && styles.cardSelected,
              selectedFrequency?.id === freq.id && { 
                backgroundColor: `${freq.color}20`,
                borderColor: freq.color,
              },
            ]}
            onPress={() => onSelectFrequency(freq)}
            activeOpacity={0.7}
          >
            <Text style={styles.icon}>{freq.icon}</Text>
            <Text style={styles.frequencyValue}>{freq.frequency} Hz</Text>
            <Text style={styles.frequencyName}>{freq.name}</Text>
            <Text style={styles.frequencyDescription}>{freq.description}</Text>
            
            {selectedFrequency?.id === freq.id && (
              <View style={[styles.selectedBadge, { backgroundColor: freq.color }]}>
                <Text style={styles.selectedBadgeText}>Selected</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedFrequency && (
        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsTitle}>✨ Benefits</Text>
          <View style={styles.benefitsList}>
            {selectedFrequency.benefits.map((benefit, index) => (
              <View 
                key={index} 
                style={[styles.benefitTag, { backgroundColor: `${selectedFrequency.color}30` }]}
              >
                <Text style={[styles.benefitText, { color: selectedFrequency.color }]}>
                  {benefit}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e2e8f0',
    marginBottom: 4,
    paddingHorizontal: 20,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  cardSelected: {
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  icon: {
    fontSize: 32,
    marginBottom: 8,
  },
  frequencyValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  frequencyName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 4,
    textAlign: 'center',
  },
  frequencyDescription: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
  },
  selectedBadge: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  selectedBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
  },
  benefitsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 12,
  },
  benefitsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  benefitTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  benefitText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
