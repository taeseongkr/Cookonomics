import styled from 'styled-components';
import { fadeIn, slideInLeft, slideInRight, pulse, shimmer, bounce } from '../animations/keyframes';
import { colors, spacing, borderRadius, fontSize, fontWeight, fontFamily } from '../themes/theme';

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
  box-shadow: 0 15px 35px ${colors.shadow.primary};
  text-align: center;
  animation: ${fadeIn} 1s ease-out;
  width: 90%;
  max-width: 500px;
  border: 2px solid ${colors.border.light};
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
    background: linear-gradient(90deg, transparent, rgba(76,175,80,0.1), transparent);
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
  color: ${colors.primary.main};
  animation: ${pulse} 2s ease-in-out infinite;
  filter: drop-shadow(0 4px 8px rgba(76, 175, 80, 0.3));
`;

export const Title = styled.h1`
  color: ${colors.text.primary};
  font-size: 3rem;
  margin: 0;
  font-family: ${fontFamily.heading};
  font-weight: ${fontWeight.bold};
  background: ${colors.background.gradient.title};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${slideInRight} 1s ease-out 0.5s both;
`;

export const Subtitle = styled.p`
  color: ${colors.text.secondary};
  font-size: ${fontSize.lg};
  margin: 1rem 0 2rem 0;
  animation: ${fadeIn} 1s ease-out 0.7s both;
`;

export const GoogleButton = styled.button`
  background: ${colors.background.white};
  border: 2px solid ${colors.border.medium};
  padding: ${spacing.lg} ${spacing.xxxl};
  border-radius: ${borderRadius.round};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.md};
  font-size: ${fontSize.lg};
  font-weight: ${fontWeight.semibold};
  color: ${colors.text.primary};
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-bottom: ${spacing.xl};
  animation: ${fadeIn} 1s ease-out 0.9s both;

  &:hover {
    background: ${colors.secondary.main};
    border-color: ${colors.border.focus};
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(76, 175, 80, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const FeaturesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${spacing.xl};
  margin: 2rem 0;
  animation: ${fadeIn} 1s ease-out 1.1s both;
`;

export const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  padding: ${spacing.lg};
  background: rgba(255, 255, 255, 0.7);
  border-radius: ${borderRadius.lg};
  border: 1px solid ${colors.border.light};
  transition: all 0.3s ease;

  &:hover {
    background: ${colors.secondary.main};
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(76, 175, 80, 0.15);
  }
`;

export const FeatureIcon = styled.div`
  font-size: ${fontSize.xl};
  color: ${colors.primary.main};
  animation: ${bounce} 2s ease-in-out infinite;
  animation-delay: ${props => props.delay || 0}s;
`;

export const FeatureText = styled.span`
  color: ${colors.text.primary};
  font-weight: ${fontWeight.medium};
  font-size: ${fontSize.sm};
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
  font-size: ${fontSize.xxl};
  color: ${colors.primary.light};
  opacity: 0.6;
  animation: ${bounce} 3s ease-in-out infinite;
  animation-delay: ${props => props.delay || 0}s;
`;
