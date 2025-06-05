import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaDollarSign, FaRocket, FaApple, FaCarrot, FaFish, FaEgg, FaBreadSlice } from 'react-icons/fa';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const SliderContainer = styled.div`
  width: 600px;
  max-width: 95vw;
  animation: ${fadeIn} 0.8s ease-out;
  position: relative;
`;

const FormContainer = styled.div`
  padding: 40px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(248, 255, 248, 0.95));
  border-radius: 35px;
  box-shadow: 
    0 20px 40px rgba(76, 175, 80, 0.12),
    0 8px 16px rgba(76, 175, 80, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  width: 100%;
  max-width: 550px;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border: 3px solid rgba(76, 175, 80, 0.15);
  overflow: hidden;
  box-sizing: border-box;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #4CAF50, #66BB6A, #81C784, #66BB6A, #4CAF50);
    background-size: 200% 100%;
    animation: shimmer 3s ease-in-out infinite;
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

const FormTitle = styled.h2`
  color: #2E7D32;
  font-size: 2.2rem;
  margin: 0 0 30px 0;
  text-align: center;
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  background: linear-gradient(135deg, #2E7D32, #4CAF50, #66BB6A);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, #4CAF50, #66BB6A);
    border-radius: 2px;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
  position: relative;
  animation: ${fadeIn} 0.5s ease-out;
  animation-fill-mode: both;
  animation-delay: ${props => props.delay}s;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  &.full-width {
    grid-template-columns: 1fr;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #2E7D32;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InputField = styled.input`
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #E8F5E9;
  border-radius: 16px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: linear-gradient(145deg, #ffffff, #f8fff8);
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;

  &:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 
      0 0 0 4px rgba(76, 175, 80, 0.1),
      0 4px 12px rgba(76, 175, 80, 0.15);
    transform: translateY(-1px);
  }

  &:hover {
    border-color: #C8E6C9;
    transform: translateY(-1px);
  }

  &::placeholder {
    color: #A0AEC0;
    font-weight: 400;
  }
`;

const SelectField = styled.select`
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #E8F5E9;
  border-radius: 16px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: linear-gradient(145deg, #ffffff, #f8fff8);
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 
      0 0 0 4px rgba(76, 175, 80, 0.1),
      0 4px 12px rgba(76, 175, 80, 0.15);
    transform: translateY(-1px);
  }

  &:hover {
    border-color: #C8E6C9;
    transform: translateY(-1px);
  }
`;

const Button = styled.button`
  padding: 16px 32px;
  background: linear-gradient(135deg, #4CAF50, #66BB6A);
  color: white;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 24px auto 0;
  font-size: 1.1rem;
  font-weight: 700;
  transition: all 0.3s ease;
  box-shadow: 
    0 8px 24px rgba(76, 175, 80, 0.25),
    0 4px 8px rgba(76, 175, 80, 0.15);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transition: all 0.3s ease;
    transform: translate(-50%, -50%);
  }

  &:hover {
    background: linear-gradient(135deg, #43A047, #5CB85C);
    transform: translateY(-3px);
    box-shadow: 
      0 12px 32px rgba(76, 175, 80, 0.35),
      0 6px 12px rgba(76, 175, 80, 0.2);
    
    &::before {
      width: 300px;
      height: 300px;
    }
  }

  &:active {
    transform: translateY(-1px);
  }
`;

const FloatingFoodIcon = styled.div`
  position: absolute;
  right: -40px;
  top: 50%;
  transform: translateY(-50%);
  color: #4CAF50;
  opacity: 0.3;
  font-size: 1.4rem;
  animation: ${float} 4s ease-in-out infinite;
  filter: drop-shadow(0 2px 4px rgba(76, 175, 80, 0.2));
`;

const FormSection = styled.div`
  background: rgba(255, 255, 255, 0.4);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 20px;
  border: 1px solid rgba(76, 175, 80, 0.1);
  backdrop-filter: blur(10px);
`;

const UserInputForm = () => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [budget, setBudget] = useState('');
  const [preferences, setPreferences] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', { age, gender, height, weight, budget, preferences });
  };

  return (
    <SliderContainer>
      <FormContainer>
        <FormTitle>Tell Us About Yourself</FormTitle>
        <form onSubmit={handleSubmit}>
          <FormSection>
            <InputGroup delay={0.1}>
              <InputWrapper>
                <InputLabel><FaApple /> Age</InputLabel>
                <InputField
                  type="number"
                  placeholder="Enter your age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min="1"
                  max="120"
                />
                <FloatingFoodIcon><FaApple /></FloatingFoodIcon>
              </InputWrapper>
              
              <InputWrapper>
                <InputLabel><FaCarrot /> Gender</InputLabel>
                <SelectField
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </SelectField>
                <FloatingFoodIcon><FaCarrot /></FloatingFoodIcon>
              </InputWrapper>
            </InputGroup>
            
            <InputGroup delay={0.2}>
              <InputWrapper>
                <InputLabel><FaFish /> Height (cm)</InputLabel>
                <InputField
                  type="number"
                  placeholder="Enter your height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  min="100"
                  max="250"
                />
                <FloatingFoodIcon><FaFish /></FloatingFoodIcon>
              </InputWrapper>
              
              <InputWrapper>
                <InputLabel><FaEgg /> Weight (kg)</InputLabel>
                <InputField
                  type="number"
                  placeholder="Enter your weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  min="30"
                  max="300"
                />
                <FloatingFoodIcon><FaEgg /></FloatingFoodIcon>
              </InputWrapper>
            </InputGroup>
          </FormSection>

          <FormSection>
            <InputGroup delay={0.3} className="full-width">
              <InputWrapper>
                <InputLabel><FaDollarSign /> Weekly Budget ($)</InputLabel>
                <InputField
                  type="number"
                  placeholder="Enter your weekly food budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  min="10"
                  max="1000"
                />
                <FloatingFoodIcon><FaDollarSign /></FloatingFoodIcon>
              </InputWrapper>
            </InputGroup>
            
            <InputGroup delay={0.4} className="full-width">
              <InputWrapper>
                <InputLabel><FaBreadSlice /> Food Preferences</InputLabel>
                <InputField
                  type="text"
                  placeholder="e.g., vegetarian, gluten-free, low-carb, dairy-free"
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                />
                <FloatingFoodIcon><FaBreadSlice /></FloatingFoodIcon>
              </InputWrapper>
            </InputGroup>
          </FormSection>
          
          <Button type="submit"><FaRocket /> Create My Nutrition Plan</Button>
        </form>
      </FormContainer>
    </SliderContainer>
  );
};

export default UserInputForm;
