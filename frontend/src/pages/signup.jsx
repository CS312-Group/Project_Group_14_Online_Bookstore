import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const Signup = () => {
  // Holds form data entry
  const [formData, setFormData] = useState({ username: "", password: "" });

  // holds Error message data
  const [error, setError] = useState("");

  // holds Success messgae data
  const [success, setSuccess] = useState("");

  // used for routing and naviagting to new pages
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (event) => {
    // variables to save indavidual data
    const { name, value } = event.target;
    // saves the data to the formData variable to be passed and checked.
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    // prevents reloading the page on submit
    event.preventDefault();

    // variable for Success or Error based on what happens
    setError("");
    setSuccess("");

    try {
      // try to route to backend at singup to save user using POST
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // if the response is okay or 200
      if (response.ok) {
        // print message saying sign up was successful
        setSuccess("Sign-up successful! Redirecting to sign-in...");

        // delay so user can read message
        setTimeout(() => {
          // move to signin for user to sign in to new account
          navigate("/signin");
        }, 2000);
        // print error if no an OK or 200 response
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Sign-up failed. Please try again.");
      }
      // print and Error if POST fails
    } catch (err) {
      console.error("Error during sign-up:", err);
      setError("An error occurred. Please try again.");
    }
  };

  // HTML return for rendering this Page
  return (
    <div className="container">
      <h1>Sign Up</h1>
      {/* Sign-up form */}
      <form className="signup-signin-form" onSubmit={handleSubmit}>
        <label htmlFor="username">Name:</label>
        <input
          type="text"
          name="username"
          id="username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input type="submit" value="Sign Up" />
      </form>

      {/* Error and success messages */}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Link to sign-in page */}
      <div className="blog-buttons">
        <a href="/signin">
          <button type="button">Already Have an Account? Sign In</button>
        </a>
      </div>
    </div>
  );
};

export default Signup;
