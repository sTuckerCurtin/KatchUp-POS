import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import "./ManagerPage.css"

function ManagerPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [user, token, config] = useAuth();
  const [typeId, setTypeId] = useState(1);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [orders, setOrders] = useState([]);

  const fetchMenuDetails = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/menu_items");
      const menuItems = response.data;
      setMenuItems(menuItems);
    } catch (error) {
      console.error("Error getting results", error);
    }
  };

  const postNewItem = async (e) => {
    e.preventDefault();

    const formData = {
      type_id: typeId,
      name: name,
      price: parseFloat(price),
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/menu_items",
        formData,
        config
      );
      console.log("Item posted successfully:", response.data);

      setName("");
      setPrice(0);
      fetchMenuDetails();
    } catch (error) {
      console.error("Error posting item:", error.response.data);
    }
  };

  useEffect(() => {
    fetchMenuDetails();
  }, []);

  const getAllUsers = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/api/employees",
        config
      );
      const employees = response.data;
      setEmployees(employees);
    } catch (error) {
      console.error("Error getting employees:", error.response.data);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllOrders = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/orders");
      if (response.data && Array.isArray(response.data)) {
        const allOrders = response.data;
        setOrders(allOrders);
      } else {
        console.error("Invalid response data for orders:", response.data);
      }
    } catch (error) {
      console.error(
        "Error getting orders:",
        error.response ? error.response.data : error.message
      );
    }
  };

  useEffect(() => {
    getAllOrders();
  }, []);
  return (
    <div className="pagelayout">
      <h1 className="title">Manager Page</h1>
      <hr/>
      <div className="content-wrapper addposition">
        <h2>Add New Item</h2>
        <form onSubmit={postNewItem}>
          <div>
            <label htmlFor="typeId">Type ID:</label>
            <input
              type="number"
              id="typeId"
              value={typeId}
              onChange={(e) => setTypeId(parseInt(e.target.value))}
            />
          </div>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              id="price"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
            />
          </div>
          <button type="submit">Add Item</button>
        </form>
      </div>

      <div>
        <table className="table table-dark table-striped position">
          <thead>
            <tr>
              <th colSpan="4">
                <h2>Menu Items</h2>
              </th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((menuItem) => (
              <tr key={menuItem.id}>
                <td>Type ID: {menuItem.type_id}</td>
                <td>Name: {menuItem.name}</td>
                <td>Price: ${menuItem.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <hr />

      <div>
        <h2>Employees</h2>
        {employees.map((employee) => (
          <div key={employee.id}>
            <div>First Name: {employee.first_name}</div>
            <div>Last Name: {employee.last_name}</div>
            <div>Pin: {employee.pin}</div>
            <div>Is Manager: {employee.is_manager ? "Yes" : "No"}</div>
            <div>---------------------</div>
            <Link to="/register">
              <button>Add New User</button>
              </Link>
          </div>
        ))}
      </div>
      <hr />
      <div>
      <h2>Orders</h2>
        {orders.map((order) => (
          <div key={order.id}>
            <div>Order ID: {order.id}</div>
            <div>Server ID: {order.user_id}</div>
            <div>Table: {order.table_id}</div>
            <div>Items:</div>
            <ul className="list-group">
              {order.items.map((item) => (
                <li key={item.id} className="list-group-item">
                  <div>Item: {item.menu_item.name}</div>
                  <div>Price: {item.menu_item.price}</div>
                  <div>Quantity: {item.quantity}</div>
                </li>
              ))}
            </ul>
            <hr className="my-4" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManagerPage;

//
