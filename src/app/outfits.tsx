import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, TextInput, Button, ScrollView, Alert, FlatList, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@/hooks/useUser';
import { useWardrobe, Clothing } from '@/hooks/useWardrobe';

export default function OutfitsScreen() {
  const { activeUser } = useUser();

  if (!activeUser) {
    return <Redirect href="/profiles" />;
  }

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  
  // Use the smaller dimension as the baseline so items don't overflow the screen height in landscape
  const baseDimension = Math.min(width, height);
  
  // Make items slightly smaller in landscape so they fit better vertically
  const ITEM_WIDTH = isLandscape ? baseDimension * 0.35 : baseDimension * 0.5;
  const ITEM_MARGIN = (width - ITEM_WIDTH) / 2;

  const { clothes, outfits, categories, loadClothes, loadOutfits, loadCategories, saveOutfit } = useWardrobe(activeUser.id);
  
  const [topId, setTopId] = useState<number | null>(null);
  const [bottomId, setBottomId] = useState<number | null>(null);
  const [shoesId, setShoesId] = useState<number | null>(null);
  
  const [earringId, setEarringId] = useState<number | null>(null);
  const [necklaceId, setNecklaceId] = useState<number | null>(null);
  const [ringId, setRingId] = useState<number | null>(null);
  const [braceletId, setBraceletId] = useState<number | null>(null);
  const [ankletId, setAnkletId] = useState<number | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOutfitCategory, setSelectedOutfitCategory] = useState<string | null>(null);
  const [newOutfitCategory, setNewOutfitCategory] = useState('');
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);

  useEffect(() => {
    loadCategories();
    loadClothes();
    loadOutfits();
  }, [loadCategories, loadClothes, loadOutfits]);

  const getClothesForCategoryName = (nameSubstring: string) => {
    const matchingCategories = categories.filter(c => c.name.toLowerCase().includes(nameSubstring.toLowerCase()));
    const matchingIds = matchingCategories.map(c => c.id);
    return clothes.filter(c => matchingIds.includes(c.categoryId));
  };

  const tops = getClothesForCategoryName('shirt');
  const bottoms = getClothesForCategoryName('pant');
  const shoes = getClothesForCategoryName('shoe');
  
  const earrings = getClothesForCategoryName('earring');
  const necklaces = getClothesForCategoryName('necklace');
  const rings = getClothesForCategoryName('ring');
  const bracelets = getClothesForCategoryName('bracelet');
  const anklets = getClothesForCategoryName('anklet');

  const defaultOutfitCategories = ['Casual', 'Work', 'Party'];
  const outfitCategories = Array.from(new Set([...defaultOutfitCategories, ...outfits.map(o => o.name)]));

  const filteredOutfits = selectedOutfitCategory 
    ? outfits.filter(o => o.name === selectedOutfitCategory)
    : outfits;

  useEffect(() => {
    if (tops.length > 0 && topId === null) setTopId(tops[0].id);
    if (bottoms.length > 0 && bottomId === null) setBottomId(bottoms[0].id);
    if (shoes.length > 0 && shoesId === null) setShoesId(shoes[0].id);
    if (earrings.length > 0 && earringId === null) setEarringId(earrings[0].id);
    if (necklaces.length > 0 && necklaceId === null) setNecklaceId(necklaces[0].id);
    if (rings.length > 0 && ringId === null) setRingId(rings[0].id);
    if (bracelets.length > 0 && braceletId === null) setBraceletId(bracelets[0].id);
    if (anklets.length > 0 && ankletId === null) setAnkletId(anklets[0].id);
  }, [tops, bottoms, shoes, earrings, necklaces, rings, bracelets, anklets]);

  const renderCarousel = (title: string, items: Clothing[], value: number | null, setValue: (id: number) => void) => {
    if (items.length === 0) {
      return (
        <View style={styles.carouselSection}>
          <Text style={styles.carouselTitle}>{title}</Text>
          <View style={[styles.emptySlot, { width: ITEM_WIDTH, height: ITEM_WIDTH, marginHorizontal: ITEM_MARGIN }]}>
            <Text style={styles.emptyText}>No {title} found</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.carouselSection}>
        <Text style={styles.carouselTitle}>{title}</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_WIDTH + 20}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: ITEM_MARGIN - 10 }}
          data={items}
          keyExtractor={(item) => item.id.toString()}
          onViewableItemsChanged={({ viewableItems }) => {
            // Optional: automatically select the center item when scrolling stops
            if (viewableItems.length > 0) {
              const centerItem = viewableItems[Math.floor(viewableItems.length / 2)];
              if (centerItem && centerItem.item.id !== value) {
                setValue(centerItem.item.id);
              }
            }
          }}
          viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          renderItem={({ item }) => {
            const isSelected = item.id === value;
            return (
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => setValue(item.id)}
                style={[
                  styles.carouselItem, 
                  { width: ITEM_WIDTH, height: ITEM_WIDTH },
                  isSelected && styles.carouselItemSelected
                ]}
              >
                <Image source={{ uri: item.imageUri }} style={styles.carouselImage} />
                {isSelected && (
                  <View style={styles.selectedOverlay}>
                    <Ionicons name="checkmark-circle" size={24} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  };

  const getImageUrl = (id: number | null) => {
    if (!id) return null;
    return clothes.find(c => c.id === id)?.imageUri;
  };

  const saveToCategory = async (cat: string) => {
    if (!cat.trim()) return;
    const jIds = [earringId, necklaceId, ringId, braceletId, ankletId].filter(id => id !== null) as number[];
    const outfit = await saveOutfit(cat.trim(), topId || undefined, bottomId || undefined, shoesId || undefined, jIds);
    if (outfit) {
      setModalVisible(false);
      setIsCreatingNewCategory(false);
      setNewOutfitCategory('');
      Alert.alert("Success", `Outfit saved to ${cat}!`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Mix & Match</Text>
          <TouchableOpacity style={styles.saveButtonSmall} onPress={() => setModalVisible(true)}>
            <Ionicons name="bookmark" size={16} color="#fff" />
            <Text style={styles.saveButtonTextSmall}>Save</Text>
          </TouchableOpacity>
        </View>
        
        {renderCarousel('Tops', tops, topId, setTopId)}
        {renderCarousel('Bottoms', bottoms, bottomId, setBottomId)}
        {renderCarousel('Shoes', shoes, shoesId, setShoesId)}
        {renderCarousel('Earrings', earrings, earringId, setEarringId)}
        {renderCarousel('Necklaces', necklaces, necklaceId, setNecklaceId)}
        {renderCarousel('Rings', rings, ringId, setRingId)}
        {renderCarousel('Bracelets', bracelets, braceletId, setBraceletId)}
        {renderCarousel('Anklets', anklets, ankletId, setAnkletId)}

        <View style={styles.savedSection}>
          <Text style={styles.savedTitle}>Saved Outfits</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <TouchableOpacity 
              style={[styles.filterBadge, selectedOutfitCategory === null && styles.filterBadgeSelected]}
              onPress={() => setSelectedOutfitCategory(null)}
            >
              <Text style={[styles.filterText, selectedOutfitCategory === null && styles.filterTextSelected]}>All</Text>
            </TouchableOpacity>
            {outfitCategories.map(cat => (
              <TouchableOpacity 
                key={cat}
                style={[styles.filterBadge, selectedOutfitCategory === cat && styles.filterBadgeSelected]}
                onPress={() => setSelectedOutfitCategory(cat)}
              >
                <Text style={[styles.filterText, selectedOutfitCategory === cat && styles.filterTextSelected]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {filteredOutfits.length === 0 ? (
            <Text style={{color: '#666', marginTop: 20}}>No outfits found in this category.</Text>
          ) : (
            filteredOutfits.map(outfit => {
              const jIds = outfit.jewelryIds ? JSON.parse(outfit.jewelryIds) : [];
              return (
                <View key={outfit.id} style={styles.savedOutfitCard}>
                  <Text style={styles.savedOutfitName}>{outfit.name}</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.savedOutfitImages}>
                      {getImageUrl(outfit.topId || null) && <Image source={{ uri: getImageUrl(outfit.topId || null) }} style={styles.smallImage} />}
                      {getImageUrl(outfit.bottomId || null) && <Image source={{ uri: getImageUrl(outfit.bottomId || null) }} style={styles.smallImage} />}
                      {getImageUrl(outfit.shoesId || null) && <Image source={{ uri: getImageUrl(outfit.shoesId || null) }} style={styles.smallImage} />}
                      {jIds.map((id: number) => getImageUrl(id) ? <Image key={id} source={{ uri: getImageUrl(id) }} style={styles.smallImage} /> : null)}
                    </View>
                  </ScrollView>
                </View>
              );
            })
          )}
        </View>

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
                    onPress={() => saveToCategory(cat)}
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
                <Button title="Save New Category" onPress={() => saveToCategory(newOutfitCategory)} color="#4F46E5" />
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
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#111827' },
  saveButtonSmall: { backgroundColor: '#4F46E5', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, gap: 6 },
  saveButtonTextSmall: { color: '#fff', fontWeight: 'bold' },
  
  carouselSection: { marginBottom: 20 },
  carouselTitle: { paddingHorizontal: 16, fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#374151', textTransform: 'uppercase', letterSpacing: 1 },
  carouselItem: { marginHorizontal: 10, borderRadius: 16, overflow: 'hidden', backgroundColor: '#e5e7eb', elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  carouselItemSelected: { borderWidth: 3, borderColor: '#4F46E5', shadowColor: '#4F46E5', shadowOpacity: 0.5, shadowRadius: 8, elevation: 8 },
  carouselImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  selectedOverlay: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 12 },
  emptySlot: { borderRadius: 16, backgroundColor: '#e5e7eb', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#d1d5db', borderStyle: 'dashed' },
  emptyText: { color: '#9ca3af', fontWeight: 'bold' },

  savedSection: { padding: 16, marginTop: 10, borderTopWidth: 1, borderColor: '#e5e7eb' },
  savedTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, color: '#111827' },
  filterScroll: { marginBottom: 16 },
  filterBadge: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#e5e7eb', marginRight: 10 },
  filterBadgeSelected: { backgroundColor: '#4F46E5' },
  filterText: { fontSize: 14, color: '#4b5563', fontWeight: '500' },
  filterTextSelected: { color: '#fff' },
  savedOutfitCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  savedOutfitName: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#374151' },
  savedOutfitImages: { flexDirection: 'row', gap: 10 },
  smallImage: { width: 60, height: 60, borderRadius: 8, backgroundColor: '#f3f4f6' },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', padding: 24, borderRadius: 16, width: '80%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  modalCatBadge: {backgroundColor: '#e5e7eb', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20},
  modalCatText: {color: '#374151', fontWeight: 'bold'},
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 20, borderRadius: 8, fontSize: 16 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-around' }
});
