import React from 'react';
import './styles.css';




const SignIn = () => {
    return (
        <div className="container">
            <h1>Sign In</h1>
            {/* Sign In form asking for username and password */}
            <form className="signup-signin-form" action="/signin" method="POST">
                <label htmlFor="username">Name:</label>
                <input type="text" name="username" id="username" required />

                <label htmlFor="password">Password:</label>
                <input type="password" name="password" id="password" required />

                <input type="submit" value="Sign In" />
            </form>
            {/* Error message for incorrect username and password */}
            {/* Allow user to make an account */}
            <div className="blog-buttons">
                <a href="/signup">
                    <button type="button">Don't Have an Account? Sign Up</button>
                </a>
            </div>
        </div>
    );
};

export default SignIn;
