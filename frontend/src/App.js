// General Imports
import { Routes, Route } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect, useContext } from "react";

// Pages Imports
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import ServicePage from "./pages/ServicePage/ServicePage";
import TableNav from "./pages/TableNav/TableNav";
import ManagerPage from "./pages/ManagerPage/ManagerPage";
import CheckoutForm from "./components/CheckoutForm/CheckoutForm";
import ServerReports from "./pages/ServerReports/ServerReports";

// Component Imports
import Navbar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";

// Util Imports
import PrivateRoute from "./utils/PrivateRoute";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";



export default function App() {

  const options = {
    // passing the client secret obtained from the server
    clientSecret: "{{sk_test_51NL7X3IQQKESwEBor6MSZe6jY9Uz7AECP5Pf4qyyBxHAKV2k4jRlXUVwSM2aKMqg6je5r0CUgEkbSU4rs2UYb25m00I1EqZQit}}",
  };

 

  return (
    <div>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/serve/:table_id"
          element={
            <PrivateRoute>
              <ServicePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/table"
          element={
            <PrivateRoute>
              <TableNav />
            </PrivateRoute>
          }
        />
        <Route
          path="/pay"
          element={
            <PrivateRoute>
              {/* <Elements stripe={stripePromise} options={options}> */}
                <CheckoutForm />
              {/* </Elements> */}
            </PrivateRoute>
          }
        />
        <Route
          path="/managerpage"
          element={
            <PrivateRoute>
              <ManagerPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <ServerReports />
            </PrivateRoute>
          }
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}
