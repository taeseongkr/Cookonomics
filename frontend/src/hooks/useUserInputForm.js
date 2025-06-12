import { useState } from 'react';
import { validateForm, formatFormData } from '../utils/formValidation';
import { createUserProfile } from '../utils/api';
import { SUBMIT_STATUS, ERROR_MESSAGES } from '../constants/formConstants';

export const useUserInputForm = () => {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
    budget: '',
    preferences: '',
    cooking_level: '',
    religion: '',
    goal: '',
    health_issues: '',
    allergies: '',
    prefer_cooking_time: '',
    exercise_routine: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      age: '',
      gender: '',
      height: '',
      weight: '',
      budget: '',
      preferences: '',
      cooking_level: '',
      religion: '',
      goal: '',
      health_issues: '',
      allergies: '',
      prefer_cooking_time: '',
      exercise_routine: '',
    });
    setSubmitStatus(null);
    setErrorMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Reset status
    setSubmitStatus(null);
    setErrorMessage('');
    
    // Validate form
    const validation = validateForm(formData);
    if (!validation.isValid) {
      setSubmitStatus(SUBMIT_STATUS.ERROR);
      setErrorMessage(validation.error);
      return;
    }

    setIsLoading(true);
    
    try {
      const formattedData = formatFormData(formData);
      const result = await createUserProfile(formattedData);
      console.log('Profile created successfully:', result);
      
      setSubmitStatus(SUBMIT_STATUS.SUCCESS);
      
      // Reset form after successful submission
      setTimeout(() => {
        resetForm();
      }, 3000);

    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus(SUBMIT_STATUS.ERROR);
      setErrorMessage(error.message || ERROR_MESSAGES.SUBMIT_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    submitStatus,
    errorMessage,
    updateField,
    resetForm,
    handleSubmit
  };
};
