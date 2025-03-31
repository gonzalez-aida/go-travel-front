import React, { useState } from "react";
import PropTypes from "prop-types";
import ReservationModal from "./ReservationModal";
import "../../../styles/Flights/FlightCard.css";

export default function FlightCard({ flight }) {
  const [showModal, setShowModal] = useState(false);

  const { airline, origin, destination, time, price } = flight;

  const handleReserveClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <article className="flight-card">
        <header className="flight-header">
          <h2 className="flight-title">{airline}</h2>
          <span className="flight-price">{price}</span>
        </header>
        <div className="flight-content">
          <div className="flight-route">
            <div className="flight-location">
              <span className="flight-city">{origin}</span>
              <span className="flight-time">{time}</span>
            </div>
            <div className="flight-divider">→</div>
            <div className="flight-location">
              <span className="flight-city">{destination}</span>
            </div>
          </div>
        </div>
        <footer className="flight-footer">
          <button className="reserve-button" onClick={handleReserveClick}>
            Reservar
          </button>
        </footer>
      </article>

      {showModal && (
        <ReservationModal 
          flight={flight} 
          onClose={closeModal} 
        />
      )}
    </>
  );
}

FlightCard.propTypes = {
  flight: PropTypes.shape({
    airline: PropTypes.string.isRequired,
    origin: PropTypes.string.isRequired,
    destination: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    fullData: PropTypes.object
  }).isRequired,
};