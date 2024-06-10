import React from "react";
import styles from "./CustomerFilterPage.module.css";

const CustomerTable = ({ data }) => {
  const tableHeaders = [
    "ID",
    "Email",
    "Total Spends",
    "Is Admin",
    "Visits",
    "Last Visit",
  ];

  return (
    <table id="customers" className={styles.customersTable}>
      <thead>
        <tr>
          {tableHeaders.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((customer) => (
          <tr key={customer._id}>
            <td>{customer._id}</td>
            <td>{customer.email}</td>
            <td>{customer.totalSpends}</td>
            <td>{customer.isAdmin ? `true` : `false`}</td>
            <td>{customer.visits}</td>
            <td>{customer.lastVisit}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CustomerTable;
