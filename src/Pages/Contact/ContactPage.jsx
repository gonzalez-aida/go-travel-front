import React, { useState, useEffect, useRef } from 'react';
import ContactCard from "./Components/ContactCard";
import "../../styles/Contact/ContactPage.css";
import Header from "../../Layouts/Header";
import { getLocations } from "../../services/contactService";

const DEFAULT_CENTER = { lat: 20.5881, lng: -100.3881 };
const API_KEY = 'AIzaSyDb3G4iXhQjeh_DvpERuAkn5Sa-6s_8BvI';

const BUILDING_ICON = {
  url: 'https://cdn-icons-png.flaticon.com/512/619/619153.png',
  scaledSize: { width: 40, height: 40 }
};

export default function ContactPage() {
  const [locations, setLocations] = useState([]);
  const [mapState, setMapState] = useState({
    loaded: false,
    error: null
  });
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markersRef = useRef([]);
  const initCalled = useRef(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getLocations();
        setLocations(data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    if (initCalled.current) return;
    initCalled.current = true;

    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps) {
      setMapState({ loaded: true, error: null });
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector(
      'script[src^="https://maps.googleapis.com/maps/api/js"]'
    );

    if (existingScript) {
      existingScript.addEventListener('load', () => {
        setMapState({ loaded: true, error: null });
      });
      return;
    }

    // Load the script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setMapState({ loaded: true, error: null });
    };
    script.onerror = () => {
      setMapState({ loaded: false, error: 'Failed to load Google Maps API' });
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (mapState.loaded && locations.length > 0 && mapContainerRef.current && !mapRef.current) {
      try {
        initializeMap();
      } catch (error) {
        console.error('Map initialization error:', error);
        setMapState(prev => ({ ...prev, error: 'Map initialization failed' }));
      }
    }
  }, [mapState.loaded, locations]);

  const initializeMap = () => {
    mapRef.current = new window.google.maps.Map(mapContainerRef.current, {
      center: DEFAULT_CENTER,
      zoom: 12,
    });
    addMarkers();
  };

  const addMarkers = () => {
    if (!mapRef.current || locations.length === 0) return;
    
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const geocoder = new window.google.maps.Geocoder();
    const bounds = new window.google.maps.LatLngBounds();

    locations.forEach(location => {
      const address = [
        location.calle, location.colonia,
        location.municipio, location.estado, location.cp, location.pais
      ].filter(Boolean).join(', ');

      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const position = results[0].geometry.location;
          const marker = new window.google.maps.Marker({
            map: mapRef.current,
            position,
            title: location.municipio || 'Ubicación',
            icon: BUILDING_ICON,
          });

          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div class="map-info-window">
                <h4>${location.municipio || 'Ubicación'}</h4>
                <p>${location.calle || ''}</p>
                ${location.colonia ? `<p>Colonia: ${location.colonia}</p>` : ''}
                ${location.cp ? `<p>CP: ${location.cp}</p>` : ''}
              </div>
            `
          });

          marker.addListener('click', () => {
            infoWindow.open(mapRef.current, marker);
          });

          markersRef.current.push(marker);
          bounds.extend(position);
          mapRef.current.fitBounds(bounds);
        }
      });
    });
  };

  return (
    <div className="contact-page">
      <Header />
      <h2 className="contact-title">Contacto</h2>
      
      <div className="map-container">
        {mapState.error ? (
          <div className="map-error">
            Error loading map: {mapState.error}
          </div>
        ) : (
          <div 
            ref={mapContainerRef}
            id="map" 
            style={{ height: '400px', width: '100%' }}
          />
        )}
      </div>

      <div className="contact-container">
        {locations.length > 0 ? (
          locations.map((location, index) => (
            <ContactCard
              key={index}
              city={`${location.municipio}, ${location.estado}`}
              location={`${location.calle}, ${location.colonia}`}
              email={location.email || 'gotravel@gotravel.com'}
              phone={location.telefono || '555-123-4567'}
            />
          ))
        ) : (
          <p className="no-contacts-message">No hay información de contacto disponible.</p>
        )}
      </div>
    </div>
  );
}