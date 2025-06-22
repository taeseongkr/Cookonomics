import React, { useState } from 'react';
import styled from 'styled-components';
import { FaCalendarPlus, FaGoogle, FaDownload, FaTimes, FaSpinner, FaCheck } from 'react-icons/fa';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 25px;
  padding: 40px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: #f0f0f0;
    color: #333;
  }
`;

const ModalTitle = styled.h2`
  color: #333;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 10px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const ModalSubtitle = styled.p`
  color: #666;
  font-size: 1rem;
  text-align: center;
  margin-bottom: 30px;
  line-height: 1.5;
`;

const OptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
`;

const OptionCard = styled.div`
  border: 2px solid #e2e8f0;
  border-radius: 15px;
  padding: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.selected ? 'linear-gradient(135deg, #f0f9ff, #e0f2fe)' : 'white'};
  border-color: ${props => props.selected ? '#667eea' : '#e2e8f0'};

  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  }
`;

const OptionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
`;

const OptionIcon = styled.div`
  font-size: 1.5rem;
  color: #667eea;
`;

const OptionTitle = styled.h3`
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
`;

const OptionDescription = styled.p`
  color: #666;
  margin: 0;
  line-height: 1.4;
  margin-left: 45px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 140px;
  justify-content: center;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }
`;

const GoogleButton = styled(Button)`
  background: linear-gradient(135deg, #4285f4, #34a853);
  color: white;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(66, 133, 244, 0.4);
  }
`;

const SecondaryButton = styled(Button)`
  background: #f7fafc;
  color: #4a5568;
  border: 2px solid #e2e8f0;

  &:hover:not(:disabled) {
    background: #edf2f7;
    border-color: #cbd5e0;
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const CalendarModal = ({ isOpen, onClose, mealPlan }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleClose = () => {
    setSelectedOption(null);
    setIsProcessing(false);
    setSuccess(false);
    onClose();
  };

  const generateGoogleCalendarUrl = (meal, date) => {
    const startDate = new Date(date);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration
    
    const formatDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const title = encodeURIComponent(`🍽️ ${meal.meal_name || meal.name || 'Meal'}`);
    const description = encodeURIComponent(
      `${meal.description || ''}\n\n` +
      `🥗 Ingredients: ${Array.isArray(meal.ingredients) ? meal.ingredients.slice(0, 5).map(i => typeof i === 'string' ? i : i.ingredient || i.name || i).join(', ') : 'See meal plan'}\n` +
      `⏱️ Prep time: ${meal.prep_time || meal.prepTime || 'N/A'}\n` +
      `🔥 Calories: ${meal.nutrition?.calories || meal.calories || 'N/A'}\n` +
      `💰 Cost: $${meal.cost || meal.estimated_cost || 'N/A'}\n\n` +
      `Generated by Cookonomics - Your AI Meal Planner`
    );

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: title.replace(/%/g, ''),
      dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
      details: description.replace(/%/g, ''),
      location: 'Kitchen'
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  const generateIcsFile = () => {
    if (!mealPlan?.meal_plans && !mealPlan?.meals) return;

    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Cookonomics//Meal Planner//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ];

    const meals = mealPlan.meal_plans || mealPlan.meals || [];
    const workflowStartDate = mealPlan.start_date ? new Date(mealPlan.start_date) : new Date();

    meals.forEach((meal, index) => {
      const mealDate = new Date(workflowStartDate);
      mealDate.setDate(mealDate.getDate() + index);
      mealDate.setHours(12, 0, 0, 0); // Set to noon
      const endDate = new Date(mealDate.getTime() + 60 * 60 * 1000); // 1 hour duration

      const formatIcsDate = (date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };

      const mealName = meal.meal_name || meal.name || 'Meal';
      const ingredients = Array.isArray(meal.ingredients) ? 
        meal.ingredients.slice(0, 5).map(i => typeof i === 'string' ? i : i.ingredient || i.name || i).join(', ') : 
        'See meal plan';

      icsContent.push(
        'BEGIN:VEVENT',
        `UID:${Date.now()}-${index}@cookonomics.com`,
        `DTSTAMP:${formatIcsDate(new Date())}`,
        `DTSTART:${formatIcsDate(mealDate)}`,
        `DTEND:${formatIcsDate(endDate)}`,
        `SUMMARY:🍽️ ${mealName}`,
        `DESCRIPTION:${meal.description || ''}\\n\\n🥗 Ingredients: ${ingredients}\\n⏱️ Prep time: ${meal.prep_time || meal.prepTime || 'N/A'}\\n🔥 Calories: ${meal.nutrition?.calories || meal.calories || 'N/A'}\\n💰 Cost: $${meal.cost || meal.estimated_cost || 'N/A'}\\n\\nGenerated by Cookonomics`,
        `LOCATION:Kitchen`,
        'END:VEVENT'
      );
    });

    icsContent.push('END:VCALENDAR');
    return icsContent.join('\r\n');
  };

  const handleGoogleCalendar = async () => {
    if (!mealPlan?.meal_plans && !mealPlan?.meals) return;

    setIsProcessing(true);
    
    try {
      const meals = mealPlan.meal_plans || mealPlan.meals || [];
      
      console.log('Meal plan data:', mealPlan);
      console.log('Found meals:', meals);
      
      if (meals.length === 0) {
        alert('No meals found in this meal plan to add to calendar.');
        return;
      }
      
      // Calculate start date based on workflow start_date
      const workflowStartDate = mealPlan.start_date ? new Date(mealPlan.start_date) : new Date();
      
      meals.forEach((meal, index) => {
        const mealDate = new Date(workflowStartDate);
        mealDate.setDate(mealDate.getDate() + index);
        mealDate.setHours(12, 0, 0, 0); // Set to noon
        
        const url = generateGoogleCalendarUrl(meal, mealDate);
        
        // Add a small delay between opening windows to prevent popup blocker
        setTimeout(() => {
          const newWindow = window.open(url, `_blank_${index}`, 'width=800,height=600');
          if (!newWindow) {
            console.warn('Popup blocked. Please allow popups for this site.');
          }
        }, index * 500); // 500ms delay between each window
      });

      setSuccess(true);
      
      // Auto close after 3 seconds
      setTimeout(() => {
        handleClose();
      }, 3000);
      
    } catch (error) {
      console.error('Error creating Google Calendar events:', error);
      alert('Error creating calendar events. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadIcs = () => {
    if (!mealPlan?.meal_plans && !mealPlan?.meals) return;

    setIsProcessing(true);
    
    try {
      const icsContent = generateIcsFile();
      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `cookonomics-meal-plan-${Date.now()}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      
      setSuccess(true);
      
      // Auto close after 2 seconds
      setTimeout(() => {
        handleClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error generating ICS file:', error);
      alert('Error generating calendar file. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={handleClose}>
          <FaTimes />
        </CloseButton>

        <ModalTitle>
          <FaCalendarPlus />
          Add to Calendar
        </ModalTitle>
        <ModalSubtitle>
          Never miss a meal! Add your personalized meal plan to your calendar and stay on track with your nutrition goals.
        </ModalSubtitle>

        {success ? (
          <SuccessMessage>
            <FaCheck />
            Success! Your meal plan has been prepared for your calendar.
          </SuccessMessage>
        ) : (
          <>
            <OptionContainer>
              <OptionCard 
                selected={selectedOption === 'google'}
                onClick={() => setSelectedOption('google')}
              >
                <OptionHeader>
                  <OptionIcon>
                    <FaGoogle />
                  </OptionIcon>
                  <OptionTitle>Google Calendar</OptionTitle>
                </OptionHeader>
                <OptionDescription>
                  Open each meal as a new Google Calendar event. Multiple calendar tabs will open - one for each meal in your plan.
                </OptionDescription>
              </OptionCard>

              <OptionCard 
                selected={selectedOption === 'download'}
                onClick={() => setSelectedOption('download')}
              >
                <OptionHeader>
                  <OptionIcon>
                    <FaDownload />
                  </OptionIcon>
                  <OptionTitle>Download Calendar File</OptionTitle>
                </OptionHeader>
                <OptionDescription>
                  Download an .ics file that works with Apple Calendar, Outlook, and most calendar apps.
                </OptionDescription>
              </OptionCard>
            </OptionContainer>

            <ButtonContainer>
              <SecondaryButton onClick={handleClose}>
                Cancel
              </SecondaryButton>
              
              {selectedOption === 'google' && (
                <GoogleButton 
                  onClick={handleGoogleCalendar}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                      Opening...
                    </>
                  ) : (
                    <>
                      <FaGoogle />
                      Add to Google Calendar
                    </>
                  )}
                </GoogleButton>
              )}

              {selectedOption === 'download' && (
                <PrimaryButton 
                  onClick={handleDownloadIcs}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FaDownload />
                      Download Calendar File
                    </>
                  )}
                </PrimaryButton>
              )}
            </ButtonContainer>
          </>
        )}
      </ModalContainer>
    </ModalOverlay>
  );
};

export default CalendarModal;
