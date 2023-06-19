import React from "react";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import ServerReports from "../ServerReports/ServerReports";
import "./HomePage.css";

import axios from "axios";

const HomePage = () => {
  // The "user" value from this Hook contains the decoded logged in user information (username, first name, id)
  // The "token" value is the JWT token that you will send in the header of any request requiring authentication
  //TODO: Add an AddCars Page to add a car for a logged in user's garage
  const [user, token] = useAuth();

  return (
    <div>
      <div>
        {console.log(user)}
        <h1 className="homepagewelcome">Welcome {user.username}!</h1>
        <div></div>

        <ServerReports user_id={user.id} />
      </div>
    </div>
  );
};

export default HomePage;
