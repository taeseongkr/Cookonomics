import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { FaCamera, FaUpload, FaStar, FaTimes, FaSpinner } from 'react-icons/fa';
import { uploadMealPlanImage, debugAuthState } from '../utils/api';
import ResultModal from './ResultModal';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 25px;
  padding: 40px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
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

const ModalTitle = styled.h2`
  color: #333;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 10px;
  text-align: center;
`;

const ModalSubtitle = styled.p`
  color: #666;
  font-size: 1rem;
  text-align: center;
  margin-bottom: 30px;
  line-height: 1.5;
`;

const UploadArea = styled.div`
  border: 3px dashed ${props => props.isDragOver ? '#667eea' : '#ddd'};
  border-radius: 20px;
  padding: 40px 20px;
  text-align: center;
  margin-bottom: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.isDragOver ? 'rgba(102, 126, 234, 0.05)' : 'transparent'};

  &:hover {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.05);
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  color: #667eea;
  margin-bottom: 15px;
`;

const UploadText = styled.div`
  color: #333;
  font-weight: 600;
  margin-bottom: 10px;
`;

const UploadSubtext = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const PreviewContainer = styled.div`
  margin-bottom: 30px;
`;

const PreviewImage = styled.img`
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
  justify-content: center;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }
`;

const SecondaryButton = styled(Button)`
  background: #f7fafc;
  color: #4a5568;
  border: 2px solid #e2e8f0;

  &:hover:not(:disabled) {
    background: #edf2f7;
    border-color: #cbd5e0;
  }
`;

const ResultContainer = styled.div`
  margin-top: 30px;
  padding: 20px;
  border-radius: 15px;
  background: ${props => props.success ? 'linear-gradient(135deg, #f0fff4, #c6f6d5)' : 'linear-gradient(135deg, #fed7d7, #feb2b2)'};
  border: 2px solid ${props => props.success ? '#9ae6b4' : '#fc8181'};
`;

const ResultTitle = styled.h3`
  color: ${props => props.success ? '#38a169' : '#e53e3e'};
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ResultText = styled.p`
  color: ${props => props.success ? '#2f855a' : '#c53030'};
  margin: 0;
  line-height: 1.5;
`;

const HiddenInput = styled.input`
  display: none;
`;

const ImageUploadModal = ({ isOpen, onClose, mealPlanId, recipeName }) => {
  console.log('ImageUploadModal props:', { isOpen, mealPlanId, recipeName });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setUploadResult(null);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleUpload = async () => {
    console.log('handleUpload called', { selectedFile, mealPlanId });
    
    // Debug authentication state
    const authDebug = debugAuthState();
    console.log('Authentication debug:', authDebug);
    
    if (!selectedFile) {
      console.error('No file selected');
      alert('Please select an image first!');
      return;
    }
    
    if (!mealPlanId) {
      console.error('No meal plan ID provided');
      alert('Meal plan ID is missing. Please try again.');
      return;
    }

    if (!authDebug.isAuthenticated) {
      console.error('User not authenticated');
      alert('You need to sign in to upload images. Please sign in with Google first.');
      return;
    }

    setIsUploading(true);
    try {
      console.log('Uploading image for meal plan:', mealPlanId);
      const result = await uploadMealPlanImage(mealPlanId, selectedFile);
      
      console.log('Upload successful:', result);
      setUploadResult(result);
      setShowResultModal(true);
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadResult(null);
    setShowResultModal(false);
    setIsDragOver(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={handleClose}>
          <FaTimes />
        </CloseButton>

        <ModalTitle>
          <FaCamera style={{ marginRight: '10px', color: '#667eea' }} />
          Show Off Your Culinary Masterpiece! 🍽️
        </ModalTitle>
        <ModalSubtitle>
          Did you nail the <strong>{recipeName}</strong>? Upload a photo and let our AI judge your cooking skills! 
          Don't worry, we're pretty generous with our ratings 😉
        </ModalSubtitle>

        <UploadArea
          isDragOver={isDragOver}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <UploadIcon>
            <FaUpload />
          </UploadIcon>
          <UploadText>Click to upload or drag & drop</UploadText>
          <UploadSubtext>Your food photo here (JPG, PNG, GIF, WebP)</UploadSubtext>
        </UploadArea>

        <HiddenInput
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
        />

        {previewUrl && (
          <PreviewContainer>
            <PreviewImage src={previewUrl} alt="Preview" />
          </PreviewContainer>
        )}

        {uploadResult && (
          <ResultContainer success={true}>
            <ResultTitle success={true}>
              <FaStar color="#38a169" />
              Upload Successful! 🎉
            </ResultTitle>
            <ResultText success={true}>
              Your image has been analyzed! Click "View Results" to see the detailed analysis.
              <div style={{ marginTop: '15px' }}>
                <PrimaryButton onClick={() => setShowResultModal(true)} style={{ minWidth: 'auto', padding: '8px 16px' }}>
                  View Results
                </PrimaryButton>
              </div>
            </ResultText>
          </ResultContainer>
        )}

        <ButtonContainer>
          <SecondaryButton onClick={handleClose}>
            Maybe Later
          </SecondaryButton>
          <PrimaryButton 
            onClick={handleUpload} 
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? (
              <>
                <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                Judging...
              </>
            ) : (
              <>
                <FaStar />
                Rate My Cooking!
              </>
            )}
          </PrimaryButton>
        </ButtonContainer>
      </ModalContainer>
      
      <ResultModal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        result={uploadResult}
      />
    </ModalOverlay>
  );
};

export default ImageUploadModal;
