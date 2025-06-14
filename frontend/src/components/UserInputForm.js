import React, { useState } from 'react';
import { FaDollarSign, FaRocket, FaApple, FaCarrot, FaFish, FaEgg, FaBreadSlice, FaSpinner, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useUserInputForm } from '../hooks/useUserInputForm';
import { GENDER_OPTIONS, FORM_VALIDATION, SUBMIT_STATUS, LOADING_MESSAGES, SUCCESS_MESSAGES } from '../constants/formConstants';
import {
  SliderContainer,
  FormContainer,
  FormTitle,
  InputGroup,
  InputWrapper,
  InputLabel,
  InputField,
  SelectField,
  Button,
  StatusMessage,
  FloatingFoodIcon,
  FormSection
} from '../styles/components/UserInputForm.styles';
import { isAuthenticated, getCurrentUserProfile } from '../utils/api';
import RecipeCarousel from './RecipeCarousel';
import './UserInputForm.css'; // Add a CSS file for fade animations
import { useNavigate } from 'react-router-dom';

const UserInputForm = () => {
  const {
    formData,
    isLoading,
    submitStatus,
    errorMessage,
    updateField,
    handleSubmit
  } = useUserInputForm();
  const navigate = useNavigate();

  // All hooks must be at the top level
  const [step, setStep] = useState(0);
  const totalSteps = 2;
  const [completed, setCompleted] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [fadeState, setFadeState] = useState('in'); // 'in' | 'out'

  // On mount, check if user already has a profile
  React.useEffect(() => {
    async function checkProfile() {
      if (isAuthenticated()) {
        try {
          const profile = await getCurrentUserProfile();
          if (profile) setCompleted(true);
        } catch (e) {
          // No profile found or error, do nothing
        }
      }
    }
    checkProfile();
  }, []);

  React.useEffect(() => {
    if (submitStatus === SUBMIT_STATUS.SUCCESS) {
      setFadeState('out');
      setTimeout(() => {
        setShowForm(false);
        setCompleted(true);
        navigate('/recipes');
      }, 600);
    }
  }, [submitStatus, navigate]);

  // Log out handler: redirect to /auth
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    window.location.href = '/auth';
  };

  // If user is not authenticated, show sign-in required message
  if (!isAuthenticated()) {
    return (
      <SliderContainer>
        <FormContainer>
          <FormTitle>Sign In Required</FormTitle>
          <StatusMessage className="error">
            Please sign in with Google to create your nutrition profile.
          </StatusMessage>
        </FormContainer>
      </SliderContainer>
    );
  }

  // Stepper state and navigation (must be after completed/auth checks)
  const goNext = (e) => {
    e.preventDefault();
    setStep((prev) => Math.min(prev + 1, totalSteps - 1));
  };
  const goBack = (e) => {
    e.preventDefault();
    setStep((prev) => Math.max(prev - 1, 0));
  };

  // If completed, show completed UI
  if (completed && !showForm) {
    return null;
  }

  return (
    <SliderContainer>
      <FormContainer className={`fade-${fadeState}`}>
        <FormTitle>Tell Us About Yourself</FormTitle>
        <form onSubmit={step === totalSteps - 1 ? handleSubmit : goNext}>
          {step === 0 && (
            <>
              <FormSection>
                <InputGroup delay={0.1}>
                  <InputWrapper>
                    <InputLabel><FaApple /> Age</InputLabel>
                    <InputField
                      type="number"
                      placeholder="Enter your age"
                      value={formData.age}
                      onChange={(e) => updateField('age', e.target.value)}
                      min={FORM_VALIDATION.AGE.MIN}
                      max={FORM_VALIDATION.AGE.MAX}
                    />
                    <FloatingFoodIcon><FaApple /></FloatingFoodIcon>
                  </InputWrapper>
                  <InputWrapper>
                    <InputLabel><FaCarrot /> Gender</InputLabel>
                    <SelectField
                      value={formData.gender}
                      onChange={(e) => updateField('gender', e.target.value)}
                    >
                      {GENDER_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </SelectField>
                    <FloatingFoodIcon><FaCarrot /></FloatingFoodIcon>
                  </InputWrapper>
                </InputGroup>
                <InputGroup delay={0.2}>
                  <InputWrapper>
                    <InputLabel><FaFish /> Height (cm)</InputLabel>
                    <InputField
                      type="number"
                      placeholder="Enter your height"
                      value={formData.height}
                      onChange={(e) => updateField('height', e.target.value)}
                      min={FORM_VALIDATION.HEIGHT.MIN}
                      max={FORM_VALIDATION.HEIGHT.MAX}
                    />
                    <FloatingFoodIcon><FaFish /></FloatingFoodIcon>
                  </InputWrapper>
                  <InputWrapper>
                    <InputLabel><FaEgg /> Weight (kg)</InputLabel>
                    <InputField
                      type="number"
                      placeholder="Enter your weight"
                      value={formData.weight}
                      onChange={(e) => updateField('weight', e.target.value)}
                      min={FORM_VALIDATION.WEIGHT.MIN}
                      max={FORM_VALIDATION.WEIGHT.MAX}
                    />
                    <FloatingFoodIcon><FaEgg /></FloatingFoodIcon>
                  </InputWrapper>
                </InputGroup>
              </FormSection>
              <FormSection>
                <InputGroup delay={0.3} className="full-width">
                  <InputWrapper>
                    <InputLabel><FaDollarSign /> Weekly Budget (₩)</InputLabel>
                    <InputField
                      type="number"
                      placeholder="Enter your weekly food budget"
                      value={formData.budget}
                      onChange={(e) => updateField('budget', e.target.value)}
                      min={FORM_VALIDATION.BUDGET.MIN}
                    />
                    <FloatingFoodIcon><FaDollarSign /></FloatingFoodIcon>
                  </InputWrapper>
                </InputGroup>
                <InputGroup delay={0.4} className="full-width">
                  <InputWrapper>
                    <InputLabel><FaBreadSlice /> Food Preferences</InputLabel>
                    <InputField
                      type="text"
                      placeholder="e.g., vegetarian, gluten-free, low-carb, dairy-free"
                      value={formData.preferences}
                      onChange={(e) => updateField('preferences', e.target.value)}
                    />
                    <FloatingFoodIcon><FaBreadSlice /></FloatingFoodIcon>
                  </InputWrapper>
                </InputGroup>
              </FormSection>
            </>
          )}
          {step === 1 && (
            <>
              <FormSection>
                <InputGroup delay={0.5} className="full-width">
                  <InputWrapper>
                    <InputLabel>Cooking Level</InputLabel>
                    <SelectField
                      value={formData.cooking_level}
                      onChange={(e) => updateField('cooking_level', e.target.value)}
                    >
                      <option value="">Select level</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </SelectField>
                  </InputWrapper>
                </InputGroup>
                <InputGroup delay={0.6} className="full-width">
                  <InputWrapper>
                    <InputLabel>Religion</InputLabel>
                    <InputField
                      type="text"
                      placeholder="e.g., Halal, Kosher, None"
                      value={formData.religion}
                      onChange={(e) => updateField('religion', e.target.value)}
                    />
                  </InputWrapper>
                </InputGroup>
                <InputGroup delay={0.7} className="full-width">
                  <InputWrapper>
                    <InputLabel>Goal</InputLabel>
                    <InputField
                      type="text"
                      placeholder="e.g., Weight loss, Muscle gain, Healthy eating"
                      value={formData.goal}
                      onChange={(e) => updateField('goal', e.target.value)}
                    />
                  </InputWrapper>
                </InputGroup>
                <InputGroup delay={0.8} className="full-width">
                  <InputWrapper>
                    <InputLabel>Health Issues</InputLabel>
                    <InputField
                      type="text"
                      placeholder="e.g., Diabetes, Hypertension, None"
                      value={formData.health_issues}
                      onChange={(e) => updateField('health_issues', e.target.value)}
                    />
                  </InputWrapper>
                </InputGroup>
                <InputGroup delay={0.9} className="full-width">
                  <InputWrapper>
                    <InputLabel>Allergies</InputLabel>
                    <InputField
                      type="text"
                      placeholder="e.g., Peanuts, Shellfish, None"
                      value={formData.allergies}
                      onChange={(e) => updateField('allergies', e.target.value)}
                    />
                  </InputWrapper>
                </InputGroup>
                <InputGroup delay={1.0} className="full-width">
                  <InputWrapper>
                    <InputLabel>Preferred Cooking Time (minutes)</InputLabel>
                    <InputField
                      type="number"
                      placeholder="e.g., 30"
                      value={formData.prefer_cooking_time}
                      onChange={(e) => updateField('prefer_cooking_time', e.target.value)}
                      min={1}
                      max={480}
                    />
                  </InputWrapper>
                </InputGroup>
                <InputGroup delay={1.1} className="full-width">
                  <InputWrapper>
                    <InputLabel>Exercise Routine</InputLabel>
                    <InputField
                      type="text"
                      placeholder="e.g., 3x/week gym, daily walking, None"
                      value={formData.exercise_routine}
                      onChange={(e) => updateField('exercise_routine', e.target.value)}
                    />
                  </InputWrapper>
                </InputGroup>
              </FormSection>
            </>
          )}

          {/* Status Messages */}
          {isLoading && (
            <StatusMessage className="loading">
              <FaSpinner className="spinner" />
              {LOADING_MESSAGES.CREATING_PROFILE}
            </StatusMessage>
          )}
          {submitStatus === SUBMIT_STATUS.SUCCESS && (
            <StatusMessage className="success">
              <FaCheckCircle />
              {SUCCESS_MESSAGES.PROFILE_CREATED}
            </StatusMessage>
          )}
          {submitStatus === SUBMIT_STATUS.ERROR && (
            <StatusMessage className="error">
              <FaExclamationTriangle />
              {errorMessage}
            </StatusMessage>
          )}

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
            {step > 0 && (
              <Button type="button" onClick={goBack} disabled={isLoading}>
                Back
              </Button>
            )}
            <div style={{ flex: 1 }} />
            {step < totalSteps - 1 ? (
              <Button type="button" onClick={goNext} disabled={isLoading}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <FaSpinner className="spinner" />
                    {LOADING_MESSAGES.CREATING_BUTTON}
                  </>
                ) : (
                  <>
                    <FaRocket />
                    Let's cook together!
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </FormContainer>
    </SliderContainer>
  );
};

export default UserInputForm;
