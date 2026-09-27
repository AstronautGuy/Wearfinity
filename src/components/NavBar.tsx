import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@/hooks/useUser';

export const NavBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { activeUser } = useUser();

  if (!activeUser || pathname === '/profiles') return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.tab} 
        onPress={() => router.replace('/')}
      >
        <Ionicons name="shirt-outline" size={24} color={pathname === '/' ? '#4F46E5' : '#666'} />
        <Text style={[styles.label, pathname === '/' && styles.labelActive]}>Wardrobe</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.tab} 
        onPress={() => router.replace('/outfits')}
      >
        <Ionicons name="color-wand-outline" size={24} color={pathname === '/outfits' ? '#4F46E5' : '#666'} />
        <Text style={[styles.label, pathname === '/outfits' && styles.labelActive]}>Mix & Match</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.tab} 
        onPress={() => router.replace('/recommendations')}
      >
        <Ionicons name="sparkles-outline" size={24} color={pathname === '/recommendations' ? '#4F46E5' : '#666'} />
        <Text style={[styles.label, pathname === '/recommendations' && styles.labelActive]}>For You</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 5,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  labelActive: {
    color: '#4F46E5',
    fontWeight: 'bold',
  }
});
