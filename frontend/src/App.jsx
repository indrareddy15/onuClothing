import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Otpverify from "./components/Login/otpverify";
import Registeruser from "./components/Login/Registeruser";
import Overview from "./components/Login/Dashboard/overview";
import Allproductpage from "./components/Product/Allproduct";
import Ppage from "./components/Productpage/Ppage";
import MPpage from "./components/Productpage/MPpage";
import Wishlist from "./components/Wishlist/Wishlist";
import Bag from "./components/Bag/Bag";
import Address from "./components/Bag/Address";
import "react-lazy-load-image-component/src/effects/blur.css";
import { BASE_API_URL } from "./config/index";
import About from "./components/Website_HelpSupport/About";
import Contact from "./components/Website_HelpSupport/Contact";
import OrderDetailsPage from "./components/Login/Dashboard/OrderDetailsPage";
import FAQ from "./components/Website_HelpSupport/FAQ";
import TermsAndConditions from "./components/Website_HelpSupport/TermsAndConditions";
import PrivacyPolicy from "./components/Website_HelpSupport/PrivacyPolicy";
// import { Toaster } from "./components/ui/toaster";
import CheckoutPage from "./components/Bag/NewCheckoutPage";
import NotFoundPage from "./NotFoundPage";
import PaymentSuccess from "./components/Bag/PaymentSuccess";
import PaymentFailed from "./components/Bag/PaymentFailed";
import PaymentPending from "./components/Bag/PaymentPending";
import { useServerAuth } from "./Contaxt/AuthContext";
import axios from "axios";

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

function App() {
  const dispatch = useDispatch();
  const { width } = useWindowSize();
  const { userLoading, user, isAuthentication, checkAuthUser } =
    useServerAuth();

  const [state, setstate] = useState(false);

  useEffect(() => {
    if (state === false) {
      checkAuthUser();
      setstate(true);
    }
    let url = document.URL;
    if (url.includes("&")) {
      if (!url.includes("?")) {
        let url1 = url.replace("&", "?");
        window.location = url1;
      }
    }
    if (isAuthentication) {
      if (
        url ===
        window.location.protocol + "//" + window.location.host + "/Login"
      ) {
        window.location.href =
          window.location.protocol + "//" + window.location.host;
      }
      if (
        url ===
        window.location.protocol + "//" + window.location.host + "/verifying"
      ) {
        window.location.href =
          window.location.protocol + "//" + window.location.host;
      }
      if (
        url ===
        window.location.protocol + "//" + window.location.host + "/registeruser"
      ) {
        window.location.href =
          window.location.protocol + "//" + window.location.host;
      }
    }
  }, [dispatch, isAuthentication]);
  console.log("Base Server API: ", BASE_API_URL);

  const isMobile = width < 1024;
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home user={user} />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/verifying" element={<Otpverify />} />
        <Route path="/registeruser" element={<Registeruser />} />

        {/* Authenticated Routes */}
        <Route
          path="/dashboard"
          element={
            <Overview
              user={user}
              loading={userLoading}
              isAuthentication={isAuthentication}
            />
          }
        />
        <Route
          path="/order/details/:orderId"
          element={<OrderDetailsPage user={user} />}
        />
        {/* Checkout Routes */}
        <Route path="/my_wishlist" element={<Wishlist />} />
        <Route path="/bag" element={<Bag user={user} />} />
        <Route path="/bag/checkout" element={<CheckoutPage />} />
        <Route path="/bag/checkout/success" element={<PaymentSuccess />} />
        <Route path="/bag/checkout/failure" element={<PaymentFailed />} />
        <Route path="/bag/checkout/pending" element={<PaymentPending />} />

        {/* Address Route */}
        <Route path="/address/bag" element={<Address user={user} />} />

        {/* Static Pages */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/tc" element={<TermsAndConditions />} />
        <Route path="/privacyPolicy" element={<PrivacyPolicy />} />

        {/* Product Pages */}
        <Route path="/products" element={<Allproductpage user={user} />} />
        <Route
          path="/products/:id"
          element={isMobile ? <MPpage /> : <Ppage />}
        />

        {/* Catch-All Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {/* <Toaster /> */}
    </Router>
  );
}

export default App;
