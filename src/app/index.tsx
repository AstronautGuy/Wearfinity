import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal, TextInput, Button, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@/hooks/useUser';
import { useWardrobe } from '@/hooks/useWardrobe';

export default function HomeScreen() {
  const { activeUser, setActiveUser } = useUser();
  const router = useRouter();

  if (!activeUser) {
    return <Redirect href="/profiles" />;
  }

  const { categories, clothes, outfits, loadCategories, loadClothes, loadOutfits, createCategory, addClothing, deleteCategory, deleteClothing } = useWardrobe(activeUser.id);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  const [activeTab, setActiveTab] = useState<'clothes' | 'jewelry' | 'outfits'>('clothes');
  const [selectedOutfitCategory, setSelectedOutfitCategory] = useState<string | null>(null);
  const [selectedOutfitForModal, setSelectedOutfitForModal] = useState<any | null>(null);

  const jewelryPresetNames = ['Earrings', 'Anklets', 'Necklaces', 'Rings', 'Bracelets'];

  useEffect(() => {
    loadCategories();
    loadOutfits();
    loadClothes();
  }, [loadCategories, loadOutfits, loadClothes]);

  useEffect(() => {
    const ensureJewelryPresets = async () => {
      if (categories.length > 0) {
        let created = false;
        for (const name of jewelryPresetNames) {
          if (!categories.find(c => c.name.toLowerCase() === name.toLowerCase())) {
            await createCategory(name);
            created = true;
          }
        }
        if (created) loadCategories();
      }
    };
    ensureJewelryPresets();
  }, [categories.length]);

  const isJewelryCategory = (catName: string) => {
    const lower = catName.toLowerCase();
    return jewelryPresetNames.some(n => lower.includes(n.toLowerCase())) || lower.includes('jewelry');
  };

  const clothingCategories = categories.filter(c => !isJewelryCategory(c.name));
  const jewelryCategories = categories.filter(c => isJewelryCategory(c.name));

  const activeCategories = activeTab === 'clothes' ? clothingCategories : jewelryCategories;

  useEffect(() => {
    if (activeCategories.length > 0 && selectedCategoryId === null) {
      setSelectedCategoryId(activeCategories[0].id);
    }
  }, [activeCategories, activeTab]);

  const displayedClothes = selectedCategoryId !== null 
    ? clothes.filter(c => c.categoryId === selectedCategoryId)
    : clothes;

  const handleCreateCategory = async () => {
    if (newCategoryName.trim() === '') return;
    const cat = await createCategory(newCategoryName);
    if (cat) {
      setSelectedCategoryId(cat.id);
      setCategoryModalVisible(false);
      setNewCategoryName('');
      loadCategories(); // Ensure UI reflects the new category in correct tab
    }
  };

  const handleLogout = () => {
    setActiveUser(null);
  };

  const handleSeedData = async () => {
    let shirtCat = categories.find(c => c.name === 'Shirts');
    if (!shirtCat) shirtCat = await createCategory('Shirts');
    let pantCat = categories.find(c => c.name === 'Pants');
    if (!pantCat) pantCat = await createCategory('Pants');
    let shoeCat = categories.find(c => c.name === 'Shoes');
    if (!shoeCat) shoeCat = await createCategory('Shoes');

    const imageUrls = {
      shirt: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80',
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80',
        'https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=400&q=80'
      ],
      pant: [
        'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&q=80',
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80',
        'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=400&q=80'
      ],
      shoe: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
        'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&q=80',
        'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&q=80'
      ]
    };

    if (shirtCat) for (const uri of imageUrls.shirt) await addClothing(shirtCat.id, uri);
    if (pantCat) for (const uri of imageUrls.pant) await addClothing(pantCat.id, uri);
    if (shoeCat) for (const uri of imageUrls.shoe) await addClothing(shoeCat.id, uri);

    loadCategories();
    loadClothes();
    alert("Mock data seeded successfully!");
  };

  const handleDeleteCategory = (id: number, name: string) => {
    Alert.alert('Delete Category', `Are you sure you want to delete "${name}"? This will not delete the items inside it.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        const success = await deleteCategory(id);
        if (success && selectedCategoryId === id) {
          setSelectedCategoryId(activeCategories.length > 1 ? activeCategories.find(c => c.id !== id)?.id || null : null);
        }
      }}
    ]);
  };

  const handleDeleteClothing = (id: number) => {
    Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteClothing(id) }
    ]);
  };

  const defaultOutfitCategories = ['Casual', 'Work', 'Party'];
  const outfitCategories = Array.from(new Set([...defaultOutfitCategories, ...outfits.map(o => o.name)]));

  const filteredOutfits = selectedOutfitCategory 
    ? outfits.filter(o => o.name === selectedOutfitCategory)
    : outfits;

  const getImageUrl = (id: number | null) => {
    if (!id) return null;
    return clothes.find(c => c.id === id)?.imageUri;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Wardrobe</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={handleSeedData} style={styles.logoutButton}>
            <Ionicons name="color-fill-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabToggle}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'clothes' && styles.tabButtonActive]} 
          onPress={() => { setActiveTab('clothes'); setSelectedCategoryId(clothingCategories[0]?.id || null); }}
        >
          <Text style={[styles.tabText, activeTab === 'clothes' && styles.tabTextActive]}>Clothes</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'jewelry' && styles.tabButtonActive]} 
          onPress={() => { setActiveTab('jewelry'); setSelectedCategoryId(jewelryCategories[0]?.id || null); }}
        >
          <Text style={[styles.tabText, activeTab === 'jewelry' && styles.tabTextActive]}>Jewelry</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'outfits' && styles.tabButtonActive]} 
          onPress={() => setActiveTab('outfits')}
        >
          <Text style={[styles.tabText, activeTab === 'outfits' && styles.tabTextActive]}>Outfits</Text>
        </TouchableOpacity>
      </View>

      {(activeTab === 'clothes' || activeTab === 'jewelry') ? (
        <>
          <View style={styles.categoriesSection}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={[{ id: 'add', name: '+ New' }, ...activeCategories]}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => {
                if (item.id === 'add') {
                  return (
                    <TouchableOpacity style={styles.categoryBadgeAdd} onPress={() => setCategoryModalVisible(true)}>
                      <Text style={styles.categoryBadgeTextAdd}>{item.name}</Text>
                    </TouchableOpacity>
                  );
                }
                const isSelected = item.id === selectedCategoryId;
                return (
                  <View style={[styles.categoryBadge, isSelected && styles.categoryBadgeSelected, { flexDirection: 'row', alignItems: 'center' }]}>
                    <TouchableOpacity onPress={() => setSelectedCategoryId(item.id as number)}>
                      <Text style={[styles.categoryBadgeText, isSelected && styles.categoryBadgeTextSelected]}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{marginLeft: 6}} onPress={() => handleDeleteCategory(item.id as number, item.name)}>
                      <Ionicons name="close-circle" size={16} color={isSelected ? "#fff" : "#9ca3af"} />
                    </TouchableOpacity>
                  </View>
                );
              }}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
            />
          </View>

          <FlatList
            data={displayedClothes}
            numColumns={3}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.gridContainer}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No items found in this category.</Text>
              </View>
            )}
            renderItem={({ item }) => (
              <View style={styles.clothingItem}>
                <Image source={{ uri: item.imageUri }} style={styles.clothingImage} />
                <TouchableOpacity style={styles.deleteOverlay} onPress={() => handleDeleteClothing(item.id)}>
                  <Ionicons name="trash" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          />

          {selectedCategoryId !== null && (
            <TouchableOpacity
              style={styles.fab}
              onPress={() => router.push({ pathname: '/camera', params: { categoryId: selectedCategoryId } })}
            >
              <Ionicons name="camera" size={30} color="#fff" />
            </TouchableOpacity>
          )}
        </>
      ) : (
        <View style={{flex: 1, padding: 16}}>
          <View style={{ marginBottom: 16 }}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={[{id: 'all', name: 'All'}, ...outfitCategories.map(c => ({id: c, name: c}))]}
              keyExtractor={item => item.id}
              renderItem={({item}) => {
                const isSelected = item.id === 'all' ? selectedOutfitCategory === null : selectedOutfitCategory === item.id;
                return (
                  <TouchableOpacity 
                    style={[styles.categoryBadge, isSelected && styles.categoryBadgeSelected, {marginRight: 10}]}
                    onPress={() => setSelectedOutfitCategory(item.id === 'all' ? null : item.id)}
                  >
                    <Text style={[styles.categoryBadgeText, isSelected && styles.categoryBadgeTextSelected]}>{item.name}</Text>
                  </TouchableOpacity>
                )
              }}
            />
          </View>

          <FlatList
            data={filteredOutfits}
            keyExtractor={item => item.id.toString()}
            ListEmptyComponent={() => <Text style={styles.emptyText}>No outfits found in this category.</Text>}
            renderItem={({item}) => {
              const jIds = item.jewelryIds ? JSON.parse(item.jewelryIds) : [];
              return (
                <TouchableOpacity style={styles.savedOutfitCard} onPress={() => setSelectedOutfitForModal(item)}>
                  {selectedOutfitCategory === null && <Text style={styles.savedOutfitCategoryTag}>{item.name}</Text>}
                  <View style={styles.savedOutfitImages}>
                    {getImageUrl(item.topId || null) ? <Image source={{ uri: getImageUrl(item.topId || null) }} style={styles.outfitGridImage} /> : <View style={[styles.outfitGridImage, styles.placeholderBg]} />}
                    {getImageUrl(item.bottomId || null) ? <Image source={{ uri: getImageUrl(item.bottomId || null) }} style={styles.outfitGridImage} /> : <View style={[styles.outfitGridImage, styles.placeholderBg]} />}
                    {getImageUrl(item.shoesId || null) ? <Image source={{ uri: getImageUrl(item.shoesId || null) }} style={styles.outfitGridImage} /> : <View style={[styles.outfitGridImage, styles.placeholderBg]} />}
                    {jIds.map((id: number) => getImageUrl(id) ? <Image key={id} source={{ uri: getImageUrl(id) }} style={styles.outfitGridImage} /> : null)}
                  </View>
                </TouchableOpacity>
              )
            }}
          />
        </View>
      )}

      {/* Existing Category Modal */}
      <Modal visible={categoryModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Category</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Shirts, Pants, Shoes"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setCategoryModalVisible(false)} color="#666" />
              <Button title="Create" onPress={handleCreateCategory} color="#4F46E5" />
            </View>
          </View>
        </View>
      </Modal>

      {/* Outfit Expanded View Modal */}
      <Modal visible={!!selectedOutfitForModal} transparent animationType="fade">
        <View style={styles.expandedOverlay}>
          {selectedOutfitForModal && (
            <View style={styles.expandedContent}>
              <View style={styles.expandedHeader}>
                <Text style={styles.expandedTitle}>{selectedOutfitForModal.name} Outfit</Text>
                <TouchableOpacity onPress={() => setSelectedOutfitForModal(null)}>
                  <Ionicons name="close" size={28} color="#111827" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.expandedImagesContainer}>
                {getImageUrl(selectedOutfitForModal.topId || null) && <Image source={{ uri: getImageUrl(selectedOutfitForModal.topId || null) }} style={styles.expandedImageLarge} />}
                {getImageUrl(selectedOutfitForModal.bottomId || null) && <Image source={{ uri: getImageUrl(selectedOutfitForModal.bottomId || null) }} style={styles.expandedImageLarge} />}
                {getImageUrl(selectedOutfitForModal.shoesId || null) && <Image source={{ uri: getImageUrl(selectedOutfitForModal.shoesId || null) }} style={styles.expandedImageLarge} />}
                {selectedOutfitForModal.jewelryIds && JSON.parse(selectedOutfitForModal.jewelryIds).map((id: number) => 
                  getImageUrl(id) ? <Image key={id} source={{ uri: getImageUrl(id) }} style={styles.expandedImageLarge} /> : null
                )}
              </View>

              <TouchableOpacity 
                style={styles.deleteOutfitBtn} 
                onPress={async () => {
                  const success = await deleteOutfit(selectedOutfitForModal.id);
                  if (success) {
                    setSelectedOutfitForModal(null);
                    Alert.alert('Deleted', 'Outfit has been removed.');
                  }
                }}
              >
                <Ionicons name="trash-outline" size={20} color="#ef4444" style={{marginRight: 8}} />
                <Text style={styles.deleteOutfitText}>Delete Outfit</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, alignItems: 'center' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#111827' },
  logoutButton: { padding: 8 },
  categoriesSection: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  categoryBadge: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#e5e7eb' },
  categoryBadgeSelected: { backgroundColor: '#4F46E5' },
  categoryBadgeAdd: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#4F46E5', borderStyle: 'dashed' },
  categoryBadgeText: { fontSize: 14, color: '#4b5563', fontWeight: '500' },
  categoryBadgeTextSelected: { color: '#fff' },
  categoryBadgeTextAdd: { fontSize: 14, color: '#4F46E5', fontWeight: '500' },
  gridContainer: { padding: 8 },
  clothingItem: { flex: 1/3, padding: 4, aspectRatio: 1 },
  clothingImage: { width: '100%', height: '100%', borderRadius: 8, backgroundColor: '#e5e7eb' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100 },
  emptyText: { color: '#6b7280', fontSize: 16 },
  fab: { position: 'absolute', right: 20, bottom: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#4F46E5', justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3 },
  deleteOverlay: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
  
  tabToggle: { flexDirection: 'row', marginHorizontal: 16, marginTop: 10, backgroundColor: '#e5e7eb', borderRadius: 8, padding: 4 },
  tabButton: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  tabButtonActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  tabText: { fontSize: 14, fontWeight: 'bold', color: '#6b7280' },
  tabTextActive: { color: '#111827' },
  
  savedOutfitCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  savedOutfitCategoryTag: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#374151' },
  savedOutfitImages: { flexDirection: 'row', gap: 10, justifyContent: 'space-between' },
  outfitGridImage: { flex: 1, aspectRatio: 1, borderRadius: 8 },
  placeholderBg: { backgroundColor: '#f3f4f6' },
  
  expandedOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  expandedContent: { backgroundColor: '#fff', width: '100%', borderRadius: 20, padding: 20, alignItems: 'center' },
  expandedHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 20 },
  expandedTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  expandedImagesContainer: { flexDirection: 'row', flexWrap: 'wrap', width: '100%', gap: 12, marginBottom: 30, justifyContent: 'center' },
  expandedImageLarge: { flexBasis: '45%', aspectRatio: 1, borderRadius: 16, backgroundColor: '#f3f4f6' },
  deleteOutfitBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fee2e2', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  deleteOutfitText: { color: '#ef4444', fontWeight: 'bold', fontSize: 16 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', padding: 24, borderRadius: 16, width: '80%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 20, borderRadius: 8, fontSize: 16 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-around' }
});
