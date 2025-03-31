import React, { useState } from "react";
import FlightCard from "./Components/FlightCard";
import "../../styles/Flights/FlightList.css";
import Header from "../../Layouts/Header";
import { flightUser } from "../../services/flightService";

const airports = [
  { code: "JFK", name: "John F. Kennedy International Airport (New York, USA)" },
  { code: "LAX", name: "Los Angeles International Airport (Los Angeles, USA)" },
  { code: "DFW", name: "Dallas/Fort Worth International Airport (Dallas-Fort Wort, USA)" },
  { code: "CDG", name: "Charles de Gaulle Airport (Paris, France)" },
  { code: "MAD", name: "Adolfo Suárez Madrid–Barajas Airport (Madrid, Spain)" },
  { code: "BCN", name: "Barcelona–El Prat Airport (Barcelona, Spain)" },
  { code: "HND", name: "Tokyo Haneda Airport (Tokyo, Japan)" },
  { code: "DXB", name: "Dubai International Airport (Dubai, UAE)" },
  { code: "FRA", name: "Frankfurt Airport (Frankfurt, Germany)" },
  { code: "MEX", name: "Aeropuerto Internacional Benito Juárez (CDMX, México)" },
  { code: "QRO", name: "Aeropuerto Intercontinental de Querétaro (Querétaro, Qro)" }
];

export default function FlightPage() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    adults: 1,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const results = await flightUser(
        searchParams.origin,
        searchParams.destination,
        searchParams.departureDate,
        searchParams.adults
      );

      const formattedFlights = results.map((flight) => {
        const firstSegment = flight.itineraries[0].segments[0];
        const pricing = flight.price;

        return {
          airline: firstSegment.carrierCode,
          origin: firstSegment.departure.iataCode,
          destination: firstSegment.arrival.iataCode,
          time: new Date(firstSegment.departure.at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          price: `$${pricing.total}`,
          fullData: flight,
        };
      });

      setFlights(formattedFlights);
    } catch (err) {
      setError(err.message || "Error al buscar vuelos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flight-page">
      <Header />

      <div className="search-container">
        <h2>Encuentra tu vuelo ideal</h2>
        <form onSubmit={handleSubmit} className="flight-search-form">
          <div className="form-group">
            <label htmlFor="origin">Origen:</label>
            <input
              list="airportList"
              id="origin"
              name="origin"
              value={searchParams.origin}
              onChange={handleInputChange}
              placeholder="Ej: JFK"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="destination">Destino:</label>
            <input
              list="airportList"
              id="destination"
              name="destination"
              value={searchParams.destination}
              onChange={handleInputChange}
              placeholder="Ej: CDG"
              required
            />
          </div>

          <datalist id="airportList">
            {airports.map((airport) => (
              <option key={airport.code} value={airport.code}>
                {airport.name}
              </option>
            ))}
          </datalist>

          <div className="form-group">
            <label htmlFor="departureDate">Fecha de salida:</label>
            <input
              type="date"
              id="departureDate"
              name="departureDate"
              value={searchParams.departureDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="adults">Pasajeros:</label>
            <select id="adults" name="adults" value={searchParams.adults} onChange={handleInputChange}>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </form>
      </div>

      <div className="flight-container-wrapper">
        {error && <p className="error-message">{error}</p>}

        <div className="flight-container">
          {loading ? (
            <p className="loading-message">Cargando vuelos...</p>
          ) : flights.length > 0 ? (
            flights.map((flight, index) => <FlightCard key={index} flight={flight} />)
          ) : (
            <p className="no-flights-message">
              {!error && "Ingresa tus criterios de búsqueda para encontrar vuelos."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
