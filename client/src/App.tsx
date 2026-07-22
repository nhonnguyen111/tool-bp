import { Routes, Route } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";

import HomePage from "./pages/HomePage";
import ProductMasterPage from "./pages/ProductMasterPage";
import CustomerMasterPage from "./pages/CustomerMasterPage";
import Login from "./pages/Login";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <Routes>
      {/* Login */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Sau khi login */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductMasterPage />} />
          <Route path="/customer" element={<CustomerMasterPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
