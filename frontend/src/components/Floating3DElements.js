import React from 'react';
import styled from 'styled-components';

const FloatingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
`;

const FloatingElement = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
  }
`;

const Floating3DElements = () => {
  return (
    <FloatingContainer>
      <FloatingElement style={{ top: '20%', left: '10%' }} />
      <FloatingElement style={{ top: '50%', left: '80%' }} />
      <FloatingElement style={{ top: '80%', left: '30%' }} />
    </FloatingContainer>
  );
};

export default Floating3DElements; 