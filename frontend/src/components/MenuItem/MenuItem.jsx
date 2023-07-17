import axios from "axios";
import React, { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import ServicePage from "../../pages/ServicePage/ServicePage";


function MenuItem({ menuItem, order_id, }) {
  const [user, token] = useAuth();
 
  const addOrderItem = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.post(
        `http://127.0.0.1:5000/api/orders/${order_id}/items`, 
        {menu_item_id: menuItem.id, quantity: 1},
        config
      );
     
    } catch (error) {}
  };

 

  return (
    <div>
      <div>
        {menuItem.name} - ${menuItem.price}
      </div>
      <button onClick={addOrderItem}>Select</button>
    </div>
  );
}

export default MenuItem;
