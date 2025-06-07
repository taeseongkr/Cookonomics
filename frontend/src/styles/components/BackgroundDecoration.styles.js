import styled, { keyframes } from 'styled-components';
import { gradientAnimation } from '../animations/keyframes';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #4CAF50, #81C784, #66BB6A, #4CAF50);
  background-size: 400% 400%;
  animation: ${gradientAnimation} 15s ease infinite;
  z-index: -1;
`;

export const AnimatedShape = styled.div`
  position: absolute;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: ${float} 6s ease-in-out infinite;
`;

export const FloatingShape = styled.div`
  position: absolute;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 15px;
  animation: ${rotate} 8s linear infinite;
`;
