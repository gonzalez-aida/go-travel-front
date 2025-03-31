import React from "react";
import PropTypes from "prop-types";
import "../../../styles/Contact/ContactCard.css";

export default function ContactCard({ city, location, email, phone }) {
  return (
    <article className="contact-card">
      <h3 className="contact-city">{city}</h3>
      <div className="contact-info">
        <p className="contact-location">📍 {location}</p>
        <p className="contact-email">✉️ {email}</p>
        <p className="contact-phone">📞 {phone}</p>
      </div>
    </article>
  );
}

ContactCard.propTypes = {
  city: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
};