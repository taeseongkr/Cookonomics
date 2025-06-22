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
  max-width: 650px;
  width: 90%;
  max-height: 85vh;
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



const CalendarModal = ({ isOpen, onClose, meal, date, mealPlan }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleClose = () => {
    setSelectedOption(null);
    setIsProcessing(false);
    setSuccess(false);
    onClose();
  };

  // Generate Google Calendar URL for a single meal
  const generateGoogleCalendarUrl = (singleMeal, mealDate) => {
    const startDate = new Date(mealDate);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration
    
    const formatDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    // Safe extraction of meal data with fallbacks
    const mealName = singleMeal.meal_name || singleMeal.name || singleMeal.title || 'Meal';
    const mealDescription = singleMeal.description || '';
    
    // Handle ingredients safely
    let ingredients = 'See meal plan';
    if (Array.isArray(singleMeal.ingredients) && singleMeal.ingredients.length > 0) {
      ingredients = singleMeal.ingredients
        .slice(0, 5)
        .map(i => {
          if (typeof i === 'string') return i;
          return i.ingredient || i.name || i.title || 'Ingredient';
        })
        .join(', ');
    }

    // Handle nutrition data safely
    const calories = singleMeal.nutrition?.calories || singleMeal.calories || 'N/A';
    const prepTime = singleMeal.prep_time || singleMeal.prepTime || singleMeal.preparation_time || 'N/A';
    const cost = singleMeal.cost || singleMeal.estimated_cost || singleMeal.price || 'N/A';

    const title = `🍽️ ${mealName}`;
    const description = [
      mealDescription,
      '',
      `🥗 Ingredients: ${ingredients}`,
      `⏱️ Prep time: ${prepTime}`,
      `🔥 Calories: ${calories}`,
      `💰 Cost: $${cost}`,
      '',
      'Generated by Cookonomics - Your AI Meal Planner'
    ].filter(line => line !== undefined).join('\\n');

    // Create URL with proper encoding
    const baseUrl = 'https://calendar.google.com/calendar/render';
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: title,
      dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
      details: description,
      location: 'Kitchen'
    });

    return `${baseUrl}?${params.toString()}`;
  };

  // Handle Google Calendar for single meal
  const handleGoogleCalendar = async () => {
    // For single meal mode
    if (meal && date) {
      setIsProcessing(true);
      
      try {
        const url = generateGoogleCalendarUrl(meal, date);
        
        const newWindow = window.open(url, 'calendar_meal', 'width=800,height=600,scrollbars=yes,resizable=yes');
        
        if (!newWindow) {
          // Fallback: open in current tab
          window.open(url, '_blank');
        }
        
        setSuccess(true);
        
        // Auto close after 2 seconds
        setTimeout(() => {
          handleClose();
        }, 2000);
        
      } catch (error) {
        console.error('Error creating Google Calendar event:', error);
        alert('Error creating calendar event. Please try again.');
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    // Legacy support for meal plan mode (if still needed)
    if (!mealPlan?.meal_plans && !mealPlan?.meals) {
      alert('No meal plan data available.');
      return;
    }

    const meals = mealPlan.meal_plans || mealPlan.meals || [];
    
    if (meals.length === 0) {
      alert('No meals found in this meal plan to add to calendar.');
      return;
    }

    setIsProcessing(true);
    
    try {
      const workflowStartDate = mealPlan.start_date ? new Date(mealPlan.start_date) : new Date();
      
      // For meal plan mode, just add the first meal as an example
      const firstMeal = meals[0];
      const mealDate = new Date(workflowStartDate);
      mealDate.setHours(12, 0, 0, 0);
      
      const url = generateGoogleCalendarUrl(firstMeal, mealDate);
      
      const newWindow = window.open(url, 'calendar_meal_plan', 'width=800,height=600,scrollbars=yes,resizable=yes');
      
      if (!newWindow) {
        window.open(url, '_blank');
      }
      
      setSuccess(true);
      
      setTimeout(() => {
        handleClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error creating Google Calendar event:', error);
      alert('Error creating calendar event. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate ICS file for single meal
  const generateIcsFile = () => {
    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Cookonomics//Meal Planner//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ];

    // Single meal mode
    if (meal && date) {
      const mealDate = new Date(date);
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
        `UID:${Date.now()}-single-meal@cookonomics.com`,
        `DTSTAMP:${formatIcsDate(new Date())}`,
        `DTSTART:${formatIcsDate(mealDate)}`,
        `DTEND:${formatIcsDate(endDate)}`,
        `SUMMARY:🍽️ ${mealName}`,
        `DESCRIPTION:${meal.description || ''}\\n\\n🥗 Ingredients: ${ingredients}\\n⏱️ Prep time: ${meal.prep_time || meal.prepTime || 'N/A'}\\n🔥 Calories: ${meal.nutrition?.calories || meal.calories || 'N/A'}\\n💰 Cost: $${meal.cost || meal.estimated_cost || 'N/A'}\\n\\nGenerated by Cookonomics`,
        `LOCATION:Kitchen`,
        'END:VEVENT'
      );
    } else if (mealPlan?.meal_plans || mealPlan?.meals) {
      // Legacy meal plan mode
      const meals = mealPlan.meal_plans || mealPlan.meals || [];
      const workflowStartDate = mealPlan.start_date ? new Date(mealPlan.start_date) : new Date();

      meals.forEach((meal, index) => {
        const mealDate = new Date(workflowStartDate);
        mealDate.setDate(mealDate.getDate() + index);
        mealDate.setHours(12, 0, 0, 0);
        const endDate = new Date(mealDate.getTime() + 60 * 60 * 1000);

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
    }

    icsContent.push('END:VCALENDAR');
    return icsContent.join('\r\n');
  };

  const handleDownloadIcs = () => {
    setIsProcessing(true);
    
    try {
      const icsContent = generateIcsFile();
      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      
      const fileName = meal ? 
        `cookonomics-${meal.meal_name || meal.name || 'meal'}-${Date.now()}.ics` :
        `cookonomics-meal-plan-${Date.now()}.ics`;
      
      link.download = fileName;
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

  // Get meal info for display
  const displayMeal = meal || (mealPlan?.meal_plans?.[0] || mealPlan?.meals?.[0]);
  const mealName = displayMeal?.meal_name || displayMeal?.name || 'Your meal';
  const displayDate = date ? new Date(date).toLocaleDateString() : 'your selected date';

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
          {meal ? 
            `Add "${mealName}" to your calendar for ${displayDate}. Never miss a meal!` :
            'Add your meal plan to your calendar and stay on track with your nutrition goals.'
          }
        </ModalSubtitle>

        {success ? (
          <SuccessMessage>
            <FaCheck />
            Success! Your meal has been prepared for your calendar.
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
                  {meal ? 
                    `Add "${mealName}" to Google Calendar. A new calendar tab will open with the meal details.` :
                    'Add your meal plan to Google Calendar. A new calendar tab will open with the meal details.'
                  }
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
