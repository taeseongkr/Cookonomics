import styled from 'styled-components';
import { fadeIn, slideInLeft, slideInRight, pulse, shimmer, bounce } from '../animations/keyframes';
import theme from '../themes/theme';

export const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const AuthCard = styled.div`
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  padding: 3rem;
  border-radius: 30px;
  box-shadow: ${theme.shadows.extra};
  text-align: center;
  animation: ${fadeIn} 1s ease-out;
  width: 90%;
  max-width: 500px;
  border: 2px solid ${theme.colors.borderLight};
  position: relative;
  z-index: 2;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(125,211,192,0.1), transparent);
    animation: ${shimmer} 3s infinite;
  }
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 2rem;
  animation: ${slideInLeft} 1s ease-out 0.3s both;
`;

export const LogoIcon = styled.div`
  font-size: 4rem;
  color: ${theme.colors.teal};
  animation: ${pulse} 2s ease-in-out infinite;
  filter: drop-shadow(0 4px 8px rgba(125, 211, 192, 0.3));
`;

export const Title = styled.h1`
  color: ${theme.colors.textPrimary};
  font-size: 3rem;
  margin: 0;
  font-family: ${theme.typography.fonts.heading};
  font-weight: ${theme.typography.weights.bold};
  background: ${theme.gradients.teal};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${slideInRight} 1s ease-out 0.5s both;
`;

export const Subtitle = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.sizes.button};
  margin: 1rem 0 2rem 0;
  animation: ${fadeIn} 1s ease-out 0.7s both;
`;

export const GoogleButton = styled.button`
  background: ${theme.colors.backgroundAlt};
  border: 2px solid ${theme.colors.border};
  padding: ${theme.spacing.lg} ${theme.spacing.xxxl};
  border-radius: ${theme.borderRadius.round};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.md};
  font-size: ${theme.typography.sizes.button};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.textPrimary};
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-bottom: ${theme.spacing.xl};
  animation: ${fadeIn} 1s ease-out 0.9s both;

  &:hover {
    background: ${theme.colors.secondary};
    border-color: ${theme.colors.teal};
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(125, 211, 192, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const FeaturesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.xl};
  margin: 2rem 0;
  animation: ${fadeIn} 1s ease-out 1.1s both;
`;

export const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.lg};
  background: rgba(255, 255, 255, 0.7);
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.borderLight};
  transition: all 0.3s ease;

  &:hover {
    background: ${theme.colors.secondary};
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(125, 211, 192, 0.15);
  }
`;

export const FeatureIcon = styled.div`
  font-size: ${theme.typography.sizes.h4};
  color: ${theme.colors.teal};
  animation: ${bounce} 2s ease-in-out infinite;
  animation-delay: ${props => props.delay || 0}s;
`;

export const FeatureText = styled.span`
  color: ${theme.colors.textPrimary};
  font-weight: ${theme.typography.weights.medium};
  font-size: ${theme.typography.sizes.small};
`;

export const FloatingElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`;

export const FloatingIcon = styled.div`
  position: absolute;
  font-size: ${theme.typography.sizes.h3};
  color: ${theme.colors.tealLight};
  opacity: 0.6;
  animation: ${bounce} 3s ease-in-out infinite;
  animation-delay: ${props => props.delay || 0}s;
`;
