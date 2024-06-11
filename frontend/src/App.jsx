// src/App.jsx

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupForm from "./components/SignupForm";
import SigninForm from "./components/SigninForm";
import DisplayFilterTable from "./components/DisplayFilterTable";
import ProductsPage from "./components/ProductsPage";
import CustomerFilterPage from "./components/CustomerFilterPage";
import AdminSigninForm from "./components/AdminSignIn";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SigninForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/products" element={<ProductsPage />} />{" "}
        <Route path="/hiddenForAdmin/signin" element={<AdminSigninForm />} />{" "}
        <Route path="/hiddenForAdmin/filter" element={<CustomerFilterPage />} />
        <Route
          path="/hiddenForAdmin/filter-table"
          element={<DisplayFilterTable />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
