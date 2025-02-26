import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDrop, useDrag } from 'react-dnd';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import BedIcon from '@mui/icons-material/SingleBed';
import { useFavorites } from '../context/FavoritesContext';
import propertyData from '../data/properties.json';
import 'react-datepicker/dist/react-datepicker.css';
import './SearchPage.css';

// Simple draggable property card
function PropertyCard({ property, addToFavorites, removeFromFavorites, favorites }) {
  const [, drag] = useDrag(() => ({
    type: 'property',
    item: property
  }));

  const isFavorite = favorites.some(fav => fav.id === property.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    if (isFavorite) {
      removeFromFavorites(property.id);
    } else {
      addToFavorites(property);
    }
  };

  return (
    <div ref={drag} className="property-card">
      <Link to={`/property/${property.id}`}>
        <img src={property.mainImage} alt={property.title} />
        <div className="property-info">
          <h3>{property.title}</h3>
          <p className="price">£{property.price.toLocaleString()}</p>
          <p className="bedrooms">
            <BedIcon sx={{ color: '#13836c' }} />
            {property.bedrooms} {property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
          </p>
          <p>{property.shortDescription}</p>
          <p>{property.postcode}</p>
        </div>
      </Link>
      <button 
        onClick={handleFavoriteClick}
        className={`favorite-button ${isFavorite ? 'active' : ''}`}
      >
        ❤
      </button>
    </div>
  );
}

// Simple draggable favorite item
function FavoriteItem({ property, removeFromFavorites }) {
  const [, drag] = useDrag(() => ({
    type: 'favorite',
    item: property,
    end: (item, monitor) => {
      if (!monitor.didDrop()) {
        removeFromFavorites(property.id);
      }
    }
  }));

  return (
    <div ref={drag} className="favorite-item">
      <img src={property.mainImage} alt={property.title} />
      <div className="favorite-details">
        <h4>{property.title}</h4>
        <p>£{property.price.toLocaleString()}</p>
      </div>
      <button
        onClick={() => removeFromFavorites(property.id)}
        className="remove-favorite"
      >
        ×
      </button>
    </div>
  );
}

function SearchPage() {
  const [searchCriteria, setSearchCriteria] = useState({
    type: null,
    minPrice: '',
    maxPrice: '',
    minBedrooms: '',
    maxBedrooms: '',
    dateFrom: null,
    dateTo: null,
    postcode: ''
  });

  const [searchResults, setSearchResults] = useState(propertyData.properties);
  const [error, setError] = useState('');
  const { favorites, addToFavorites, removeFromFavorites, clearFavorites } = useFavorites();

  const propertyTypes = [
    { value: 'any', label: 'Any' },
    { value: 'house', label: 'House' },
    { value: 'flat', label: 'Flat' }
  ];

  // Simple function to check if search is empty
  function isSearchEmpty() {
    // Check if all fields are empty
    if (!searchCriteria.type && 
        !searchCriteria.minPrice && 
        !searchCriteria.maxPrice && 
        !searchCriteria.minBedrooms && 
        !searchCriteria.maxBedrooms && 
        !searchCriteria.dateFrom && 
        !searchCriteria.dateTo && 
        !searchCriteria.postcode) {
      return true;
    }
    return false;
  }

  const handleSearch = () => {
    // Clear any previous error
    setError('');

    // Check if search is empty
    if (isSearchEmpty()) {
      setError('Please fill in at least one search field');
      return;
    }

    let results = propertyData.properties;

    if (searchCriteria.type && searchCriteria.type.value !== 'any') {
      results = results.filter(property => property.type === searchCriteria.type.value);
    }

    if (searchCriteria.minPrice) {
      results = results.filter(property => property.price >= parseInt(searchCriteria.minPrice));
    }

    if (searchCriteria.maxPrice) {
      results = results.filter(property => property.price <= parseInt(searchCriteria.maxPrice));
    }

    if (searchCriteria.minBedrooms) {
      results = results.filter(property => property.bedrooms >= parseInt(searchCriteria.minBedrooms));
    }

    if (searchCriteria.maxBedrooms) {
      results = results.filter(property => property.bedrooms <= parseInt(searchCriteria.maxBedrooms));
    }

    if (searchCriteria.dateFrom) {
      results = results.filter(property => new Date(property.dateAdded) >= searchCriteria.dateFrom);
    }

    if (searchCriteria.dateTo) {
      results = results.filter(property => new Date(property.dateAdded) <= searchCriteria.dateTo);
    }

    if (searchCriteria.postcode) {
      const postcodePrefix = searchCriteria.postcode.toUpperCase().split(' ')[0];
      results = results.filter(property => 
        property.postcode.toUpperCase().startsWith(postcodePrefix)
      );
    }

    // Show error if no results found
    if (results.length === 0) {
      setError('No properties found matching your search');
    }

    setSearchResults(results);
  };

  const handleReset = () => {
    setSearchCriteria({
      type: null,
      minPrice: '',
      maxPrice: '',
      minBedrooms: '',
      maxBedrooms: '',
      dateFrom: null,
      dateTo: null,
      postcode: ''
    });
    setSearchResults(propertyData.properties);
    // Clear any error message when resetting
    setError('');
  };

  const handleInputChange = (field, value) => {
    // For bedroom and price fields, ensure value is not negative
    if ((field === 'minBedrooms' || field === 'maxBedrooms' || 
         field === 'minPrice' || field === 'maxPrice') && value < 0) {
      value = 0;
    }

    // Create new search criteria with the updated value
    const newSearchCriteria = { ...searchCriteria, [field]: value };

    // Validate max values are greater than min values
    if (field === 'minPrice' && newSearchCriteria.maxPrice && 
        Number(value) > Number(newSearchCriteria.maxPrice)) {
      newSearchCriteria.maxPrice = value;
    }
    if (field === 'maxPrice' && newSearchCriteria.minPrice && 
        Number(value) < Number(newSearchCriteria.minPrice)) {
      newSearchCriteria.minPrice = value;
    }
    if (field === 'minBedrooms' && newSearchCriteria.maxBedrooms && 
        Number(value) > Number(newSearchCriteria.maxBedrooms)) {
      newSearchCriteria.maxBedrooms = value;
    }
    if (field === 'maxBedrooms' && newSearchCriteria.minBedrooms && 
        Number(value) < Number(newSearchCriteria.minBedrooms)) {
      newSearchCriteria.minBedrooms = value;
    }

    setSearchCriteria(newSearchCriteria);
  };

  const [, drop] = useDrop(() => ({
    accept: 'property',
    drop: (item) => {
      addToFavorites(item);
    }
  }));

  return (
    <div className="search-page">
      <div className="search-container">
        <div className="search-form">
          <h2>Search Properties</h2>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label>Property Type</label>
            <Select
              value={searchCriteria.type}
              onChange={option => handleInputChange('type', option)}
              options={propertyTypes}
              isClearable
              placeholder="Select type..."
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: '#13836c',
                  '&:hover': {
                    borderColor: '#0f6a56'
                  }
                }),
                option: (base, { isFocused, isSelected }) => ({
                  ...base,
                  backgroundColor: isSelected 
                    ? '#13836c'
                    : isFocused 
                      ? 'rgba(19, 131, 108, 0.1)'
                      : null,
                  color: isSelected ? 'white' : '#333'
                }),
                singleValue: (base) => ({
                  ...base,
                  color: '#13836c'
                })
              }}
            />
          </div>

          <div className="form-group">
            <label>Price Range</label>
            <div className="price-inputs">
              <input
                type="number"
                min="0"
                placeholder="Min Price"
                value={searchCriteria.minPrice}
                onChange={(e) => handleInputChange('minPrice', e.target.value)}
              />
              <input
                type="number"
                min={searchCriteria.minPrice || 0}
                placeholder="Max Price"
                value={searchCriteria.maxPrice}
                onChange={(e) => handleInputChange('maxPrice', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Bedrooms</label>
            <div className="bedroom-inputs">
              <input
                type="number"
                min="0"
                placeholder="Min Bedrooms"
                value={searchCriteria.minBedrooms}
                onChange={(e) => handleInputChange('minBedrooms', e.target.value)}
              />
              <input
                type="number"
                min={searchCriteria.minBedrooms || 0}
                placeholder="Max Bedrooms"
                value={searchCriteria.maxBedrooms}
                onChange={(e) => handleInputChange('maxBedrooms', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Date Range</label>
            <div className="date-inputs">
              <DatePicker
                selected={searchCriteria.dateFrom}
                onChange={(date) => handleInputChange('dateFrom', date)}
                placeholderText="From Date"
              />
              <DatePicker
                selected={searchCriteria.dateTo}
                onChange={(date) => handleInputChange('dateTo', date)}
                placeholderText="To Date"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Postcode Area</label>
            <input
              type="text"
              placeholder="e.g. BR1, NW1"
              value={searchCriteria.postcode}
              onChange={(e) => handleInputChange('postcode', e.target.value)}
            />
          </div>

          <div className="button-group">
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              sx={{
                backgroundColor: '#13836c',
                '&:hover': {
                  backgroundColor: '#0f6a56'
                }
              }}
            >
              Search
            </Button>
            <Button
              variant="outlined"
              startIcon={<RestartAltIcon />}
              onClick={handleReset}
              sx={{
                color: '#13836c',
                borderColor: '#13836c',
                '&:hover': {
                  backgroundColor: 'rgba(19, 131, 108, 0.04)',
                  borderColor: '#0f6a56',
                  color: '#0f6a56'
                }
              }}
            >
              Reset
            </Button>
          </div>
        </div>

        <div ref={drop} className="favorites-box">
          <h2>Favorites</h2>
          <button
            onClick={clearFavorites}
            className="clear-favorites"
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px'
            }}
          >
            Clear All
          </button>
          <div className="favorites-list">
            {favorites.map(property => (
              <FavoriteItem
                key={property.id}
                property={property}
                removeFromFavorites={removeFromFavorites}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="results-container">
        {searchResults.map(property => (
          <PropertyCard
            key={property.id}
            property={property}
            addToFavorites={addToFavorites}
            removeFromFavorites={removeFromFavorites}
            favorites={favorites}
          />
        ))}
      </div>
    </div>
  );
}

export default SearchPage;
