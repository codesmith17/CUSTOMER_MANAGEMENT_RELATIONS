import React, { useState } from "react";
import styles from "./CustomerFilterPage.module.css";

const DeliveryStatusTable = (props) => {
  const [visibleRows, setVisibleRows] = useState(5); // Initial number of visible rows
  const [isAllRowsVisible, setIsAllRowsVisible] = useState(false); // Flag to track if all rows are visible

  const { data } = props;
  console.log(data); // Log the prop for debugging

  const tableHeaders = [
    "Campaign ID",
    "Message",
    "Customer Email",
    "Delivery Status",
  ];

  const handleLoadMore = () => {
    setVisibleRows(data.length); // Show all rows
    setIsAllRowsVisible(true); // Set the flag to true
  };

  return (
    <div className={styles.tableWrapper}>
      <table id="customers" className={styles.customersTable}>
        <thead>
          <tr>
            {tableHeaders.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.slice(0, visibleRows).map((status) => (
            <tr key={status._id}>
              <td>{status.campaignId}</td>
              <td>{status.message}</td>
              <td>{status.customerEmail}</td>
              <td>{status.deliveryStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!isAllRowsVisible && (
        <button className={styles.loadMoreButton} onClick={handleLoadMore}>
          Load More
        </button>
      )}
    </div>
  );
};

export default DeliveryStatusTable;
