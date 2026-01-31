import React, { useEffect } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  useEffect(() => {
    async function configureImmersiveMode() {
      if (Platform.OS === 'android') {
        await NavigationBar.setVisibilityAsync('hidden');
        await NavigationBar.setBehaviorAsync('overlay-swipe');
        await NavigationBar.setBackgroundColorAsync('#0a0b1e');
      }
    }
    configureImmersiveMode();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <HomeScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0b1e',
  },
});
