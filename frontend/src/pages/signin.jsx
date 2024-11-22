import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const SignIn = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate(); 

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setError('');
        setSuccess('');

        try {
            const response = await fetch('http://localhost:3000/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                setSuccess('Sign-in successful!');
                console.log('User:', data.user);
                // Redirect to the books page
                setTimeout(() => {
                    navigate('/books'); 
                }, 1000); 
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Invalid username or password');
            }
        } catch (err) {
            console.error('Error during sign-in:', err);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="container">
            <h1>Sign In</h1>
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

                <input type="submit" value="Sign In" />
            </form>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="blog-buttons">
                <a href="/signup">
                    <button type="button">Don't Have an Account? Sign Up</button>
                </a>
            </div>
        </div>
    );
};

export default SignIn;
