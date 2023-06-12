import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ServicePage = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [selectResults, setSelectResults] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchMenuDetails(id);
  }, [id]);

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

  return (
    <div>
      <h1>Order Details</h1>
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

      <h2>Selected Items</h2>
      <form>
        {orderDetails.map((item) => (
          <div key={item.id}>
            <input type="text" value={item.name} disabled />
            <input type="number" value={item.price} disabled />
          </div>
        ))}
      </form>

      <h2>Total Price: ${calculateTotalPrice()}</h2>
    </div>
  );
};

export default ServicePage;
