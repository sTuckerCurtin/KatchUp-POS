import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Order from "../../components/Order/Order";


const ServicePage = () => {
  const [table, setTable] = useState(null);
  const [user, token, config] = useAuth();
  const { table_id } = useParams();

  const fetchTable = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/api/tables/${table_id}`,
        config
      );
      setTable(response.data);
    } catch (error) {
      console.error(error.response.data);
    }
  };
  useEffect(() => {
    fetchTable();
  }, [table_id]);

  
  return (
    table && (
      <div>
        <h1>Table Name: {table.name}</h1>
        {table.orders.map((order) =>(
          <Order order={order}/>
        ))}
        
      </div>
    )
  );
};
export default ServicePage;
