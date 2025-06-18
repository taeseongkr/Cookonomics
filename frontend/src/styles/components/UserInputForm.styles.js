import styled from 'styled-components';
import { fadeIn, float, spin, shimmer } from '../animations/keyframes';
import { colors, spacing, borderRadius, fontSize, fontWeight, fontFamily } from '../themes/theme';

export const SliderContainer = styled.div`
  width: 600px;
  max-width: 95vw;
  animation: ${fadeIn} 0.8s ease-out;
  position: relative;
`;

export const FormContainer = styled.div`
  padding: ${spacing.huge};
  background: ${colors.background.gradient.form};
  border-radius: 35px;
  box-shadow: 
    0 20px 40px ${colors.shadow.primary},
    0 8px 16px ${colors.shadow.secondary},
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  width: 100%;
  max-width: 550px;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border: 3px solid ${colors.border.light};
  overflow: hidden;
  box-sizing: border-box;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${colors.background.gradient.topBar};
    background-size: 200% 100%;
    animation: ${shimmer} 3s ease-in-out infinite;
  }
`;

export const FormTitle = styled.h2`
  color: ${colors.text.primary};
  font-size: ${fontSize.xxxl};
  margin: 0 0 30px 0;
  text-align: center;
  font-family: ${fontFamily.heading};
  font-weight: ${fontWeight.bold};
  background: ${colors.background.gradient.title};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: ${colors.background.gradient.primary};
    border-radius: 2px;
  }
`;

export const InputGroup = styled.div`
  margin-bottom: ${spacing.xl};
  position: relative;
  animation: ${fadeIn} 0.5s ease-out;
  animation-fill-mode: both;
  animation-delay: ${props => props.delay}s;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${spacing.xl};

  &.full-width {
    grid-template-columns: 1fr;
  }
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const InputLabel = styled.label`
  display: block;
  margin-bottom: ${spacing.sm};
  color: ${colors.text.primary};
  font-weight: ${fontWeight.semibold};
  font-size: ${fontSize.base};
  display: flex;
  align-items: center;
  gap: ${spacing.sm};

  .required {
    color: ${colors.accent.red};
    font-weight: ${fontWeight.bold};
  }
`;

export const InputField = styled.input`
  width: 100%;
  padding: 14px 18px;
  border: 2px solid ${colors.border.medium};
  border-radius: ${borderRadius.lg};
  font-size: ${fontSize.base};
  transition: all 0.3s ease;
  background: linear-gradient(145deg, ${colors.background.white}, ${colors.background.lightGreen});
  box-sizing: border-box;
  font-family: ${fontFamily.primary};

  &:focus {
    outline: none;
    border-color: ${colors.border.focus};
    box-shadow: 
      0 0 0 4px rgba(76, 175, 80, 0.1),
      0 4px 12px rgba(76, 175, 80, 0.15);
    transform: translateY(-1px);
  }

  &:hover {
    border-color: ${colors.border.hover};
    transform: translateY(-1px);
  }

  &::placeholder {
    color: ${colors.text.secondary};
    font-weight: ${fontWeight.normal};
  }
`;

export const SelectField = styled.select`
  width: 100%;
  padding: 14px 18px;
  border: 2px solid ${colors.border.medium};
  border-radius: ${borderRadius.lg};
  font-size: ${fontSize.base};
  transition: all 0.3s ease;
  background: linear-gradient(145deg, ${colors.background.white}, ${colors.background.lightGreen});
  box-sizing: border-box;
  font-family: ${fontFamily.primary};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${colors.border.focus};
    box-shadow: 
      0 0 0 4px rgba(76, 175, 80, 0.1),
      0 4px 12px rgba(76, 175, 80, 0.15);
    transform: translateY(-1px);
  }

  &:hover {
    border-color: ${colors.border.hover};
    transform: translateY(-1px);
  }
`;

export const Button = styled.button`
  padding: ${spacing.lg} ${spacing.xxxl};
  background: ${colors.background.gradient.button};
  color: white;
  border: none;
  border-radius: ${borderRadius.lg};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.md};
  margin: ${spacing.xxl} auto 0;
  font-size: ${fontSize.lg};
  font-weight: ${fontWeight.bold};
  transition: all 0.3s ease;
  box-shadow: 
    0 8px 24px ${colors.shadow.button},
    0 4px 8px rgba(76, 175, 80, 0.15);
  position: relative;
  overflow: hidden;
  min-width: 200px;

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
    background: ${colors.background.gradient.buttonHover};
    transform: translateY(-3px);
    box-shadow: 
      0 12px 32px ${colors.shadow.buttonHover},
      0 6px 12px rgba(76, 175, 80, 0.2);
    
    &::before {
      width: 300px;
      height: 300px;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    background: ${colors.background.gradient.buttonDisabled};
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 4px 12px rgba(165, 165, 165, 0.15);
  }
`;

export const StatusMessage = styled.div`
  padding: ${spacing.lg} ${spacing.xl};
  border-radius: ${borderRadius.md};
  margin: ${spacing.lg} 0;
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  font-weight: ${fontWeight.semibold};
  font-size: ${fontSize.base};
  animation: ${fadeIn} 0.3s ease-out;

  &.success {
    background: linear-gradient(135deg, #E8F5E9, #C8E6C9);
    color: ${colors.text.success};
    border: 2px solid ${colors.primary.main};
  }

  &.error {
    background: linear-gradient(135deg, #FFEBEE, #FFCDD2);
    color: ${colors.text.error};
    border: 2px solid ${colors.accent.red};
  }

  &.loading {
    background: linear-gradient(135deg, #E3F2FD, #BBDEFB);
    color: ${colors.text.info};
    border: 2px solid ${colors.accent.blue};
  }

  .spinner {
    animation: ${spin} 1s linear infinite;
  }
`;

export const FloatingFoodIcon = styled.div`
  position: absolute;
  right: -40px;
  top: 50%;
  transform: translateY(-50%);
  color: ${colors.primary.main};
  opacity: 0.3;
  font-size: 1.4rem;
  animation: ${float} 4s ease-in-out infinite;
  filter: drop-shadow(0 2px 4px rgba(76, 175, 80, 0.2));
`;

export const FormSection = styled.div`
  background: rgba(255, 255, 255, 0.4);
  border-radius: ${spacing.xl};
  padding: ${spacing.xxl};
  margin-bottom: ${spacing.xl};
  border: 1px solid ${colors.border.light};
  backdrop-filter: blur(10px);
`;
