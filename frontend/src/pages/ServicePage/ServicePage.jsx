import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const ServicePage = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [selectResults, setSelectResults] = useState(null);
  const [tableId, setTableId] = useState(null);
  const [newOrder, setNewOrder]= useState("")
  const [Check, setCheck]= useState(null)
  const [user, token] = useAuth();
  const { id, table_id } = useParams();

  useEffect(() => {
    fetchMenuDetails(id);
    setTableId(table_id);
    getCheck(); 
  }, [id, table_id]);



  const fetchMenuDetails = async (typeId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/menu_items`);
      const filteredItems = response.data.filter(item => item.type_id === typeId);
      setSelectResults(filteredItems);
    } catch (error) {
      console.error("Error getting results", error);
    }
  };

  const handleButtonClick = (typeId) => {
    fetchMenuDetails(typeId);
  };

  const handleItemSelect = (item) => {
    setOrderDetails(prevOrderDetails => [...prevOrderDetails, item]);
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    orderDetails.forEach(item => {
      totalPrice += item.price;
    });
    return totalPrice.toFixed(2); 
  };

  const sendOrder = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
  
      const tableId = table_id; 
  
      const order_id = await createOrder(tableId); 
  
      const requestData = orderDetails.map(item => ({
        quantity: 1,
        order_id: order_id,
        menu_item_id: item.id,
      }));
  
      const response = await axios.post("http://127.0.0.1:5000/api/order_items", requestData, config);
  
      setNewOrder(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error.response.data);
    }
  };
  

  const getCheck = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
  
      const tableId = table_id; 
  
      const order_id = await createOrder(tableId); 
  
      const response = await axios.get(`http://127.0.0.1:5000/api/orders/${order_id}`, config);
  
      setOrderDetails(response.data.items);
      setCheck(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  
  
  const createOrder = async (tableId) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
  
      const requestData = { table_id: tableId };
      const response = await axios.post("http://127.0.0.1:5000/api/orders", requestData, config);
  
      const { order_id } = response.data; 
  
      return order_id;
    } catch (error) {
      console.error(error.response.data);
      throw error;
    }
  };
  
  
  
  
  return (
    <div>
      <h1>Order Details</h1>
      <h3>Table Name: {tableId}</h3>
      <button onClick={() => handleButtonClick(1)}>Apps</button>
      <button onClick={() => handleButtonClick(2)}>Lunch</button>
      <button onClick={() => handleButtonClick(3)}>Dinner</button>
  
      {selectResults && (
        <div>
          <h2>Menu Items</h2>
          {selectResults.map((item) => (
            <div key={item.id}>
              <div>{item.name} - ${item.price}</div>
              <button onClick={() => handleItemSelect(item)}>Select</button>
            </div>
          ))}
        </div>
      )}
  
      <h2>Check</h2>
      <form>
        {orderDetails.map((item) => (
          <div key={item.id}>
            <input type="text" value={item.name} disabled />
            <input type="number" value={item.price} disabled />
          </div>
        ))}
      </form>
  
      <h2>Total Price: ${calculateTotalPrice()}</h2>
      <button onClick={sendOrder}>Send Order</button>
    </div>
  );
  };
  
  export default ServicePage;
  
