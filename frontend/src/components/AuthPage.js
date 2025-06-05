import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaGoogle, FaSeedling, FaApple, FaCarrot, FaHeart, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-50px); }
  to { opacity: 1; transform: translateX(0); }
`;

const slideInRight = keyframes`
  from { opacity: 0; transform: translateX(50px); }
  to { opacity: 1; transform: translateX(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const AuthCard = styled.div`
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  padding: 3rem;
  border-radius: 30px;
  box-shadow: 0 15px 35px rgba(76, 175, 80, 0.15);
  text-align: center;
  animation: ${fadeIn} 1s ease-out;
  width: 90%;
  max-width: 500px;
  border: 2px solid rgba(76, 175, 80, 0.1);
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

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 2rem;
  animation: ${slideInLeft} 1s ease-out 0.3s both;
`;

const LogoIcon = styled.div`
  font-size: 4rem;
  color: #4CAF50;
  animation: ${pulse} 2s ease-in-out infinite;
  filter: drop-shadow(0 4px 8px rgba(76, 175, 80, 0.3));
`;

const Title = styled.h1`
  color: #2E7D32;
  font-size: 3rem;
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  background: linear-gradient(45deg, #2E7D32, #4CAF50, #66BB6A);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${slideInRight} 1s ease-out 0.5s both;
`;

const Subtitle = styled.p`
  color: #4a5568;
  margin-bottom: 2.5rem;
  font-size: 1.3rem;
  font-weight: 500;
  animation: ${fadeIn} 1s ease-out 0.7s both;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
  animation: ${fadeIn} 1s ease-out 0.9s both;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #4a5568;
  padding: 8px;
  border-radius: 10px;
  background: rgba(76, 175, 80, 0.05);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(76, 175, 80, 0.1);
    transform: translateY(-2px);
  }
`;

const GoogleButton = styled.button`
  background: linear-gradient(135deg, #4285F4, #34A853);
  border: none;
  border-radius: 50px;
  padding: 15px 30px;
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 0 8px 25px rgba(66, 133, 244, 0.3);
  animation: ${fadeIn} 1s ease-out 1.1s both;
  position: relative;
  overflow: hidden;

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

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(66, 133, 244, 0.4);
    
    &::before {
      width: 300px;
      height: 300px;
    }
  }

  &:active {
    transform: translateY(-1px);
  }
`;

const HeartIcon = styled(FaHeart)`
  color: #E91E63;
  margin: 0 5px;
  animation: ${bounce} 2s ease-in-out infinite;
`;

const AuthPage = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    // Simulate authentication with loading effect
    setTimeout(() => {
      navigate('/form');
    }, 500);
  };

  return (
    <AuthContainer>
      <AuthCard>
        <LogoContainer>
          <LogoIcon><FaSeedling /></LogoIcon>
          <Title>Cookonomics</Title>
        </LogoContainer>
        
        <Subtitle>
          Your Personal Nutrition & Recipe Assistant <HeartIcon />
        </Subtitle>
        
        <FeatureGrid>
          <FeatureItem>
            <FaStar color="#FFD700" />
            Personalized Recipes
          </FeatureItem>
          <FeatureItem>
            <FaHeart color="#E91E63" />
            Health Focused
          </FeatureItem>
          <FeatureItem>
            <FaApple color="#4CAF50" />
            Nutrition Tracking
          </FeatureItem>
          <FeatureItem>
            <FaCarrot color="#FF9800" />
            Budget Friendly
          </FeatureItem>
        </FeatureGrid>
        
        <GoogleButton onClick={handleGoogleSignIn}>
          <FaGoogle />
          Continue with Google
        </GoogleButton>
      </AuthCard>
    </AuthContainer>
  );
};

export default AuthPage; 