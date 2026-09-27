import { Clothing, Category } from '../hooks/useWardrobe';

export interface OutfitRecommendation {
  top: Clothing | null;
  bottom: Clothing | null;
  shoes: Clothing | null;
}

const getRandomItem = (items: Clothing[]) => {
  if (items.length === 0) return null;
  return items[Math.floor(Math.random() * items.length)];
};

export const generateRecommendations = (clothes: Clothing[], categories: Category[], limit: number = 3): OutfitRecommendation[] => {
  const topIds = categories.filter(c => c.name.toLowerCase().includes('shirt') || c.name.toLowerCase().includes('top')).map(c => c.id);
  const bottomIds = categories.filter(c => c.name.toLowerCase().includes('pant') || c.name.toLowerCase().includes('bottom') || c.name.toLowerCase().includes('short')).map(c => c.id);
  const shoesIds = categories.filter(c => c.name.toLowerCase().includes('shoe') || c.name.toLowerCase().includes('sneaker') || c.name.toLowerCase().includes('boot')).map(c => c.id);

  const tops = clothes.filter(c => topIds.includes(c.categoryId));
  const bottoms = clothes.filter(c => bottomIds.includes(c.categoryId));
  const shoes = clothes.filter(c => shoesIds.includes(c.categoryId));

  const recommendations: OutfitRecommendation[] = [];

  for (let i = 0; i < limit; i++) {
    recommendations.push({
      top: getRandomItem(tops),
      bottom: getRandomItem(bottoms),
      shoes: getRandomItem(shoes),
    });
  }

  return recommendations;
};
