import React, { useState, useEffect } from "react";
import styles from "./DisplayFilterTable.module.css";
import CustomerTable2 from "./CustomerTable2";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import DeliveryStatusTable from "./DeliveryStatusTable";
import DeliveryStats from "./DeliveryStats";
const DisplayFilterTable = () => {
  const [message, setMessage] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [showTable, setShowTable] = useState(false); // State to toggle table display
  const [showDeliveryTable, setShowDeliveryTable] = useState(false);
  const [deliveryData, setDeliveryData] = useState(null);
  const [customerData, setCustomerData] = useState(null); // State to store customer data
  const location = useLocation();
  const data = location.state;
  //   console.log(data);
  //   console.log(customerData);
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleDiscountChange = (e) => {
    setDiscountPercentage(e.target.value);
  };
  useEffect(() => {
    fetch("http://localhost:3000/api/auth/verifyAdmin", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        console.log(res);
        if (!res.ok) {
          navigate("/hiddenForAdmin/signin");
          toast.error("SIGNIN FIRST USING CREDENTIALS");
        }
        return res.json();
      })
      .then((res) => {
        if (!res.user.isAdmin) {
          navigate("/hiddenForAdmin/signin");
          toast.error("SIGNIN FIRST USING CREDENTIALS");
        }
      })
      .catch((err) => {
        throw new error(err);
      });
  }, []);
  const handleSubmit = () => {
    if (message === "" || !message) {
      toast.error("MESSAGE CANNOT BE EMPTY!");
      return;
    }
    if (!message.includes("${discountPercentage}")) {
      toast.error("MESSAGE SHOULD INCLUDE ${discountPercentage}");
      return;
    }
    if (discountPercentage >= 100 || discountPercentage < 1) {
      setDiscountPercentage(1);
      toast.error("DISCOUNT PERCENTAGE IS BETWEEN 1 AND 100");
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
  const fetchDeliveryTable = () => {
    if (showDeliveryTable) {
      setShowDeliveryTable(false);
      return;
    }
    setShowDeliveryTable(true);
    setShowTable(false);
    fetch("http://localhost:3000/api/delivery/getDeliveryTable")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch customer data");
        }
      })
      .then((data) => {
        setDeliveryData(data);
        setShowDeliveryTable(true);
      })
      .catch((error) => {
        console.error("Error fetching filtered table:", error);
        toast.error("Error fetching filtered table");
      });
  };
  const fetchFilteredTable = () => {
    if (showTable) {
      setShowTable(false);
      return;
    }
    setShowDeliveryTable(false);
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
            ? "HIDE COMMUNICATION LOGS"
            : "DISPLAY CURRENT COMMUNICATION LOGS"}
        </button>
        <button onClick={fetchDeliveryTable} className={styles.submitButton}>
          {showDeliveryTable
            ? "HIDE DELIVERY STATUS"
            : "DISPLAY DELIVERY STATUS"}
        </button>
        {showDeliveryTable && deliveryData && (
          <>
            <DeliveryStats deliveryData={deliveryData} />
            <div className={styles.tableWrapper}>
              <DeliveryStatusTable data={deliveryData} />
            </div>
          </>
        )}
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
