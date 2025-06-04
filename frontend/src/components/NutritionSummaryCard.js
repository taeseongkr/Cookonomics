import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 20px;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 10px;
`;

const NutritionSummaryCard = () => {
  return (
    <CardContainer>
      <Title>Nutrition Summary</Title>
      <p>This is a placeholder for the nutrition summary content.</p>
    </CardContainer>
  );
};

export default NutritionSummaryCard; 