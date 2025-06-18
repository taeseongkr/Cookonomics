export const colors = {
  primary: {
    main: '#4CAF50',
    light: '#66BB6A',
    lighter: '#81C784',
    dark: '#2E7D32',
    darker: '#43A047'
  },
  secondary: {
    main: '#E8F5E9',
    light: '#F8FFF8',
    dark: '#C8E6C9'
  },
  accent: {
    red: '#F44336',
    blue: '#2196F3',
    orange: '#FF9800'
  },
  text: {
    primary: '#2E7D32',
    secondary: '#A0AEC0',
    error: '#C62828',
    success: '#2E7D32',
    info: '#1565C0'
  },
  background: {
    white: '#ffffff',
    lightGreen: '#f8fff8',
    gradient: {
      primary: 'linear-gradient(135deg, #4CAF50, #66BB6A)',
      form: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(248, 255, 248, 0.95))',
      button: 'linear-gradient(135deg, #4CAF50, #66BB6A)',
      buttonHover: 'linear-gradient(135deg, #43A047, #5CB85C)',
      buttonDisabled: 'linear-gradient(135deg, #A5A5A5, #B8B8B8)',
      title: 'linear-gradient(135deg, #2E7D32, #4CAF50, #66BB6A)',
      topBar: 'linear-gradient(90deg, #4CAF50, #66BB6A, #81C784, #66BB6A, #4CAF50)'
    }
  },
  border: {
    light: 'rgba(76, 175, 80, 0.15)',
    medium: '#E8F5E9',
    focus: '#4CAF50',
    hover: '#C8E6C9'
  },
  shadow: {
    primary: 'rgba(76, 175, 80, 0.12)',
    secondary: 'rgba(76, 175, 80, 0.08)',
    button: 'rgba(76, 175, 80, 0.25)',
    buttonHover: 'rgba(76, 175, 80, 0.35)'
  }
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  xxl: '24px',
  xxxl: '32px',
  huge: '40px'
};

export const borderRadius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  xxl: '30px',
  round: '50px'
};

export const fontSize = {
  sm: '0.875rem',
  base: '1rem',
  lg: '1.1rem',
  xl: '1.25rem',
  xxl: '1.5rem',
  xxxl: '2.2rem'
};

export const fontWeight = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700
};

export const fontFamily = {
  primary: "'Inter', sans-serif",
  heading: "'Poppins', sans-serif"
};

export const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1200px'
};
