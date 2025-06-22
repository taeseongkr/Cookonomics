import React, { useState, useEffect } from 'react';
import { SliderContainer } from '../styles/components/UserInputForm.styles';
import RecipeCarousel from '../components/RecipeCarousel';
import RecipeSelector from '../components/RecipeSelector';
import MealPlanDisplay from '../components/MealPlanDisplay';
import WorkflowSelector from '../components/WorkflowSelector';
import { useWorkflowWebSocket } from '../hooks/useWorkflowWebSocket';
import styled from 'styled-components';
import { isAuthenticated, checkUserHasProfile, getCurrentUserProfile, getUserWorkflows, createWorkflowForExistingProfile } from '../utils/api';

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
`;

const LoadingText = styled.div`
  font-size: 1.5rem;
  color: #667eea;
  font-weight: 600;
  margin-bottom: 16px;
`;

const StatusText = styled.div`
  font-size: 1rem;
  color: #764ba2;
  margin-bottom: 24px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  color: #e53e3e;
`;

const RetryButton = styled.button`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 16px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }
`;

const SelectorToggleButton = styled.button`
  background: linear-gradient(135deg, #48bb78, #38a169);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin: 20px 0;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(72, 187, 120, 0.4);
  }
`;

const SuccessMessage = styled.div`
  background: linear-gradient(135deg, #f0fff4, #c6f6d5);
  border: 2px solid #9ae6b4;
  color: #38a169;
  border-radius: 15px;
  padding: 20px;
  margin: 20px 0;
  text-align: center;
  font-weight: 600;
`;

const RecipeShowcase = () => {
  const [sessionId, setSessionId] = useState(null);
  const [fallbackRecipes, setFallbackRecipes] = useState([]);
  const [showSelector, setShowSelector] = useState(false);
  const [selectedRecipeData, setSelectedRecipeData] = useState(null);
  const [isCreatingWorkflow, setIsCreatingWorkflow] = useState(false);
  const [showWorkflowSelector, setShowWorkflowSelector] = useState(false);
  const [currentMealPlan, setCurrentMealPlan] = useState(null);
  const [appState, setAppState] = useState('loading'); // 'loading', 'workflow-selector', 'websocket', 'meal-plan', 'fallback'

  // Initialize the app flow
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setAppState('loading');
      
      // Check if user is authenticated
      if (isAuthenticated()) {
        const hasProfile = await checkUserHasProfile();
        
        if (hasProfile) {
          // User has profile - check for existing workflows
          const userProfile = await getCurrentUserProfile();
          const workflows = await getUserWorkflows(userProfile.id);
          
          if (workflows && workflows.length > 0) {
            // User has existing workflows - show selector
            setAppState('workflow-selector');
          } else {
            // User has no workflows - create one automatically
            await createNewWorkflowForUser(userProfile);
          }
        } else {
          // User has no profile - redirect to form
          window.location.href = '/form';
        }
      } else {
        // Case 3: Not authenticated - show fallback
        loadFallbackRecipes();
        setAppState('fallback');
      }
      
    } catch (error) {
      console.error('Error initializing app:', error);
      loadFallbackRecipes();
      setAppState('fallback');
    }
  };

  // Create new workflow for user with default settings
  const createNewWorkflowForUser = async (userProfile) => {
    try {
      setIsCreatingWorkflow(true);
      
      const workflowData = {
        budget: 100000, // Default budget of 100,000 KRW
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
      };
      
      const workflowResult = await createWorkflowForExistingProfile(userProfile.id, workflowData);
      
      if (workflowResult.execution && workflowResult.execution.websocket_session_id) {
        setSessionId(workflowResult.execution.websocket_session_id);
        setAppState('websocket');
      } else {
        console.error('No websocket session ID in auto-created workflow');
        setAppState('fallback');
        loadFallbackRecipes();
      }
    } catch (error) {
      console.error('Error auto-creating workflow:', error);
      setAppState('fallback');
      loadFallbackRecipes();
    } finally {
      setIsCreatingWorkflow(false);
    }
  };

  // Handle workflow selection from WorkflowSelector
  const handleWorkflowSelected = (workflowWithMealPlans) => {
    setCurrentMealPlan(workflowWithMealPlans);
    setAppState('meal-plan');
  };

  // Handle new workflow creation from WorkflowSelector
  const handleCreateNewWorkflow = (workflowResult) => {
    
    if (workflowResult.execution && workflowResult.execution.websocket_session_id) {
      setSessionId(workflowResult.execution.websocket_session_id);
      setAppState('websocket');
    } else {
      console.error('No websocket session ID in new workflow');
      loadFallbackRecipes();
      setAppState('fallback');
    }
  };

  const loadFallbackRecipes = () => {
    // Mock recipes as fallback
    setFallbackRecipes([
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
    ]);
  };

  // Use WebSocket hook if we have a session ID
  const { 
    recipes: wsRecipes,
    mealPlan,
    isLoading, 
    error, 
    workflowStatus,
    isConnected 
  } = useWorkflowWebSocket(sessionId);

  const handleRetry = () => {
    window.location.reload();
  };

  const handleRecipeSelected = (data) => {
    setSelectedRecipeData(data);
    
    // You can add additional logic here, such as:
    // - Saving the selection to localStorage
    // - Sending the data to a backend API
    // - Updating user preferences
    
    localStorage.setItem('selectedRecipe', JSON.stringify(data));
    
    // Show success message or navigate to next step
    alert(`Recipe "${data.recipe.name || 'Unknown'}" selected with image uploaded successfully!`);
  };

  const toggleSelector = () => {
    setShowSelector(!showSelector);
  };

  // Show loading state for workflow creation or WebSocket loading
  if ((sessionId && isLoading) || isCreatingWorkflow) {
    return (
      <>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>
            {isCreatingWorkflow ? 'Setting up your personalized meal plan...' : 'Generating Your Personalized Recipes'}
          </LoadingText>
          <StatusText>
            {isCreatingWorkflow && 'Creating workflow for your profile...'}
            {sessionId && workflowStatus === 'connected' && 'Connected to meal planning service...'}
            {sessionId && workflowStatus === 'processing' && 'Analyzing your preferences...'}
            {sessionId && workflowStatus === 'connecting' && 'Connecting to server...'}
          </StatusText>
        </LoadingContainer>
      </>
    );
  }

  // Show error state
  if (sessionId && error) {
    return (
      <>
        <ErrorContainer>
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <RetryButton onClick={handleRetry}>Try Again</RetryButton>
        </ErrorContainer>
      </>
    );
  }

  // Use WebSocket recipes if available, otherwise use fallback
  const recipesToShow = sessionId && wsRecipes.length > 0 ? wsRecipes : fallbackRecipes;

  return (
    <>
      {/* Display meal plan if available - full width outside SliderContainer */}
      {mealPlan && (
        <div style={{ width: '100%', marginBottom: '30px' }}>
          <MealPlanDisplay data={mealPlan} />
        </div>
      )}
      
      <SliderContainer>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {sessionId && isConnected && (
            <div style={{ 
              marginBottom: '20px', 
              textAlign: 'center',
              color: '#667eea',
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>
              ✨ Personalized content generated just for you!
            </div>
          )}
          
          {/* Display recipes if available */}
          {recipesToShow.length > 0 && (
          <>
            <RecipeCarousel recipes={recipesToShow} />
            
            {/* Toggle button to show/hide recipe selector */}
            <SelectorToggleButton onClick={toggleSelector}>
              {showSelector ? 'Hide Recipe Selection' : 'Select & Upload Recipe Image'}
            </SelectorToggleButton>
            
            {/* Show success message if recipe was selected */}
            {selectedRecipeData && (
              <SuccessMessage>
                🎉 Recipe "{selectedRecipeData.recipe.name || 'Unknown'}" selected successfully!
                <br />
                Image uploaded: <a href={selectedRecipeData.imageInfo.public_url} target="_blank" rel="noopener noreferrer">View Image</a>
              </SuccessMessage>
            )}
            
            {/* Recipe selector component */}
            {showSelector && (
              <RecipeSelector 
                recipes={recipesToShow} 
                onRecipeSelected={handleRecipeSelected}
              />
            )}
          </>
        )}
        
        {/* Show message if no content is available */}
        {!mealPlan && recipesToShow.length === 0 && !isLoading && (
          <div style={{ 
            textAlign: 'center',
            color: '#764ba2',
            fontSize: '1.1rem',
            marginTop: '40px'
          }}>
            🍽️ Waiting for your personalized meal plan...
          </div>
        )}
      </div>
    </SliderContainer>
    </>
  );
};

export default RecipeShowcase;
