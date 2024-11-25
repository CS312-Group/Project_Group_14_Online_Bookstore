import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const SignIn = () => {
    // set the variables and useStates
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
            // send a POST request to the backend to sign in
            const response = await fetch('http://localhost:3000/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // send the form data as json
                body: JSON.stringify(formData),
            });

            // if the response returns ok sign the user in
            if (response.ok) {
                const data = await response.json();
                setSuccess('Sign-in successful!');
                console.log('User:', data.user);
                // Redirect to the books page
                setTimeout(() => {
                    // redirect to the /book page with the user data
                    navigate('/books', { state: { user: data.user } }); 
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
            {/* Sign In form */}
            <form className="signup-signin-form" onSubmit={handleSubmit}>
                {/*set the fields for each area of the form*/}
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

            {/* Link to redirect the user to the Sign Up page */}
            <div className="blog-buttons">
                <a href="/signup">
                    <button type="button">Don't Have an Account? Sign Up</button>
                </a>
            </div>
        </div>
    );
};

export default SignIn;
