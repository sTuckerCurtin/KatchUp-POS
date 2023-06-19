import React, { useState } from "react";
import axios from "axios";
import MenuItem from "../../components/MenuItem/MenuItem";
import ServicePage from "../../pages/ServicePage/ServicePage";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import Transaction from "../Transaction/Transaction";

function Order({ order }) {
  const [selectResults, setSelectResults] = useState(null);
  const [user, token, config] = useAuth();
  const [totalPrice, setTotalPrice] = useState(0);
  const [isCompleted, setIsCompleted] = useState(order.is_completed);

  const fetchMenuDetails = async (typeId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/menu_items`);
      const filteredItems = response.data.filter(
        (item) => item.type_id === typeId
      );
      setSelectResults(filteredItems);
    } catch (error) {
      console.error("Error getting results", error);
    }
  };

  const handleButtonClick = (typeId) => {
    fetchMenuDetails(typeId);
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    order.items.forEach((orderItem) => {
      totalPrice += orderItem.menu_item.price;
    });
    return totalPrice.toFixed(2);
  };

  const handleCompletionToggle = () => {
    setIsCompleted(!isCompleted);
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
          {selectResults.map((menuItem) => (
            <MenuItem
              menuItem={menuItem}
              key={menuItem.id}
              order_id={order.id}
            />
          ))}
        </div>
      )}

      <h2>Check</h2>
      <form>
        {order.items.map((orderItem, index) => (
          <div key={index}>
            <input type="text" value={orderItem.menu_item.name} disabled />
            <input type="number" value={orderItem.menu_item.price} disabled />
          </div>
        ))}

        <h2>Total Price: ${calculateTotalPrice()}</h2>
        <button type="submit">Send Order</button>
      </form>

      <h2>Order Status: {isCompleted ? "Completed" : "Incomplete"}</h2>
      <button onClick={handleCompletionToggle}>
        {isCompleted ? "Mark as Incomplete" : "Mark as Completed"}
      </button>

      <Transaction order_id={order.id} totalPrice={calculateTotalPrice()} />
    </div>
  );
}

export default Order;
