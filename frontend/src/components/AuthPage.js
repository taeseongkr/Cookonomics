import React from 'react';
import { FaGoogle, FaSeedling, FaApple, FaCarrot, FaHeart, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {
  AuthContainer,
  AuthCard,
  LogoContainer,
  LogoIcon,
  Title,
  Subtitle,
  FeaturesList,
  FeatureItem,
  FeatureIcon,
  FeatureText,
  GoogleButton
} from '../styles/components/AuthPage.styles';

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
          Your Personal Nutrition & Recipe Assistant <FaHeart color="#E91E63" />
        </Subtitle>
        <FeaturesList>
          <FeatureItem>
            <FeatureIcon><FaStar color="#FFD700" /></FeatureIcon>
            <FeatureText>Personalized Recipes</FeatureText>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon><FaHeart color="#E91E63" /></FeatureIcon>
            <FeatureText>Health Focused</FeatureText>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon><FaApple color="#4CAF50" /></FeatureIcon>
            <FeatureText>Nutrition Tracking</FeatureText>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon><FaCarrot color="#FF9800" /></FeatureIcon>
            <FeatureText>Budget Friendly</FeatureText>
          </FeatureItem>
        </FeaturesList>
        <GoogleButton onClick={handleGoogleSignIn}>
          <FaGoogle />
          Continue with Google
        </GoogleButton>
      </AuthCard>
    </AuthContainer>
  );
};

export default AuthPage;