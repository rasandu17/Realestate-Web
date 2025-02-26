import React from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { Link } from 'react-router-dom';
import './FavoritesPage.css';

function FavoritesPage() {
  const { favorites, removeFromFavorites, clearFavorites } = useFavorites();

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1>Your Favorite Properties</h1>
        {favorites.length > 0 && (
          <button onClick={clearFavorites} className="clear-button">
            Clear All
          </button>
        )}
      </div>
      
      {favorites.length === 0 ? (
        <div className="no-favorites">
          <p>You haven't added any properties to your favorites yet.</p>
          <Link to="/" className="browse-link">Browse Properties</Link>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map(property => (
            <div key={property.id} className="favorite-card">
              <Link to={`/property/${property.id}`}>
                <img src={property.mainImage} alt={property.title} />
                <div className="favorite-info">
                  <h3>{property.title}</h3>
                  <p className="price">£{property.price.toLocaleString()}</p>
                  <p>{property.shortDescription}</p>
                </div>
              </Link>
              <button
                onClick={() => removeFromFavorites(property.id)}
                className="remove-button"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;
