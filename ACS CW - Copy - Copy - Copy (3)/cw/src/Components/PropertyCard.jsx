import React from 'react';
import { Link } from 'react-router-dom';
import { useDrag } from 'react-dnd';

const PropertyCard = ({ property, onFavoriteToggle, isFavorite }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'property',
    item: { property },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`property-card ${isDragging ? 'dragging' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <Link to={`/property/${property.id}`} className="property-link">
        <img src={property.image} alt={property.title} className="property-image" />
        <div className="property-info">
          <h3>{property.title}</h3>
          <p className="price">£{property.price.toLocaleString()}</p>
          <p className="location">{property.location}</p>
          <p className="details">
            {property.bedrooms} beds • {property.type}
          </p>
        </div>
      </Link>
      <button 
        className={`favorite-button ${isFavorite ? 'active' : ''}`}
        onClick={() => onFavoriteToggle(property)}
      >
        ♥
      </button>
    </div>
  );
};

export default PropertyCard;