import { useState } from 'react';
import { validateForm, formatFormData } from '../utils/formValidation';
import { createUserProfile } from '../utils/api';
import { SUBMIT_STATUS, ERROR_MESSAGES } from '../constants/formConstants';

export const useUserInputForm = () => {
  // Calculate default dates
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
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
  const [workflowData, setWorkflowData] = useState(null);

  const updateField = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-adjust end date when start date changes
      if (field === 'start_date' && value) {
        const startDate = new Date(value);
        const currentEndDate = new Date(prev.end_date);
        
        // If end date is before or same as new start date, adjust it
        if (currentEndDate <= startDate) {
          const newEndDate = new Date(startDate);
          newEndDate.setDate(startDate.getDate() + 7); // Default to 7 days later
          newData.end_date = newEndDate.toISOString().split('T')[0];
        }
      }
      
      return newData;
    });
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
      
      // Store profile data (no workflow data)
      setWorkflowData({ profile: result });
      
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
    workflowData,
    updateField,
    resetForm,
    handleSubmit
  };
};
