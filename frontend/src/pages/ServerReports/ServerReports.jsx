import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ServerReports.css"

function ServerReports({ user_id }) {
  const [serverReport, setServerReport] = useState(null);

  useEffect(() => {
    const fetchServerReport = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/api/check/${user_id}`
        );
        setServerReport(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchServerReport();
  }, [user_id]);

  return (
    <div>
      {serverReport ? (
        <div>
          <div className="homepageinfo">
            <h2>Server Report</h2>
            <p>User ID: {user_id}</p>
          </div>
        
          <table className="table table-dark table-striped">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Name</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {serverReport.order_items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Loading server report...</p>
      )}
    </div>
  );
}

export default ServerReports;
