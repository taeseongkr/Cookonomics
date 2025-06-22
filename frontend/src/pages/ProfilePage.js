import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaUser, FaEdit, FaPlus, FaTrash, FaSpinner } from 'react-icons/fa';
import { getUserProfiles, updateUserProfile, createUserProfile, deleteUserProfile } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const ProfileContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #2d3748;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CreateButton = styled.button`
  background: linear-gradient(135deg, #7DD3C0, #5AB5A1);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(125, 211, 192, 0.3);
  }
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ProfileTitle = styled.h3`
  color: #2d3748;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
`;

const ProfileActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: ${props => props.danger ? '#fed7d7' : '#edf2f7'};
  color: ${props => props.danger ? '#e53e3e' : '#4a5568'};
  border: none;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    background: ${props => props.danger ? '#feb2b2' : '#e2e8f0'};
  }
`;

const ProfileInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
`;

const InfoItem = styled.div`
  background: #f7fafc;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const InfoLabel = styled.div`
  font-size: 0.8rem;
  color: #718096;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.div`
  font-size: 0.95rem;
  color: #2d3748;
  font-weight: 500;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #7DD3C0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #4a5568;
  background: white;
  border-radius: 15px;
  border: 1px solid #e2e8f0;
`;

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const userProfiles = await getUserProfiles();
      setProfiles(userProfiles || []);
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = () => {
    navigate('/form');
  };

  const handleEditProfile = (profile) => {
    // Navigate to form with profile data for editing
    navigate('/form', { state: { editProfile: profile } });
  };

  const handleDeleteProfile = async (profileId) => {
    if (!window.confirm('Are you sure you want to delete this profile? This action cannot be undone.')) {
      return;
    }

    setActionLoading(profileId);
    try {
      await deleteUserProfile(profileId);
      
      // Remove the deleted profile from the local state
      setProfiles(profiles.filter(profile => profile.id !== profileId));
      
      alert('Profile deleted successfully!');
    } catch (error) {
      console.error('Error deleting profile:', error);
      alert('Failed to delete profile. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const formatValue = (value, type) => {
    if (!value && value !== 0) return 'Not specified';
    
    switch (type) {
      case 'weight':
        return `${value} kg`;
      case 'height':
        return `${value} cm`;
      case 'age':
        return `${value} years`;
      case 'time':
        return `${value} minutes`;
      case 'gender':
        return value.charAt(0).toUpperCase() + value.slice(1);
      default:
        return value;
    }
  };

  if (loading) {
    return (
      <ProfileContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <p>Loading your profiles...</p>
        </LoadingContainer>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <Header>
        <Title>
          <FaUser />
          My Profiles
        </Title>
        <CreateButton onClick={handleCreateProfile}>
          <FaPlus />
          Create New Profile
        </CreateButton>
      </Header>

      {profiles.length > 0 ? (
        <ProfileGrid>
          {profiles.map((profile) => (
            <ProfileCard key={profile.id}>
              <ProfileHeader>
                <ProfileTitle>Profile {profile.id}</ProfileTitle>
                <ProfileActions>
                  <ActionButton 
                    onClick={() => handleEditProfile(profile)}
                    title="Edit Profile"
                  >
                    <FaEdit />
                  </ActionButton>
                  <ActionButton 
                    danger
                    onClick={() => handleDeleteProfile(profile.id)}
                    disabled={actionLoading === profile.id}
                    title="Delete Profile"
                  >
                    {actionLoading === profile.id ? (
                      <FaSpinner className="spinner" />
                    ) : (
                      <FaTrash />
                    )}
                  </ActionButton>
                </ProfileActions>
              </ProfileHeader>

              <ProfileInfo>
                <InfoItem>
                  <InfoLabel>Age</InfoLabel>
                  <InfoValue>{formatValue(profile.age, 'age')}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Gender</InfoLabel>
                  <InfoValue>{formatValue(profile.gender, 'gender')}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Height</InfoLabel>
                  <InfoValue>{formatValue(profile.height, 'height')}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Weight</InfoLabel>
                  <InfoValue>{formatValue(profile.weight, 'weight')}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Cooking Level</InfoLabel>
                  <InfoValue>{formatValue(profile.cooking_level)}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Cooking Time</InfoLabel>
                  <InfoValue>{formatValue(profile.prefer_cooking_time, 'time')}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Food Preferences</InfoLabel>
                  <InfoValue>{formatValue(profile.food_preferences)}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Goal</InfoLabel>
                  <InfoValue>{formatValue(profile.goal)}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Allergies</InfoLabel>
                  <InfoValue>{formatValue(profile.allergies)}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Health Issues</InfoLabel>
                  <InfoValue>{formatValue(profile.health_issues)}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Religion</InfoLabel>
                  <InfoValue>{formatValue(profile.religion)}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Exercise Routine</InfoLabel>
                  <InfoValue>{formatValue(profile.exercise_routine)}</InfoValue>
                </InfoItem>
              </ProfileInfo>
            </ProfileCard>
          ))}
        </ProfileGrid>
      ) : (
        <EmptyState>
          <FaUser style={{ fontSize: '3rem', color: '#cbd5e0', marginBottom: '1rem' }} />
          <h3>No Profiles Found</h3>
          <p>Create your first profile to start generating personalized meal plans!</p>
          <CreateButton onClick={handleCreateProfile} style={{ marginTop: '1rem' }}>
            <FaPlus />
            Create Your First Profile
          </CreateButton>
        </EmptyState>
      )}
    </ProfileContainer>
  );
};

export default ProfilePage; 