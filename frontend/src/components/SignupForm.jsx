import React, { useState, useEffect } from "react";
import styles from "./SignupForm.module.css";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    checked: false,
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showError, setShowError] = useState(false);

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      if (formData[key] === "" && key !== "checked") {
        newErrors[key] = true;
        isValid = false;
      }
    });

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = true;
      isValid = false;
    }

    if (!formData.checked) {
      newErrors.checked = true;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setShowError(true);
      return;
    }

    const dataToSend = {
      ...formData,
      dateOfBirth: moment(formData.dateOfBirth).format("YYYY-MM-DD"),
    };

    fetch("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (
          data.message ===
          "This user already exists. Try with another email ID or phone number."
        ) {
          toast.error(data.message);
          return;
        } else if (data.message === "Server error. Please try again later.") {
          toast.error(data.message);
          return;
        }
        if (data.message === "User registered.") {
          toast.success(data.message);
          navigate("/signin");
        }
      })
      .catch((err) => console.error("Error:", err));
  };

  useEffect(() => {
    setShowError(false);
  }, [formData]);

  return (
    <div className={styles.signupFormContainer}>
      <div className={styles.signupForm}>
        <h2 className={styles.signupTitle}>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <div
              className={`${styles.inputGroup} ${
                errors.name ? styles.error : ""
              }`}
            >
              <FaUser className={styles.inputIcon} />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div
              className={`${styles.inputGroup} ${
                errors.email ? styles.error : ""
              }`}
            >
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

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <div
                className={`${styles.inputGroup} ${
                  errors.password ? styles.error : ""
                }`}
              >
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
            <div className={styles.formGroup}>
              <div
                className={`${styles.inputGroup} ${
                  errors.confirmPassword ? styles.error : ""
                }`}
              >
                <FaLock className={styles.inputIcon} />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <div
              className={`${styles.inputGroup} ${
                errors.phoneNumber ? styles.error : ""
              }`}
            >
              <FaPhone className={styles.inputIcon} />
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div
              className={`${styles.inputGroup} ${
                errors.address ? styles.error : ""
              }`}
            >
              <FaMapMarkerAlt className={styles.inputIcon} />
              <textarea
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div
              className={`${styles.inputGroup} ${
                errors.dateOfBirth ? styles.error : ""
              }`}
            >
              <FaCalendarAlt className={styles.inputIcon} />
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label
              className={`${styles.checkboxLabel} ${
                errors.checked ? styles.error : ""
              }`}
            >
              <input
                type="checkbox"
                name="checked"
                checked={formData.checked}
                onChange={handleChange}
                className={styles.checkbox}
              />
              <span className={styles.checkmark}></span>I agree to the{" "}
              <a href="#terms">terms and conditions</a>
            </label>
          </div>

          <button type="submit" className={styles.submitButton}>
            Create Account
          </button>

          <div className={styles.formDivider}></div>

          <p className={styles.loginText}>
            Already have an account?{" "}
            <Link to="/signin" className={styles.loginLink}>
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
