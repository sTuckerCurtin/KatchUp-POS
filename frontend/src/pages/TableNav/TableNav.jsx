import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';


const TableNav = () => {
  const [tableDetails, setTables] = useState(null);
  const [server, setServer]= useState(null)
  const [isUser, setIsUser] = useState(null)
  const [order, setOrder] = useState(null)
  const { id } = useParams();
  const [user, token] = useAuth();

  const fetchTableDetails = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/tables`);
      setTables(response.data);
      console.log(response.data)
    } catch (error) {
      console.log(error);
    }
  };

  const AssignTableDetails = async (table_id, user_id) => {
    try {
        const config = {headers: {Authorization: `Bearer ${token}`}}
      const [response1, response2] = await Promise.all([
        axios.put(`http://127.0.0.1:5000/api/${table_id}`, { ownerId: user_id }, config),
        axios.post(`http://127.0.0.1:5000/api/orders`, {table_id: table_id}, config)
      ]);
  
      setServer(response1.data);
      setOrder(response2.data)
    } catch (error) {
      console.log(error);
    }
  }
  

  useEffect(() => {
    fetchTableDetails();
  }, []);

  return (
    <div>
      <h1>Tables</h1>
      {tableDetails && tableDetails.map((table) => (
        <div key={table.id}>
          <h2>{table.name}</h2>
          <h2> Seats: {table.seats}</h2>
          <h3> User: {table.user_id}</h3>
          <button onClick={() => AssignTableDetails(table.id, table.user_id)}>Start Table</button><button>View</button>
          
        </div>
      ))}
    </div>
  );
};

export default TableNav;
