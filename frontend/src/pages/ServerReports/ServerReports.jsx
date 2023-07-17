import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ServerReports.css";

function ServerReports({ user_id }) {
  const [serverReport, setServerReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchServerReport = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/api/transactions`
        );
        setServerReport(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchServerReport();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredReport = serverReport
    ? serverReport.filter(
        (item) =>
          item.payment_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.order.items.some((orderItem) =>
            orderItem.menu_item.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          )
      )
    : [];

  return (
    <div>
      <div className="homepageinfo">
        <h2>Server Report</h2>
        Search <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {serverReport ? (
        filteredReport.length > 0 ? (
          <table className="table table-dark table-striped">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Payment ID</th>
                <th>Created At</th>
                <th>Amount</th>
                <th>Order Items</th>
              </tr>
            </thead>
            <tbody>
              {filteredReport.map((item) => (
                <tr key={item.id}>
                  <td>{item.order.id}</td>
                  <td>{item.payment_id}</td>
                  <td>{item.created_at}</td>
                  <td>{item.amount}</td>
                  <td>
                    <ul>
                      {item.order.items.map((orderItem) => (
                        <li key={orderItem.id}>
                          {orderItem.menu_item.name} - {orderItem.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No results found.</p>
        )
      ) : (
        <p>Loading server report...</p>
      )}
    </div>
  );
}

export default ServerReports;
