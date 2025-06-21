import React from 'react';
import styled from 'styled-components';
import { FaTimes, FaStar, FaCheckCircle, FaTimesCircle, FaPlusCircle, FaUtensils, FaEye, FaBalanceScale, FaTrophy, FaLightbulb } from 'react-icons/fa';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
  backdrop-filter: blur(8px);
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 25px;
  padding: 30px;
  max-width: 700px;
  width: 95%;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(102, 126, 234, 0.3);
    border-radius: 4px;
    
    &:hover {
      background: rgba(102, 126, 234, 0.5);
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: #f0f0f0;
    color: #333;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const Title = styled.h2`
  color: #333;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const ScoreSection = styled.div`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 20px;
  border-radius: 20px;
  text-align: center;
  margin-bottom: 25px;
`;

const ScoreText = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 10px;
`;

const StarContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-bottom: 10px;
`;

const ScoreNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
`;

const Section = styled.div`
  margin-bottom: 25px;
  background: #f8fafc;
  border-radius: 15px;
  padding: 20px;
  border-left: 4px solid ${props => props.borderColor || '#667eea'};
`;

const SectionTitle = styled.h3`
  color: #2d3748;
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SectionContent = styled.div`
  color: #4a5568;
  line-height: 1.6;
`;

const ItemList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const Item = styled.li`
  background: white;
  margin: 8px 0;
  padding: 12px 16px;
  border-radius: 10px;
  border-left: 3px solid ${props => props.color || '#667eea'};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 10px;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: #718096;
  font-style: italic;
  padding: 20px;
  background: white;
  border-radius: 10px;
  border: 2px dashed #e2e8f0;
`;

const RecommendationItem = styled.div`
  background: linear-gradient(135deg, #fff5f5, #fed7d7);
  border: 1px solid #feb2b2;
  border-radius: 10px;
  padding: 15px;
  margin: 10px 0;
  color: #c53030;
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

const QualityText = styled.p`
  background: white;
  padding: 15px;
  border-radius: 10px;
  margin: 0;
  border-left: 3px solid #48bb78;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const ResultModal = ({ isOpen, onClose, result }) => {
  if (!isOpen || !result) return null;

  const { comparison_result, similarity_score } = result;

  const renderStars = (score) => {
    const stars = Math.round(score / 20); // Convert 0-100 to 0-5 stars
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        color={i < stars ? '#ffd700' : 'rgba(255, 255, 255, 0.3)'}
        size={20}
      />
    ));
  };

  const renderItemList = (items, color, icon) => {
    if (!items || items.length === 0) {
      return <EmptyState>No items found</EmptyState>;
    }

    return (
      <ItemList>
        {items.map((item, index) => (
          <Item key={index} color={color}>
            {icon}
            {item}
          </Item>
        ))}
      </ItemList>
    );
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>

        <Header>
          <Title>
            <FaTrophy color="#ffd700" />
            Cooking Analysis Results
          </Title>
        </Header>

        <ScoreSection>
          <ScoreText>Your Cooking Score</ScoreText>
          <StarContainer>
            {renderStars(similarity_score)}
          </StarContainer>
          <ScoreNumber>{similarity_score}/100</ScoreNumber>
        </ScoreSection>

        {comparison_result.detected_items && (
          <Section borderColor="#48bb78">
            <SectionTitle>
              <FaCheckCircle color="#48bb78" />
              Detected Items
            </SectionTitle>
            <SectionContent>
              {renderItemList(comparison_result.detected_items, '#48bb78', <FaCheckCircle color="#48bb78" size={14} />)}
            </SectionContent>
          </Section>
        )}

        {comparison_result.missing_items && (
          <Section borderColor="#f56565">
            <SectionTitle>
              <FaTimesCircle color="#f56565" />
              Missing Items
            </SectionTitle>
            <SectionContent>
              {renderItemList(comparison_result.missing_items, '#f56565', <FaTimesCircle color="#f56565" size={14} />)}
            </SectionContent>
          </Section>
        )}

        {comparison_result.additional_items && (
          <Section borderColor="#ed8936">
            <SectionTitle>
              <FaPlusCircle color="#ed8936" />
              Additional Items
            </SectionTitle>
            <SectionContent>
              {renderItemList(comparison_result.additional_items, '#ed8936', <FaPlusCircle color="#ed8936" size={14} />)}
            </SectionContent>
          </Section>
        )}

        {comparison_result.cooking_quality && (
          <Section borderColor="#667eea">
            <SectionTitle>
              <FaUtensils color="#667eea" />
              Cooking Quality
            </SectionTitle>
            <SectionContent>
              <QualityText>{comparison_result.cooking_quality}</QualityText>
            </SectionContent>
          </Section>
        )}

        {comparison_result.presentation && (
          <Section borderColor="#9f7aea">
            <SectionTitle>
              <FaEye color="#9f7aea" />
              Presentation
            </SectionTitle>
            <SectionContent>
              <QualityText>{comparison_result.presentation}</QualityText>
            </SectionContent>
          </Section>
        )}

        {comparison_result.portion_size && (
          <Section borderColor="#38b2ac">
            <SectionTitle>
              <FaBalanceScale color="#38b2ac" />
              Portion Size
            </SectionTitle>
            <SectionContent>
              <QualityText>{comparison_result.portion_size}</QualityText>
            </SectionContent>
          </Section>
        )}

        {comparison_result.overall_match && (
          <Section borderColor="#805ad5">
            <SectionTitle>
              <FaTrophy color="#805ad5" />
              Overall Match
            </SectionTitle>
            <SectionContent>
              <QualityText>{comparison_result.overall_match}</QualityText>
            </SectionContent>
          </Section>
        )}

        {comparison_result.recommendations && comparison_result.recommendations.length > 0 && (
          <Section borderColor="#f6ad55">
            <SectionTitle>
              <FaLightbulb color="#f6ad55" />
              Recommendations
            </SectionTitle>
            <SectionContent>
              {comparison_result.recommendations.map((recommendation, index) => (
                <RecommendationItem key={index}>
                  <FaLightbulb color="#dd6b20" size={16} />
                  <span>{recommendation}</span>
                </RecommendationItem>
              ))}
            </SectionContent>
          </Section>
        )}
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ResultModal;
