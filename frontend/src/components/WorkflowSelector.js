import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlus, FaCalendarAlt, FaClock, FaDollarSign } from 'react-icons/fa';
import { getUserWorkflows, getWorkflowWithMealPlans, createWorkflowForExistingProfile, getCurrentUserProfile } from '../utils/api';

const Container = styled.div`
  background: white;
  border-radius: 25px;
  padding: 40px;
  margin: 20px 0;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 20px auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const Title = styled.h2`
  color: #333;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1rem;
  margin-bottom: 30px;
`;

const WorkflowGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const WorkflowCard = styled.div`
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  border: 2px solid #e2e8f0;
  border-radius: 15px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    border-color: #667eea;
  }

  &.completed {
    background: linear-gradient(135deg, #f0fff4, #c6f6d5);
    border-color: #9ae6b4;
    
    &::after {
      content: '✅';
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 1.2rem;
    }
  }

  &.processing {
    background: linear-gradient(135deg, #fffaf0, #fed7aa);
    border-color: #f6ad55;
    
    &::after {
      content: '⏳';
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 1.2rem;
    }
  }
`;

const NewWorkflowCard = styled(WorkflowCard)`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-color: #667eea;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 150px;
  text-align: center;

  &:hover {
    background: linear-gradient(135deg, #5a67d8, #6b46c1);
  }
`;

const CardDate = styled.div`
  color: #667eea;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const CardTitle = styled.h3`
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 15px;
`;

const CardDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  font-size: 0.9rem;
  color: #666;
`;

const CardDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const CardStatus = styled.div`
  color: #48bb78;
  font-weight: 600;
  font-size: 0.9rem;
  margin-top: 10px;
  text-transform: capitalize;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const NewWorkflowIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 10px;
`;

const NewWorkflowText = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
`;

const WorkflowSelector = ({ onWorkflowSelected, onCreateNew }) => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      setLoading(true);
      
      // Get user profile first
      const userProfile = await getCurrentUserProfile();
      setProfile(userProfile);
      
      // Get workflows for this profile
      const userWorkflows = await getUserWorkflows(userProfile.id);
      setWorkflows(userWorkflows || []);
      
    } catch (err) {
      console.error('Error loading workflows:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkflowClick = async (workflow) => {
    try {
      if (workflow.status === 'completed') {
        // Get workflow with meal plans
        const workflowWithMealPlans = await getWorkflowWithMealPlans(workflow.id);
        onWorkflowSelected(workflowWithMealPlans);
      } else {
        // Workflow is not completed, show status
        alert(`This workflow is ${workflow.status}. Please wait for it to complete or create a new one.`);
      }
    } catch (err) {
      console.error('Error loading workflow details:', err);
      alert('Failed to load workflow details. Please try again.');
    }
  };

  const handleCreateNew = async () => {
    try {
      if (!profile) {
        alert('Profile not found. Please refresh the page.');
        return;
      }

      setLoading(true);
      
      // Create new workflow with default settings
      const workflowData = {
        budget: 100000, // Default budget of 100,000 KRW
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
      };
      
      const workflowResult = await createWorkflowForExistingProfile(profile.id, workflowData);
      onCreateNew(workflowResult);
      
    } catch (err) {
      console.error('Error creating new workflow:', err);
      alert('Failed to create new workflow. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return 'Date range unknown';
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingSpinner />
          <div>Loading your meal plans...</div>
        </LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header>
          <Title>Error Loading Workflows</Title>
          <Subtitle>{error}</Subtitle>
        </Header>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>🍽️ Your Meal Plans</Title>
        <Subtitle>
          {workflows.length > 0 
            ? 'Choose an existing meal plan or create a new one'
            : 'Create your first personalized meal plan'
          }
        </Subtitle>
      </Header>

      <WorkflowGrid>
        {/* Create New Workflow Card */}
        <NewWorkflowCard onClick={handleCreateNew}>
          <NewWorkflowIcon>
            <FaPlus />
          </NewWorkflowIcon>
          <NewWorkflowText>Create New Meal Plan</NewWorkflowText>
        </NewWorkflowCard>

        {/* Existing Workflows */}
        {workflows.map((workflow) => (
          <WorkflowCard
            key={workflow.id}
            className={workflow.status}
            onClick={() => handleWorkflowClick(workflow)}
          >
            <CardDate>
              <FaCalendarAlt />
              {getDateRange(workflow.start_date, workflow.end_date)}
            </CardDate>
            
            <CardTitle>
              Meal Plan #{workflow.id}
            </CardTitle>
            
            <CardDetails>
              {workflow.budget && (
                <CardDetail>
                  <FaDollarSign />
                  ₩{workflow.budget.toLocaleString()}
                </CardDetail>
              )}
              
              <CardDetail>
                <FaClock />
                {formatDate(workflow.created_at)}
              </CardDetail>
            </CardDetails>
            
            <CardStatus>
              Status: {workflow.status}
            </CardStatus>
          </WorkflowCard>
        ))}
      </WorkflowGrid>
    </Container>
  );
};

export default WorkflowSelector;
