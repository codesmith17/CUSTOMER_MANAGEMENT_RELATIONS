// OrdersPage.js
import React, { useState, useEffect } from "react";
import styles from "./OrdersPage.module.css";
import { FaSearch, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=10&skip=10&select=title,price")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.products);
      })
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const filteredOrders = orders.filter((order) =>
    order.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
  });

  return (
    <div className={styles.ordersContainer}>
      <div className={styles.ordersContent}>
        <h1 className={styles.ordersTitle}>Recent Orders</h1>

        <div className={styles.searchBar}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by product title..."
            value={searchTerm}
            onChange={handleSearch}
            className={styles.searchInput}
          />
        </div>

        <table className={styles.ordersTable}>
          <thead>
            <tr>
              <th>Product Title</th>
              <th>
                Price{" "}
                <button onClick={toggleSortOrder} className={styles.sortButton}>
                  {sortOrder === "asc" ? (
                    <FaSortAmountUp />
                  ) : (
                    <FaSortAmountDown />
                  )}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map((order, index) => (
              <tr key={index}>
                <td>{order.title}</td>
                <td>${order.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;
