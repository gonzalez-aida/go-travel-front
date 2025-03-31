import React, { useState, useEffect } from "react";
import HotelCard from "./Components/HotelCard";
import "../../styles/Hotels/HotelPage.css";
import Header from "../../Layouts/Header";
import { fetchCityHotels } from "../../services/googlePlaces";

export default function HotelPage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cityName, setCityName] = useState("Madrid"); 

  useEffect(() => {
    if (!cityName) return;

    const fetchHotels = async () => {
      setLoading(true);
      try {
        const data = await fetchCityHotels(cityName);
        
        if (data.success && Array.isArray(data.hotels)) {
          // Filtrar hoteles que no tienen nombre o dirección
          const validHotels = data.hotels.filter(
            hotel => hotel.name && hotel.address && hotel.address !== hotel.name
          );
          setHotels(validHotels);
          setError(null);
        } else {
          setError("No se encontraron hoteles en esta ciudad.");
        }
      } catch (err) {
        setError("Error al cargar hoteles. Intente nuevamente.");
        console.error("Error fetching hotels:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [cityName]);

  const handleInputChange = (e) => {
    setCityName(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="hotel-page">
      <Header />

      <div className="search-container">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="form-row">
            <div className="form-group">
              <label>Ciudad</label>
              <input
                type="text"
                value={cityName}
                onChange={handleInputChange}
                placeholder="Ej: Madrid"
                required
              />
            </div>
            <button type="submit">Buscar</button>
          </div>
        </form>
      </div>

      {loading && <div className="loading-message">Cargando hoteles...</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="hotels-list">
  {hotels.length === 0 && !loading && !error && (
    <div className="no-results">No se encontraron hoteles en esta ciudad.</div>
  )}
  
  <div className="hotels-grid">
    {hotels.map((hotel) => (
      <HotelCard key={hotel.id} hotel={hotel} />
    ))}
  </div>
</div>

    </div>
  );
}