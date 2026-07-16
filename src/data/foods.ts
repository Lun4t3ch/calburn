/**
 * Curated food list with calories per typical portion (approximate values
 * based on USDA FoodData Central). Used to show "what does X kcal look like
 * as food" in a best-case (whole foods) vs worst-case (fast food) day.
 */

export type FoodStyle = 'healthy' | 'indulgent'

export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export interface FoodItem {
  id: string
  label: string
  portion: string
  kcal: number
  style: FoodStyle
  slot: MealSlot
  emoji: string
}

export const FOODS: FoodItem[] = [
  // ---- Healthy: breakfast
  { id: 'oatmeal', label: 'Oatmeal with milk', portion: '1 bowl (60 g oats)', kcal: 300, style: 'healthy', slot: 'breakfast', emoji: '🥣' },
  { id: 'eggs-2', label: 'Boiled eggs', portion: '2 eggs', kcal: 155, style: 'healthy', slot: 'breakfast', emoji: '🥚' },
  { id: 'wholegrain-toast', label: 'Wholegrain toast with cheese', portion: '2 slices', kcal: 280, style: 'healthy', slot: 'breakfast', emoji: '🍞' },
  { id: 'greek-yogurt', label: 'Greek yogurt with berries', portion: '1 cup (250 g)', kcal: 220, style: 'healthy', slot: 'breakfast', emoji: '🫐' },

  // ---- Healthy: lunch
  { id: 'chicken-salad', label: 'Chicken salad with dressing', portion: '1 large bowl', kcal: 400, style: 'healthy', slot: 'lunch', emoji: '🥗' },
  { id: 'salmon-potatoes', label: 'Salmon with potatoes & veg', portion: '1 plate', kcal: 550, style: 'healthy', slot: 'lunch', emoji: '🐟' },
  { id: 'lentil-soup', label: 'Lentil soup with bread', portion: '1 bowl + 1 slice', kcal: 380, style: 'healthy', slot: 'lunch', emoji: '🍲' },
  { id: 'tuna-wrap', label: 'Tuna & veggie wrap', portion: '1 wrap', kcal: 350, style: 'healthy', slot: 'lunch', emoji: '🌯' },

  // ---- Healthy: dinner
  { id: 'chicken-rice', label: 'Chicken breast with rice & broccoli', portion: '1 plate', kcal: 550, style: 'healthy', slot: 'dinner', emoji: '🍗' },
  { id: 'cod-veg', label: 'Baked cod with vegetables', portion: '1 plate', kcal: 420, style: 'healthy', slot: 'dinner', emoji: '🐠' },
  { id: 'beef-stirfry', label: 'Lean beef stir-fry with noodles', portion: '1 plate', kcal: 580, style: 'healthy', slot: 'dinner', emoji: '🥡' },
  { id: 'turkey-pasta', label: 'Turkey mince pasta', portion: '1 plate', kcal: 600, style: 'healthy', slot: 'dinner', emoji: '🍝' },

  // ---- Healthy: snacks
  { id: 'apple', label: 'Apple', portion: '1 medium', kcal: 95, style: 'healthy', slot: 'snack', emoji: '🍎' },
  { id: 'banana', label: 'Banana', portion: '1 medium', kcal: 105, style: 'healthy', slot: 'snack', emoji: '🍌' },
  { id: 'carrots-hummus', label: 'Carrots with hummus', portion: '1 handful + 2 tbsp', kcal: 130, style: 'healthy', slot: 'snack', emoji: '🥕' },
  { id: 'almonds', label: 'Almonds', portion: 'small handful (20 g)', kcal: 120, style: 'healthy', slot: 'snack', emoji: '🌰' },
  { id: 'cottage-cheese', label: 'Cottage cheese', portion: '1/2 cup', kcal: 110, style: 'healthy', slot: 'snack', emoji: '🧀' },

  // ---- Indulgent: breakfast
  { id: 'croissant-latte', label: 'Croissant + caffè latte', portion: '1 + large', kcal: 480, style: 'indulgent', slot: 'breakfast', emoji: '🥐' },
  { id: 'sugary-cereal', label: 'Sugary cereal with milk', portion: '1 big bowl', kcal: 400, style: 'indulgent', slot: 'breakfast', emoji: '🥛' },

  // ---- Indulgent: lunch
  { id: 'cheeseburger-fries', label: 'Cheeseburger with fries', portion: '1 meal', kcal: 950, style: 'indulgent', slot: 'lunch', emoji: '🍔' },
  { id: 'pepperoni-pizza', label: 'Pepperoni pizza', portion: '3 slices', kcal: 850, style: 'indulgent', slot: 'lunch', emoji: '🍕' },
  { id: 'kebab', label: 'Kebab in pita with sauce', portion: '1 kebab', kcal: 750, style: 'indulgent', slot: 'lunch', emoji: '🥙' },

  // ---- Indulgent: dinner
  { id: 'fried-chicken-meal', label: 'Fried chicken with fries & soda', portion: '1 meal', kcal: 1100, style: 'indulgent', slot: 'dinner', emoji: '🍟' },
  { id: 'creamy-pasta', label: 'Creamy carbonara with garlic bread', portion: '1 large plate', kcal: 900, style: 'indulgent', slot: 'dinner', emoji: '🍝' },

  // ---- Indulgent: snacks
  { id: 'chocolate-bar', label: 'Chocolate bar', portion: '1 bar (50 g)', kcal: 270, style: 'indulgent', slot: 'snack', emoji: '🍫' },
  { id: 'soda', label: 'Soda', portion: '0.5 L', kcal: 210, style: 'indulgent', slot: 'snack', emoji: '🥤' },
  { id: 'potato-chips', label: 'Potato chips', portion: '1 small bag (100 g)', kcal: 540, style: 'indulgent', slot: 'snack', emoji: '🥔' },
  { id: 'ice-cream', label: 'Ice cream', portion: '2 scoops', kcal: 280, style: 'indulgent', slot: 'snack', emoji: '🍦' },
  { id: 'beer', label: 'Beer', portion: '0.5 L', kcal: 215, style: 'indulgent', slot: 'snack', emoji: '🍺' },
]
