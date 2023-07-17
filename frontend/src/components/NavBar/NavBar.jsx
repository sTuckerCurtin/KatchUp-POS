import React from "react";
import { useContext } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import "./NavBar.css";

const Navbar = () => {
  const { logoutUser, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { user_id } = useParams;

  return (
    <div className="navBar">
      <ul>
        <li className="navbar-brand">
          <Link to="/" style={{ textDecoration: "none", color: "white" }}>
            <img src="AdobeStock_550305846_Preview.png" alt="Logo" className="logo-icon"/> 
            <b className="brand">KatchUp POS</b>
          </Link>
        </li>
        <li>
          <Link to="table" style={{ textDecoration: "none", color: "white" }} className="tablepos">
           <h4><b>Table Menu</b></h4> 
          </Link>
        </li>

        <li>
          <Link
            to={"managerpage"}
            style={{ textDecoration: "none", color: "white" }} className="tablepos"
          >
           <h4><b>Manager Page</b></h4> 
          </Link>
        </li>
        <li>
          {user ? (
            <button onClick={logoutUser}>Logout</button>
          ) : (
            <button onClick={() => navigate("/login")}>Login</button>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
