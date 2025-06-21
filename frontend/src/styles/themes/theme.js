export const colors = {
  primary: '#7DD3C0',
  primaryLight: '#BDE0E0',
  primaryDark: '#5AB5A1',
  secondary: '#CCECEC',
  secondaryLight: '#E8F5F5',
  secondaryDark: '#A8D8D8',
  background: '#F5F8F7',
  backgroundAlt: '#FFFFFF',
  backgroundCard: '#FFFFFF',
  textPrimary: '#2D3748',
  textSecondary: '#4A5568',
  textLight: '#718096',
  textMuted: '#A0AEC0',
  border: '#E2E8F0',
  borderLight: '#F7FAFC',
  borderHover: '#CBD5E0',
  success: '#48BB78',
  successLight: '#C6F6D5',
  successDark: '#38A169',
  warning: '#ED8936',
  warningLight: '#FEEBC8',
  warningDark: '#C05621',
  error: '#F56565',
  errorLight: '#FED7D7',
  errorDark: '#C53030',
  info: '#4299E1',
  infoLight: '#BEE3F8',
  infoDark: '#2B6CB0',
  link: '#7DD3C0',
  linkHover: '#5AB5A1',
  button: {
    primary: {
      background: 'linear-gradient(135deg, #7DD3C0, #5AB5A1)',
      backgroundHover: 'linear-gradient(135deg, #6BC4B0, #4A9B87)',
      text: '#FFFFFF',
      border: 'transparent'
    },
    secondary: {
      background: '#BDE0E0',
      backgroundHover: '#A8D8D8',
      text: '#2D3748',
      border: '#BDE0E0'
    },
    outline: {
      background: 'transparent',
      backgroundHover: '#F5F8F7',
      text: '#7DD3C0',
      border: '#7DD3C0'
    },
    ghost: {
      background: 'transparent',
      backgroundHover: '#E8F5F5',
      text: '#4A5568',
      border: 'transparent'
    }
  }
};

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  xxl: '3rem'
};

export const borderRadius = {
  sm: '6px',
  md: '10px',
  lg: '15px',
  xl: '20px',
  xxl: '30px',
  round: '50%'
};

export const fontSize = {
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  xxl: '1.5rem',
  xxxl: '2rem'
};

export const fontWeight = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700
};

export const fontFamily = {
  primary: "'Poppins', 'Inter', 'Roboto', Arial, sans-serif"
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  xxl: '1536px'
};

export const gradients = {
  primary: 'linear-gradient(135deg, #7DD3C0, #5AB5A1)',
  secondary: 'linear-gradient(135deg, #BDE0E0, #CCECEC)',
  background: 'linear-gradient(135deg, #F5F8F7, #E8F5F5)',
  card: 'linear-gradient(135deg, #FFFFFF, #F9FFFE)',
  success: 'linear-gradient(135deg, #C6F6D5, #9AE6B4)',
  warning: 'linear-gradient(135deg, #FEEBC8, #FBD38D)',
  error: 'linear-gradient(135deg, #FED7D7, #FEB2B2)'
};

export const shadows = {
  small: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  medium: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
  large: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
  extra: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
  card: '0 4px 6px rgba(125, 211, 192, 0.1), 0 2px 4px rgba(125, 211, 192, 0.06)',
  cardHover: '0 8px 25px rgba(125, 211, 192, 0.15), 0 4px 10px rgba(125, 211, 192, 0.1)'
};

export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060
};

export const lineHeights = {
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75
};

// Updated theme structure for proper imports
const theme = {
  colors: {
    teal: '#7DD3C0',
    tealLight: '#BDE0E0',
    tealDark: '#5AB5A1',
    primaryLight: '#BDE0E0',
    primaryDark: '#5AB5A1',
    secondary: '#CCECEC',
    secondaryLight: '#E8F5F5',
    secondaryDark: '#A8D8D8',
    background: '#F5F8F7',
    backgroundAlt: '#FFFFFF',
    backgroundLight: '#E8F5F5',
    backgroundCard: '#FFFFFF',
    textPrimary: '#2D3748',
    textSecondary: '#4A5568',
    textLight: '#718096',
    textMuted: '#A0AEC0',
    border: '#E2E8F0',
    borderLight: '#F7FAFC',
    borderHover: '#CBD5E0',
    success: '#48BB78',
    successLight: '#C6F6D5',
    successDark: '#38A169',
    warning: '#ED8936',
    warningLight: '#FEEBC8',
    warningDark: '#C05621',
    error: '#F56565',
    errorLight: '#FED7D7',
    errorDark: '#C53030',
    info: '#4299E1',
    infoLight: '#BEE3F8',
    infoDark: '#2B6CB0',
    link: '#7DD3C0',
    linkHover: '#5AB5A1',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
    xxxl: '4rem',
    huge: '5rem'
  },
  borderRadius: {
    sm: '6px',
    md: '10px',
    lg: '15px',
    xl: '20px',
    xxl: '30px',
    round: '50%'
  },
  typography: {
    sizes: {
      h1: '2.5rem',
      h2: '2rem',
      h3: '1.5rem',
      h4: '1.25rem',
      body: '1rem',
      button: '1.125rem',
      small: '0.875rem'
    },
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    fonts: {
      heading: "'Poppins', 'Inter', 'Roboto', Arial, sans-serif",
      body: "'Inter', 'Roboto', Arial, sans-serif"
    }
  },
  gradients: {
    teal: 'linear-gradient(135deg, #7DD3C0, #5AB5A1)',
    tealHover: 'linear-gradient(135deg, #6BC4B0, #4A9B87)',
    tealGlow: 'linear-gradient(135deg, rgba(125, 211, 192, 0.1), rgba(189, 224, 224, 0.15))',
    secondary: 'linear-gradient(135deg, #BDE0E0, #CCECEC)',
    background: 'linear-gradient(135deg, #F5F8F7, #E8F5F5)',
    card: 'linear-gradient(135deg, #FFFFFF, #F9FFFE)',
    success: 'linear-gradient(135deg, #C6F6D5, #9AE6B4)',
    warning: 'linear-gradient(135deg, #FEEBC8, #FBD38D)',
    error: 'linear-gradient(135deg, #FED7D7, #FEB2B2)'
  },
  shadows: {
    small: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    medium: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
    large: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
    extra: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
    card: '0 4px 6px rgba(125, 211, 192, 0.1), 0 2px 4px rgba(125, 211, 192, 0.06)',
    cardHover: '0 8px 25px rgba(125, 211, 192, 0.15), 0 4px 10px rgba(125, 211, 192, 0.1)',
    button: '0 8px 24px rgba(125, 211, 192, 0.3), 0 4px 8px rgba(125, 211, 192, 0.15)',
    buttonHover: '0 12px 32px rgba(125, 211, 192, 0.4), 0 6px 12px rgba(125, 211, 192, 0.2)'
  },
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    xxl: '1536px'
  }
};

export default theme;
