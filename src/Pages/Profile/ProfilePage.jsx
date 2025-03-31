import React from "react";
import Header from "../../Layouts/Header"; 
import ProfileForm from "./Components/ProfileForm";
import airplaneImage from "../../assets/avi.jpg"; 
import "../../styles/Profile/ProfilePage.css"; 

const ProfilePage = () => {
  return (
    <div className="profile-container">
      <Header />

      <div className="profile-content">
        <div className="profile-form-container">
          <ProfileForm />
        </div>
        <div className="profile-image">
          <img src={airplaneImage} alt="Avión" />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
