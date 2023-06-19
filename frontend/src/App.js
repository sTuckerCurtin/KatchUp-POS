// General Imports
import { Routes, Route } from "react-router-dom";
import "./App.css";

// Pages Imports
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import ServicePage from "./pages/ServicePage/ServicePage";
import TableNav from "./pages/TableNav/TableNav";
import ManagerPage from "./pages/ManagerPage/ManagerPage";
import ServerReports from "./pages/ServerReports/ServerReports";

// Component Imports
import Navbar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";

// Util Imports
import PrivateRoute from "./utils/PrivateRoute";
import Transaction from "./components/Transaction/Transaction";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route path="/serve/:table_id"
        element={
          <PrivateRoute>
            <ServicePage />
          </PrivateRoute>
        }
        />
        <Route path="/table"
        element={
          <PrivateRoute>
            <TableNav/>
          </PrivateRoute>
        }
        />
        <Route path="/transaction/:order_id"
         element={
          <PrivateRoute>
            <Transaction />
          </PrivateRoute>
        }
        />
        <Route path="/managerpage"
        element={
          <PrivateRoute>
            <ManagerPage />
          </PrivateRoute>
        }
        />
        <Route path="/reports"
        element={
          <PrivateRoute>
            <ServerReports />
          </PrivateRoute>
        }
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>

    </div>
  );
}

export default App;
