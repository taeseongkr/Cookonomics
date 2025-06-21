import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaUtensils, 
  FaChevronLeft, 
  FaChevronRight, 
  FaPlus, 
  FaHistory
} from 'react-icons/fa';
import { getUserWorkflows, getWorkflowWithMealPlans, getUserProfiles } from '../utils/api';
import CalendarModal from '../components/CalendarModal';

const CalendarContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
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
  display: flex;
  align-items: center;
  gap: 1rem;
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
`;

const CalendarHeader = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  border: 1px solid #e2e8f0;
  display: flex;
  justify-content: between;
  align-items: center;
`;

const MonthNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NavButton = styled.button`
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #edf2f7;
    border-color: #cbd5e0;
  }
`;

const MonthTitle = styled.h2`
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  min-width: 200px;
  text-align: center;
`;

const ViewToggle = styled.div`
  display: flex;
  background: #f7fafc;
  border-radius: 10px;
  padding: 0.25rem;
  border: 1px solid #e2e8f0;
`;

const ViewButton = styled.button`
  background: ${props => props.active ? 'white' : 'transparent'};
  color: ${props => props.active ? '#2d3748' : '#718096'};
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.active ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none'};
`;

const CalendarGrid = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  border: 1px solid #e2e8f0;
  overflow: hidden;
`;

const DaysHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #f7fafc;
  border-bottom: 1px solid #e2e8f0;
`;

const DayLabel = styled.div`
  padding: 1rem;
  text-align: center;
  font-weight: 600;
  color: #4a5568;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CalendarBody = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

const CalendarDay = styled.div`
  min-height: 120px;
  border-right: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  padding: 0.5rem;
  position: relative;
  background: ${props => props.isOtherMonth ? '#f7fafc' : 'white'};
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.isOtherMonth ? '#edf2f7' : '#f7fafc'};
  }
  
  &:nth-child(7n) {
    border-right: none;
  }
`;

const DayNumber = styled.div`
  font-weight: 600;
  color: ${props => props.isOtherMonth ? '#a0aec0' : props.isToday ? '#7DD3C0' : '#2d3748'};
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const MealIndicator = styled.div`
  background: linear-gradient(135deg, #7DD3C0, #5AB5A1);
  color: white;
  border-radius: 6px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(125, 211, 192, 0.3);
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
  background: white;
  border-radius: 15px;
  border: 1px solid #e2e8f0;
`;

const ActionButton = styled.button`
  background: #edf2f7;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  
  &:hover {
    background: #e2e8f0;
    transform: translateY(-1px);
  }
`;

const CalendarPage = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // 'month' or 'week'
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMealPlan, setSelectedMealPlan] = useState(null);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  
  useEffect(() => {
    loadCalendarData();
  }, []);

  const loadCalendarData = async () => {
    try {
      console.log('Loading calendar data...');
      
      // First get user profiles
      const profiles = await getUserProfiles();
      if (!profiles || profiles.length === 0) {
        console.log('No profiles found');
        setLoading(false);
        return;
      }

      // Get workflows for all profiles
      const allWorkflows = [];
      for (const profile of profiles) {
        try {
          const profileWorkflows = await getUserWorkflows(profile.id);
          if (profileWorkflows && profileWorkflows.length > 0) {
            // Add profile info to each workflow
            const workflowsWithProfile = profileWorkflows.map(workflow => ({
              ...workflow,
              profile_info: profile
            }));
            allWorkflows.push(...workflowsWithProfile);
          }
        } catch (error) {
          console.error(`Error loading workflows for profile ${profile.id}:`, error);
        }
      }

      console.log('All workflows loaded:', allWorkflows);
      setWorkflows(allWorkflows);
    } catch (error) {
      console.error('Error loading calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Get first day of month and its day of week
    const firstDay = new Date(year, month, 1);
    const firstDayWeek = firstDay.getDay();
    
    // Get last day of month
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Calculate days to show from previous month
    const daysFromPrevMonth = firstDayWeek;
    const prevMonth = new Date(year, month - 1, 0);
    const daysInPrevMonth = prevMonth.getDate();
    
    // Calculate days to show from next month
    const totalCells = Math.ceil((daysInMonth + daysFromPrevMonth) / 7) * 7;
    const daysFromNextMonth = totalCells - (daysInMonth + daysFromPrevMonth);
    
    const days = [];
    
    // Previous month days
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, daysInPrevMonth - i),
        isOtherMonth: true
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isOtherMonth: false
      });
    }
    
    // Next month days
    for (let i = 1; i <= daysFromNextMonth; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isOtherMonth: true
      });
    }
    
    return days;
  };

  const getMealsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const mealsForDate = [];
    
    workflows.forEach(workflow => {
      if (workflow.start_date <= dateStr && workflow.end_date >= dateStr) {
        // Calculate which day of the meal plan this date represents
        const startDate = new Date(workflow.start_date);
        const diffTime = date.getTime() - startDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        mealsForDate.push({
          workflow,
          dayIndex: diffDays,
          title: `Meal Plan ${workflow.id}`,
          budget: workflow.budget
        });
      }
    });
    
    return mealsForDate;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleMealClick = async (meal) => {
    try {
      console.log('Loading meal plan details for workflow:', meal.workflow.id);
      const workflowWithMealPlans = await getWorkflowWithMealPlans(meal.workflow.id);
      setSelectedMealPlan(workflowWithMealPlans);
      setShowCalendarModal(true);
    } catch (error) {
      console.error('Error loading meal plan details:', error);
    }
  };

  const handleCreateNewMealPlan = () => {
    navigate('/dashboard');
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <CalendarContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <p>Loading your meal calendar...</p>
        </LoadingContainer>
      </CalendarContainer>
    );
  }

  const days = getDaysInMonth(currentDate);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <CalendarContainer>
      <Header>
        <Title>
          <FaCalendarAlt />
          Meal Calendar
        </Title>
        <CreateButton onClick={handleCreateNewMealPlan}>
          <FaPlus />
          Create New Meal Plan
        </CreateButton>
      </Header>

      <CalendarHeader>
        <MonthNavigation>
          <NavButton onClick={handlePrevMonth}>
            <FaChevronLeft />
          </NavButton>
          <MonthTitle>{formatMonthYear(currentDate)}</MonthTitle>
          <NavButton onClick={handleNextMonth}>
            <FaChevronRight />
          </NavButton>
        </MonthNavigation>
        
        <ViewToggle>
          <ViewButton 
            active={view === 'month'} 
            onClick={() => setView('month')}
          >
            Month
          </ViewButton>
          <ViewButton 
            active={view === 'week'} 
            onClick={() => setView('week')}
          >
            Week
          </ViewButton>
        </ViewToggle>
      </CalendarHeader>

      {workflows.length > 0 ? (
        <CalendarGrid>
          <DaysHeader>
            {dayNames.map(day => (
              <DayLabel key={day}>{day}</DayLabel>
            ))}
          </DaysHeader>
          
          <CalendarBody>
            {days.map((day, index) => {
              const mealsForDay = getMealsForDate(day.date);
              return (
                <CalendarDay 
                  key={index} 
                  isOtherMonth={day.isOtherMonth}
                >
                  <DayNumber 
                    isOtherMonth={day.isOtherMonth}
                    isToday={isToday(day.date)}
                  >
                    {day.date.getDate()}
                  </DayNumber>
                  
                  {mealsForDay.map((meal, mealIndex) => (
                    <MealIndicator 
                      key={mealIndex}
                      onClick={() => handleMealClick(meal)}
                      title={`${meal.title} - ₩${meal.budget.toLocaleString()}`}
                    >
                      <FaUtensils style={{ marginRight: '0.25rem' }} />
                      {meal.title}
                    </MealIndicator>
                  ))}
                  
                  {!day.isOtherMonth && mealsForDay.length === 0 && (
                    <ActionButton onClick={handleCreateNewMealPlan}>
                      <FaPlus />
                      Add Meal
                    </ActionButton>
                  )}
                </CalendarDay>
              );
            })}
          </CalendarBody>
        </CalendarGrid>
      ) : (
        <EmptyState>
          <FaHistory style={{ fontSize: '3rem', color: '#cbd5e0', marginBottom: '1rem' }} />
          <h3>No Meal Plans Found</h3>
          <p>Create your first meal plan to start tracking your meals on the calendar!</p>
          <CreateButton onClick={handleCreateNewMealPlan} style={{ marginTop: '1rem' }}>
            <FaPlus />
            Create Your First Meal Plan
          </CreateButton>
        </EmptyState>
      )}

      {/* Calendar Integration Modal */}
      <CalendarModal 
        isOpen={showCalendarModal}
        onClose={() => {
          setShowCalendarModal(false);
          setSelectedMealPlan(null);
        }}
        mealPlan={selectedMealPlan}
      />
    </CalendarContainer>
  );
};

export default CalendarPage; 