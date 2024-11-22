import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    // Redirect to sign-in if not logged in
    useEffect(() => {
            navigate("/signin"); 
    }, [navigate]);

    return <div>Welcome to the Home Page</div>;
};

export default Home;
