import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Card = styled.div`
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 50%, #e2e8f0 100%);
  border-radius: 24px;
  box-shadow: 
    0 20px 40px rgba(0,0,0,0.1),
    0 0 0 1px rgba(255,255,255,0.5),
    inset 0 1px 0 rgba(255,255,255,0.9);
  padding: 24px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  animation: ${fadeIn} 1.2s;
  backdrop-filter: blur(20px);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c);
    border-radius: 24px 24px 0 0;
  }
`;

const ScrollableContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0,0,0,0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #764ba2, #667eea);
  }
`;

const StepsButton = styled.button`
  position: absolute;
  bottom: 15px;
  right: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  z-index: 10;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;
const RecipeImage = styled.img`
  width: 100%;
  height: 140px;
  border-radius: 16px;
  margin-bottom: 12px;
  object-fit: cover;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const Title = styled.h2`
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 12px 0;
  text-align: center;
  color: #1a202c;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Section = styled.div`
  margin: 8px 0;
  font-size: 0.9rem;
  color: #4a5568;
  font-weight: 500;
`;
const IngredientList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  list-style: none;
  padding: 0;
  margin: 0;
`;
const IngredientItem = styled.li`
  background: linear-gradient(135deg, #f7fafc, #edf2f7);
  border-radius: 16px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  color: #2d3748;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border: 1px solid rgba(255,255,255,0.8);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  }
`;
const IngredientImg = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  margin-right: 6px;
  object-fit: cover;
`;
const NutritionRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  margin-bottom: 4px;
`;
const StepList = styled.ol`
  margin: 0 0 0 16px;
  padding: 0;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const StepsOnlyCard = styled(Card)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  
  h2 {
    color: white;
    font-size: 1.4rem;
    margin-bottom: 20px;
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }
  
  ol {
    color: rgba(255, 255, 255, 0.95);
    font-size: 1rem;
    line-height: 1.6;
  }
  
  li {
    margin-bottom: 12px;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255,255,255,0.2);
    
    &:last-child {
      border-bottom: none;
    }
  }
`;

const NutritionSummaryCard = ({ recipe, showStepsOnly = false, onToggleSteps, isCenter = false }) => {
  if (!recipe) return null;
  
  if (showStepsOnly) {
    return (
      <StepsOnlyCard>
        {isCenter && onToggleSteps && (
          <StepsButton onClick={onToggleSteps}>
            Back to Details
          </StepsButton>
        )}
        <ScrollableContent>
          <Title>{recipe.title}</Title>
          <Section>
            <strong>Cooking Steps:</strong>
            <StepList>
              {recipe.steps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </StepList>
          </Section>
        </ScrollableContent>
      </StepsOnlyCard>
    );
  }

  return (
    <Card>
      {isCenter && onToggleSteps && (
        <StepsButton onClick={onToggleSteps}>
          Steps
        </StepsButton>
      )}
      <ScrollableContent>
        <RecipeImage src={recipe.image} alt={recipe.title} />
        <Title>{recipe.title}</Title>
        <Section>
          <strong>Budget:</strong> ₩{recipe.budget?.toLocaleString() || 'N/A'}
        </Section>
        <Section>
          <strong>Calories:</strong> {recipe.calories} kcal
        </Section>
        <Section>
          <strong>Nutrition:</strong>
          {recipe.nutrition && (
            <div style={{ marginTop: 6 }}>
              {Object.entries(recipe.nutrition).map(([k, v]) => (
                <NutritionRow key={k}>
                  <span style={{ textTransform: 'capitalize' }}>{k}</span>
                  <span>{v}</span>
                </NutritionRow>
              ))}
            </div>
          )}
        </Section>
        <Section>
          <strong>Ingredients:</strong>
          <IngredientList>
            {recipe.ingredients.map((ing, idx) => (
              <IngredientItem key={idx}>
                <IngredientImg src={ing.image} alt={ing.name} />
                {ing.name} <span style={{ marginLeft: 6, color: '#888' }}>({ing.amount})</span>
              </IngredientItem>
            ))}
          </IngredientList>
        </Section>
      </ScrollableContent>
    </Card>
  );
};

export default NutritionSummaryCard;