import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../../styles/Hotels/HotelCard.css";

export default function HotelCard({ hotel }) {
  const [showDetails, setShowDetails] = useState(false);
  
  const { 
    name, 
    address, 
    rating, 
    totalRatings,
    photo,
    reviews = []
  } = hotel;

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const renderRatingStars = () => {
    if (!rating) return null;
    
    return (
      <div className="hotel-rating">
        {Array.from({ length: 5 }, (_, i) => (
          <span 
            key={i} 
            className={`star-icon ${i < Math.round(rating) ? 'filled' : 'empty'}`}
          >
            {i < Math.round(rating) ? '★' : '☆'}
          </span>
        ))}
        <span className="rating-number">
          {rating} ({totalRatings} valoraciones)
        </span>
      </div>
    );
  };

  const renderTopReviews = () => {
    if (reviews.length === 0) return null;
    
    return (
      <div className="hotel-reviews">
        <h4>Reseñas destacadas:</h4>
        {reviews.slice(0, 2).map((review, index) => (
          <div key={index} className="review-item">
            <div className="review-header">
              <img 
                src={review.profile_photo_url} 
                alt={review.author_name} 
                className="reviewer-avatar"
              />
              <span className="reviewer-name">{review.author_name}</span>
              <span className="review-rating">{review.rating} ★</span>
            </div>
            <p className="review-text">{review.text}</p>
            <span className="review-time">{review.relative_time_description}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <article className="hotel-card">
      <div className="hotel-image">
        <img 
          src={photo || "/default-hotel.jpg"} 
          alt={`Imagen de ${name}`} 
          onError={(e) => {
            e.target.src = "/default-hotel.jpg";
          }}
        />
      </div>
      <div className="hotel-content">
        <h3 className="hotel-name">{name}</h3>
        
        {showDetails && (
          <>
            <p className="hotel-address">{address}</p>
            {renderRatingStars()}
            {renderTopReviews()}
          </>
        )}
        
        <button 
          className="book-button"
          onClick={toggleDetails}
        >
          {showDetails ? "Ocultar detalles" : "Ver más detalles"}
        </button>
      </div>
    </article>
  );
}

HotelCard.propTypes = {
  hotel: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    photo: PropTypes.string,
    rating: PropTypes.number,
    totalRatings: PropTypes.number,
    reviews: PropTypes.arrayOf(
      PropTypes.shape({
        author_name: PropTypes.string,
        author_url: PropTypes.string,
        profile_photo_url: PropTypes.string,
        rating: PropTypes.number,
        relative_time_description: PropTypes.string,
        text: PropTypes.string,
        time: PropTypes.number
      })
    )
  }).isRequired
};