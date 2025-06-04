import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserInputForm from './components/UserInputForm';
import BackgroundDecoration from './components/BackgroundDecoration';
import Floating3DElements from './components/Floating3DElements';
import NutritionSummaryCard from './components/NutritionSummaryCard';
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

function App() {
  return (
    <Router>
      <GlobalStyle />
      <BackgroundDecoration />
      <Floating3DElements />
      <CenteredContainer>
        <Routes>
          <Route path="/" element={<UserInputForm />} />
          <Route path="/summary" element={<NutritionSummaryCard />} />
        </Routes>
      </CenteredContainer>
    </Router>
  );
}

export default App;
