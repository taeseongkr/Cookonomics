import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaUtensils, FaCalendarAlt, FaUser, FaSignOutAlt, FaSeedling } from 'react-icons/fa';
import { isAuthenticated, getUserProfiles, getLatestUserWorkflow } from '../utils/api';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background: linear-gradient(135deg, #7DD3C0, #5AB5A1);
  color: white;
  padding: 0;
  box-shadow: 0 4px 6px rgba(125, 211, 192, 0.1), 0 2px 4px rgba(125, 211, 192, 0.06);
  position: relative;
  z-index: 100;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  
  svg {
    margin-right: 0.5rem;
    color: #48bb78;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LogoutButton = styled.button`
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-1px);
  }
`;

const Navigation = styled.nav`
  background: rgba(255, 255, 255, 0.95);
  border-top: 1px solid rgba(125, 211, 192, 0.2);
  backdrop-filter: blur(10px);
`;

const TabList = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  padding: 0 2rem;
`;

const Tab = styled.button`
  background: none;
  border: none;
  padding: 1rem 1.5rem;
  color: ${props => props.active ? '#7DD3C0' : '#4A5568'};
  font-weight: ${props => props.active ? '600' : '500'};
  border-bottom: 3px solid ${props => props.active ? '#7DD3C0' : 'transparent'};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: #7DD3C0;
    background: rgba(125, 211, 192, 0.08);
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState('');
  const [userProfiles, setUserProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeUser();
  }, []);

  const initializeUser = async () => {
    try {
      if (!isAuthenticated()) {
        navigate('/auth');
        return;
      }

      const email = localStorage.getItem('userEmail');
      const name = localStorage.getItem('userName');
      setUserName(name || email?.split('@')[0] || 'User');

      // Load user profiles
      const profiles = await getUserProfiles();
      setUserProfiles(profiles || []);
    } catch (error) {
      console.error('Error initializing user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    navigate('/auth');
  };

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/') return 'home';
    if (path === '/meal-plans') return 'meals';
    if (path === '/calendar') return 'calendar';
    if (path === '/profile') return 'profile';
    return 'home';
  };

  const navigateToTab = (tab) => {
    switch (tab) {
      case 'home':
        navigate('/dashboard');
        break;
      case 'meals':
        navigate('/meal-plans');
        break;
      case 'calendar':
        navigate('/calendar');
        break;
      case 'profile':
        navigate('/profile');
        break;
      default:
        navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <LayoutContainer>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '1.2rem',
          color: '#7DD3C0'
        }}>
          Loading...
        </div>
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer>
      <Header>
        <HeaderContent>
          <Logo>
            <FaSeedling />
            Cookonomics
          </Logo>
          <UserInfo>
            <span>{userName}</span>
            <LogoutButton onClick={handleLogout}>
              <FaSignOutAlt />
              Logout
            </LogoutButton>
          </UserInfo>
        </HeaderContent>
        <Navigation>
          <TabList>
            <Tab 
              active={getActiveTab() === 'home'}
              onClick={() => navigateToTab('home')}
            >
              <FaHome />
              Home
            </Tab>
            <Tab 
              active={getActiveTab() === 'meals'}
              onClick={() => navigateToTab('meals')}
            >
              <FaUtensils />
              Meal Plans
            </Tab>
            <Tab 
              active={getActiveTab() === 'calendar'}
              onClick={() => navigateToTab('calendar')}
            >
              <FaCalendarAlt />
              Calendar
            </Tab>
            <Tab 
              active={getActiveTab() === 'profile'}
              onClick={() => navigateToTab('profile')}
            >
              <FaUser />
              Profile
            </Tab>
          </TabList>
        </Navigation>
      </Header>
      <MainContent>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout; 