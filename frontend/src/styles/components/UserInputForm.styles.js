import styled from 'styled-components';
import { fadeIn, float, spin, shimmer } from '../animations/keyframes';
import theme from '../themes/theme';

export const SliderContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  animation: ${fadeIn} 0.8s ease-out;
  position: relative;
`;

export const FormContainer = styled.div`
  background: white;
  border-radius: 24px;
  padding: 3rem 2.5rem;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.08),
    0 8px 16px rgba(0, 0, 0, 0.04);
  width: 100%;
  box-sizing: border-box;
  position: relative;
  border: 1px solid #f0f4f8;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    margin: 1rem;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${theme.gradients.teal};
    border-radius: 24px 24px 0 0;
  }
`;

export const FormTitle = styled.h2`
  color: ${theme.colors.textPrimary};
  font-size: 2.5rem;
  margin: 0 0 2rem 0;
  text-align: center;
  font-family: ${theme.typography.fonts.heading};
  font-weight: ${theme.typography.weights.bold};
  background: ${theme.gradients.teal};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;

  @media (max-width: 768px) {
    font-size: 2rem;
    margin: 0 0 1.5rem 0;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: ${theme.gradients.teal};
    border-radius: 2px;
  }
`;

export const InputGroup = styled.div`
  margin-bottom: 2rem;
  position: relative;
  animation: ${fadeIn} 0.5s ease-out;
  animation-fill-mode: both;
  animation-delay: ${props => props.delay}s;
  
  /* Grid layout for responsive design */
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;

  &.full-width {
    grid-template-columns: 1fr;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const InputLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  color: ${theme.colors.textPrimary};
  font-weight: ${theme.typography.weights.semibold};
  font-size: 1rem;

  svg {
    color: ${theme.colors.teal};
    font-size: 1.1rem;
  }

  .required {
    color: #e74c3c;
    font-weight: ${theme.typography.weights.bold};
  }
`;

export const InputField = styled.input`
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  font-family: ${theme.typography.fonts.body};
  background: white;
  transition: all 0.3s ease;
  box-sizing: border-box;
  min-height: 56px;

  &:focus {
    outline: none;
    border-color: ${theme.colors.teal};
    box-shadow: 
      0 0 0 4px rgba(125, 211, 192, 0.1),
      0 4px 12px rgba(125, 211, 192, 0.15);
    transform: translateY(-1px);
  }

  &:hover:not(:focus) {
    border-color: ${theme.colors.tealLight};
  }

  &::placeholder {
    color: #a0aec0;
    font-weight: ${theme.typography.weights.normal};
  }

  /* Specific styles for different input types */
  &[type="number"] {
    -moz-appearance: textfield;
    
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  &[type="date"] {
    position: relative;
    
    &::-webkit-calendar-picker-indicator {
      color: ${theme.colors.teal};
      cursor: pointer;
    }
  }

  /* Error state */
  &.error {
    border-color: #e74c3c;
    box-shadow: 0 0 0 4px rgba(231, 76, 60, 0.1);
  }
`;

export const SelectField = styled.select`
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  font-family: ${theme.typography.fonts.body};
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-sizing: border-box;
  min-height: 56px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 1rem center;
  background-repeat: no-repeat;
  background-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${theme.colors.teal};
    box-shadow: 
      0 0 0 4px rgba(125, 211, 192, 0.1),
      0 4px 12px rgba(125, 211, 192, 0.15);
    transform: translateY(-1px);
  }

  &:hover:not(:focus) {
    border-color: ${theme.colors.tealLight};
  }

  option {
    padding: 0.5rem;
    background: white;
    color: ${theme.colors.textPrimary};
  }
`;

export const Button = styled.button`
  padding: 1rem 2.5rem;
  background: ${theme.gradients.teal};
  color: white;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin: 2.5rem auto 0;
  font-size: 1.1rem;
  font-weight: ${theme.typography.weights.bold};
  font-family: ${theme.typography.fonts.body};
  transition: all 0.3s ease;
  box-shadow: 
    0 8px 24px rgba(125, 211, 192, 0.25),
    0 4px 8px rgba(125, 211, 192, 0.15);
  position: relative;
  overflow: hidden;
  min-width: 200px;
  min-height: 56px;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transition: all 0.3s ease;
    transform: translate(-50%, -50%);
  }

  &:hover:not(:disabled) {
    background: ${theme.gradients.tealHover};
    transform: translateY(-3px);
    box-shadow: 
      0 12px 32px rgba(125, 211, 192, 0.35),
      0 6px 12px rgba(125, 211, 192, 0.25);
    
    &::before {
      width: 300px;
      height: 300px;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    background: linear-gradient(135deg, #cbd5e0, #a0aec0);
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 4px 12px rgba(160, 174, 192, 0.15);
  }

  /* Spinner animation for loading state */
  .spinner {
    animation: ${spin} 1s linear infinite;
  }
`;

export const StatusMessage = styled.div`
  padding: 1rem 1.25rem;
  border-radius: 12px;
  margin: 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: ${theme.typography.weights.semibold};
  font-size: 1rem;
  animation: ${fadeIn} 0.3s ease-out;

  &.success {
    background: linear-gradient(135deg, #d4edda, #c3e6cb);
    color: #155724;
    border: 2px solid #28a745;
  }

  &.error {
    background: linear-gradient(135deg, #f8d7da, #f5c6cb);
    color: #721c24;
    border: 2px solid #dc3545;
  }

  &.loading {
    background: linear-gradient(135deg, #cce7ff, #b3d9ff);
    color: #0056b3;
    border: 2px solid #007bff;
  }

  .spinner {
    animation: ${spin} 1s linear infinite;
  }
`;

export const FloatingFoodIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.colors.teal};
  opacity: 0.2;
  font-size: 1.2rem;
  pointer-events: none;
  z-index: 1;
`;

export const FormSection = styled.div`
  background: #fafbfc;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid #f0f4f8;
  position: relative;

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

/* Navigation buttons for multi-step form */
export const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2.5rem;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

export const BackButton = styled.button`
  padding: 0.875rem 1.5rem;
  background: transparent;
  color: ${theme.colors.teal};
  border: 2px solid ${theme.colors.teal};
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: ${theme.typography.weights.semibold};
  font-family: ${theme.typography.fonts.body};
  transition: all 0.3s ease;
  min-height: 48px;

  &:hover {
    background: ${theme.colors.teal};
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(125, 211, 192, 0.25);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

/* Progress indicator */
export const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  margin-bottom: 2rem;
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  height: 100%;
  background: ${theme.gradients.teal};
  border-radius: 2px;
  transition: width 0.3s ease;
  width: ${props => props.progress}%;
`;

/* Responsive adjustments */
export const ResponsiveWrapper = styled.div`
  @media (max-width: 768px) {
    .two-column {
      grid-template-columns: 1fr !important;
    }
  }
`;
