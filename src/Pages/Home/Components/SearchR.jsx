import React, { useState, useEffect } from "react";
import { fetchCityAttractions } from "../../../services/googlePlaces";
import "../../../styles/Home/SearchR.css";

const SearchR = () => {
    const [cityName, setCityName] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState({
        attractions: [],
        loading: true, // Inicia en true para cargar Querétaro por defecto
        error: null,
        searchedCity: "Querétaro"
    });

    const [loadedImages, setLoadedImages] = useState({});

    // Cargar atracciones de Querétaro al montar el componente
    useEffect(() => {
        const loadDefaultAttractions = async () => {
            try {
                const data = await fetchCityAttractions("Querétaro");
                
                if (data.attractions && data.attractions.length > 0) {
                    data.attractions.forEach(attraction => {
                        const img = new Image();
                        img.src = attraction.photo;
                    });
                }

                setResults({
                    attractions: data.attractions || [],
                    loading: false,
                    error: null,
                    searchedCity: "Querétaro"
                });
            } catch (error) {
                console.error("Error cargando atracciones por defecto:", error);
                setResults(prev => ({
                    ...prev,
                    loading: false,
                    error: "No se pudieron cargar las atracciones por defecto"
                }));
            }
        };

        loadDefaultAttractions();
    }, []); // El array vacío asegura que solo se ejecute al montar el componente

    const handleImageLoad = (id) => {
        setLoadedImages(prev => ({ ...prev, [id]: true }));
    };

    const handleImageError = (id, photoUrl, e) => {
        setTimeout(() => {
            e.target.src = `${photoUrl}&retry=${Date.now()}`;
        }, 500);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (cityName.trim().length < 3) return;

        setLoading(true);
        setResults({
            attractions: [],
            loading: true,
            error: null,
            searchedCity: cityName
        });

        try {
            const data = await fetchCityAttractions(cityName);
            
            if (data.attractions && data.attractions.length > 0) {
                data.attractions.forEach(attraction => {
                    const img = new Image();
                    img.src = attraction.photo;
                });
            }

            setResults({
                attractions: data.attractions || [],
                loading: false,
                error: null,
                searchedCity: cityName
            });

            setLoadedImages({});
        } catch (error) {
            console.error("Error buscando atracciones:", error);
            setResults({
                attractions: [],
                loading: false,
                error: error.message || "No se encontraron atracciones",
                searchedCity: cityName
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search-and-results-container">
            {/* Sección de búsqueda */}
            <div className="search-section">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        value={cityName}
                        onChange={(e) => setCityName(e.target.value)}
                        placeholder="Busca una ciudad..."
                        className="search-input"
                        disabled={loading}
                    />
                    <button 
                        type="submit" 
                        className="search-btn"
                        disabled={loading || cityName.trim().length < 3}
                    >
                        {loading ? (
                            <span className="loading-spinner"></span>
                        ) : (
                            "Buscar"
                        )}
                    </button>
                </form>
            </div>

            {/* Sección de resultados */}
            <div className="results-section">
                {results.loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>{results.searchedCity === "Querétaro" ? "Cargando atracciones de Querétaro..." : "Buscando atracciones..."}</p>
                    </div>
                ) : results.error ? (
                    <div className="error-state">
                        <p>⚠️ {results.error}</p>
                    </div>
                ) : results.attractions.length === 0 && results.searchedCity ? (
                    <div className="empty-state">
                        <p>No encontramos atracciones en {results.searchedCity}</p>
                        <button 
                            className="default-search-btn"
                            onClick={() => {
                                setCityName("");
                                // Recargar Querétaro
                                setResults({
                                    attractions: [],
                                    loading: true,
                                    error: null,
                                    searchedCity: "Querétaro"
                                });
                                fetchCityAttractions("Querétaro").then(data => {
                                    setResults({
                                        attractions: data.attractions || [],
                                        loading: false,
                                        error: null,
                                        searchedCity: "Querétaro"
                                    });
                                });
                            }}
                        >
                            Ver atracciones de Querétaro
                        </button>
                    </div>
                ) : (
                    <>
                        <h2 className="results-title">
                            Atracciones en {results.searchedCity}
                            {results.searchedCity === "Querétaro" && (
                                <span className="default-tag"></span>
                            )}
                        </h2>
                        
                        <div className="attractions-grid">
                            {results.attractions.map((attraction) => (
                                <div key={attraction.id} className="attraction-card">
                                    <div className="card-image-container">
                                        <img
                                            src={attraction.photo}
                                            alt={attraction.name}
                                            className={`attraction-image ${loadedImages[attraction.id] ? 'loaded' : ''}`}
                                            loading="eager"
                                            onLoad={() => handleImageLoad(attraction.id)}
                                            onError={(e) => handleImageError(attraction.id, attraction.photo, e)}
                                        />
                                        {!loadedImages[attraction.id] && (
                                            <div className="image-loading-indicator"></div>
                                        )}
                                    </div>

                                    <div className="card-content">
                                        <h3 className="attraction-name">{attraction.name}</h3>
                                        <p className="attraction-address">
                                            {attraction.address || 'Dirección no disponible'}
                                        </p>
                                        
                                        <div className="rating-container">
                                            <span className="rating-value">
                                                ⭐ {attraction.rating?.toFixed(1) || 'N/A'}
                                            </span>
                                            <span className="rating-count">
                                                ({attraction.totalRatings || 0} reseñas)
                                            </span>
                                        </div>

                                        {attraction.reviews?.length > 0 && (
                                            <div className="reviews-section">
                                                <h4 className="reviews-title">Reseñas destacadas</h4>
                                                <div className="reviews-list">
                                                    {attraction.reviews.slice(0, 2).map((review, i) => (
                                                        <div key={i} className="review-item">
                                                            <div className="reviewer-info">
                                                                <img
                                                                    src={review.profile_photo_url || '/default-avatar.png'}
                                                                    alt={review.author_name}
                                                                    className="reviewer-avatar"
                                                                />
                                                                <div>
                                                                    <p className="reviewer-name">{review.author_name}</p>
                                                                    <p className="review-rating">
                                                                        ⭐ {review.rating} • {review.relative_time_description}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <p className="review-text">{review.text}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SearchR;