import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlus, FaUtensils, FaHistory, FaUser, FaClock, FaSpinner } from 'react-icons/fa';
import { 
  isAuthenticated, 
  getUserProfiles, 
  getWorkflowWithMealPlans,
  createWorkflowForExistingProfile,
  getAllWorkflowsWithMealPlans
} from '../utils/api';
import DateSelectionModal from '../components/DateSelectionModal';

const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const WelcomeSection = styled.div`
  background: linear-gradient(135deg, #F5F8F7, #E8F5F5);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  border: 1px solid #E2E8F0;
`;

const WelcomeTitle = styled.h1`
  color: #2d3748;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const WelcomeSubtitle = styled.p`
  color: #4a5568;
  font-size: 1.2rem;
  margin-bottom: 2rem;
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ActionCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const ActionIcon = styled.div`
  font-size: 2rem;
  color: #7DD3C0;
  margin-bottom: 1rem;
`;

const ActionTitle = styled.h3`
  color: #2d3748;
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const ActionDescription = styled.p`
  color: #4a5568;
  font-size: 0.95rem;
  line-height: 1.6;
`;

const RecentSection = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  border: 1px solid #e2e8f0;
`;

const SectionTitle = styled.h2`
  color: #2d3748;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const WorkflowList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const WorkflowItem = styled.div`
  background: #f7fafc;
  border-radius: 10px;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #edf2f7;
    transform: translateX(4px);
  }
`;

const WorkflowHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const WorkflowTitle = styled.h4`
  color: #2d3748;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
`;

const WorkflowDate = styled.span`
  color: #718096;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const WorkflowStatus = styled.span`
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
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

const CreateButton = styled.button`
  background: linear-gradient(135deg, #7DD3C0, #5AB5A1);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 1rem auto 0 auto;
  
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

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [recentWorkflows, setRecentWorkflows] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [creatingWorkflow, setCreatingWorkflow] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);

  useEffect(() => {
    initializeDashboard();
  }, []);

  const initializeDashboard = async () => {
    try {
      if (!isAuthenticated()) {
        navigate('/auth');
        return;
      }

      const email = localStorage.getItem('userEmail');
      setUserEmail(email || 'User');

      // Load user profiles
      const userProfiles = await getUserProfiles();
      setProfiles(userProfiles || []);

      // Load recent workflows if user has profiles
      if (userProfiles && userProfiles.length > 0) {
        const latestProfile = userProfiles[userProfiles.length - 1];
        const workflows = await getAllWorkflowsWithMealPlans(latestProfile.id);
        setRecentWorkflows(workflows || []);
      }
    } catch (error) {
      console.error('Error initializing dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewMealPlan = async () => {
    try {
      if (profiles.length === 0) {
        // User has no profiles, redirect to form
        navigate('/form');
        return;
      }

      // Show the date selection modal
      setShowDateModal(true);
    } catch (error) {
      console.error('Error checking user profiles:', error);
      alert('Failed to load user profiles. Please try again.');
    }
  };

  const handleDateModalSubmit = async (workflowData) => {
    try {
      setCreatingWorkflow(true);
      
      // Use the most recent profile
      const latestProfile = profiles[profiles.length - 1];
      
      const workflowResult = await createWorkflowForExistingProfile(latestProfile.id, workflowData);
      
      // Close the modal
      setShowDateModal(false);
      
      // Navigate to meal plans page to show the workflow execution
      navigate('/meal-plans', { 
        state: { 
          newWorkflow: workflowResult,
          sessionId: workflowResult.execution?.websocket_session_id 
        } 
      });
    } catch (error) {
      console.error('Error creating new meal plan:', error);
      alert('Failed to create new meal plan. Please try again.');
    } finally {
      setCreatingWorkflow(false);
    }
  };

  const handleViewWorkflow = async (workflow) => {
    try {
      const workflowWithMealPlans = await getWorkflowWithMealPlans(workflow.id);
      navigate('/meal-plans', { 
        state: { 
          workflowData: workflowWithMealPlans 
        } 
      });
    } catch (error) {
      console.error('Error loading workflow:', error);
      alert('Failed to load workflow details. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <DashboardContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <p>Loading your dashboard...</p>
        </LoadingContainer>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <WelcomeSection>
        <WelcomeTitle>Welcome back, {userEmail.split('@')[0]}!</WelcomeTitle>
        <WelcomeSubtitle>
          Ready to create delicious, personalized meal plans that fit your budget and preferences?
        </WelcomeSubtitle>
        <CreateButton 
          onClick={handleCreateNewMealPlan}
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
              Create New Meal Plan
            </>
          )}
        </CreateButton>
      </WelcomeSection>

      <QuickActionsGrid>
        <ActionCard onClick={() => navigate('/meal-plans')}>
          <ActionIcon><FaUtensils /></ActionIcon>
          <ActionTitle>View Meal Plans</ActionTitle>
          <ActionDescription>
            Browse your current and past meal plans, see detailed recipes and nutritional information.
          </ActionDescription>
        </ActionCard>

        <ActionCard onClick={() => navigate('/calendar')}>
          <ActionIcon><FaClock /></ActionIcon>
          <ActionTitle>Meal Calendar</ActionTitle>
          <ActionDescription>
            View your meals organized by date, plan ahead, and track your eating schedule.
          </ActionDescription>
        </ActionCard>

        <ActionCard onClick={() => navigate('/profile')}>
          <ActionIcon><FaUser /></ActionIcon>
          <ActionTitle>Manage Profile</ActionTitle>
          <ActionDescription>
            Update your dietary preferences, budget, health goals, and personal information.
          </ActionDescription>
        </ActionCard>
      </QuickActionsGrid>

      {recentWorkflows.length > 0 && (
        <RecentSection>
          <SectionTitle>
            <FaHistory />
            Recent Meal Plans
          </SectionTitle>
          <WorkflowList>
            {recentWorkflows.slice(0, 5).map((workflow) => (
              <WorkflowItem 
                key={workflow.id} 
                onClick={() => handleViewWorkflow(workflow)}
              >
                <WorkflowHeader>
                  <WorkflowTitle>
                    Meal Plan {workflow.id} - ${workflow.budget}
                  </WorkflowTitle>
                  <WorkflowStatus status={workflow.status}>
                    {workflow.status}
                  </WorkflowStatus>
                </WorkflowHeader>
                <WorkflowDate>
                  <FaClock />
                  {formatDate(workflow.start_date)} - {formatDate(workflow.end_date)}
                </WorkflowDate>
              </WorkflowItem>
            ))}
          </WorkflowList>
        </RecentSection>
      )}

      {profiles.length === 0 && (
        <RecentSection>
          <EmptyState>
            <FaUser style={{ fontSize: '3rem', color: '#cbd5e0', marginBottom: '1rem' }} />
            <h3>No Profile Found</h3>
            <p>Create your first profile to start generating personalized meal plans!</p>
            <CreateButton onClick={() => navigate('/form')}>
              <FaPlus />
              Create Profile
            </CreateButton>
          </EmptyState>
        </RecentSection>
      )}

      <DateSelectionModal
        isOpen={showDateModal}
        onClose={() => setShowDateModal(false)}
        onSubmit={handleDateModalSubmit}
        isLoading={creatingWorkflow}
      />
    </DashboardContainer>
  );
};

export default Dashboard; 