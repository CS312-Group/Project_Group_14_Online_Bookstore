import React from 'react';
import './styles.css';


const SignUp = () => {
    return (
        <div className="container">
            <h1>Sign Up</h1>
            {/* Sign Up form asking for username and password */}
            <form className="signup-signin-form" action="/signup" method="POST">
                <label htmlFor="username">Name:</label>
                <input type="text" name="username" id="username" required />

                <label htmlFor="password">Password:</label>
                <input type="password" name="password" id="password" required />

                <input type="submit" value="Sign Up" />
            </form>
            {/* Error message for incorrect username and password */}
            {/* Allow user to skip if they already have an account */}
            <div className="blog-buttons">
                <a href="/signin">
                    <button type="button">Already Have an Account? Sign In</button>
                </a>
            </div>
        </div>
    );
};

export default SignUp;
