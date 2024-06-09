import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./SigninForm.module.css";
import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
// import googleLogo from "../assets/google-logo.svg"; // Make sure to have this SVG in your assets
// import { Navigate } from "react-router-dom";

const SigninForm = () => {
  const navigate = useNavigate();
  const [firstTime, setFirstTime] = useState(false);
  useEffect(() => {
    const first = localStorage.getItem("firstTime");
    if (first) {
      setFirstTime(true);
    }
  }, []);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please enter both email and password.");
      return;
    }

    fetch("http://localhost:3000/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Invalid email or password");
        }
        // console.log(res);
        return res.json();
      })
      .then((data) => {
        localStorage.setItem("firstTime", true);
        console.log(data);
        document.cookie = `access_token=${data.user.access_token}; path=/`;
        toast.success(`WELCOME ${data.user.name}`);
        navigate("/products");
      })
      .catch((err) => {
        console.error("Error:", err);
        toast.error(err.message);
      });
  };

  return (
    <div className={styles.signinFormContainer}>
      <div className={styles.signinForm}>
        <h2 className={styles.signinTitle}>
          {firstTime ? `WELCOME` : `WELCOME BACK`}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <div className={styles.inputGroup}>
              <FaEnvelope className={styles.inputIcon} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.inputGroup}>
              <FaLock className={styles.inputIcon} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.forgotPassword}>
            <Link to="/forgot-password" className={styles.forgotLink}>
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className={styles.submitButton}>
            Sign In with Email
          </button>
        </form>

        <p className={styles.signupText}>
          Don't have an account?{" "}
          <Link to="/signup" className={styles.signupLink}>
            Create One
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SigninForm;
