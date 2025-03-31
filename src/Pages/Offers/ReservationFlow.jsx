import React, { useState, useRef } from "react";
import { FiArrowRight, FiUser, FiCreditCard, FiDownload, FiCheckCircle, FiX } from "react-icons/fi";
import html2canvas from "html2canvas";
import { toast } from 'react-toastify';

const ReservationFlow = ({ offer, onClose, onComplete }) => {
  const [passengers, setPassengers] = useState(1);
  const [seats, setSeats] = useState([]);
  const [cardNumber, setCardNumber] = useState("");
  const [currentStep, setCurrentStep] = useState("passengers");
  const ticketRef = useRef(null);

  // Datos por defecto para el vuelo
  const defaultFlightData = {
    origin: 'Ciudad de México',
    time: '10:00 AM',
    duration: '2h 30m',
    airline: 'MEX'
  };

  const handlePassengersSubmit = (e) => {
    e.preventDefault();
    setCurrentStep("seats");
  };

  const handleSeatSelection = (seat) => {
    if (seats.includes(seat)) {
      setSeats(seats.filter(s => s !== seat));
    } else if (seats.length < passengers) {
      setSeats([...seats, seat]);
    }
  };

  const handleSeatsSubmit = () => {
    if (seats.length === passengers) {
      setCurrentStep("payment");
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (cardNumber.length === 8 && /^\d+$/.test(cardNumber)) {
      setTimeout(() => {
        const reservation = {
          ...offer,
          ...defaultFlightData,
          passengers,
          seats,
          total: offer.price * passengers,
          reservationNumber: `RES-${Math.floor(Math.random() * 1000000)}`,
          cardLastDigits: cardNumber.slice(-4)
        };
        setCurrentStep("confirmation");
        onComplete(reservation);
      }, 1500);
    }
  };

  const downloadTicket = () => {
    const ticketElement = ticketRef.current;
    
    html2canvas(ticketElement, {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff"
    }).then(canvas => {
      const link = document.createElement("a");
      link.download = `ticket-${offer.reservationNumber}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }).catch(error => {
      console.error("Error al generar el ticket:", error);
      toast.error("Error al generar el ticket, inténtalo de nuevo");
    });
  };

  const seatMap = [
    '1A', '1B', '1C', '1D',
    '2A', '2B', '2C', '2D',
    '3A', '3B', '3C', '3D',
    '4A', '4B', '4C', '4D',
    '5A', '5B', '5C', '5D'
  ];

  return (
    <div className="reservation-modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          <FiX />
        </button>

        {currentStep === "passengers" && (
          <div className="reservation-flow">
            <div className="flow-header">
              <h2>Reservar vuelo a {offer.destination}</h2>
              <p>Paso 1 de 4: Selecciona número de pasajeros</p>
            </div>
            
            <form onSubmit={handlePassengersSubmit} className="passengers-form">
              <div className="form-group">
                <label>
                  <FiUser className="icon" /> Número de pasajeros
                </label>
                <input 
                  type="number" 
                  min="1" 
                  max="10" 
                  value={passengers}
                  onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
                  required
                />
              </div>
              
              <div className="form-actions">
                <button type="button" className="secondary-button" onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className="primary-button">
                  Siguiente <FiArrowRight className="icon" />
                </button>
              </div>
            </form>
          </div>
        )}

        {currentStep === "seats" && (
          <div className="reservation-flow">
            <div className="flow-header">
              <h2>Selección de asientos</h2>
              <p>Paso 2 de 4: Elige los asientos ({seats.length}/{passengers} seleccionados)</p>
            </div>
            
            <div className="seat-selection">
              <div className="seat-map">
                {seatMap.map(seat => (
                  <button
                    key={seat}
                    className={`seat ${seats.includes(seat) ? 'selected' : ''}`}
                    onClick={() => handleSeatSelection(seat)}
                    disabled={!seats.includes(seat) && seats.length >= passengers}
                  >
                    {seat}
                  </button>
                ))}
              </div>
              
              <div className="seat-legend">
                <div className="legend-item">
                  <div className="seat-sample available"></div>
                  <span>Disponible</span>
                </div>
                <div className="legend-item">
                  <div className="seat-sample selected"></div>
                  <span>Seleccionado</span>
                </div>
                <div className="legend-item">
                  <div className="seat-sample unavailable"></div>
                  <span>Ocupado</span>
                </div>
              </div>
            </div>
            
            <div className="form-actions">
              <button type="button" className="secondary-button" onClick={() => setCurrentStep("passengers")}>
                Atrás
              </button>
              <button 
                type="button" 
                className="primary-button"
                onClick={handleSeatsSubmit}
                disabled={seats.length !== passengers}
              >
                Siguiente <FiArrowRight className="icon" />
              </button>
            </div>
          </div>
        )}

        {currentStep === "payment" && (
          <div className="reservation-flow">
            <div className="flow-header">
              <h2>Información de pago</h2>
              <p>Paso 3 de 4: Completa tus datos de pago</p>
            </div>
            
            <form onSubmit={handlePaymentSubmit} className="payment-form">
              <div className="payment-summary">
                <h4>Resumen de compra</h4>
                <div className="summary-item">
                  <span>Vuelo a {offer.destination}:</span>
                  <span>${offer.price} x {passengers}</span>
                </div>
                <div className="summary-item total">
                  <span>Total:</span>
                  <span>${offer.price * passengers}</span>
                </div>
              </div>
              
              <div className="form-group">
                <label>
                  <FiCreditCard className="icon" /> Número de tarjeta (8 dígitos)
                </label>
                <input 
                  type="text" 
                  value={cardNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 8) setCardNumber(value);
                  }}
                  placeholder="12345678"
                  required
                />
                <small>Usaremos este número solo para fines de demostración</small>
              </div>
              
              <div className="form-actions">
                <button type="button" className="secondary-button" onClick={() => setCurrentStep("seats")}>
                  Atrás
                </button>
                <button type="submit" className="primary-button" disabled={cardNumber.length !== 8}>
                  Pagar <FiArrowRight className="icon" />
                </button>
              </div>
            </form>
          </div>
        )}

        {currentStep === "confirmation" && (
          <div className="reservation-flow confirmation">
            <div className="confirmation-header">
              <FiCheckCircle className="success-icon" />
              <h2>¡Reserva confirmada!</h2>
              <p>Tu vuelo a {offer.destination} ha sido reservado exitosamente.</p>
            </div>
            
            <div className="ticket" ref={ticketRef}>
              <div className="ticket-header">
                <h3>Ticket de Vuelo</h3>
                <span className="ticket-number">#{offer.reservationNumber}</span>
              </div>
              
              <div className="ticket-body">
                <div className="ticket-section">
                  <div className="ticket-item">
                    <span className="label">Origen:</span>
                    <span className="value">{offer.origin || 'MEX'}</span>
                  </div>
                  <div className="ticket-item">
                    <span className="label">Destino:</span>
                    <span className="value">{offer.destination}</span>
                  </div>
                </div>
                
                <div className="ticket-section">
                  <div className="ticket-item">
                    <span className="label">Fecha:</span>
                    <span className="value">{offer.date}</span>
                  </div>
                  <div className="ticket-item">
                    <span className="label">Hora:</span>
                    <span className="value">{offer.time || defaultFlightData.time}</span>
                  </div>
                </div>
                
                <div className="ticket-section">
                  <div className="ticket-item">
                    <span className="label">Aerolínea:</span>
                    <span className="value">{offer.airline || 'MEX'}</span>
                  </div>
                  <div className="ticket-item">
                    <span className="label">Duración:</span>
                    <span className="value">{offer.duration || defaultFlightData.duration}</span>
                  </div>
                </div>
                
                <div className="ticket-section">
                  <div className="ticket-item">
                    <span className="label">Pasajeros:</span>
                    <span className="value">{passengers}</span>
                  </div>
                  <div className="ticket-item">
                    <span className="label">Asientos:</span>
                    <span className="value">{seats.join(', ')}</span>
                  </div>
                </div>
                
                <div className="ticket-section total">
                  <div className="ticket-item">
                    <span className="label">Total pagado:</span>
                    <span className="value">${offer.price * passengers}</span>
                  </div>
                  <div className="ticket-item">
                    <span className="label">Tarjeta terminada en:</span>
                    <span className="value">•••• {cardNumber.slice(-4)}</span>
                  </div>
                </div>
              </div>
              
              <div className="ticket-footer">
                <p>¡Gracias por tu reserva! Presenta este ticket en el mostrador de la aerolínea.</p>
              </div>
            </div>
            
            <div className="confirmation-actions">
              <button 
                className="download-button"
                onClick={downloadTicket}
              >
                <FiDownload className="icon" /> Descargar Ticket
              </button>
              <button 
                className="primary-button"
                onClick={onClose}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationFlow;