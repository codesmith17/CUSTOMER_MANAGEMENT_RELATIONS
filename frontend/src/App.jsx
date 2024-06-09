// src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupForm from "./components/SignupForm";
import SigninForm from "./components/SigninForm";
import OrdersPage from "./components/OrdersPage.jsx";
import ProductsPage from "./components/ProductsPage.jsx";
import CustomerFilterPage from "./components/CustomerFilterPage.jsx";
// import SigninForm from './components/SigninForm'; // Uncomment this line if you have a SigninForm component
import FilteredCustomers from "./components/FilteredCustomers.jsx";
const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<SigninForm />} /> */}
        <Route path="/signin" element={<SigninForm />} />
        <Route path="/filtered-customers" element={<FilteredCustomers />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/filter" element={<CustomerFilterPage />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;
