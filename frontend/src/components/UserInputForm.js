import React, { useState } from 'react';
import { FaDollarSign, FaRocket, FaApple, FaCarrot, FaFish, FaEgg, FaBreadSlice, FaSpinner, FaCheckCircle, FaExclamationTriangle, FaCalendarAlt } from 'react-icons/fa';
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
  FormSection,
  NavigationButtons,
  BackButton,
  ProgressBar,
  ProgressFill
} from '../styles/components/UserInputForm.styles';
import { 
  isAuthenticated, 
  getCurrentUserProfile,
  deleteUserProfile 
} from '../utils/api';
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
  const [userProfile, setUserProfile] = useState(null);
  const [deletingProfile, setDeletingProfile] = useState(false);

  // On mount, check if user already has a profile
  React.useEffect(() => {
    async function checkProfile() {
      if (isAuthenticated()) {
        try {
          const profile = await getCurrentUserProfile();
          if (profile) {
            setUserProfile(profile);
            setCompleted(true);
          }
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
        // Navigate to meal-plans without any workflow data - user can create workflow from there
        navigate('/meal-plans');
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

  // Delete profile handler
  const handleDeleteProfile = async () => {
    if (!userProfile) {
      alert('No profile found to delete.');
      return;
    }

    const confirmDelete = window.confirm(
      'Are you sure you want to delete your profile? This action cannot be undone and will remove all your meal plans and data.'
    );

    if (!confirmDelete) return;

    try {
      setDeletingProfile(true);
      await deleteUserProfile(userProfile.id);
      
      // Reset state after successful deletion
      setUserProfile(null);
      setCompleted(false);
      setShowForm(true);
      
      alert('Profile deleted successfully.');
    } catch (error) {
      console.error('Error deleting profile:', error);
      alert('Failed to delete profile. Please try again.');
    } finally {
      setDeletingProfile(false);
    }
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

  // If completed, show completed UI with option to create new meal plan
  if (completed && !showForm) {
    return (
      <SliderContainer>
        <FormContainer>
          <FormTitle>🎉 Profile Complete!</FormTitle>
          <StatusMessage className="success">
            <FaCheckCircle style={{ marginRight: '8px' }} />
            Your nutrition profile is all set up!
          </StatusMessage>
          <div style={{ 
            marginTop: '20px', 
            textAlign: 'center',
            padding: '20px',
            backgroundColor: '#f7fafc',
            borderRadius: '15px',
            border: '2px solid #e2e8f0'
          }}>
            <p style={{ color: '#4a5568', marginBottom: '20px' }}>
              Ready to create a personalized meal plan?
            </p>
            <Button 
              type="button" 
              onClick={() => {
                // Navigate to meal-plans where user can create a workflow
                navigate('/meal-plans');
              }}
              style={{ 
                background: 'linear-gradient(135deg, #48bb78, #38a169)',
                marginBottom: '10px'
              }}
            >
              <FaRocket style={{ marginRight: '8px' }} />
              Go to Meal Plans
            </Button>
            <br />
            <button 
              type="button"
              onClick={() => {
                setShowForm(true);
                setCompleted(false);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#667eea',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '0.9rem',
                marginBottom: '10px'
              }}
            >
              Customize Budget & Dates
            </button>
            <br />
            <button 
              type="button"
              onClick={handleDeleteProfile}
              disabled={deletingProfile}
              style={{
                background: deletingProfile ? '#cbd5e0' : 'linear-gradient(135deg, #f56565, #e53e3e)',
                border: 'none',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                cursor: deletingProfile ? 'not-allowed' : 'pointer',
                fontSize: '0.85rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                margin: '0 auto'
              }}
            >
              {deletingProfile ? (
                <>
                  <FaSpinner className="spinner" style={{ fontSize: '0.8rem' }} />
                  Deleting...
                </>
              ) : (
                <>
                  🗑️ Delete Profile
                </>
              )}
            </button>
          </div>
        </FormContainer>
      </SliderContainer>
    );
  }

  return (
    <SliderContainer>
      <FormContainer className={`fade-${fadeState}`}>
        <FormTitle>Tell Us About Yourself</FormTitle>
        
        {/* Progress indicator */}
        <ProgressBar>
          <ProgressFill progress={((step + 1) / totalSteps) * 100} />
        </ProgressBar>
        
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
                    <InputLabel><FaDollarSign /> Budget ($)</InputLabel>
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
                <InputGroup delay={0.35} className="full-width">
                  <InputWrapper>
                    <InputLabel><FaCalendarAlt /> Start Date</InputLabel>
                    <InputField
                      type="date"
                      value={formData.start_date || ''}
                      onChange={(e) => updateField('start_date', e.target.value)}
                      min={new Date().toISOString().split('T')[0]} // Today's date as minimum
                    />
                    <FloatingFoodIcon><FaCalendarAlt /></FloatingFoodIcon>
                  </InputWrapper>
                </InputGroup>
                <InputGroup delay={0.4} className="full-width">
                  <InputWrapper>
                    <InputLabel><FaCalendarAlt /> End Date</InputLabel>
                    <InputField
                      type="date"
                      value={formData.end_date || ''}
                      onChange={(e) => updateField('end_date', e.target.value)}
                      min={formData.start_date || new Date().toISOString().split('T')[0]} // Start date as minimum
                    />
                    <FloatingFoodIcon><FaCalendarAlt /></FloatingFoodIcon>
                  </InputWrapper>
                </InputGroup>
                <InputGroup delay={0.45} className="full-width">
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
          <NavigationButtons>
            {step > 0 && (
              <BackButton type="button" onClick={goBack} disabled={isLoading}>
                ← Back
              </BackButton>
            )}
            {step < totalSteps - 1 ? (
              <Button type="button" onClick={goNext} disabled={isLoading}>
                Next Step →
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
                    Create My Profile
                  </>
                )}
              </Button>
            )}
          </NavigationButtons>
        </form>
      </FormContainer>
    </SliderContainer>
  );
};

export default UserInputForm;
