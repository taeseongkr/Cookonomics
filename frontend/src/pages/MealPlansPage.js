import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ReactCardFlip from 'react-card-flip';
import { FaSpinner, FaCheck, FaTimes, FaPlus, FaUtensils } from 'react-icons/fa';
import { useWorkflowWebSocket } from '../hooks/useWorkflowWebSocket';
import { 
  getUserWorkflows, 
  getWorkflowWithMealPlans, 
  createWorkflowForExistingProfile,
  getUserProfiles
} from '../utils/api';
import ImageUploadModal from '../components/ImageUploadModal';
import MealPlanDisplay from '../components/MealPlanDisplay';

const MealPlansContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #2d3748;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
`;

const CreateButton = styled.button`
  background: linear-gradient(135deg, #7DD3C0, #5AB5A1);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(125, 211, 192, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const WorkflowCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  border: 1px solid #e2e8f0;
`;

const WorkflowHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
`;

const WorkflowTitle = styled.h3`
  color: #2d3748;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
`;

const WorkflowStatus = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'completed': return '#c6f6d5';
      case 'in_progress': return '#fed7d7';
      case 'pending': return '#feebc8';
      default: return '#e2e8f0';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'completed': return '#22543d';
      case 'in_progress': return '#742a2a';
      case 'pending': return '#744210';
      default: return '#2d3748';
    }
  }};
`;

const WorkflowInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const InfoItem = styled.div`
  background: #f7fafc;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
`;

const InfoLabel = styled.div`
  font-size: 0.9rem;
  color: #718096;
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.div`
  font-size: 1.1rem;
  color:rgb(87, 96, 111);
  font-weight: 600;
`;

// Enhanced meal plan card styles matching the Korean Bibimbap design
const MealPlansGrid = styled.div`
  display: flex;
  gap: 30px;
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
    background: rgba(125, 211, 192, 0.5);
    border-radius: 10px;
    
    &:hover {
      background: rgba(125, 211, 192, 0.7);
    }
  }
  
  /* Scroll snap for better UX */
  scroll-snap-type: x mandatory;
  
  @media (max-width: 768px) {
    gap: 20px;
  }
`;

const MealPlanCard = styled.div`
  flex: 0 0 auto;
  scroll-snap-align: start;
  width: 380px;
  min-width: 360px;
  height: 600px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.8);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    width: 320px;
    min-width: 300px;
    height: 560px;
  }
`;

const MealImageContainer = styled.div`
  position: relative;
  height: 240px;
  background: linear-gradient(135deg, #7DD3C0 0%, #5AB5A1 100%);
  overflow: hidden;
`;

const MealImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
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
`;

const PlaceholderIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 15px;
  opacity: 0.6;
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
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const MealPlanTitle = styled.h3`
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
`;

const MoreIngredients = styled.span`
  color: #7DD3C0;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 8px 14px;
  background: rgba(125, 211, 192, 0.1);
  border-radius: 25px;
  border: 1px solid rgba(125, 211, 192, 0.2);
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #7DD3C0, #5AB5A1);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 14px 20px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 12px;
  
  &.rating {
    background: linear-gradient(135deg, #667eea, #764ba2);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #7DD3C0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #4a5568;
`;

const WebSocketStatus = styled.div`
  background: ${props => props.connected ? '#c6f6d5' : '#fed7d7'};
  color: ${props => props.connected ? '#22543d' : '#742a2a'};
  padding: 0.75rem 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
`;

const InstructionList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  counter-reset: step-counter;
`;

const InstructionStep = styled.li`
  background: white;
  margin: 8px 0;
  padding: 12px 16px;
  border-radius: 10px;
  border-left: 3px solid #667eea;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: relative;
  counter-increment: step-counter;
  
  &:before {
    content: counter(step-counter);
    position: absolute;
    left: -15px;
    top: 50%;
    transform: translateY(-50%);
    background: #667eea;
    color: white;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 700;
  }
`;

const MealPlansPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [creatingWorkflow, setCreatingWorkflow] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedMealPlan, setSelectedMealPlan] = useState(null);
  const [flippedCards, setFlippedCards] = useState({});

  // Handle incoming state from navigation
  const { newWorkflow, sessionId, workflowData } = location.state || {};

  // WebSocket hook for real-time updates
  const { 
    isConnected, 
    mealPlan,
    workflowStatus,
    isLoading: wsLoading
  } = useWorkflowWebSocket(sessionId);

  useEffect(() => {
    initializePage();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Handle incoming workflow data from navigation
    if (workflowData) {
      setSelectedWorkflow(workflowData);
      setLoading(false);
    } else if (newWorkflow && !selectedWorkflow) {
      // This is a new workflow being created
      console.log('New workflow received:', newWorkflow);
    }
  }, [workflowData, newWorkflow, selectedWorkflow]);

  useEffect(() => {
    // Handle WebSocket meal plan data
    if (mealPlan) {
      console.log('Received parsed meal plan data via WebSocket:', mealPlan);
    }
  }, [mealPlan]);

  const initializePage = async () => {
    try {
      // Load all user workflows
      const userWorkflows = await getUserWorkflows();
      console.log('Loaded user workflows:', userWorkflows);

      // If no specific workflow data was passed, show the most recent one
      if (!workflowData && !newWorkflow && userWorkflows && userWorkflows.length > 0) {
        const latestWorkflow = userWorkflows[userWorkflows.length - 1];
        const workflowDetails = await getWorkflowWithMealPlans(latestWorkflow.id);
        setSelectedWorkflow(workflowDetails);
      }
    } catch (error) {
      console.error('Error initializing meal plans page:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewWorkflow = async () => {
    try {
      setCreatingWorkflow(true);
      
      // Get user profiles
      const profiles = await getUserProfiles();
      if (!profiles || profiles.length === 0) {
        navigate('/form');
        return;
      }

      const latestProfile = profiles[profiles.length - 1];
      
      const workflowData = {
        budget: 100,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
      
      const workflowResult = await createWorkflowForExistingProfile(latestProfile.id, workflowData);
      
      console.log('Created new workflow:', workflowResult);
      
      // Navigate to show the new workflow execution
      navigate('/meal-plans', { 
        state: { 
          newWorkflow: workflowResult,
          sessionId: workflowResult.execution?.websocket_session_id 
        },
        replace: true
      });
    } catch (error) {
      console.error('Error creating new workflow:', error);
      alert('Failed to create new workflow. Please try again.');
    } finally {
      setCreatingWorkflow(false);
    }
  };

  const handleImageUpload = (mealPlan) => {
    setSelectedMealPlan(mealPlan);
    setShowImageModal(true);
  };

  const handleCardFlip = (mealId) => {
    setFlippedCards(prev => ({
      ...prev,
      [mealId]: !prev[mealId]
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && !sessionId) {
    return (
      <MealPlansContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <p>Loading your meal plans...</p>
        </LoadingContainer>
      </MealPlansContainer>
    );
  }

  return (
    <MealPlansContainer>
      <Header>
        <Title>Meal Plans</Title>
        <CreateButton 
          onClick={handleCreateNewWorkflow}
          disabled={creatingWorkflow}
        >
          {creatingWorkflow ? (
            <>
              <FaSpinner className="spinner" />
              Creating...
            </>
          ) : (
            <>
              <FaPlus />
              Create New Plan
            </>
          )}
        </CreateButton>
      </Header>

      {sessionId && (
        <WebSocketStatus connected={isConnected}>
          {isConnected ? <FaCheck /> : <FaTimes />}
          {isConnected ? `Real-time updates active - Status: ${workflowStatus}` : 'Connecting to meal plan generator...'}
          {mealPlan && <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
            ✅ Meal plan data received and parsed
          </div>}
        </WebSocketStatus>
      )}

      {selectedWorkflow ? (
        <WorkflowCard>
          <WorkflowHeader>
            <WorkflowTitle>
              Meal Plan {selectedWorkflow.id} - ${selectedWorkflow.budget}
            </WorkflowTitle>
            <WorkflowStatus status={selectedWorkflow.status}>
              {selectedWorkflow.status}
            </WorkflowStatus>
          </WorkflowHeader>

          <WorkflowInfo>
            <InfoItem>
              <InfoLabel>Date Range</InfoLabel>
              <InfoValue>
                {formatDate(selectedWorkflow.start_date)} - {formatDate(selectedWorkflow.end_date)}
              </InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Budget</InfoLabel>
              <InfoValue>${selectedWorkflow.budget}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Meal Plans</InfoLabel>
              <InfoValue>{selectedWorkflow.meal_plans?.length || 0}</InfoValue>
            </InfoItem>
          </WorkflowInfo>

          {/* Show WebSocket meal plan data if available */}
          {mealPlan ? (
            <MealPlanDisplay data={mealPlan} />
          ) : selectedWorkflow.meal_plans && selectedWorkflow.meal_plans.length > 0 ? (
            <MealPlansGrid>
              {selectedWorkflow.meal_plans.map((meal, index) => {
                const mealName = meal.meal_name || meal.name || `Recipe ${index + 1}`;
                const mealDate = meal.date || meal.meal_date || '';
                const mealCost = typeof meal.cost === 'number' ? meal.cost : 
                               meal.estimated_cost || meal.total_cost || 0;
                const mealDescription = meal.description || '';
                const mealImageUrl = meal.image_url || meal.imageUrl || null;
                
                // Process ingredients for preview
                const ingredients = meal.ingredients ? 
                  (Array.isArray(meal.ingredients) ? meal.ingredients : 
                   typeof meal.ingredients === 'string' ? meal.ingredients.split('\n').filter(ing => ing.trim()) : 
                   []) : [];

                const formatDateForBadge = (dateString) => {
                  if (!dateString) return `DAY ${index + 1}`;
                  try {
                    const date = new Date(dateString);
                    return date.toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    }).toUpperCase();
                  } catch (error) {
                    return `DAY ${index + 1}`;
                  }
                };

                return (
                  <ReactCardFlip 
                    key={meal.id || index}
                    isFlipped={flippedCards[meal.id || index] || false}
                    flipDirection="horizontal"
                  >
                    {/* Front of Card */}
                    <MealPlanCard onClick={() => handleCardFlip(meal.id || index)}>
                      <MealImageContainer>
                        {mealImageUrl ? (
                          <MealImage 
                            src={mealImageUrl} 
                            alt={mealName}
                            onError={(e) => {
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
                          {formatDateForBadge(mealDate)}
                        </DateBadge>
                        
                        {mealCost > 0 && (
                          <CostBadge>${mealCost.toFixed(2)}</CostBadge>
                        )}
                      </MealImageContainer>

                      <MealContent>
                        <MealPlanTitle>{mealName}</MealPlanTitle>
                        
                        {mealDescription && (
                          <MealDescription>{mealDescription}</MealDescription>
                        )}

                        {ingredients.length > 0 && (
                          <IngredientPreview>
                            {ingredients.slice(0, 3).map((ingredient, i) => (
                              <IngredientChip key={i}>
                                {typeof ingredient === 'string' ? ingredient : 
                                 typeof ingredient === 'object' && ingredient.ingredient ? 
                                 `${ingredient.ingredient}: ${ingredient.quantity}${ingredient.unit ? ' ' + ingredient.unit : ''}` :
                                 String(ingredient)}
                              </IngredientChip>
                            ))}
                            {ingredients.length > 3 && (
                              <MoreIngredients>
                                +{ingredients.length - 3} more
                              </MoreIngredients>
                            )}
                          </IngredientPreview>
                        )}
                        
                        <ActionButton 
                          className="rating"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageUpload(meal);
                          }}
                        >
                          👨‍🍳 Rate My Cooking Skills!
                        </ActionButton>
                      </MealContent>
                    </MealPlanCard>

                    {/* Back of Card */}
                    <MealPlanCard onClick={() => handleCardFlip(meal.id || index)}>
                      <MealContent style={{ padding: '24px', height: '100%' }}>
                        <MealPlanTitle style={{ marginBottom: '20px' }}>
                          {mealName} - Details
                        </MealPlanTitle>
                        
                        {meal.instructions && (
                          <div style={{ marginBottom: '20px' }}>
                            <h4 style={{ color: '#2d3748', marginBottom: '10px' }}>Instructions:</h4>
                            <InstructionList>
                              {meal.instructions.split(/\d+\.|\n/).filter(step => step.trim()).map((step, i) => (
                                <InstructionStep key={i}>
                                  {step.trim()}
                                </InstructionStep>
                              ))}
                            </InstructionList>
                          </div>
                        )}

                        {ingredients.length > 0 && (
                          <div style={{ marginBottom: '20px' }}>
                            <h4 style={{ color: '#2d3748', marginBottom: '10px' }}>All Ingredients:</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                              {ingredients.map((ingredient, i) => (
                                <IngredientChip key={i} style={{ fontSize: '0.8rem' }}>
                                  {typeof ingredient === 'string' ? ingredient : 
                                   typeof ingredient === 'object' && ingredient.ingredient ? 
                                   `${ingredient.ingredient}: ${ingredient.quantity}${ingredient.unit ? ' ' + ingredient.unit : ''}` :
                                   String(ingredient)}
                                </IngredientChip>
                              ))}
                            </div>
                          </div>
                        )}

                        {meal.nutrition && (
                          <div style={{ marginBottom: '20px' }}>
                            <h4 style={{ color: '#2d3748', marginBottom: '10px' }}>Nutrition:</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                              {meal.nutrition.calories && (
                                <div style={{ background: '#f7fafc', padding: '8px', borderRadius: '8px', fontSize: '0.9rem' }}>
                                  <strong>Calories:</strong> {meal.nutrition.calories}
                                </div>
                              )}
                              {meal.nutrition.protein && (
                                <div style={{ background: '#f7fafc', padding: '8px', borderRadius: '8px', fontSize: '0.9rem' }}>
                                  <strong>Protein:</strong> {meal.nutrition.protein}g
                                </div>
                              )}
                              {meal.nutrition.carbs && (
                                <div style={{ background: '#f7fafc', padding: '8px', borderRadius: '8px', fontSize: '0.9rem' }}>
                                  <strong>Carbs:</strong> {meal.nutrition.carbs}g
                                </div>
                              )}
                              {meal.nutrition.fat && (
                                <div style={{ background: '#f7fafc', padding: '8px', borderRadius: '8px', fontSize: '0.9rem' }}>
                                  <strong>Fat:</strong> {meal.nutrition.fat}g
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <div style={{ marginTop: 'auto' }}>
                          <ActionButton 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageUpload(meal);
                            }}
                          >
                            📷 Upload Photo
                          </ActionButton>
                        </div>
                      </MealContent>
                    </MealPlanCard>
                  </ReactCardFlip>
                );
              })}
            </MealPlansGrid>
          ) : (
            <EmptyState>
              <FaUtensils style={{ fontSize: '3rem', color: '#cbd5e0', marginBottom: '1rem' }} />
              <h3>No Meal Plans Yet</h3>
              <p>
                {sessionId 
                  ? wsLoading ? 'Your meal plans are being generated. Please wait...' : 'Waiting for meal plan data...'
                  : 'This workflow doesn\'t have any meal plans yet.'}
              </p>
            </EmptyState>
          )}
        </WorkflowCard>
      ) : (
        <EmptyState>
          <FaUtensils style={{ fontSize: '3rem', color: '#cbd5e0', marginBottom: '1rem' }} />
          <h3>No Meal Plans Found</h3>
          <p>Create your first meal plan to get started with personalized recipes!</p>
          <CreateButton onClick={handleCreateNewWorkflow}>
            <FaPlus />
            Create Your First Plan
          </CreateButton>
        </EmptyState>
      )}

      <ImageUploadModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        mealPlanId={selectedMealPlan?.id}
        recipeName={selectedMealPlan?.name || selectedMealPlan?.recipe_name || 'Recipe'}
      />
    </MealPlansContainer>
  );
};

export default MealPlansPage; 