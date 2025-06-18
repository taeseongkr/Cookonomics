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
    MIN: 1, // Minimum budget should be at least $1
    MAX: 9999999999
  },
  DATE: {
    MIN_DAYS_AHEAD: 0, // Can start today
    MAX_DAYS_AHEAD: 365 // Max 1 year ahead
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
  START_DATE: 'start_date',
  END_DATE: 'end_date',
  PREFERENCES: 'preferences'
};

export const SUBMIT_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  LOADING: 'loading'
};

export const ERROR_MESSAGES = {
  REQUIRED_FIELDS: 'Please fill in all required fields (age, gender, height, weight, budget, start date, end date)',
  INVALID_AGE: 'Please enter a valid age between 1 and 120',
  INVALID_HEIGHT: 'Please enter a valid height between 100-250 cm',
  INVALID_WEIGHT: 'Please enter a valid weight between 30-300 kg',
  INVALID_BUDGET: 'Please enter a valid budget (must be at least $1)',
  INVALID_START_DATE: 'Please select a valid start date',
  INVALID_END_DATE: 'Please select a valid end date',
  INVALID_DATE_RANGE: 'End date must be after start date',
  SUBMIT_ERROR: 'Failed to create profile. Please try again.'
};

export const SUCCESS_MESSAGES = {
  PROFILE_CREATED: 'Profile created successfully! Your nutrition plan is being prepared.'
};

export const LOADING_MESSAGES = {
  CREATING_PROFILE: 'Creating your nutrition profile...',
  CREATING_BUTTON: 'Creating Profile...'
};
