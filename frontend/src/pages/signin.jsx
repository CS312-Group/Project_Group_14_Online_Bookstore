import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const SignIn = () => {
    // set the variables and useStates
    const [formData, setFormData] = useState({ username: '', password: '' });
    
    // holds Error message data
    const [error, setError] = useState('');
    
    // holds Success messgae data
    const [success, setSuccess] = useState('');
    
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
        setError('');
        setSuccess('');

        try {
            // try to route to backend at singup to save user using POST
            const response = await fetch('http://localhost:3000/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // send the form data as json
                body: JSON.stringify(formData),
            });

            // if the response is okay or 200 
            if (response.ok) {
                // save data from form to send to backend
                const data = await response.json();

                // print message saying sign up was successful
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

    // HTML return for rendering this Page
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
