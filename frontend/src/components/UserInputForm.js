import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { FaSeedling, FaChartLine, FaDollarSign, FaShoppingCart, FaRocket } from 'react-icons/fa';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const SliderContainer = styled.div`
  width: 450px;
  max-width: 95vw;
`;

const WelcomeCard = styled.div`
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 30px;
  box-shadow: 0 10px 30px rgba(76, 175, 80, 0.08);
  text-align: center;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const LogoIcon = styled.div`
  font-size: 64px;
  color: #4CAF50;
  margin-bottom: 16px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: #222;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #4CAF50;
  font-weight: 600;
  margin-bottom: 24px;
`;

const FeaturesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(76, 175, 80, 0.07);
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 1rem;
`;

const FormContainer = styled.div`
  padding: 24px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  min-width: 400px;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const InputField = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 auto;
`;

const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 8px;
`;

const Dot = styled.div`
  width: ${props => (props.active ? '24px' : '8px')};
  height: 8px;
  background: ${props => (props.active ? '#4CAF50' : 'rgba(255,255,255,0.5)')};
  border-radius: 4px;
  transition: all 0.3s;
`;

const UserInputForm = () => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [budget, setBudget] = useState('');
  const [preferences, setPreferences] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef();

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    swipe: true,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    draggable: true,
  };

  return (
    <SliderContainer>
      <Slider ref={sliderRef} {...settings} initialSlide={0}>
        <div>
          <WelcomeCard>
            <LogoIcon><FaSeedling /></LogoIcon>
            <Title>Cookonomics</Title>
            <Subtitle>Your Personal Nutrition & Recipe Assistant</Subtitle>
            <FeaturesList>
              <FeatureItem><FaChartLine color="#388e3c" size={24} /> Personalized Nutrition: Get recipes tailored to your health goals</FeatureItem>
              <FeatureItem><FaDollarSign color="#388e3c" size={24} /> Budget-Friendly: Find healthy meals within your budget</FeatureItem>
              <FeatureItem><FaShoppingCart color="#388e3c" size={24} /> Smart Shopping: Generate shopping lists with nutritional value</FeatureItem>
            </FeaturesList>
            <Button type="button" onClick={() => sliderRef.current.slickGoTo(1)}><FaRocket /> Get Started</Button>
          </WelcomeCard>
        </div>
        <div>
          <FormContainer>
            <form onSubmit={handleSubmit}>
              <InputField
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
              <InputField
                type="text"
                placeholder="Gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              />
              <InputField
                type="number"
                placeholder="Height (cm)"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
              <InputField
                type="number"
                placeholder="Weight (kg)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
              <InputField
                type="number"
                placeholder="Weekly Budget ($)"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
              <InputField
                type="text"
                placeholder="Preferences"
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
              />
              <Button type="submit"><FaRocket /> Submit</Button>
            </form>
          </FormContainer>
        </div>
      </Slider>
      <DotsContainer>
        <Dot active={currentSlide === 0} />
        <Dot active={currentSlide === 1} />
      </DotsContainer>
    </SliderContainer>
  );
};

export default UserInputForm; 