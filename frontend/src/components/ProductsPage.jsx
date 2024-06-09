// ProductsPage.js
import React, { useState, useEffect } from "react";
import styles from "./ProductsPage.module.css";
import { FaSearch, FaTruck } from "react-icons/fa";
import { toast } from "react-toastify";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=12")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const orderNow = (product) => {
    // Simulating an order placement
    // console.log(
    //   `Ordering ${product.title} for  ₹ ${product.price.toFixed(2) * 83.53}`
    // );

    let result = window.confirm(
      `DO YOU WANT TO CONFIRM YOUR ORDER IT WILL COST YOU  ₹${(
        product.price * 83.53
      ).toFixed(0)}`
    );
    if (result) toast.success(`Order placed for ${product.title}!`);
    else toast.info("ORDER CANCELLED");
    return;
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.productsContainer}>
      <div className={styles.productsContent}>
        <h1 className={styles.productsTitle}>Featured Products</h1>

        <div className={styles.searchBar}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.orderInfo}>
          <FaTruck className={styles.orderIcon} />
          <span className={styles.orderText}>Fast Delivery</span>
        </div>

        <div className={styles.productGrid}>
          {filteredProducts.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <img
                src={product.thumbnail}
                alt={product.title}
                className={styles.productImage}
              />
              <h3 className={styles.productTitle}>{product.title}</h3>
              <p className={styles.productPrice}>
                ₹{(product.price * 83.53).toFixed(0)}
              </p>
              <button
                onClick={() => orderNow(product)}
                className={styles.orderNowBtn}
              >
                Order Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
