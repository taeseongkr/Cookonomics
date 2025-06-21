import React, { useState } from 'react';
import styled from 'styled-components';
import ImageUploadModal from '../components/ImageUploadModal';
import CalendarModal from '../components/CalendarModal';
import MealPlanStorage from '../components/MealPlanStorage';

const TestContainer = styled.div`
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Poppins', sans-serif;
`;

const TestSection = styled.div`
  margin-bottom: 40px;
  padding: 20px;
  border: 2px solid #e2e8f0;
  border-radius: 15px;
`;

const TestTitle = styled.h2`
  color: #333;
  margin-bottom: 20px;
`;

const TestButton = styled.button`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 10px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }
`;

const NewFeaturesTest = () => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showStorage, setShowStorage] = useState(false);

  // Mock meal plan data for testing
  const mockMealPlan = {
    meals: [
      {
        name: 'Grilled Chicken Salad',
        description: 'Healthy grilled chicken with mixed greens',
        calories: 450,
        prepTime: '25 minutes',
        ingredients: ['Chicken breast', 'Mixed greens', 'Cherry tomatoes', 'Cucumber'],
        instructions: ['Grill the chicken', 'Prepare the salad', 'Combine and serve']
      },
      {
        name: 'Spaghetti Carbonara',
        description: 'Classic Italian pasta with eggs and pancetta',
        calories: 650,
        prepTime: '20 minutes',
        ingredients: ['Spaghetti', 'Eggs', 'Pancetta', 'Parmesan cheese'],
        instructions: ['Cook pasta', 'Fry pancetta', 'Mix with eggs and cheese']
      },
      {
        name: 'Vegetable Stir Fry',
        description: 'Fresh vegetables with Asian flavors',
        calories: 320,
        prepTime: '15 minutes',
        ingredients: ['Broccoli', 'Bell peppers', 'Carrots', 'Soy sauce'],
        instructions: ['Heat oil', 'Stir fry vegetables', 'Add sauce and serve']
      }
    ]
  };

  const handlePhotoUpload = (meal, mealId) => {
    console.log('Photo upload for meal:', meal, 'ID:', mealId);
    setShowImageModal(true);
  };

  return (
    <TestContainer>
      <h1>🚀 New Features Test Page</h1>
      <p>This page demonstrates all the new features added to the meal plan system.</p>

      <TestSection>
        <TestTitle>📸 Image Upload Feature</TestTitle>
        <p>Test the "Rate My Cooking Skills" image upload modal.</p>
        <TestButton onClick={() => setShowImageModal(true)}>
          📸 Test Image Upload
        </TestButton>
      </TestSection>

      <TestSection>
        <TestTitle>📅 Calendar Integration</TestTitle>
        <p>Test adding meal plans to Google Calendar or downloading as .ics file.</p>
        <TestButton onClick={() => setShowCalendarModal(true)}>
          📅 Test Calendar Modal
        </TestButton>
      </TestSection>

      <TestSection>
        <TestTitle>💾 Meal Plan Storage</TestTitle>
        <p>View and manage saved meal plans with photo upload functionality.</p>
        <TestButton onClick={() => setShowStorage(!showStorage)}>
          💾 {showStorage ? 'Hide' : 'Show'} Storage Tab
        </TestButton>
      </TestSection>

      {showStorage && (
        <TestSection>
          <MealPlanStorage onPhotoUpload={handlePhotoUpload} />
        </TestSection>
      )}

      {/* Modals */}
      <ImageUploadModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        mealPlanId={123}
        recipeName="Test Recipe"
      />

      <CalendarModal
        isOpen={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
        mealPlan={mockMealPlan}
      />
    </TestContainer>
  );
};

export default NewFeaturesTest;
