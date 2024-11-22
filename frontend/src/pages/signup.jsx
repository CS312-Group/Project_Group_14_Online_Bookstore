import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const Signup = () => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await fetch("http://localhost:3000/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSuccess("Sign-up successful! Redirecting to sign-in...");
                setTimeout(() => {
                    navigate("/signin");
                }, 2000);
            } else {
                const errorData = await response.json();
                setError(errorData.error || "Sign-up failed. Please try again.");
            }
        } catch (err) {
            console.error("Error during sign-up:", err);
            setError("An error occurred. Please try again.");
        }
    };

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
