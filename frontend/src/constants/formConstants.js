export const FORM_VALIDATION = {
  AGE: {
    MIN: 1,
    MAX: 120
  },
  HEIGHT: {
    MIN: 100,
    MAX: 250
  },
  WEIGHT: {
    MIN: 30,
    MAX: 300
  },
  BUDGET: {
    MIN: 10000
  }
};

export const GENDER_OPTIONS = [
  { value: '', label: 'Select gender' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' }
];

export const FORM_FIELDS = {
  AGE: 'age',
  GENDER: 'gender',
  HEIGHT: 'height',
  WEIGHT: 'weight',
  BUDGET: 'budget',
  PREFERENCES: 'preferences'
};

export const SUBMIT_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  LOADING: 'loading'
};

export const ERROR_MESSAGES = {
  REQUIRED_FIELDS: 'Please fill in all required fields (age, gender, height, weight, budget)',
  INVALID_AGE: 'Please enter a valid age between 1 and 120',
  INVALID_HEIGHT: 'Please enter a valid height between 100-250 cm',
  INVALID_WEIGHT: 'Please enter a valid weight between 30-300 kg',
  SUBMIT_ERROR: 'Failed to create profile. Please try again.'
};

export const SUCCESS_MESSAGES = {
  PROFILE_CREATED: 'Profile created successfully! Your nutrition plan is being prepared.'
};

export const LOADING_MESSAGES = {
  CREATING_PROFILE: 'Creating your nutrition profile...',
  CREATING_BUTTON: 'Creating Profile...'
};
