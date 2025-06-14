import React, { useState, useEffect } from 'react';
import NutritionSummaryCard from './NutritionSummaryCard';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import styled from 'styled-components';

const CarouselOuter = styled.div`
  position: relative;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  overflow: visible;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 100px;
  min-height: 80vh;
  perspective: 1000px;
`;
const CarouselRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 75vh;
  position: relative;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 20px 0;
`;

const CardSlot = styled.div`
  width: 38vw;
  max-width: 500px;
  min-width: 350px;
  height: 70vh;
  max-height: 750px;
  min-height: 550px;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: ${props => props.z};
  transform: 
    translateX(${props => props.translateX}px) 
    scale(${props => props.scale}) 
    rotateY(${props => props.rotateY}deg);
  filter: blur(${props => props.blur}px);
  opacity: ${props => props.opacity};
  cursor: pointer;
  
  &:hover {
    transform: 
      translateX(${props => props.translateX}px) 
      scale(${props => props.scale * 1.02}) 
      rotateY(${props => props.rotateY}deg)
      translateY(-5px);
  }
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,250,252,0.95));
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 50%;
  cursor: pointer;
  font-size: 28px;
  color: #667eea;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 8px 32px rgba(102, 126, 234, 0.2),
    0 0 0 1px rgba(255,255,255,0.8);
  backdrop-filter: blur(20px);
  
  &:hover { 
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border-color: transparent;
    transform: translateY(-50%) scale(1.1);
    box-shadow: 
      0 12px 40px rgba(102, 126, 234, 0.4),
      0 0 0 1px rgba(255,255,255,0.2);
  }
  
  &:active {
    transform: translateY(-50%) scale(1.05);
  }
  
  ${props => props.direction === 'left' ? 'left: 20px;' : 'right: 20px;'}
`;

const RecipeCarousel = ({ recipes }) => {
  const [index, setIndex] = useState(0);
  const [showStepsOnly, setShowStepsOnly] = useState(false);
  const total = recipes.length;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        setIndex((prev) => (prev - 1 + total) % total);
        setShowStepsOnly(false);
      } else if (event.key === 'ArrowRight') {
        setIndex((prev) => (prev + 1) % total);
        setShowStepsOnly(false);
      } else if (event.key === 'Enter' || event.key === ' ') {
        setShowStepsOnly(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [total]);

  // Get the indices for the 3 cards to display
  const getVisibleIndices = () => {
    return [
      (index - 1 + total) % total,
      index,
      (index + 1) % total,
    ];
  };

  const visibleIndices = getVisibleIndices();

  // Enhanced card positioning with 3D effects
  const getCardProps = (i) => {
    const position = visibleIndices.indexOf(i);
    
    if (i === index) {
      // Center card - main focus
      return { 
        scale: 1, 
        blur: 0, 
        opacity: 1, 
        z: 10, 
        translateX: 0, 
        rotateY: 0 
      };
    } else if (position === 0) {
      // Left card - blurred background
      return { 
        scale: 0.7, 
        blur: 6, 
        opacity: 0.4, 
        z: 1, 
        translateX: -280, 
        rotateY: 35 
      };
    } else if (position === 2) {
      // Right card - blurred background
      return { 
        scale: 0.7, 
        blur: 6, 
        opacity: 0.4, 
        z: 1, 
        translateX: 280, 
        rotateY: -35 
      };
    }
    return { scale: 0, blur: 10, opacity: 0, z: 0, translateX: 0, rotateY: 0 };
  };

  const handleCardClick = (i) => {
    const position = visibleIndices.indexOf(i);
    if (i === index) {
      // Center card clicked - toggle steps view
      setShowStepsOnly(!showStepsOnly);
    } else if (position === 0) {
      // Left card clicked - go to previous
      handlePrev();
    } else if (position === 2) {
      // Right card clicked - go to next
      handleNext();
    }
  };

  const handleToggleSteps = () => {
    setShowStepsOnly(!showStepsOnly);
  };

  const handlePrev = () => {
    setIndex((index - 1 + total) % total);
    setShowStepsOnly(false);
  };

  const handleNext = () => {
    setIndex((index + 1) % total);
    setShowStepsOnly(false);
  };

  return (
    <CarouselOuter>
      <ArrowButton direction="left" onClick={handlePrev}>
        <FaChevronLeft />
      </ArrowButton>
      
      <CarouselRow>
        {visibleIndices.map((i) => {
          const props = getCardProps(i);
          const isCenter = i === index;
          return (
            <CardSlot
              key={i}
              {...props}
              onClick={() => handleCardClick(i)}
            >
              <NutritionSummaryCard 
                recipe={recipes[i]} 
                showStepsOnly={isCenter && showStepsOnly}
                onToggleSteps={isCenter ? handleToggleSteps : undefined}
                isCenter={isCenter}
              />
            </CardSlot>
          );
        })}
      </CarouselRow>
      
      <ArrowButton direction="right" onClick={handleNext}>
        <FaChevronRight />
      </ArrowButton>
      
      <div style={{ 
        textAlign: 'center', 
        marginTop: 20, 
        color: '#667eea',
        fontSize: '1.1rem',
        fontWeight: '600'
      }}>
        {index + 1} / {total} 
        {showStepsOnly && (
          <span style={{ color: '#764ba2', marginLeft: '8px' }}>
            (Steps View)
          </span>
        )}
      </div>
    </CarouselOuter>
  );
};

export default RecipeCarousel;
