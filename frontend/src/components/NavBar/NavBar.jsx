import React from "react";
import { useContext } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import "./NavBar.css";

const Navbar = () => {
  const { logoutUser, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { user_id } = useParams
  return (
    <div className="navBar">
      <ul>
        <li className="brand">
          <Link to="/" style={{ textDecoration: "none", color: "white" }}>
            <b>React/Flask JWT</b>
          </Link>
        </li>
        <li>
          <Link to="table" style={{ textDecoration: "none", color: "white" }}>
            <b>Table Menu</b>
          </Link>
        </li>

        <li>
          <Link
            to={"managerpage"}
            style={{ textDecoration: "none", color: "white" }}
          >
            Manager Page
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
