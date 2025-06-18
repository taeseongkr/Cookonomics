import React, { useState } from 'react';
import styled from 'styled-components';
import { uploadRecipeImage } from '../utils/api';

const RecipeSelectionContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  margin: 20px 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const RecipeTitle = styled.h2`
  color: #4A5568;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 20px;
  text-align: center;
`;

const RecipeCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 2px solid ${props => props.selected ? '#667eea' : 'transparent'};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
`;

const SelectButton = styled.button`
  background: ${props => props.selected 
    ? 'linear-gradient(135deg, #667eea, #764ba2)' 
    : 'linear-gradient(135deg, #f7fafc, #edf2f7)'};
  color: ${props => props.selected ? 'white' : '#4A5568'};
  border: none;
  border-radius: 25px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 15px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ImageUploadSection = styled.div`
  background: linear-gradient(135deg, #f7fafc, #edf2f7);
  border-radius: 15px;
  padding: 25px;
  margin-top: 20px;
  text-align: center;
`;

const ImageUploadTitle = styled.h3`
  color: #4A5568;
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 20px;
`;

const FileInputWrapper = styled.div`
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
`;

const FileInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const FileInputLabel = styled.label`
  display: inline-block;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }
`;

const ImagePreview = styled.div`
  margin: 20px 0;
  text-align: center;
`;

const PreviewImage = styled.img`
  max-width: 300px;
  max-height: 200px;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
`;

const UploadButton = styled.button`
  background: linear-gradient(135deg, #48bb78, #38a169);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 12px 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin: 10px;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(72, 187, 120, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const StatusMessage = styled.div`
  padding: 12px;
  border-radius: 8px;
  margin: 10px 0;
  font-weight: 500;
  
  ${props => props.type === 'success' && `
    background: #f0fff4;
    color: #38a169;
    border: 1px solid #9ae6b4;
  `}
  
  ${props => props.type === 'error' && `
    background: #fed7d7;
    color: #e53e3e;
    border: 1px solid #feb2b2;
  `}
  
  ${props => props.type === 'loading' && `
    background: #ebf8ff;
    color: #3182ce;
    border: 1px solid #90cdf4;
  `}
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #e2e8f0;
  border-top: 2px solid #3182ce;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const RecipeSelector = ({ recipes, onRecipeSelected }) => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  const handleRecipeSelect = (recipe) => {
    setSelectedRecipe(recipe);
    setSelectedImage(null);
    setImagePreview(null);
    setUploadStatus(null);
    setUploadedImageUrl(null);
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setUploadStatus({
          type: 'error',
          message: 'Please select a valid image file (JPEG, PNG, GIF, or WebP)'
        });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setUploadStatus({
          type: 'error',
          message: 'Image file is too large. Please select an image under 10MB.'
        });
        return;
      }

      setSelectedImage(file);
      setUploadStatus(null);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage || !selectedRecipe) {
      setUploadStatus({
        type: 'error',
        message: 'Please select both a recipe and an image'
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus({
      type: 'loading',
      message: 'Uploading your recipe image...'
    });

    try {
      const result = await uploadRecipeImage(
        selectedImage,
        'recipe-images',
        true, // resize
        true  // make public
      );

      setUploadStatus({
        type: 'success',
        message: 'Image uploaded successfully!'
      });

      setUploadedImageUrl(result.public_url);

      // Call the parent callback with the selected recipe and uploaded image info
      if (onRecipeSelected) {
        onRecipeSelected({
          recipe: selectedRecipe,
          imageInfo: result
        });
      }

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({
        type: 'error',
        message: error.message || 'Failed to upload image. Please try again.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedRecipe(null);
    setSelectedImage(null);
    setImagePreview(null);
    setUploadStatus(null);
    setUploadedImageUrl(null);
  };

  if (!recipes || recipes.length === 0) {
    return (
      <RecipeSelectionContainer>
        <RecipeTitle>No recipes available</RecipeTitle>
        <p>Please generate recipes first.</p>
      </RecipeSelectionContainer>
    );
  }

  return (
    <RecipeSelectionContainer>
      <RecipeTitle>Choose Your Recipe</RecipeTitle>
      
      {recipes.map((recipe, index) => (
        <RecipeCard key={index} selected={selectedRecipe === recipe}>
          <h3 style={{ color: '#4A5568', marginBottom: '10px' }}>
            {recipe.name || recipe.title || `Recipe ${index + 1}`}
          </h3>
          
          {recipe.description && (
            <p style={{ color: '#718096', marginBottom: '15px' }}>
              {recipe.description}
            </p>
          )}
          
          {recipe.ingredients && (
            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: '#4A5568' }}>Ingredients:</strong>
              <ul style={{ color: '#718096', marginTop: '8px' }}>
                {recipe.ingredients.slice(0, 3).map((ingredient, i) => (
                  <li key={i}>{ingredient}</li>
                ))}
                {recipe.ingredients.length > 3 && (
                  <li>... and {recipe.ingredients.length - 3} more</li>
                )}
              </ul>
            </div>
          )}
          
          <SelectButton 
            selected={selectedRecipe === recipe}
            onClick={() => handleRecipeSelect(recipe)}
          >
            {selectedRecipe === recipe ? 'Selected' : 'Select This Recipe'}
          </SelectButton>
        </RecipeCard>
      ))}

      {selectedRecipe && (
        <ImageUploadSection>
          <ImageUploadTitle>Upload Your Recipe Image</ImageUploadTitle>
          <p style={{ color: '#718096', marginBottom: '20px' }}>
            Share a photo of your prepared dish!
          </p>
          
          <FileInputWrapper>
            <FileInput
              type="file"
              id="recipe-image"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleImageSelect}
              disabled={isUploading}
            />
            <FileInputLabel htmlFor="recipe-image">
              {selectedImage ? 'Change Image' : 'Choose Image'}
            </FileInputLabel>
          </FileInputWrapper>

          {imagePreview && (
            <ImagePreview>
              <PreviewImage src={imagePreview} alt="Recipe preview" />
              <p style={{ color: '#718096', marginTop: '10px' }}>
                {selectedImage.name} ({(selectedImage.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </ImagePreview>
          )}

          {uploadStatus && (
            <StatusMessage type={uploadStatus.type}>
              {uploadStatus.type === 'loading' && <LoadingSpinner />}
              {uploadStatus.message}
            </StatusMessage>
          )}

          {uploadedImageUrl && (
            <div style={{ marginTop: '20px' }}>
              <p style={{ color: '#38a169', fontWeight: '600' }}>
                Your image has been uploaded successfully!
              </p>
              <a 
                href={uploadedImageUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#3182ce', textDecoration: 'underline' }}
              >
                View uploaded image
              </a>
            </div>
          )}

          <div style={{ marginTop: '20px' }}>
            <UploadButton
              onClick={handleImageUpload}
              disabled={!selectedImage || isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload Image'}
            </UploadButton>
            
            <UploadButton
              onClick={clearSelection}
              disabled={isUploading}
              style={{ 
                background: 'linear-gradient(135deg, #e2e8f0, #cbd5e0)',
                color: '#4A5568'
              }}
            >
              Clear Selection
            </UploadButton>
          </div>
        </ImageUploadSection>
      )}
    </RecipeSelectionContainer>
  );
};

export default RecipeSelector;
