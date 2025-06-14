import React from 'react';
import { SliderContainer } from '../styles/components/UserInputForm.styles';
import RecipeCarousel from '../components/RecipeCarousel';

const mockRecipes = [
  {
    title: 'Vibrant Veggie Bowl',
    image: '/images/mock_recipe.jpg',
    calories: 520,
    budget: 8500,
    nutrition: { protein: '18g', carbs: '65g', fat: '20g', fiber: '12g' },
    ingredients: [
      { name: 'Quinoa', amount: '100g', image: '/images/quinoa.jpg' },
      { name: 'Chickpeas', amount: '80g', image: '/images/chickpeas.jpg' },
      { name: 'Spinach', amount: '50g', image: '/images/spinach.jpg' },
      { name: 'Cherry Tomatoes', amount: '40g', image: '/images/tomatoes.jpg' },
      { name: 'Avocado', amount: '1/2', image: '/images/avocado.jpg' },
    ],
    steps: [
      'Cook quinoa according to package instructions.',
      'Roast chickpeas with spices until crispy.',
      'Assemble bowl with spinach, tomatoes, avocado, quinoa, and chickpeas.',
      'Drizzle with olive oil and lemon juice.',
    ],
  },
  {
    title: 'Salmon Power Plate',
    image: '/images/salmon_plate.jpg',
    calories: 610,
    budget: 12000,
    nutrition: { protein: '32g', carbs: '40g', fat: '28g', fiber: '7g' },
    ingredients: [
      { name: 'Salmon Fillet', amount: '120g', image: '/images/salmon.jpg' },
      { name: 'Brown Rice', amount: '100g', image: '/images/brown_rice.jpg' },
      { name: 'Broccoli', amount: '60g', image: '/images/broccoli.jpg' },
      { name: 'Lemon', amount: '1/4', image: '/images/lemon.jpg' },
      { name: 'Olive Oil', amount: '1 tbsp', image: '/images/olive_oil.jpg' },
    ],
    steps: [
      'Grill salmon fillet with lemon and olive oil.',
      'Steam broccoli until tender.',
      'Serve salmon with brown rice and broccoli.',
    ],
  },
  {
    title: 'Tofu Stir-Fry Fiesta',
    image: '/images/tofu_stirfry.jpg',
    calories: 480,
    budget: 7000,
    nutrition: { protein: '22g', carbs: '55g', fat: '15g', fiber: '10g' },
    ingredients: [
      { name: 'Tofu', amount: '100g', image: '/images/tofu.jpg' },
      { name: 'Bell Pepper', amount: '50g', image: '/images/bell_pepper.jpg' },
      { name: 'Carrot', amount: '40g', image: '/images/carrot.jpg' },
      { name: 'Soy Sauce', amount: '2 tbsp', image: '/images/soy_sauce.jpg' },
      { name: 'Rice', amount: '100g', image: '/images/rice.jpg' },
    ],
    steps: [
      'Stir-fry tofu until golden.',
      'Add vegetables and cook until crisp-tender.',
      'Add soy sauce and serve with rice.',
    ],
  },
];

const RecipeShowcase = () => {
  return (
    <SliderContainer>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <RecipeCarousel recipes={mockRecipes} />
      </div>
    </SliderContainer>
  );
};

export default RecipeShowcase;
