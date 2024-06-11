import React, { useState } from "react";
import styles from "./CustomerFilterPage.module.css";

const CustomerTable2 = ({ data }) => {
  const columnHeaders = [
    "_id",
    "message",
    "discountPercentage",
    "date",
    "audience",
  ];
  const [expandedRows, setExpandedRows] = useState([]);

  const toggleExpandRow = (index) => {
    setExpandedRows((prevExpandedRows) => {
      if (prevExpandedRows.includes(index)) {
        return prevExpandedRows.filter((i) => i !== index);
      } else {
        return [...prevExpandedRows, index];
      }
    });
  };

  const isCurrentCampaign = (index) => index === 0;

  return (
    <div className={styles.tableWrapper}>
      <table id="customers" className={styles.customersTable}>
        <thead>
          <tr>
            {columnHeaders.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <React.Fragment key={index}>
              {isCurrentCampaign(index) && <h3>Current campaign</h3>}
              {!isCurrentCampaign(index) && index === 1 && (
                <h3>Past campaigns</h3>
              )}
              <tr>
                {columnHeaders.map((key) => {
                  const value = row[key];
                  if (key === "audience") {
                    const isExpanded = expandedRows.includes(index);
                    const visibleAudience = isExpanded
                      ? value
                      : value.slice(0, 3);
                    const remainingAudience =
                      value.length - visibleAudience.length;

                    return (
                      <td key={key}>
                        <table>
                          <thead>
                            <tr>
                              <th>Customer Name</th>
                              <th>Customer Email</th>
                            </tr>
                          </thead>
                          <tbody>
                            {visibleAudience.map((customer, i) => (
                              <tr key={i}>
                                <td>{customer.customerName}</td>
                                <td>{customer.customerEmail}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {remainingAudience > 0 && (
                          <button onClick={() => toggleExpandRow(index)}>
                            {isExpanded
                              ? `Show Less (${remainingAudience})`
                              : `Show More (${remainingAudience})`}
                          </button>
                        )}
                      </td>
                    );
                  } else if (key === "date") {
                    return (
                      <td key={key}>{new Date(value).toLocaleString()}</td>
                    );
                  } else {
                    return <td key={key}>{JSON.stringify(value)}</td>;
                  }
                })}
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable2;
