import React, { useState, useEffect } from "react";
import Header from "../../Layouts/Header";
import { fetchOffers } from "../../services/offersService";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import "../../styles/Offers/OffersPage.css";

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const eventSource = fetchOffers((newOffers) => {
      setOffers(newOffers);
      setLoading(false);
    });

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="offers-page">
      <Header />
      
      <header className="page-header">
        <div className="header-content">
          <h1>Ofertas exclusivas de vuelo</h1>
          <p>Descubre las mejores promociones para tu próximo destino</p>
        </div>
      </header>

      <main className="offers-main">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Buscando las mejores ofertas...</p>
          </div>
        ) : offers.length === 0 ? (
          <div className="no-offers">
            <h3>No hay ofertas disponibles en este momento</h3>
            <p>Vuelve a intentarlo más tarde o ajusta tus criterios de búsqueda</p>
          </div>
        ) : (
          <div className="offers-grid">
            {offers.map((offer, index) => (
              <div key={index} className="offer-card">
                <div className="card-header">
                  <div className="destination-badge">
                    <FiMapPin className="icon" />
                    <span>MEX ➝ {offer.destination}</span>
                  </div>
                  <div className="price-tag">
                    <span className="currency">USD</span>
                    <span className="amount">{offer.price.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="card-body">
                  <div className="flight-details">
                    <div className="detail-item">
                      <FiCalendar className="icon" />
                      <span> Fecha: {offer.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="page-footer">
        <p>Las ofertas están sujetas a disponibilidad y pueden cambiar sin previo aviso</p>
      </footer>
    </div>
  );
};

export default OffersPage;
