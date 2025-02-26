import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useFavorites } from '../context/FavoritesContext';
import propertyData from '../data/properties.json';
import 'react-tabs/style/react-tabs.css';
import './PropertyDetails.css';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = propertyData.properties.find(p => p.id === parseInt(id));
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const isFavorite = favorites.some(fav => fav.id === property.id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const allImages = [property.mainImage, ...property.images];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  const mapContainerStyle = {
    width: '100%',
    height: '400px'
  };

  const center = {
    lat: property.location.lat,
    lng: property.location.lng
  };

  const mapOptions = {
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFromFavorites(property);
    } else {
      addToFavorites(property);
    }
  };

  return (
    <div className="property-details">
      <Button 
        variant="contained" 
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        className="back-button"
      >
        Back
      </Button>

      <div className="property-header">
        <h1>{property.title}</h1>
        <Button
          variant="contained"
          startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          onClick={() => isFavorite ? removeFromFavorites(property.id) : addToFavorites(property)}
          sx={{
            backgroundColor: isFavorite ? '#ff4444' : '#13836c',
            marginTop: '20px',
            '&:hover': {
              backgroundColor: isFavorite ? '#cc0000' : '#0f6a56'
            }
          }}
        >
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </Button>
      </div>

      <div className="property-gallery">
        <img 
          src={allImages[currentImageIndex]} 
          alt={`Property view ${currentImageIndex + 1}`}
          className="gallery-image"
        />
        <div className="gallery-controls">
          <button onClick={handlePrevImage}>Previous</button>
          <span>{currentImageIndex + 1} / {allImages.length}</span>
          <button onClick={handleNextImage}>Next</button>
        </div>
      </div>

      <div className="property-info">
        <h2>£{property.price.toLocaleString()}</h2>
        <p>{property.longDescription}</p>
      </div>

      <Tabs>
        <TabList>
          <Tab>Location</Tab>
          <Tab>Floor Plan</Tab>
        </TabList>

        <TabPanel>
          <LoadScript googleMapsApiKey="AIzaSyDXp1Qh_FeQBCHeLtjILcY-fZRGH-dEhA0">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={15}
              options={mapOptions}
            >
              <Marker position={center} />
            </GoogleMap>
          </LoadScript>
        </TabPanel>

        <TabPanel>
          <div className="floor-plan-panel">
            <img src={property.floorPlan} alt="Floor Plan" />
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default PropertyDetails;
