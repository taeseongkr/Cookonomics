import React from 'react';
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

const UserInputForm = () => {
  const {
    formData,
    isLoading,
    submitStatus,
    errorMessage,
    updateField,
    handleSubmit
  } = useUserInputForm();

  return (
    <SliderContainer>
      <FormContainer>
        <FormTitle>Tell Us About Yourself</FormTitle>
        <form onSubmit={handleSubmit}>
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
          
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <FaSpinner className="spinner" />
                {LOADING_MESSAGES.CREATING_BUTTON}
              </>
            ) : (
              <>
                <FaRocket />
                Create My Nutrition Plan
              </>
            )}
          </Button>
        </form>
      </FormContainer>
    </SliderContainer>
  );
};

export default UserInputForm;
