import React from 'react';
import { FaApple, FaCarrot, FaHeart, FaStar, FaSeedling } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { signInWithGoogle, checkUserHasProfile } from '../utils/api';
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
} from '../styles/components/AuthPage.styles';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const AuthPage = () => {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Send the ID token to your backend
      const idToken = credentialResponse.credential;
      const backendResponse = await signInWithGoogle(idToken);
      
      // Store the token and user info
      localStorage.setItem('authToken', backendResponse.access_token);
      localStorage.setItem('userId', backendResponse.user_id);
      localStorage.setItem('userEmail', backendResponse.email);
      
      // Check if user already has a profile
      try {
        const hasProfile = await checkUserHasProfile();
        if (hasProfile) {
          navigate('/dashboard');
        } else {
          navigate('/form');
        }
      } catch (profileError) {
        navigate('/form');
      }
    } catch (error) {
      console.error("Google Sign-In Error after backend call:", error);
      alert(error.message || "Google Sign-In failed. Please try again.");
    }
  };

  const handleGoogleFailure = (error) => {
    console.error("Google Sign-In Failure:", error);
    alert("Google Sign-In failed. Please try again.");
  };

  if (!GOOGLE_CLIENT_ID) {
    console.error("Google Client ID not found. Make sure REACT_APP_GOOGLE_CLIENT_ID is set.");
    return (
      <AuthContainer>
        <AuthCard>
          <Title>Configuration Error</Title>
          <Subtitle>Google Client ID is missing. Please configure it in your environment variables.</Subtitle>
        </AuthCard>
      </AuthContainer>
    );
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
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
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
              useOneTap
            />
          </div>
        </AuthCard>
      </AuthContainer>
    </GoogleOAuthProvider>
  );
};

export default AuthPage;