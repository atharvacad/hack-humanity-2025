// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Home from './Home';
import FoodListDonar from './FoodListDonar';
import ViewFoodList from './ViewFoodList';
import DonorList from './DonorList';
import CommunityPartnerList from './CommunityPartnerList';
import FoodRequestCommunityPartner from './FoodRequestCommunityPartner';
import DonorHome from './DonorHome';
import CommunityPartnerHome from './CommunityPartnerHome';
import SignIn from './signin';
import SignUp from './signup';
import SignOut from './SignOut';
import NotFound from './NotFound';
import RequestedFood from './RequestedFood';
import AddFoodDonation from './AddFoodDonation';
import AboutUs from './AboutUs'; // Import the AboutUs component
import Cookies from 'js-cookie';

const App = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      setUserData(JSON.parse(userCookie));
    }
  }, []);

  const handleUserUpdate = (user) => {
    setUserData(user);
  };

  const userType = userData ? userData.type : null;

  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link className="navbar-brand" to="/">AgniSewa App</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              {userType === 'donor' && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/donor-home">Donor Home</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/foodlistdonar">Food List Donar</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/requested-food">Requested Food</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/add-food-donation">Add Food Donation</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/community-partner-list">Community Partner List</Link>
                  </li>
                </>
              )}
              {userType === 'community-partner' && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/community-partner-home">Community Partner Home</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/donor-list">View Donor List</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/view-food-list">View Food List</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to={`/food-requests/${userData.id}`}>Food Requests</Link>
                  </li>
                </>
              )}
              {!userType && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/signup">Sign Up</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/signin">Sign In</Link>
                  </li>
                </>
              )}
              {userType && (
                <li className="nav-item">
                  <Link className="nav-link" to="/signout">Sign Out</Link>
                </li>
              )}
              <li className="nav-item">
                <Link className="nav-link" to="/about-us">About Us</Link>
              </li>
            </ul>
          </div>
        </nav>
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/donor-home" element={<DonorHome />} />
            <Route path="/community-partner-home" element={<CommunityPartnerHome />} />
            <Route path="/foodlistdonar" element={<FoodListDonar />} />
            <Route path="/view-food-list" element={<ViewFoodList />} />
            <Route path="/donor-list" element={<DonorList />} />
            <Route path="/community-partner-list" element={<CommunityPartnerList />} />
            <Route path="/food-requests/:communityPartnerId" element={<FoodRequestCommunityPartner />} />
            <Route path="/requested-food" element={<RequestedFood />} />
            <Route path="/add-food-donation" element={<AddFoodDonation />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn onUserUpdate={handleUserUpdate} />} />
            <Route path="/signout" element={<SignOut onUserUpdate={handleUserUpdate} />} />
            <Route path="/about-us" element={<AboutUs />} /> {/* Add the About Us route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;