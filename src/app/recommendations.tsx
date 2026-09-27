import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, RefreshControl, Alert, Modal, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@/hooks/useUser';
import { useWardrobe } from '@/hooks/useWardrobe';
import { generateRecommendations, OutfitRecommendation } from '@/lib/recommendations';

export default function RecommendationsScreen() {
  const { activeUser } = useUser();

  if (!activeUser) {
    return <Redirect href="/profiles" />;
  }

  const { clothes, categories, loadClothes, loadCategories, saveOutfit } = useWardrobe(activeUser.id);
  const [recommendations, setRecommendations] = useState<OutfitRecommendation[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [activeRec, setActiveRec] = useState<{rec: OutfitRecommendation, index: number} | null>(null);
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  const [newOutfitCategory, setNewOutfitCategory] = useState('');

  const { outfits } = useWardrobe(activeUser.id);
  const defaultOutfitCategories = ['Casual', 'Work', 'Party'];
  const outfitCategories = Array.from(new Set([...defaultOutfitCategories, ...outfits.map(o => o.name)]));

  useEffect(() => {
    loadCategories();
    loadClothes();
  }, [loadCategories, loadClothes]);

  useEffect(() => {
    if (clothes.length > 0 && categories.length > 0 && recommendations.length === 0) {
      setRecommendations(generateRecommendations(clothes, categories, 3));
    }
  }, [clothes, categories, recommendations.length]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setRecommendations(generateRecommendations(clothes, categories, 3));
    setRefreshing(false);
  }, [clothes, categories]);

  const initiateSave = (rec: OutfitRecommendation, index: number) => {
    setActiveRec({ rec, index });
    setModalVisible(true);
  };

  const handleSaveToCategory = async (categoryName: string) => {
    if (!activeRec || !categoryName.trim()) return;
    const { rec, index } = activeRec;
    
    await saveOutfit(categoryName.trim(), rec.top?.id, rec.bottom?.id, rec.shoes?.id);
    Alert.alert("Awesome!", `Outfit saved to ${categoryName.trim()}!`);
    setModalVisible(false);
    setIsCreatingNewCategory(false);
    setNewOutfitCategory('');
    setActiveRec(null);

    setRecommendations(prev => {
      const next = [...prev];
      next[index] = generateRecommendations(clothes, categories, 1)[0];
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.headerTitle}>For You</Text>
        <Text style={styles.subtitle}>Pull down to refresh ideas</Text>
        
        {recommendations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Add more clothes to your wardrobe to get recommendations!</Text>
          </View>
        ) : (
          <View style={styles.feed}>
            {recommendations.map((rec, index) => (
              <View key={index} style={styles.recCard}>
                <View style={styles.imagesRow}>
                  {rec.top ? <Image source={{ uri: rec.top.imageUri }} style={styles.itemImage} /> : <View style={styles.placeholder}><Text>No Top</Text></View>}
                  {rec.bottom ? <Image source={{ uri: rec.bottom.imageUri }} style={styles.itemImage} /> : <View style={styles.placeholder}><Text>No Bottom</Text></View>}
                  {rec.shoes ? <Image source={{ uri: rec.shoes.imageUri }} style={styles.itemImage} /> : <View style={styles.placeholder}><Text>No Shoes</Text></View>}
                </View>
                <TouchableOpacity style={styles.saveButton} onPress={() => initiateSave(rec, index)}>
                  <Ionicons name="bookmark-outline" size={20} color="#fff" style={styles.saveIcon} />
                  <Text style={styles.saveButtonText}>Save this Outfit</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Save to Category</Text>
            
            {!isCreatingNewCategory ? (
              <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 20}}>
                {outfitCategories.map(cat => (
                  <TouchableOpacity 
                    key={cat} 
                    style={styles.modalCatBadge}
                    onPress={() => handleSaveToCategory(cat)}
                  >
                    <Text style={styles.modalCatText}>{cat}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity 
                  style={[styles.modalCatBadge, { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#4F46E5', borderStyle: 'dashed' }]}
                  onPress={() => setIsCreatingNewCategory(true)}
                >
                  <Text style={[styles.modalCatText, { color: '#4F46E5' }]}>+ New Category</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{marginBottom: 20}}>
                <TextInput
                  style={styles.input}
                  placeholder="E.g. Festival, Formal, Date Night"
                  value={newOutfitCategory}
                  onChangeText={setNewOutfitCategory}
                  autoFocus
                />
                <Button title="Save New Category" onPress={() => handleSaveToCategory(newOutfitCategory)} color="#4F46E5" />
              </View>
            )}

            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => { setModalVisible(false); setIsCreatingNewCategory(false); }} color="#666" />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#111827', paddingHorizontal: 16, paddingTop: 16 },
  subtitle: { fontSize: 14, color: '#6b7280', paddingHorizontal: 16, paddingBottom: 16 },
  feed: { padding: 16 },
  recCard: { backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 4 },
  imagesRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  itemImage: { flex: 1, aspectRatio: 1, borderRadius: 8, marginHorizontal: 4, backgroundColor: '#f3f4f6' },
  placeholder: { flex: 1, aspectRatio: 1, borderRadius: 8, marginHorizontal: 4, backgroundColor: '#f3f4f6', justifyContent: 'center', alignItems: 'center' },
  saveButton: { backgroundColor: '#4F46E5', padding: 14, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  saveIcon: { marginRight: 8 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  emptyContainer: { padding: 30, alignItems: 'center' },
  emptyText: { textAlign: 'center', color: '#6b7280', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', padding: 24, borderRadius: 16, width: '80%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  modalCatBadge: {backgroundColor: '#e5e7eb', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20},
  modalCatText: {color: '#374151', fontWeight: 'bold'},
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 20, borderRadius: 8, fontSize: 16 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-around' }
});
