import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const TableNav = () => {
  const [tableDetails, setTableDetails] = useState([]);
  const [user, token] = useAuth();
  const [order_id, setOrderID] = useState(null);

  const fetchTableDetails = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/tables');
      const updatedTableDetails = response.data.map(table => ({
        ...table,
        order_id: null 
      }));
      setTableDetails(updatedTableDetails);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const assignTableDetails = async (table_id) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      await axios.put(`http://127.0.0.1:5000/api/${table_id}`, null, config);
      fetchTableDetails();
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const unassignTableDetails = async (table_id) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      await axios.delete(`http://127.0.0.1:5000/api/${table_id}`, config);
      fetchTableDetails();
    } catch (error) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    fetchTableDetails();
  }, []);

  return (
    <div>
      <h1>Tables</h1>
      {tableDetails.map((table) => (
        <div key={table.id}>
          <h2>{table.name}</h2>
          <h3>Seats: {table.seats}</h3>
          <h3>User: {table.user_id}</h3>
          
          <Link to={`/serve/${table.id}`}>
            <button onClick={() => assignTableDetails(table.id)}>Assign Server and Start Order</button>
          </Link>
          <button onClick={() => unassignTableDetails(table.id)}>Unassign Server from table</button>
          <Link to={`/serve/${table.id}`}>
            <button>Order Menu</button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default TableNav;
