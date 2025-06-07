export const mockUserProfiles = [
  {
    id: 1,
    age: 25,
    gender: 'female',
    height: 165,
    weight: 55,
    weekly_budget: 50000,
    food_preferences: 'vegetarian, gluten-free',
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    age: 30,
    gender: 'male',
    height: 180,
    weight: 75,
    weekly_budget: 75000,
    food_preferences: 'high-protein, low-carb',
    created_at: '2024-01-16T14:20:00Z'
  },
  {
    id: 3,
    age: 35,
    gender: 'female',
    height: 160,
    weight: 60,
    weekly_budget: 60000,
    food_preferences: 'dairy-free, organic',
    created_at: '2024-01-17T09:15:00Z'
  },
  {
    id: 4,
    age: 28,
    gender: 'male',
    height: 175,
    weight: 70,
    weekly_budget: 45000,
    food_preferences: 'mediterranean, fish',
    created_at: '2024-01-18T16:45:00Z'
  }
];

export const mockNutritionPlans = [
  {
    id: 1,
    user_id: 1,
    daily_calories: 1800,
    protein_g: 65,
    carbs_g: 225,
    fat_g: 60,
    fiber_g: 25,
    meals: [
      {
        type: 'breakfast',
        calories: 400,
        items: ['Overnight oats with berries', 'Almond milk', 'Chia seeds']
      },
      {
        type: 'lunch',
        calories: 600,
        items: ['Quinoa salad with vegetables', 'Grilled tofu', 'Tahini dressing']
      },
      {
        type: 'dinner',
        calories: 550,
        items: ['Lentil curry', 'Brown rice', 'Steamed broccoli']
      },
      {
        type: 'snack',
        calories: 250,
        items: ['Apple slices', 'Almond butter', 'Green tea']
      }
    ]
  },
  {
    id: 2,
    user_id: 2,
    daily_calories: 2200,
    protein_g: 110,
    carbs_g: 220,
    fat_g: 80,
    fiber_g: 30,
    meals: [
      {
        type: 'breakfast',
        calories: 500,
        items: ['Scrambled eggs', 'Avocado toast', 'Greek yogurt']
      },
      {
        type: 'lunch',
        calories: 700,
        items: ['Grilled chicken breast', 'Sweet potato', 'Mixed vegetables']
      },
      {
        type: 'dinner',
        calories: 650,
        items: ['Salmon fillet', 'Quinoa', 'Asparagus']
      },
      {
        type: 'snack',
        calories: 350,
        items: ['Protein shake', 'Banana', 'Almonds']
      }
    ]
  }
];

export const mockFoodPreferences = [
  'vegetarian',
  'vegan',
  'gluten-free',
  'dairy-free',
  'low-carb',
  'high-protein',
  'keto',
  'paleo',
  'mediterranean',
  'organic',
  'low-sodium',
  'sugar-free',
  'nut-free',
  'soy-free',
  'halal',
  'kosher'
];

export const mockIngredients = [
  {
    id: 1,
    name: 'Chicken Breast',
    category: 'protein',
    calories_per_100g: 165,
    protein_g: 31,
    carbs_g: 0,
    fat_g: 3.6,
    price_per_kg: 8000
  },
  {
    id: 2,
    name: 'Brown Rice',
    category: 'grain',
    calories_per_100g: 111,
    protein_g: 2.6,
    carbs_g: 23,
    fat_g: 0.9,
    price_per_kg: 2500
  },
  {
    id: 3,
    name: 'Broccoli',
    category: 'vegetable',
    calories_per_100g: 34,
    protein_g: 2.8,
    carbs_g: 7,
    fat_g: 0.4,
    price_per_kg: 3000
  },
  {
    id: 4,
    name: 'Salmon',
    category: 'protein',
    calories_per_100g: 208,
    protein_g: 20,
    carbs_g: 0,
    fat_g: 13,
    price_per_kg: 15000
  },
  {
    id: 5,
    name: 'Quinoa',
    category: 'grain',
    calories_per_100g: 120,
    protein_g: 4.4,
    carbs_g: 22,
    fat_g: 1.9,
    price_per_kg: 8000
  }
];
