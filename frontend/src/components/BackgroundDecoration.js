import React from 'react';
import styled, { keyframes } from 'styled-components';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const BackgroundContainer = styled.div`
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

const AnimatedShape = styled.div`
  position: absolute;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
  }
`;

const FloatingShape = styled.div`
  position: absolute;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 15px;
  animation: rotate 8s linear infinite;
  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const BackgroundDecoration = () => {
  return (
    <BackgroundContainer>
      <AnimatedShape style={{ top: '-100px', right: '-100px', width: '300px', height: '300px' }} />
      <AnimatedShape style={{ bottom: '-150px', left: '-150px', width: '400px', height: '400px' }} />
      <FloatingShape style={{ top: '150px', left: '50px', width: '60px', height: '60px' }} />
      <FloatingShape style={{ top: '300px', right: '80px', width: '40px', height: '40px' }} />
      <FloatingShape style={{ bottom: '200px', left: '100px', width: '50px', height: '50px' }} />
    </BackgroundContainer>
  );
};

export default BackgroundDecoration; 