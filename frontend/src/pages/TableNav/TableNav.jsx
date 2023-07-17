import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./TableNav.css"

const TableNav = () => {
  const [tables, setTables] = useState([]);
  const [user, token] = useAuth();
  const [order_id, setOrderID] = useState(null);

  const navigate = useNavigate();

  const fetchTables = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/tables");
      const updatedTableDetails = response.data.map((table) => ({
        ...table,
        order_id: null,
      }));
      setTables(updatedTableDetails);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const assignTableDetails = async (table_id) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.put(
        `http://127.0.0.1:5000/api/tables/${table_id}`,
        { user_id: user.id },
        config
      );
      navigate(`/serve/${table_id}`);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const unassignTableDetails = async (table_id) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.delete(`http://127.0.0.1:5000/api/tables/${table_id}`, config);
      fetchTables();
    } catch (error) {
      console.log(error.response.data);
    }
  };
  

  useEffect(() => {
    fetchTables();
  }, []);

  return (
    <div className="container-fluid">
      <h1 className="headerpos">Dining Room</h1>
      <hr/>
      {tables.map((table) => (
        <div key={table.id} className="mb-4">
          <h2 className="headerpos">{table.name}</h2>
          <div className="row align-items-center">
            <div className="col-6">
              <h2 className="mb-2 infopos">
                Seats: {table.seats} | User: {table.user_id}
              </h2>
            </div>
            <div className="col-6">
              <div className="row">
                <div className="col">
                  <button
                    className="btn btn-success me-2"
                    onClick={() => assignTableDetails(table.id)}
                  >
                    Assign Server and Start Order
                  </button>
                </div>
                <div className="col">
                  <button
                    className="btn btn-success me-2"
                    onClick={() => unassignTableDetails(table.id)}
                  >
                    Unassign Server from Table
                  </button>
                </div>
                <div className="col">
                  <Link to={`/serve/${table.id}`}>
                    <button className="btn btn-success">Order Menu</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <hr />
        </div>
      ))}
    </div>
  );
}


export default TableNav;
