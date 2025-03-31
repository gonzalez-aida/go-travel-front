import React from "react";
import Header from "../../Layouts/Header";
import Footer from "../../Layouts/Footer";
import "../../styles/Home/HomePage.css";
import SearchR from "./Components/SearchR";

const HomePage = () => {
  return (
    <div className="home-page">
      <Header />
      <main>
        <SearchR />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;