import React, { useState } from 'react';
import styled from 'styled-components';
import { formatDate, calculateTotalCost, calculateTotalNutrition } from '../utils/mealPlanParser';

const MealPlanContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  margin: 20px 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 1200px;
  margin: 20px auto;
`;

const MealPlanHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: #4A5568;
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 10px;
`;

const DateRange = styled.p`
  color: #718096;
  font-size: 1.1rem;
  margin-bottom: 20px;
`;

const BudgetInfo = styled.div`
  background: linear-gradient(135deg, #f0fff4, #c6f6d5);
  border: 2px solid #9ae6b4;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 30px;
  text-align: center;
`;

const BudgetAmount = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: #38a169;
  margin-bottom: 5px;
`;

const BudgetStatus = styled.div`
  color: #2d3748;
  font-weight: 600;
`;

const RecipeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const RecipeCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
`;

const RecipeDate = styled.div`
  color: #667eea;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const RecipeName = styled.h3`
  color: #2d3748;
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 15px;
  line-height: 1.3;
`;

const SectionTitle = styled.h4`
  color: #4a5568;
  font-size: 1rem;
  font-weight: 600;
  margin: 15px 0 8px 0;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 5px;
`;

const IngredientsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 15px 0;
`;

const IngredientItem = styled.li`
  color: #718096;
  font-size: 0.9rem;
  margin-bottom: 3px;
  padding-left: 15px;
  position: relative;
  
  &:before {
    content: '•';
    color: #667eea;
    position: absolute;
    left: 0;
  }
`;

const InstructionsList = styled.ol`
  color: #718096;
  font-size: 0.9rem;
  margin: 0 0 15px 0;
  padding-left: 20px;
`;

const InstructionItem = styled.li`
  margin-bottom: 5px;
  line-height: 1.4;
`;

const NutritionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 15px;
`;

const NutritionItem = styled.div`
  background: #f7fafc;
  border-radius: 8px;
  padding: 8px;
  text-align: center;
`;

const NutritionLabel = styled.div`
  color: #4a5568;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const NutritionValue = styled.div`
  color: #2d3748;
  font-size: 1.1rem;
  font-weight: 700;
`;

const CostInfo = styled.div`
  background: linear-gradient(135deg, #ebf8ff, #bee3f8);
  border-radius: 10px;
  padding: 12px;
  text-align: center;
`;

const CostAmount = styled.span`
  color: #3182ce;
  font-weight: 700;
  font-size: 1.1rem;
`;

const ToggleButton = styled.button`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 8px 16px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
`;

const SummarySection = styled.div`
  background: linear-gradient(135deg, #f7fafc, #edf2f7);
  border-radius: 15px;
  padding: 25px;
  margin-top: 30px;
`;

const SummaryTitle = styled.h3`
  color: #2d3748;
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 20px;
  text-align: center;
`;

const MealPlanDisplay = ({ mealPlan }) => {
  const [expandedRecipes, setExpandedRecipes] = useState({});

  if (!mealPlan || mealPlan.error) {
    return (
      <MealPlanContainer>
        <div style={{ textAlign: 'center', color: '#e53e3e' }}>
          <h3>Error Loading Meal Plan</h3>
          <p>{mealPlan?.error || 'Failed to load meal plan data'}</p>
        </div>
      </MealPlanContainer>
    );
  }

  // Handle different data structures
  const mealPlans = mealPlan.meal_plans || mealPlan.recipes || [];
  const dateRange = mealPlan.date_range || mealPlan.dateRange || '';
  const totalBudget = mealPlan.total_budget || mealPlan.budget?.total || 0;
  const budgetStatus = mealPlan.budget_status || mealPlan.budget?.status || '';

  if (mealPlans.length === 0) {
    return (
      <MealPlanContainer>
        <div style={{ textAlign: 'center', color: '#667eea' }}>
          <h3>No Meal Plans Available</h3>
          <p>Meal plan data is being processed...</p>
        </div>
      </MealPlanContainer>
    );
  }

  const toggleRecipeDetails = (index) => {
    setExpandedRecipes(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const totalCost = calculateTotalCost(mealPlans);
  const totalNutrition = calculateTotalNutrition(mealPlans);

  return (
    <MealPlanContainer>
      <MealPlanHeader>
        <Title>Weekly Meal Plan</Title>
        {dateRange && <DateRange>{dateRange}</DateRange>}
        
        <BudgetInfo>
          {totalBudget > 0 && <BudgetAmount>${totalBudget.toFixed(2)}</BudgetAmount>}
          {budgetStatus && <BudgetStatus>{budgetStatus}</BudgetStatus>}
          {totalCost > 0 && (
            <div style={{ marginTop: '10px', fontSize: '0.9rem' }}>
              Actual Cost: <strong>${totalCost.toFixed(2)}</strong>
            </div>
          )}
        </BudgetInfo>
      </MealPlanHeader>

      <RecipeGrid>
        {mealPlans.map((recipe, index) => {
          // Handle different recipe data structures
          const recipeName = recipe.name || recipe.recipe_name || `Recipe ${index + 1}`;
          const recipeDate = recipe.date || recipe.meal_date || '';
          const recipeIngredients = recipe.ingredients || [];
          const recipeInstructions = recipe.instructions || recipe.cooking_instructions || [];
          const recipeNutrition = recipe.nutrition || recipe.nutritional_info || {};
          const recipeCost = typeof recipe.cost === 'number' ? recipe.cost : 
                            recipe.estimated_cost || recipe.total_cost || 0;

          return (
            <RecipeCard key={index}>
              {recipeDate && <RecipeDate>{formatDate(recipeDate)}</RecipeDate>}
              <RecipeName>{recipeName}</RecipeName>
              
              {recipeIngredients.length > 0 && (
                <>
                  <SectionTitle>Ingredients ({recipeIngredients.length})</SectionTitle>
                  <IngredientsList>
                    {recipeIngredients.slice(0, expandedRecipes[index] ? undefined : 3).map((ingredient, i) => (
                      <IngredientItem key={i}>{ingredient}</IngredientItem>
                    ))}
                    {!expandedRecipes[index] && recipeIngredients.length > 3 && (
                      <IngredientItem style={{ color: '#667eea', fontStyle: 'italic' }}>
                        ... and {recipeIngredients.length - 3} more
                      </IngredientItem>
                    )}
                  </IngredientsList>
                </>
              )}

              {expandedRecipes[index] && (
                <>
                  {recipeInstructions.length > 0 && (
                    <>
                      <SectionTitle>Instructions</SectionTitle>
                      <InstructionsList>
                        {recipeInstructions.map((instruction, i) => (
                          <InstructionItem key={i}>{instruction}</InstructionItem>
                        ))}
                      </InstructionsList>
                    </>
                  )}

                  {Object.keys(recipeNutrition).length > 0 && (
                    <>
                      <SectionTitle>Nutrition (Estimated)</SectionTitle>
                      <NutritionGrid>
                        {Object.entries(recipeNutrition).map(([key, value]) => (
                          <NutritionItem key={key}>
                            <NutritionLabel>{key}</NutritionLabel>
                            <NutritionValue>{value}</NutritionValue>
                          </NutritionItem>
                        ))}
                      </NutritionGrid>
                    </>
                  )}
                </>
              )}

              {recipeCost > 0 && (
                <CostInfo>
                  <CostAmount>${recipeCost.toFixed(2)}</CostAmount>
                </CostInfo>
              )}

              <ToggleButton onClick={() => toggleRecipeDetails(index)}>
                {expandedRecipes[index] ? 'Show Less' : 'Show Details'}
              </ToggleButton>
            </RecipeCard>
          );
        })}
      </RecipeGrid>

      {Object.keys(totalNutrition).length > 0 && (
        <SummarySection>
          <SummaryTitle>Weekly Nutrition Summary</SummaryTitle>
          <NutritionGrid>
            {Object.entries(totalNutrition).map(([key, value]) => (
              <NutritionItem key={key}>
                <NutritionLabel>{key}</NutritionLabel>
                <NutritionValue>{value > 0 ? `${value.toFixed(1)}g` : 'N/A'}</NutritionValue>
              </NutritionItem>
            ))}
          </NutritionGrid>
        </SummarySection>
      )}
    </MealPlanContainer>
  );
};

export default MealPlanDisplay;
