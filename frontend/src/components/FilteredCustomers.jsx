import React from "react";
import styles from "./FilteredCustomers.module.css";
import { useLocation } from "react-router-dom";

const FilteredCustomers = () => {
  const location = useLocation();
  const customers = location.state?.customers || [];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Filtered Customers</h1>
      <p className={styles.count}>Total: {customers.length}</p>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Total Spends</th>
            <th>Visits</th>
            <th>Last Visit</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer._id}>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>INR {customer.totalSpends.toFixed(2)}</td>
              <td>{customer.visits}</td>
              <td>
                {customer.lastVisit
                  ? new Date(customer.lastVisit).toLocaleDateString()
                  : "Never"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FilteredCustomers;
