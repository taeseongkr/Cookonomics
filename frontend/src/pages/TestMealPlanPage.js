import React from 'react';
import MealPlanDisplay from '../components/MealPlanDisplay';
import { testMealPlanParser } from '../utils/mealPlanParser';
import { SliderContainer } from '../styles/components/UserInputForm.styles';

// Sample test data to verify the new meal plan display
const sampleMealPlanData = {
  meal_plans: [
    {
      name: "Korean Bibimbap Bowl",
      date: "2024-01-15",
      cost: 12500, // 12,500 KRW
      description: "A healthy Korean mixed rice bowl with colorful vegetables, marinated beef, and a fried egg on top",
      image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
      ingredients: [
        { ingredient: "Cooked rice", quantity: "1", unit: "cup" },
        { ingredient: "Beef bulgogi", quantity: "100", unit: "g" },
        { ingredient: "Spinach", quantity: "50", unit: "g" },
        { ingredient: "Bean sprouts", quantity: "50", unit: "g" },
        { ingredient: "Carrots", quantity: "1", unit: "medium" },
        { ingredient: "Mushrooms", quantity: "3-4", unit: "pieces" },
        { ingredient: "Egg", quantity: "1", unit: "piece" },
        { ingredient: "Sesame oil", quantity: "1", unit: "tbsp" },
        { ingredient: "Gochujang", quantity: "1", unit: "tbsp" }
      ],
      instructions: [
        "Cook rice according to package directions and set aside",
        "Marinate thinly sliced beef in bulgogi sauce for 30 minutes",
        "Blanch spinach in boiling water for 1 minute, drain and season with sesame oil and salt",
        "Blanch bean sprouts for 2 minutes, drain and season",
        "Julienne carrots and sauté briefly until tender-crisp",
        "Sauté mushrooms until golden brown",
        "Cook beef bulgogi in a hot pan until caramelized",
        "Fry egg sunny-side up",
        "Arrange all components over rice in a bowl",
        "Serve with gochujang on the side"
      ],
      nutrition: {
        calories: "520",
        protein: "28g",
        carbohydrates: "65g",
        fat: "15g",
        fiber: "8g"
      }
    },
    {
      name: "Korean Kimchi Fried Rice",
      date: "2024-01-16",
      cost: 8750, // 8,750 KRW
      description: "Spicy and tangy fried rice made with fermented kimchi, perfect for using leftover rice",
      image_url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400",
      ingredients: [
        { ingredient: "Day-old cooked rice", quantity: "2", unit: "cups" },
        { ingredient: "Aged kimchi", quantity: "1", unit: "cup" },
        { ingredient: "Kimchi juice", quantity: "2", unit: "tbsp" },
        { ingredient: "Pork belly or spam", quantity: "100", unit: "g" },
        { ingredient: "Eggs", quantity: "2", unit: "pieces" },
        { ingredient: "Scallions", quantity: "2", unit: "stalks" },
        { ingredient: "Garlic", quantity: "3", unit: "cloves" },
        { ingredient: "Sesame oil", quantity: "1", unit: "tbsp" },
        { ingredient: "Vegetable oil", quantity: "2", unit: "tbsp" }
      ],
      instructions: [
        "Chop kimchi into bite-sized pieces",
        "Cut pork belly into small cubes",
        "Mince garlic and chop scallions",
        "Heat oil in a wok or large pan over high heat",
        "Cook pork belly until crispy",
        "Add garlic and cook until fragrant",
        "Add kimchi and kimchi juice, stir-fry for 2-3 minutes",
        "Add day-old rice, breaking up clumps",
        "Stir-fry everything together for 4-5 minutes",
        "Push rice to one side, scramble eggs on the other side",
        "Mix eggs with rice, add scallions and sesame oil",
        "Serve hot with additional kimchi if desired"
      ],
      nutrition: {
        calories: "445",
        protein: "18g",
        carbohydrates: "52g",
        fat: "18g",
        fiber: "4g"
      }
    },
    {
      name: "Korean Bulgogi Tacos",
      date: "2024-01-17",
      cost: 15250, // 15,250 KRW
      description: "Fusion Korean-Mexican dish with marinated beef bulgogi in soft tortillas",
      image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
      ingredients: [
        { ingredient: "Beef ribeye, thinly sliced", quantity: "200", unit: "g" },
        { ingredient: "Soy sauce", quantity: "3", unit: "tbsp" },
        { ingredient: "Brown sugar", quantity: "2", unit: "tbsp" },
        { ingredient: "Asian pear, grated", quantity: "1/4", unit: "piece" },
        { ingredient: "Garlic", quantity: "4", unit: "cloves" },
        { ingredient: "Ginger", quantity: "1", unit: "tsp" },
        { ingredient: "Sesame oil", quantity: "1", unit: "tbsp" },
        { ingredient: "Small corn tortillas", quantity: "8", unit: "pieces" },
        { ingredient: "Cabbage slaw", quantity: "1", unit: "cup" },
        { ingredient: "Cilantro", quantity: "1/4", unit: "cup" },
        { ingredient: "Lime", quantity: "2", unit: "pieces" }
      ],
      instructions: [
        "Combine soy sauce, brown sugar, grated pear, minced garlic, ginger, and sesame oil for marinade",
        "Marinate sliced beef for at least 2 hours or overnight",
        "Heat a grill pan or skillet over high heat",
        "Cook marinated beef for 2-3 minutes per side until caramelized",
        "Warm tortillas in a dry pan or microwave",
        "Prepare cabbage slaw and chop cilantro",
        "Cut lime into wedges",
        "Fill tortillas with bulgogi beef",
        "Top with cabbage slaw and cilantro",
        "Serve with lime wedges on the side"
      ],
      nutrition: {
        calories: "380",
        protein: "25g",
        carbohydrates: "35g",
        fat: "16g",
        fiber: "5g"
      }
    }
  ]
};

const TestMealPlanPage = () => {
  // Run parser test on component mount
  React.useEffect(() => {
    console.log('Running meal plan parser test...');
    testMealPlanParser();
  }, []);

  return (
    <>
      {/* Full width meal plan display */}
      <div style={{ width: '100%', marginBottom: '30px' }}>
        <MealPlanDisplay data={sampleMealPlanData} />
      </div>
      
      {/* Constrained content below */}
      <SliderContainer>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h1 style={{ color: '#2d3748', marginBottom: '10px' }}>Meal Plan Display Test</h1>
            <p style={{ color: '#718096' }}>Testing the new horizontal calendar-style meal plan layout</p>
          </div>
        
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <h3 style={{ color: '#2d3748', marginBottom: '10px' }}>Features Tested:</h3>
          <ul style={{ color: '#4a5568', textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
            <li>✅ Horizontal scrollable calendar layout</li>
            <li>✅ Beautiful meal cards with image support</li>
            <li>✅ Image fallback to placeholder when URL fails</li>
            <li>✅ Cost display in Korean Won (₩)</li>
            <li>✅ Date badges with proper formatting</li>
            <li>✅ Expandable meal details with react-card-flip</li>
            <li>✅ Ingredient and instruction parsing</li>
            <li>✅ Nutrition information display</li>
            <li>✅ Budget summary calculations</li>
            <li>✅ Weekly nutrition summary</li>
          </ul>
        </div>
      </div>
    </SliderContainer>
    </>
  );
};

export default TestMealPlanPage;
