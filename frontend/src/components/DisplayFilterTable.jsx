import React, { useState } from "react";
import styles from "./DisplayFilterTable.module.css";
import CustomerTable2 from "./CustomerTable2";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const DisplayFilterTable = () => {
  const [message, setMessage] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [showTable, setShowTable] = useState(false); // State to toggle table display
  const [customerData, setCustomerData] = useState(null); // State to store customer data
  const location = useLocation();
  const data = location.state;
  //   console.log(data);
  console.log(customerData);
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleDiscountChange = (e) => {
    setDiscountPercentage(e.target.value);
  };

  const handleSubmit = () => {
    if (message === "" || !message) {
      toast.error("MESSAGE CANNOT BE EMPTY!");
      return;
    }
    if (!message.includes("${discountPercentage}")) {
      toast.error("MESSAGE SHOULD INCLUDE ${discountPercentage}");
      return;
    }

    fetch("http://localhost:3000/api/campaign/postFilteredTable", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        message,
        data,
        discountPercentage,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          toast.error("CANNOT SAVE TO COMMUNICATION LOGS");
        } else {
          toast.success("SAVED TO COMMUNICATION LOGS");
          // Fetch customer data after successful submission
          return;
        }
      })

      .catch((error) => {
        console.error("Error submitting customer data:", error);
        toast.error("Error submitting customer data");
      });
  };

  const fetchFilteredTable = () => {
    if (showTable) {
      setShowTable(false);
      return;
    }

    fetch("http://localhost:3000/api/campaign/getFilteredTable")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch customer data");
        }
      })
      .then((data) => {
        setCustomerData(data);
        setShowTable(true);
        return data;
      })
      .catch((error) => {
        console.error("Error fetching filtered table:", error);
        toast.error("Error fetching filtered table");
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.heading}>Customer Communication</h1>
        <textarea
          value={message}
          onChange={handleMessageChange}
          placeholder="Enter your communication message. Use ${name} for name and similar for ${email} and ${discountPercentage}."
          rows={5}
          className={styles.messageTextarea}
        />

        <input
          type="number"
          value={discountPercentage}
          onChange={handleDiscountChange}
          placeholder="Enter discount percentage"
          className={styles.discountInput}
        />

        <button onClick={handleSubmit} className={styles.submitButton}>
          Submit
        </button>
        <button onClick={fetchFilteredTable} className={styles.submitButton}>
          {showTable
            ? "HIDE CUSTOMER TABLE"
            : "DISPLAY CURRENT COMMUNICATION LOGS"}
        </button>

        {showTable && customerData && (
          <div className={styles.tableWrapper}>
            <CustomerTable2 data={customerData} />
          </div>
        )}

        {/* <div className={styles.tableWrapper}>
          <CustomerTable data={data} />
        </div> */}
      </div>
    </div>
  );
};

export default DisplayFilterTable;
