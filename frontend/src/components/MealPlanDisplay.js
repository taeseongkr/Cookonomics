import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ReactCardFlip from 'react-card-flip';
import { formatDate, calculateTotalCost, calculateTotalNutrition } from '../utils/mealPlanParser';
import ImageUploadModal from './ImageUploadModal';
import CalendarModal from './CalendarModal';
import MealPlanStorage from './MealPlanStorage';

const MealPlanContainer = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 25px;
  padding: 40px;
  margin: 20px 0;
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
  width: 100%;
  max-width: 95vw; /* Use viewport width for full responsiveness */
  margin: 20px auto;
  position: relative;
  overflow: hidden;
  
  /* Ensure minimum width for desktop */
  @media (min-width: 1200px) {
    max-width: 1600px; /* Increased from 1400px */
  }
  
  @media (min-width: 1600px) {
    max-width: 1800px; /* Even wider for large screens */
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.15"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.15"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    pointer-events: none;
  }
`;

const CalendarHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
  position: relative;
  z-index: 2;
`;

const Title = styled.h1`
  color: white;
  font-size: 2.8rem;
  font-weight: 800;
  margin-bottom: 15px;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  margin-bottom: 25px;
  font-weight: 300;
`;

const BudgetSummary = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 20px 30px;
  display: inline-flex;
  align-items: center;
  gap: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const BudgetItem = styled.div`
  text-align: center;
  color: white;
`;

const BudgetLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 5px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const BudgetValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

// Horizontal scrollable calendar container
const CalendarScrollContainer = styled.div`
  position: relative;
  z-index: 2;
  margin-bottom: 30px;
`;

const CalendarGrid = styled.div`
  display: flex;
  gap: 30px; /* Increased gap */
  overflow-x: auto;
  padding: 20px 0;
  scroll-behavior: smooth;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 10px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  }
  
  /* Scroll snap for better UX */
  scroll-snap-type: x mandatory;
  
  /* Responsive gaps */
  @media (max-width: 768px) {
    gap: 20px;
  }
  
  @media (min-width: 768px) {
    gap: 35px; /* Increased from 30px */
  }
  
  /* For larger screens, show more cards with larger gaps */
  @media (min-width: 1200px) {
    gap: 40px; /* Increased from 35px */
  }
  
  @media (min-width: 1600px) {
    gap: 45px; /* Even larger gap for very wide screens */
  }
`;

const MealCard = styled.div`
  /* Simplified card container for react-card-flip */
  flex: 0 0 auto;
  scroll-snap-align: start;
  
  /* Responsive card sizing - increased sizes */
  width: 320px; /* Increased from 300px */
  min-width: 300px; /* Increased from 280px */
  height: 540px; /* Increased from 520px */
  
  @media (min-width: 768px) {
    width: 380px; /* Increased from 350px */
    min-width: 360px; /* Increased from 330px */
    height: 560px; /* Increased from 540px */
  }
  
  @media (min-width: 1200px) {
    width: 420px; /* Increased from 380px */
    min-width: 400px; /* Increased from 360px */
    height: 580px; /* Increased from 560px */
  }
  
  @media (min-width: 1600px) {
    width: 450px; /* New breakpoint for very wide screens */
    min-width: 430px;
    height: 600px;
  }
  
  /* Add hover effect to the entire card */
  &:hover {
    transform: scale(1.02);
    filter: drop-shadow(0 10px 20px rgba(102, 126, 234, 0.2));
    transition: all 0.3s ease;
  }
`;

const CardFace = styled.div`
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.8);
  transition: all 0.4s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  
  &:hover {
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
    transform: translateY(-3px);
  }
`;

const CardFront = styled(CardFace)`
  /* Front of the card (normal state) */
`;

const CardBack = styled(CardFace)`
  /* Back of the card (flipped state) */
  background: rgba(248, 250, 252, 0.98);
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  
  /* Custom scrollbar for back of card */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(102, 126, 234, 0.3);
    border-radius: 3px;
    
    &:hover {
      background: rgba(102, 126, 234, 0.5);
    }
  }
`;

const MealImageContainer = styled.div`
  position: relative;
  height: 240px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
  border-radius: 20px 20px 0 0;
`;

const MealImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
  border-radius: 20px 20px 0 0;
  
  ${MealCard}:hover & {
    transform: scale(1.05);
  }
`;

const MealImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #4a5568;
  text-align: center;
  padding: 20px;
  border-radius: 20px 20px 0 0;
`;

const PlaceholderIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 15px;
  opacity: 0.6;
  filter: grayscale(0.3);
`;

const PlaceholderText = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  opacity: 0.8;
  line-height: 1.4;
  max-width: 200px;
`;

const DateBadge = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  color: #2d3748;
  padding: 8px 14px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.8);
`;

const CostBadge = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #48bb78, #38a169);
  color: white;
  padding: 10px 16px;
  border-radius: 25px;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: 0 4px 15px rgba(72, 187, 120, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const MealContent = styled.div`
  padding: 24px;
  background: white;
  border-radius: 0 0 20px 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const MealName = styled.h3`
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1.3;
  letter-spacing: -0.01em;
`;

const MealDescription = styled.p`
  color: #718096;
  font-size: 1rem;
  margin-bottom: 20px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
`;

const IngredientPreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const IngredientChip = styled.span`
  background: #f7fafc;
  color: #4a5568;
  padding: 8px 14px;
  border-radius: 25px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  
  &:hover {
    background: #edf2f7;
    border-color: #cbd5e0;
    transform: translateY(-1px);
  }
`;

const MoreIngredients = styled.span`
  color: #667eea;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 8px 14px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 25px;
  border: 1px solid rgba(102, 126, 234, 0.2);
`;

const ExpandButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 14px 20px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  
  &::before {
    content: '🔄';
    transition: transform 0.3s ease;
  }
  
  &:hover {
    background: linear-gradient(135deg, #5a67d8, #6b46c1);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    
    &::before {
      transform: rotateY(180deg);
    }
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const RatingButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 14px 20px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  
  &:hover {
    background: linear-gradient(135deg, #ed8936, #dd6b20);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(237, 137, 54, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const Section = styled.div`
  margin-bottom: 20px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h4`
  color: #2d3748;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: '•';
    color: #667eea;
    font-weight: bold;
  }
`;

const IngredientsList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const IngredientItem = styled.li`
  color: #4a5568;
  font-size: 0.9rem;
  margin-bottom: 6px;
  padding-left: 15px;
  position: relative;
  
  &::before {
    content: '✓';
    color: #48bb78;
    position: absolute;
    left: 0;
    font-weight: bold;
  }
`;

const InstructionsList = styled.ol`
  margin: 0;
  padding-left: 20px;
`;

const InstructionItem = styled.li`
  color: #4a5568;
  font-size: 0.9rem;
  margin-bottom: 8px;
  line-height: 1.4;
`;

const NutritionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 10px;
`;

const NutritionItem = styled.div`
  background: white;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const NutritionLabel = styled.div`
  font-size: 0.8rem;
  color: #718096;
  text-transform: capitalize;
`;

const NutritionValue = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #2d3748;
`;

const SummarySection = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 30px;
  margin-top: 40px;
  position: relative;
  z-index: 2;
`;

const SummaryTitle = styled.h3`
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  text-align: center;
`;

const WeeklySummary = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const SummaryCard = styled.div`
  background: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 15px;
  text-align: center;
  color: white;
`;

const SummaryCardLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 5px;
`;

const SummaryCardValue = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
`;

const ClearDataButton = styled.button`
  background: linear-gradient(135deg, #f56565, #e53e3e);
  color: white;
  border: none;
  border-radius: 15px;
  padding: 8px 16px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #e53e3e, #c53030);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(229, 62, 62, 0.4);
  }
`;

const SavedDataNotice = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 10px 15px;
  margin-bottom: 20px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
`;

// New styled components for the features
const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin: 20px 0;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }

  &.calendar {
    background: linear-gradient(135deg, #48bb78, #38a169);
    
    &:hover {
      box-shadow: 0 6px 16px rgba(72, 187, 120, 0.4);
    }
  }

  &.storage {
    background: linear-gradient(135deg, #ed8936, #dd6b20);
    
    &:hover {
      box-shadow: 0 6px 16px rgba(237, 137, 54, 0.4);
    }
  }

  &.save {
    background: linear-gradient(135deg, #9f7aea, #805ad5);
    
    &:hover {
      box-shadow: 0 6px 16px rgba(159, 122, 234, 0.4);
    }
  }
`;


const TabContainer = styled.div`
  display: ${props => props.show ? 'block' : 'none'};
  margin-top: 30px;
`;

// Helper function to format dates for badges
const formatDateForBadge = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    }).toUpperCase();
  } catch (error) {
    return dateString;
  }
};

const MealPlanDisplay = ({ data }) => {
  const [isUsingStoredData, setIsUsingStoredData] = useState(false);

  // Save meal plan data to localStorage when it changes
  useEffect(() => {
    if (data && data.meal_plans && data.meal_plans.length > 0) {
      localStorage.setItem('lastMealPlan', JSON.stringify(data));
      localStorage.setItem('lastMealPlanDate', new Date().toISOString());
      setIsUsingStoredData(false);
    }
  }, [data]);

  const clearStoredData = () => {
    localStorage.removeItem('lastMealPlan');
    localStorage.removeItem('lastMealPlanDate');
    window.location.reload(); // Refresh to show empty state
  };

  if (!data || !data.meal_plans || !Array.isArray(data.meal_plans)) {
    // Try to load from localStorage
    const savedMealPlan = localStorage.getItem('lastMealPlan');
    const savedDate = localStorage.getItem('lastMealPlanDate');
    
    if (savedMealPlan) {
      try {
        const parsed = JSON.parse(savedMealPlan);
        if (parsed && parsed.meal_plans && parsed.meal_plans.length > 0) {
          // Create a modified component call with stored data indication
          return (
            <MealPlanContainer>
              <SavedDataNotice>
                📅 Showing saved meal plan from {savedDate ? new Date(savedDate).toLocaleDateString() : 'previous session'}
                <br />
                <ClearDataButton onClick={clearStoredData}>Clear Saved Data</ClearDataButton>
              </SavedDataNotice>
              <MealPlanDisplayContent data={parsed} isStored={true} />
            </MealPlanContainer>
          );
        }
      } catch (error) {
        console.error('Error loading saved meal plan:', error);
      }
    }
    
    return (
      <MealPlanContainer>
        <CalendarHeader>
          <Title>No Meal Plan Available</Title>
          <Subtitle>Generate a meal plan to see your weekly calendar</Subtitle>
        </CalendarHeader>
      </MealPlanContainer>
    );
  }

  return <MealPlanDisplayContent data={data} isStored={isUsingStoredData} />;
};

const MealPlanDisplayContent = ({ data, isStored = false }) => {
  const [expandedMeals, setExpandedMeals] = useState({});
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showStorage, setShowStorage] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [selectedMealId, setSelectedMealId] = useState(null);

  const { meal_plans: mealPlans } = data;
  const totalCost = calculateTotalCost(mealPlans);
  const totalNutrition = calculateTotalNutrition(mealPlans);

  const toggleMealDetails = (index) => {
    setExpandedMeals(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Process ingredients helper function
  const processIngredients = (ingredients) => {
    if (!ingredients) return [];
    
    if (Array.isArray(ingredients)) {
      return ingredients.map(ing => {
        if (typeof ing === 'string') return ing;
        if (typeof ing === 'object' && ing.ingredient) {
          return `${ing.ingredient}: ${ing.quantity}${ing.unit ? ' ' + ing.unit : ''}`;
        }
        return String(ing);
      });
    }
    
    if (typeof ingredients === 'string') {
      return ingredients.split('\n').filter(ing => ing.trim());
    }
    
    return [];
  };

  // Process instructions helper function
  const processInstructions = (instructions) => {
    if (!instructions) return [];
    
    if (Array.isArray(instructions)) {
      return instructions;
    }
    
    if (typeof instructions === 'string') {
      return instructions
        .split('\n')
        .filter(step => step.trim())
        .map(step => step.replace(/^Step \d+:\s*/, '').trim());
    }
    
    return [];
  };

  // Handler functions for new features
  const handlePhotoUpload = (meal, mealId) => {
    setSelectedMeal(meal);
    setSelectedMealId(mealId);
    setShowImageUpload(true);
  };

  const handleAddToCalendar = () => {
    setShowCalendar(true);
  };

  const handleShowStorage = () => {
    setShowStorage(true);
  };

  const handleSaveMealPlan = () => {
    // Save meal plan to localStorage directly
    const storedMealPlans = JSON.parse(localStorage.getItem('storedMealPlans') || '[]');
    const newMealPlan = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      meals: mealPlans.map(meal => ({
        name: meal.name || meal.recipe_name || 'Untitled Meal',
        description: meal.description || '',
        calories: meal.nutrition?.calories || null,
        prepTime: meal.prep_time || meal.cooking_time || null,
        ingredients: processIngredients(meal.ingredients),
        instructions: processInstructions(meal.instructions || meal.cooking_instructions)
      }))
    };
    
    const updatedPlans = [newMealPlan, ...storedMealPlans];
    localStorage.setItem('storedMealPlans', JSON.stringify(updatedPlans));
    
    // Show success message
    alert('Meal plan saved successfully!');
  };

  // Generate date display text
  const getDateDisplayText = () => {
    if (mealPlans.length === 0) return '';
    
    const dates = mealPlans
      .map(meal => meal.date)
      .filter(date => date)
      .sort();
    
    if (dates.length === 0) return 'Your Weekly Meal Plan';
    
    const startDate = new Date(dates[0]);
    const endDate = new Date(dates[dates.length - 1]);
    
    if (dates.length === 1) {
      return `Meal Plan for ${formatDate(dates[0])}`;
    }
    
    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  };

  return (
    <MealPlanContainer>
      <CalendarHeader>
        <Title>🍽️ Your Meal Calendar</Title>
        <Subtitle>{getDateDisplayText()}</Subtitle>
        
        {totalCost > 0 && (
          <BudgetSummary>
            <BudgetItem>
              <BudgetLabel>Total Cost</BudgetLabel>
              <BudgetValue>₩{totalCost.toLocaleString()}</BudgetValue>
            </BudgetItem>
            <BudgetItem>
              <BudgetLabel>Meals</BudgetLabel>
              <BudgetValue>{mealPlans.length}</BudgetValue>
            </BudgetItem>
            <BudgetItem>
              <BudgetLabel>Avg per Meal</BudgetLabel>
              <BudgetValue>₩{(totalCost / mealPlans.length).toLocaleString(undefined, { maximumFractionDigits: 0 })}</BudgetValue>
            </BudgetItem>
          </BudgetSummary>
        )}
      </CalendarHeader>

      {/* Action buttons for new features */}
      <ActionButtonsContainer>
        <ActionButton onClick={handleAddToCalendar} className="calendar">
          📅 Add to Calendar
        </ActionButton>
        <ActionButton onClick={handleSaveMealPlan} className="save">
          💾 Save Meal Plan
        </ActionButton>
        <ActionButton onClick={handleShowStorage} className="storage">
          📚 My Saved Plans
        </ActionButton>
      </ActionButtonsContainer>

      <CalendarScrollContainer>
        <CalendarGrid>
          {mealPlans.map((meal, index) => {
            const mealName = meal.name || meal.recipe_name || `Recipe ${index + 1}`;
            const mealDate = meal.date || meal.meal_date || '';
            const mealCost = typeof meal.cost === 'number' ? meal.cost : 
                            meal.estimated_cost || meal.total_cost || 0;
            const mealDescription = meal.description || '';
            const mealImageUrl = meal.image_url || meal.imageUrl || null;
            
            const ingredients = processIngredients(meal.ingredients);
            const instructions = processInstructions(meal.instructions || meal.cooking_instructions);
            const nutrition = meal.nutrition || meal.nutritional_info || {};
            
            const isExpanded = expandedMeals[index];

            return (
              <MealCard key={index}>
                <ReactCardFlip 
                  isFlipped={isExpanded}
                  flipDirection="horizontal"
                  flipSpeedBackToFront={0.8}
                  flipSpeedFrontToBack={0.8}
                  containerStyle={{ 
                    width: '100%', 
                    height: '100%',
                    cursor: 'pointer'
                  }}
                >
                  {/* Front of the card */}
                  <CardFront onClick={() => toggleMealDetails(index)}>
                    <MealImageContainer>
                      {mealImageUrl ? (
                        <MealImage 
                          src={mealImageUrl} 
                          alt={mealName}
                          onError={(e) => {
                            // If image fails to load, hide it and show placeholder
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      
                      <MealImagePlaceholder style={{ display: mealImageUrl ? 'none' : 'flex' }}>
                        <PlaceholderIcon>🍽️</PlaceholderIcon>
                        <PlaceholderText>{mealName}</PlaceholderText>
                      </MealImagePlaceholder>
                      
                      <DateBadge>
                        {mealDate ? formatDateForBadge(mealDate) : `DAY ${index + 1}`}
                      </DateBadge>
                      
                      {mealCost > 0 && (
                        <CostBadge>₩{mealCost.toLocaleString()}</CostBadge>
                      )}
                    </MealImageContainer>

                    <MealContent>
                      <MealName>{mealName}</MealName>
                      
                      {mealDescription && (
                        <MealDescription>{mealDescription}</MealDescription>
                      )}

                      {ingredients.length > 0 && (
                        <IngredientPreview>
                          {ingredients.slice(0, 3).map((ingredient, i) => (
                            <IngredientChip key={i}>{ingredient}</IngredientChip>
                          ))}
                          {ingredients.length > 3 && (
                            <MoreIngredients>
                              +{ingredients.length - 3} more
                            </MoreIngredients>
                          )}
                        </IngredientPreview>
                      )}

                      <ExpandButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMealDetails(index);
                        }}
                      >
                        Click to flip & see details
                      </ExpandButton>
                      
                      <RatingButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePhotoUpload(
                            { name: mealName, description: mealDescription }, 
                            index + 1
                          );
                        }}
                      >
                        �‍🍳 Rate My Cooking Skills!
                      </RatingButton>
                    </MealContent>
                  </CardFront>

                  {/* Back of the card */}
                  <CardBack onClick={() => toggleMealDetails(index)}>
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '20px' }}>
                      <div style={{ textAlign: 'center', borderBottom: '2px solid #667eea', paddingBottom: '15px' }}>
                        <h3 style={{ color: '#2d3748', fontSize: '1.3rem', margin: '0 0 5px 0' }}>{mealName}</h3>
                        {mealCost > 0 && (
                          <div style={{ color: '#48bb78', fontSize: '1.1rem', fontWeight: 'bold' }}>
                            ₩{mealCost.toLocaleString()}
                          </div>
                        )}
                      </div>

                      {ingredients.length > 0 && (
                        <Section>
                          <SectionTitle>Ingredients ({ingredients.length})</SectionTitle>
                          <IngredientsList>
                            {ingredients.map((ingredient, i) => (
                              <IngredientItem key={i}>{ingredient}</IngredientItem>
                            ))}
                          </IngredientsList>
                        </Section>
                      )}

                      {instructions.length > 0 && (
                        <Section>
                          <SectionTitle>Instructions</SectionTitle>
                          <InstructionsList>
                            {instructions.map((instruction, i) => (
                              <InstructionItem key={i}>{instruction}</InstructionItem>
                            ))}
                          </InstructionsList>
                        </Section>
                      )}

                      {Object.keys(nutrition).length > 0 && (
                        <Section>
                          <SectionTitle>Nutrition Info</SectionTitle>
                          <NutritionGrid>
                            {Object.entries(nutrition).map(([key, value]) => (
                              <NutritionItem key={key}>
                                <NutritionLabel>{key}</NutritionLabel>
                                <NutritionValue>{value}</NutritionValue>
                              </NutritionItem>
                            ))}
                          </NutritionGrid>
                        </Section>
                      )}

                      <div style={{ marginTop: 'auto', textAlign: 'center', paddingTop: '15px', borderTop: '1px solid #e2e8f0' }}>
                        <ExpandButton 
                          style={{ background: 'linear-gradient(135deg, #764ba2, #667eea)' }}
                          onClick={() => toggleMealDetails(index)}
                        >
                          🔄 Click to flip back
                        </ExpandButton>
                      </div>
                    </div>
                  </CardBack>
                </ReactCardFlip>
              </MealCard>
            );
          })}
        </CalendarGrid>
      </CalendarScrollContainer>

      {Object.keys(totalNutrition).length > 0 && (
        <SummarySection>
          <SummaryTitle>📊 Weekly Nutrition Summary</SummaryTitle>
          <WeeklySummary>
            {Object.entries(totalNutrition).map(([key, value]) => (
              <SummaryCard key={key}>
                <SummaryCardLabel>{key.charAt(0).toUpperCase() + key.slice(1)}</SummaryCardLabel>
                <SummaryCardValue>
                  {value > 0 ? `${value.toFixed(1)}${key === 'calories' ? '' : 'g'}` : 'N/A'}
                </SummaryCardValue>
              </SummaryCard>
            ))}
          </WeeklySummary>
        </SummarySection>
      )}

      {/* Storage Tab */}
      <TabContainer show={showStorage}>
        <MealPlanStorage 
          onPhotoUpload={handlePhotoUpload}
        />
      </TabContainer>

      {/* Modals */}
      <ImageUploadModal
        isOpen={showImageUpload}
        onClose={() => setShowImageUpload(false)}
        mealPlanId={selectedMealId}
        recipeName={selectedMeal?.name || 'this recipe'}
      />

      <CalendarModal
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
        mealPlan={{ meals: mealPlans }}
      />
    </MealPlanContainer>
  );
};

export default MealPlanDisplay;
