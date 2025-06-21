import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaCalendarAlt, FaTrash, FaCamera, FaUtensils, FaClock } from 'react-icons/fa';
import { formatDate } from '../utils/mealPlanParser';

const TabContainer = styled.div`
  background: white;
  border-radius: 25px;
  padding: 30px;
  margin: 20px 0;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  max-width: 1200px;
  margin: 20px auto;
`;

const TabHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e2e8f0;
`;

const TabTitle = styled.h2`
  color: #333;
  font-size: 1.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
`;

const ClearAllButton = styled.button`
  background: linear-gradient(135deg, #fc8181, #e53e3e);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(229, 62, 62, 0.4);
  }
`;

const MealPlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const MealPlanCard = styled.div`
  background: linear-gradient(135deg, ${props => props.bgColor || '#f7fafc'}, ${props => props.bgColorSecondary || '#edf2f7'});
  border-radius: 20px;
  padding: 25px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
    border-color: rgba(102, 126, 234, 0.3);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const CardDate = styled.div`
  color: #667eea;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const DeleteButton = styled.button`
  background: rgba(229, 62, 62, 0.1);
  color: #e53e3e;
  border: none;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(229, 62, 62, 0.2);
    transform: scale(1.1);
  }
`;

const MealsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MealItem = styled.div`
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: translateX(5px);
  }
`;

const MealInfo = styled.div`
  flex: 1;
`;

const MealName = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MealDetails = styled.div`
  display: flex;
  gap: 15px;
  font-size: 0.8rem;
  color: #666;
`;

const MealDetail = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const PhotoButton = styled.button`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 12px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  color: #cbd5e0;
  margin-bottom: 20px;
`;

const EmptyText = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 10px;
`;

const EmptySubtext = styled.div`
  color: #9ca3af;
`;

const MealPlanStorage = ({ onPhotoUpload }) => {
  const [storedMealPlans, setStoredMealPlans] = useState([]);

  useEffect(() => {
    loadStoredMealPlans();
  }, []);

  const loadStoredMealPlans = () => {
    const stored = localStorage.getItem('storedMealPlans');
    if (stored) {
      try {
        setStoredMealPlans(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading stored meal plans:', error);
      }
    }
  };

  const saveMealPlans = (mealPlans) => {
    localStorage.setItem('storedMealPlans', JSON.stringify(mealPlans));
    setStoredMealPlans(mealPlans);
  };

  const deleteMealPlan = (id) => {
    const updated = storedMealPlans.filter(plan => plan.id !== id);
    saveMealPlans(updated);
  };

  const clearAllMealPlans = () => {
    if (window.confirm('Are you sure you want to delete all stored meal plans?')) {
      saveMealPlans([]);
    }
  };

  const getCardColors = (index) => {
    const colors = [
      { bg: '#f0f9ff', bgSecondary: '#e0f2fe' },
      { bg: '#f0fff4', bgSecondary: '#dcfce7' },
      { bg: '#fef7ff', bgSecondary: '#fae8ff' },
      { bg: '#fff7ed', bgSecondary: '#fed7aa' },
      { bg: '#f0f9ff', bgSecondary: '#dbeafe' },
    ];
    return colors[index % colors.length];
  };

  if (storedMealPlans.length === 0) {
    return (
      <TabContainer>
        <TabHeader>
          <TabTitle>
            <FaCalendarAlt />
            My Meal Plans
          </TabTitle>
        </TabHeader>
        
        <EmptyState>
          <EmptyIcon>
            <FaUtensils />
          </EmptyIcon>
          <EmptyText>No meal plans saved yet</EmptyText>
          <EmptySubtext>
            Create your first meal plan to see it here!
          </EmptySubtext>
        </EmptyState>
      </TabContainer>
    );
  }

  return (
    <TabContainer>
      <TabHeader>
        <TabTitle>
          <FaCalendarAlt />
          My Meal Plans ({storedMealPlans.length})
        </TabTitle>
        <ClearAllButton onClick={clearAllMealPlans}>
          <FaTrash />
          Clear All
        </ClearAllButton>
      </TabHeader>

      <MealPlansGrid>
        {storedMealPlans.map((mealPlan, index) => {
          const colors = getCardColors(index);
          
          return (
            <MealPlanCard 
              key={mealPlan.id} 
              bgColor={colors.bg}
              bgColorSecondary={colors.bgSecondary}
            >
              <CardHeader>
                <CardDate>
                  <FaCalendarAlt />
                  {formatDate(mealPlan.createdAt)}
                </CardDate>
                <DeleteButton onClick={() => deleteMealPlan(mealPlan.id)}>
                  <FaTrash />
                </DeleteButton>
              </CardHeader>

              <MealsList>
                {mealPlan.meals?.slice(0, 3).map((meal, mealIndex) => (
                  <MealItem key={mealIndex}>
                    <MealInfo>
                      <MealName>
                        <FaUtensils size={12} />
                        {meal.name || `Meal ${mealIndex + 1}`}
                      </MealName>
                      <MealDetails>
                        {meal.calories && (
                          <MealDetail>
                            🔥 {meal.calories} cal
                          </MealDetail>
                        )}
                        {meal.prepTime && (
                          <MealDetail>
                            <FaClock size={10} />
                            {meal.prepTime}
                          </MealDetail>
                        )}
                      </MealDetails>
                    </MealInfo>
                    <PhotoButton 
                      onClick={() => onPhotoUpload && onPhotoUpload(meal, mealPlan.id)}
                    >
                      <FaCamera />
                      Rate
                    </PhotoButton>
                  </MealItem>
                ))}
                
                {mealPlan.meals?.length > 3 && (
                  <MealItem style={{ opacity: 0.7, fontStyle: 'italic' }}>
                    <MealInfo>
                      <MealName>
                        +{mealPlan.meals.length - 3} more meals...
                      </MealName>
                    </MealInfo>
                  </MealItem>
                )}
              </MealsList>
            </MealPlanCard>
          );
        })}
      </MealPlansGrid>
    </TabContainer>
  );
};

export default MealPlanStorage;
