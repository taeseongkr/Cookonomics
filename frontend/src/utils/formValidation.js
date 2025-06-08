import { FORM_VALIDATION, ERROR_MESSAGES } from '../constants/formConstants';

export const validateForm = (formData) => {
  const { age, gender, height, weight, budget } = formData;
  
  // Check for required fields
  if (!age || !gender || !height || !weight || !budget) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.REQUIRED_FIELDS
    };
  }
  
  // Validate age
  if (age < FORM_VALIDATION.AGE.MIN || age > FORM_VALIDATION.AGE.MAX) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.INVALID_AGE
    };
  }
  
  // Validate height
  if (height < FORM_VALIDATION.HEIGHT.MIN || height > FORM_VALIDATION.HEIGHT.MAX) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.INVALID_HEIGHT
    };
  }
  
  // Validate weight
  if (weight < FORM_VALIDATION.WEIGHT.MIN || weight > FORM_VALIDATION.WEIGHT.MAX) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.INVALID_WEIGHT
    };
  }
  
  // Validate budget
  if (budget < FORM_VALIDATION.BUDGET.MIN || budget > FORM_VALIDATION.BUDGET.MAX) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.INVALID_BUDGET
    };
  }
  
  return {
    isValid: true,
    error: null
  };
};

export const formatFormData = (formData) => {
  return {
    age: parseInt(formData.age),
    gender: formData.gender,
    height: parseInt(formData.height), // Height should be int, not float
    weight: parseFloat(formData.weight),
    weekly_budget: parseFloat(formData.budget),
    food_preferences: formData.preferences || 'none'
  };
};
