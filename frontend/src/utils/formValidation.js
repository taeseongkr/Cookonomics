import { FORM_VALIDATION, ERROR_MESSAGES } from '../constants/formConstants';

export const validateForm = (formData) => {
  const { age, gender, height, weight } = formData;
  
  // Check for required fields
  if (!age || !gender || !height || !weight ) {
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

  
  // Validate dates
  
  
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
    budget: parseFloat(formData.budget), // Keep as 'budget' for workflow creation
    start_date: formData.start_date, // Keep as YYYY-MM-DD string format
    end_date: formData.end_date, // Keep as YYYY-MM-DD string format
    food_preferences: formData.preferences || 'none',
    cooking_level: formData.cooking_level || null,
    religion: formData.religion || null,
    goal: formData.goal || null,
    health_issues: formData.health_issues || null,
    allergies: formData.allergies || null,
    prefer_cooking_time: formData.prefer_cooking_time ? parseInt(formData.prefer_cooking_time) : null,
    exercise_routine: formData.exercise_routine || null,
  };
};
