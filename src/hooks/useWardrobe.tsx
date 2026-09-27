import { useState, useCallback } from 'react';
import { db } from '../lib/db';

export interface Category {
  id: number;
  name: string;
  userId: number;
}

export interface Clothing {
  id: number;
  imageUri: string;
  categoryId: number;
  userId: number;
  createdAt: number;
}

export interface Outfit {
  id: number;
  name: string;
  userId: number;
  topId?: number;
  bottomId?: number;
  shoesId?: number;
  jewelryId?: number;
  jewelryIds?: string;
  createdAt: number;
}

export const useWardrobe = (userId: number | undefined) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [clothes, setClothes] = useState<Clothing[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);

  const loadCategories = useCallback(async () => {
    if (!userId) return;
    try {
      const results = await db.getAllAsync<Category>('SELECT * FROM categories WHERE userId = ?', [userId]);
      setCategories(results);
    } catch (e) {
      console.error('Failed to load categories', e);
    }
  }, [userId]);

  const loadClothes = useCallback(async (categoryId?: number) => {
    if (!userId) return;
    try {
      let results;
      if (categoryId !== undefined) {
        results = await db.getAllAsync<Clothing>('SELECT * FROM clothes WHERE userId = ? AND categoryId = ? ORDER BY createdAt DESC', [userId, categoryId]);
      } else {
        results = await db.getAllAsync<Clothing>('SELECT * FROM clothes WHERE userId = ? ORDER BY createdAt DESC', [userId]);
      }
      setClothes(results);
    } catch (e) {
      console.error('Failed to load clothes', e);
    }
  }, [userId]);

  const loadOutfits = useCallback(async () => {
    if (!userId) return;
    try {
      const results = await db.getAllAsync<Outfit>('SELECT * FROM outfits WHERE userId = ? ORDER BY createdAt DESC', [userId]);
      setOutfits(results);
    } catch (e) {
      console.error('Failed to load outfits', e);
    }
  }, [userId]);

  const createCategory = async (name: string) => {
    if (!userId) return null;
    
    const trimmedName = name.trim();
    const existing = categories.find(c => c.name.toLowerCase() === trimmedName.toLowerCase());
    if (existing) return existing;

    try {
      const result = await db.runAsync('INSERT INTO categories (name, userId) VALUES (?, ?)', [trimmedName, userId]);
      if (result.lastInsertRowId) {
        const newCategory = await db.getFirstAsync<Category>('SELECT * FROM categories WHERE id = ?', [result.lastInsertRowId]);
        if (newCategory) {
          setCategories(prev => [...prev, newCategory]);
          return newCategory;
        }
      }
      return null;
    } catch (e) {
      console.error('Failed to create category', e);
      return null;
    }
  };

  const addClothing = async (categoryId: number, imageUri: string) => {
    if (!userId) return null;
    try {
      const result = await db.runAsync('INSERT INTO clothes (imageUri, categoryId, userId) VALUES (?, ?, ?)', [imageUri, categoryId, userId]);
      if (result.lastInsertRowId) {
        const newClothing = await db.getFirstAsync<Clothing>('SELECT * FROM clothes WHERE id = ?', [result.lastInsertRowId]);
        if (newClothing) {
          setClothes(prev => [newClothing, ...prev]);
          return newClothing;
        }
      }
      return null;
    } catch (e) {
      console.error('Failed to add clothing', e);
      return null;
    }
  };

  const saveOutfit = async (name: string, topId?: number, bottomId?: number, shoesId?: number, jewelryIds?: number[]) => {
    if (!userId) return null;
    const jIdsStr = jewelryIds && jewelryIds.length > 0 ? JSON.stringify(jewelryIds) : null;
    try {
      const result = await db.runAsync(
        'INSERT INTO outfits (name, userId, topId, bottomId, shoesId, jewelryIds) VALUES (?, ?, ?, ?, ?, ?)',
        [name, userId, topId || null, bottomId || null, shoesId || null, jIdsStr]
      );
      if (result.lastInsertRowId) {
        const newOutfit = await db.getFirstAsync<Outfit>('SELECT * FROM outfits WHERE id = ?', [result.lastInsertRowId]);
        if (newOutfit) {
          setOutfits(prev => [newOutfit, ...prev]);
          return newOutfit;
        }
      }
      return null;
    } catch (e) {
      console.error('Failed to save outfit', e);
      return null;
    }
  };

  const deleteCategory = async (categoryId: number) => {
    if (!userId) return false;
    try {
      await db.runAsync('DELETE FROM categories WHERE id = ? AND userId = ?', [categoryId, userId]);
      setCategories(prev => prev.filter(c => c.id !== categoryId));
      return true;
    } catch (e) {
      console.error('Failed to delete category', e);
      return false;
    }
  };

  const deleteClothing = async (clothingId: number) => {
    if (!userId) return false;
    try {
      await db.runAsync('DELETE FROM clothes WHERE id = ? AND userId = ?', [clothingId, userId]);
      setClothes(prev => prev.filter(c => c.id !== clothingId));
      return true;
    } catch (e) {
      console.error('Failed to delete clothing', e);
      return false;
    }
  };

  const deleteOutfit = async (outfitId: number) => {
    if (!userId) return false;
    try {
      await db.runAsync('DELETE FROM outfits WHERE id = ? AND userId = ?', [outfitId, userId]);
      setOutfits(prev => prev.filter(o => o.id !== outfitId));
      return true;
    } catch (e) {
      console.error('Failed to delete outfit', e);
      return false;
    }
  };

  return {
    categories,
    clothes,
    outfits,
    loadCategories,
    loadClothes,
    loadOutfits,
    createCategory,
    addClothing,
    saveOutfit,
    deleteCategory,
    deleteClothing,
    deleteOutfit
  };
};
