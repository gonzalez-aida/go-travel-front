import React, { useState } from "react";
import PropTypes from "prop-types";
import html2canvas from "html2canvas";
import logo from "../../../assets/logo2.png";
import { toast } from 'react-toastify';

export default function ReservationModal({ flight, onClose }) {
  const { airline, origin, destination, time, price } = flight;
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [cardNumber, setCardNumber] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [reservationData, setReservationData] = useState(null);
  const [numPassengers, setNumPassengers] = useState(1);

  const seats = ["1A", "1B", "1C", "2A", "2B", "2C", "3A", "3B", "3C", "4A", "4B", "4C"];

  const handlePassengerChange = (e) => {
    const num = parseInt(e.target.value, 10);
    setNumPassengers(num);
    setSelectedSeats([]);
  };

  const handleSeatSelect = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      if (selectedSeats.length < numPassengers) {
        setSelectedSeats([...selectedSeats, seat]);
      }
    }
  };

  const handlePayment = (e) => {
    e.preventDefault();
    if (cardNumber.length !== 8) {
      toast.error("El número de tarjeta debe tener 8 caracteres");
      return;
    }

    if (selectedSeats.length !== numPassengers) {
      toast.error(`Debes seleccionar ${numPassengers} asiento(s)`);
      return;
    }

    setTimeout(() => {
      const reservation = {
        id: `RES-${Date.now()}`,
        flight: { ...flight },
        seats: selectedSeats,
        cardLastFour: cardNumber.slice(-4),
        date: new Date().toLocaleString()
      };
      setReservationData(reservation);
      setPaymentSuccess(true);
    }, 1000);
  };

  const downloadReceipt = () => {
    const receiptElement = document.getElementById("receipt");
    if (receiptElement) {
      // Ocultar botones antes de la descarga
      const downloadBtn = document.querySelector(".download-btn");
      const closeBtn = document.querySelector(".close-btn");
      downloadBtn.style.display = "none";
      closeBtn.style.display = "none";

      html2canvas(receiptElement).then(canvas => {
        const link = document.createElement("a");
        link.download = `reserva-${reservationData.id}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();

        // Restaurar los botones después de la descarga
        downloadBtn.style.display = "block";
        closeBtn.style.display = "block";
      });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="reservation-modal">
        {!paymentSuccess ? (
          <>
            <button className="close-modal-btn" onClick={onClose}>×</button>
            <h2>Reservar vuelo {airline}</h2>
            <p>{origin} → {destination} | {time}</p>

            <div className="passenger-selection">
              <h3>Selecciona el número de pasajeros</h3>
              <select value={numPassengers} onChange={handlePassengerChange}>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <div className="seat-selection">
              <h3>Selecciona tus asientos</h3>
              <div className="seats-grid">
                {seats.map(seat => (
                  <button
                    key={seat}
                    className={`seat-btn ${selectedSeats.includes(seat) ? "selected" : ""}`}
                    onClick={() => handleSeatSelect(seat)}
                    disabled={selectedSeats.length >= numPassengers && !selectedSeats.includes(seat)}
                  >
                    {seat}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handlePayment} className="payment-form">
              <h3>Información de pago</h3>
              <div className="form-group">
                <label>Número de tarjeta (8 dígitos):</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
                  maxLength="8"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={onClose}>Cancelar</button>
                <button type="submit" className="pay-button">Pagar {price}</button>
              </div>
            </form>
          </>
        ) : (
          <div id="receipt" className="receipt">
            <button className="close-modal-btn" onClick={onClose}>×</button>
            <div className="receipt-header">
              <img src={logo} alt="Logo" className="airline-logo" />
              <h2>¡Reserva confirmada!</h2>
            </div>
            <p><strong>ID de reserva:</strong> {reservationData.id}</p>
            <p><strong>Aerolínea:</strong> {reservationData.flight.airline}</p>
            <p><strong>Ruta:</strong> {reservationData.flight.origin} → {reservationData.flight.destination}</p>
            <p><strong>Hora:</strong> {reservationData.flight.time}</p>
            <p><strong>Asientos:</strong> {reservationData.seats.join(", ")}</p>
            <p><strong>Precio:</strong> {reservationData.flight.price}</p>
            <p><strong>Tarjeta terminada en:</strong> ****{reservationData.cardLastFour}</p>
            <p><strong>Fecha de reserva:</strong> {reservationData.date}</p>

            <div className="receipt-actions">
              <button onClick={downloadReceipt} className="download-btn">Descargar comprobante</button>
              <button onClick={onClose} className="close-btn">Cerrar</button>
            </div>

            <div className="receipt-footer">
              <p><strong>Gracias por elegir {reservationData.flight.airline}.</strong></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

ReservationModal.propTypes = {
  flight: PropTypes.shape({
    airline: PropTypes.string.isRequired,
    origin: PropTypes.string.isRequired,
    destination: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    fullData: PropTypes.object
  }).isRequired,
  onClose: PropTypes.func.isRequired
};
