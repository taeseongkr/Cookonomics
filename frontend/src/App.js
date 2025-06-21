import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import UserInputForm from './components/UserInputForm';
import BackgroundDecoration from './components/BackgroundDecoration';
import Floating3DElements from './components/Floating3DElements';
import NutritionSummaryCard from './components/NutritionSummaryCard';
import AuthPage from './components/AuthPage';
import RecipeShowcase from './pages/RecipeShowcase';
import TestMealPlanPage from './pages/TestMealPlanPage';
import NewFeaturesTest from './pages/NewFeaturesTest';
import Dashboard from './pages/Dashboard';
import MealPlansPage from './pages/MealPlansPage';
import CalendarPage from './pages/CalendarPage';
import ProfilePage from './pages/ProfilePage';
import Layout from './components/Layout';
import { isAuthenticated } from './utils/api';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Poppins', 'Roboto', Arial, sans-serif;
    margin: 0;
    padding: 0;
    background: transparent;
  }
`;

const CenteredContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

// Protected Route component
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? (
    <Layout>{children}</Layout>
  ) : (
    <Navigate to="/auth" replace />
  );
};

function App() {
  return (
    <Router>
      <GlobalStyle />
      
      <Routes>
        {/* Standalone routes (no layout) */}
        <Route 
          path="/auth" 
          element={
            <>
              <BackgroundDecoration />
              <Floating3DElements />
              <CenteredContainer>
                <AuthPage />
              </CenteredContainer>
            </>
          } 
        />
        <Route 
          path="/form" 
          element={
            <>
              <BackgroundDecoration />
              <Floating3DElements />
              <CenteredContainer>
                <UserInputForm />
              </CenteredContainer>
            </>
          } 
        />
        
        {/* Test routes (standalone) */}
        <Route 
          path="/recipes" 
          element={
            <>
              <BackgroundDecoration />
              <Floating3DElements />
              <CenteredContainer>
                <RecipeShowcase />
              </CenteredContainer>
            </>
          } 
        />
        <Route 
          path="/summary" 
          element={
            <>
              <BackgroundDecoration />
              <Floating3DElements />
              <CenteredContainer>
                <NutritionSummaryCard />
              </CenteredContainer>
            </>
          } 
        />
        <Route 
          path="/test-meal-plan" 
          element={
            <>
              <BackgroundDecoration />
              <Floating3DElements />
              <CenteredContainer>
                <TestMealPlanPage />
              </CenteredContainer>
            </>
          } 
        />
        <Route 
          path="/test-features" 
          element={
            <>
              <BackgroundDecoration />
              <Floating3DElements />
              <CenteredContainer>
                <NewFeaturesTest />
              </CenteredContainer>
            </>
          } 
        />

        {/* Protected routes (with layout) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/meal-plans" 
          element={
            <ProtectedRoute>
              <MealPlansPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/calendar" 
          element={
            <ProtectedRoute>
              <CalendarPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
