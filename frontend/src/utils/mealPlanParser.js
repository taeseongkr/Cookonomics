/**
 * Utility functions for parsing and formatting meal plan data
 */

/**
 * Parse meal plan data from the WebSocket response
 * @param {Object|string} data - The meal plan data from the WebSocket
 * @returns {Object} Parsed meal plan data
 */
export const parseMealPlan = (data) => {
  console.log('Parsing meal plan data:', data);
  
  // If data is already structured (from backend), return as is
  if (typeof data === 'object' && data.meal_plans) {
    console.log('Data already structured with meal_plans');
    return data;
  }

  // If data is an array of meal plans, wrap it
  if (Array.isArray(data)) {
    console.log('Data is array, wrapping in meal_plans');
    return { meal_plans: data };
  }

  // If data is a single meal plan object, wrap it in an array
  if (typeof data === 'object' && data.name && data.cost && data.ingredients) {
    console.log('Data is single meal plan object, wrapping in array');
    return { meal_plans: [data] };
  }

  // If data is a string (markdown format), parse it
  if (typeof data === 'string') {
    console.log('Data is string, parsing as markdown');
    return parseMarkdownMealPlan(data);
  }

  console.error('Invalid meal plan data format:', data);
  throw new Error('Invalid meal plan data format');
};

/**
 * Parse markdown format meal plan (as fallback)
 * @param {string} markdown - Markdown string
 * @returns {Object} Parsed meal plan data
 */
const parseMarkdownMealPlan = (markdown) => {
  const lines = markdown.split('\n');
  const result = {
    meal_plans: [],
    summary: {},
    date_range: '',
    total_budget: 0,
    budget_status: ''
  };

  let currentMeal = null;
  let currentSection = null;

  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.startsWith('## Weekly Meal Plan Summary')) {
      const dateMatch = trimmed.match(/\(([^)]+)\)/);
      if (dateMatch) {
        result.date_range = dateMatch[1];
      }
    } else if (trimmed.startsWith('**Overall Budget:**')) {
      const budgetMatch = trimmed.match(/\$([0-9.]+)/);
      if (budgetMatch) {
        result.total_budget = parseFloat(budgetMatch[1]);
      }
    } else if (trimmed.startsWith('**Budget Status:**')) {
      result.budget_status = trimmed.replace('**Budget Status:**', '').trim();
    } else if (trimmed.match(/^\*\*\d{4}-\d{2}-\d{2}:/)) {
      // Start of a new meal
      if (currentMeal) {
        result.meal_plans.push(currentMeal);
      }
      
      const dateMatch = trimmed.match(/^\*\*(\d{4}-\d{2}-\d{2}):\s*(.+)\*\*/);
      if (dateMatch) {
        currentMeal = {
          date: dateMatch[1],
          name: dateMatch[2],
          ingredients: [],
          instructions: [],
          nutrition: {},
          cost: 0
        };
      }
    } else if (currentMeal) {
      if (trimmed.startsWith('* **Ingredients:**')) {
        currentSection = 'ingredients';
      } else if (trimmed.startsWith('* **Cooking Instructions:**')) {
        currentSection = 'instructions';
      } else if (trimmed.startsWith('* **Nutritional Information')) {
        currentSection = 'nutrition';
      } else if (trimmed.startsWith('* **Estimated Cost:**')) {
        const costMatch = trimmed.match(/\$([0-9.]+)/);
        if (costMatch) {
          currentMeal.cost = parseFloat(costMatch[1]);
        }
      } else if (trimmed.startsWith('*') && currentSection === 'ingredients') {
        const ingredient = trimmed.replace(/^\*\s*/, '').replace(/:\s*/, ': ');
        currentMeal.ingredients.push(ingredient);
      } else if (trimmed.match(/^\d+\./) && currentSection === 'instructions') {
        const instruction = trimmed.replace(/^\d+\.\s*/, '');
        currentMeal.instructions.push(instruction);
      } else if (trimmed.startsWith('*') && currentSection === 'nutrition') {
        const nutritionMatch = trimmed.match(/\*\s*([^:]+):\s*(.+)/);
        if (nutritionMatch) {
          const key = nutritionMatch[1].toLowerCase();
          const value = nutritionMatch[2];
          currentMeal.nutrition[key] = value;
        }
      }
    }
  }

  // Add the last meal
  if (currentMeal) {
    result.meal_plans.push(currentMeal);
  }

  return result;
};

/**
 * Format date for display
 * @param {string} dateString - Date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
};

/**
 * Calculate total cost from meal plans
 * @param {Array} mealPlans - Array of meal plan objects
 * @returns {number} Total cost
 */
export const calculateTotalCost = (mealPlans) => {
  return mealPlans.reduce((total, meal) => {
    return total + (meal.cost || 0);
  }, 0);
};

/**
 * Calculate total nutrition from meal plans
 * @param {Array} mealPlans - Array of meal plan objects
 * @returns {Object} Total nutrition
 */
export const calculateTotalNutrition = (mealPlans) => {
  const totals = {
    protein: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0
  };

  mealPlans.forEach(meal => {
    if (meal.nutrition) {
      // Extract numeric values from nutrition strings
      Object.keys(totals).forEach(key => {
        const value = meal.nutrition[key];
        if (value) {
          const numMatch = value.toString().match(/(\d+\.?\d*)/);
          if (numMatch) {
            totals[key] += parseFloat(numMatch[1]);
          }
        }
      });
    }
  });

  return totals;
};

/**
 * Test function to verify the parser with sample data
 */
export const testMealPlanParser = () => {
  console.log('Testing meal plan parser...');
  
  // Test structured data format
  const structuredData = {
    meal_plans: [
      {
        name: "Korean Bibimbap Bowl",
        date: "2024-01-15",
        cost: 12.50,
        description: "A healthy Korean mixed rice bowl with vegetables and protein",
        image_url: "https://example.com/bibimbap.jpg",
        ingredients: [
          { ingredient: "Rice", quantity: "1", unit: "cup" },
          { ingredient: "Spinach", quantity: "100", unit: "g" },
          { ingredient: "Carrots", quantity: "1", unit: "medium" }
        ],
        instructions: [
          "Cook rice according to package directions",
          "Blanch spinach and season with sesame oil",
          "Julienne carrots and sauté briefly"
        ],
        nutrition: {
          calories: "450",
          protein: "18g",
          carbohydrates: "65g",
          fat: "12g"
        }
      }
    ]
  };
  
  // Test array format
  const arrayData = [
    {
      name: "Korean Kimchi Fried Rice",
      date: "2024-01-16",
      cost: 8.75,
      ingredients: ["Rice", "Kimchi", "Eggs", "Scallions"],
      instructions: ["Heat oil in pan", "Add rice and kimchi", "Scramble eggs"]
    }
  ];
  
  // Test single object format
  const singleObjectData = {
    name: "Korean Bulgogi",
    date: "2024-01-17",
    cost: 15.25,
    ingredients: ["Beef", "Soy sauce", "Garlic", "Pear"],
    instructions: "Marinate beef and grill until cooked"
  };
  
  try {
    console.log('Testing structured data:');
    const result1 = parseMealPlan(structuredData);
    console.log('✓ Structured data parsed successfully:', result1);
    
    console.log('Testing array data:');
    const result2 = parseMealPlan(arrayData);
    console.log('✓ Array data parsed successfully:', result2);
    
    console.log('Testing single object data:');
    const result3 = parseMealPlan(singleObjectData);
    console.log('✓ Single object data parsed successfully:', result3);
    
    return true;
  } catch (error) {
    console.error('✗ Parser test failed:', error);
    return false;
  }
};
