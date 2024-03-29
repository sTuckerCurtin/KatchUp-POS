import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import "./ManagerPage.css";

function ManagerPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [user, token, config] = useAuth();
  const [typeId, setTypeId] = useState(1);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [tableName, setTableName] = useState("");
  const [seats, setSeats] = useState(0);
  const [editedOrderItem, setEditedOrderItem] = useState({});
  const [editedTable, setEditedTable] = useState({});

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

  const getAllTables = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/tables");
      const tables = response.data;
      setTables(tables);
    } catch (error) {
      console.error(error);
    }
  };

  const postNewTable = async (e) => {
    e.preventDefault();

    const formData = {
      name: tableName,
      seats: seats,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/tables",
        formData,
        config
      );
      console.log("Table posted successfully:", response.data);

      setTableName("");
      setSeats(0);
      getAllTables();
    } catch (error) {
      console.error("Error posting table:", error.response.data);
    }
  };

  const editOrderItem = (orderItemId) => {
    const orderItem = orders
      .flatMap((order) => order.items)
      .find((item) => item.id === orderItemId);
    setEditedOrderItem({
      id: orderItem.id,
      quantity: orderItem.quantity,
      menu_item_id: orderItem.menu_item.id,
    });
  };

  const updateEditedOrderItem = (field, value) => {
    setEditedOrderItem((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const saveEditedOrderItem = async () => {
    try {
      const updatedOrderItem = {
        quantity: editedOrderItem.quantity,
        menu_item_id: editedOrderItem.menu_item_id,
      };

      await axios.put(
        `http://127.0.0.1:5000/api/order_items/${editedOrderItem.id}`,
        updatedOrderItem,
        config
      );

      setEditedOrderItem({});
      getAllOrders(); // Refresh the orders data
    } catch (error) {
      console.error("Error updating order item:", error);
    }
  };

  const editTable = (table) => {
    setEditedTable({ ...table });
  };

  const handleTableChange = (e, tableId) => {
    const updatedTables = tables.map((table) => {
      if (table.id === tableId) {
        return { ...table, [e.target.name]: e.target.value };
      }
      return table;
    });
    setTables(updatedTables);
    setEditedTable((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const saveEditedTable = async (tableId) => {
    try {
      const editedTableIndex = tables.findIndex((table) => table.id === tableId);
      const updatedTable = {
        ...tables[editedTableIndex],
        name: editedTable.name,
        seats: parseInt(editedTable.seats),
      };
  
      await axios.put(
        `http://127.0.0.1:5000/api/tables/${tableId}`,
        updatedTable,
        config
      );
  
      const updatedTables = [...tables];
      updatedTables[editedTableIndex] = updatedTable;
      setTables(updatedTables);
  
      setEditedTable({});
    } catch (error) {
      console.error("Error updating table:", error);
    }
  };
  

  useEffect(() => {
    fetchMenuDetails();
    getAllUsers();
    getAllOrders();
    getAllTables();
  }, []);

  return (
    <div className="pagelayout">
      <h1 className="title">Manager Page</h1>
      <hr />
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

      <div className="container">
        <div className="text-center">
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
      </div>

      <hr />

      <div>
        <div className="text-center">
          <h2>Tables</h2>
          {tables.map((table) => (
            <div key={table.id}>
              {editedTable.id === table.id ? (
                <div>
                  <input
                    type="text"
                    name="name"
                    value={editedTable.name}
                    onChange={(e) => handleTableChange(e, table.id)}
                  />
                  <input
                    type="number"
                    name="seats"
                    value={editedTable.seats}
                    onChange={(e) => handleTableChange(e, table.id)}
                  />
                  <button onClick={() => saveEditedTable(table.id)}>
                    Save
                  </button>
                </div>
              ) : (
                <div>
                  <div>Table Name: {table.name}</div>
                  <div>Seats: {table.seats}</div>
                  <button onClick={() => editTable(table)}>Edit Table</button>
                </div>
              )}
            </div>
          ))}

          <div>
            <h2>Add New Table</h2>
            <form onSubmit={postNewTable}>
              <div>
                <label htmlFor="tableName">Table Name:</label>
                <input
                  type="text"
                  id="tableName"
                  value={tableName}
                  onChange={(e) => setTableName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="seats">Seats:</label>
                <input
                  type="number"
                  id="seats"
                  value={seats}
                  onChange={(e) => setSeats(parseInt(e.target.value))}
                />
              </div>
              <button type="submit">Add Table</button>
            </form>
          </div>
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
                    <div className="row">
                      <div className="col-md-4">
                        Item: {item.menu_item.name}
                      </div>
                      <div className="col-md-4">
                        Price: {item.menu_item.price}
                      </div>
                      <div className="col-md-4">Quantity: {item.quantity}</div>
                    </div>
                    {editedOrderItem.id === item.id ? (
                      <div>
                        <input
                          type="number"
                          value={editedOrderItem.quantity}
                          onChange={(e) =>
                            updateEditedOrderItem("quantity", e.target.value)
                          }
                        />
                        <input
                          type="number"
                          value={editedOrderItem.menu_item_id}
                          onChange={(e) =>
                            updateEditedOrderItem(
                              "menu_item_id",
                              e.target.value
                            )
                          }
                        />
                        <button onClick={saveEditedOrderItem}>Save</button>
                      </div>
                    ) : (
                      <button onClick={() => editOrderItem(item.id)}>
                        Edit Order
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              <hr className="my-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ManagerPage;
