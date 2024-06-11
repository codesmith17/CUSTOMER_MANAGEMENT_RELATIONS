// src/components/AdminSignIn.jsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./SigninForm.module.css";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock } from "react-icons/fa";

const AdminSigninForm = () => {
  const navigate = useNavigate();
  const [firstTime, setFirstTime] = useState(false);
  //   const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("admin17")) {
      toast.error("SUCH PATH DOESN'T EXIST");
      navigate("/signin");
      return;
    }
    const first = localStorage.getItem("firstTime");
    if (first) {
      setFirstTime(true);
    }
  }, []);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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

    const url = isAdmin
      ? "http://localhost:3000/api/auth/admin/signin"
      : "http://localhost:3000/api/auth/signin";

    fetch(url, {
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
        return res.json();
      })
      .then((data) => {
        localStorage.setItem("firstTime", true);
        console.log(data);
        document.cookie = `access_token=${data.user.access_token}; path=/`;
        toast.success(`WELCOME ${data.user.name}`);
        navigate(isAdmin ? "/admin/dashboard" : "/products");
      })
      .catch((err) => {
        console.error("Error:", err);
        toast.error(err.message);
      });
  };

  const handleGoogleSignin = () => {
    // Implement Google sign-in logic here
    console.log("Google sign-in clicked");
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
            Admin Sign In
          </button>
        </form>

        <div className={styles.orDivider}>
          <span>or</span>
        </div>

        <button className={styles.googleButton} onClick={handleGoogleSignin}>
          <img alt="Google Logo" className={styles.googleLogo} />
          <span className={styles.googleText}>Continue with Google</span>
        </button>
        {/* 
        <div className={styles.signupText}>
          {isAdmin ? (
            <>
              Not an admin?{" "}
              <Link
                to="#"
                onClick={toggleAdminSignin}
                className={styles.signupLink}
              >
                Sign In as User
              </Link>
            </>
          ) : (
            <>
              Are you an admin?{" "}
              <Link
                to="#"
                onClick={toggleAdminSignin}
                className={styles.signupLink}
              >
                Sign In as Admin
              </Link>
            </>
          )}
        </div> */}

        {/* <p className={styles.signupText}>
          Don't have an account?{" "}
          <Link to="/signup" className={styles.signupLink}>
            Create One
          </Link>
        </p> */}
      </div>
    </div>
  );
};

export default AdminSigninForm;
