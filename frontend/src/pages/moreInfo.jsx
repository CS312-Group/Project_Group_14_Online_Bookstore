import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate, useLocation } from "react-router-dom";

const MoreInfo = () => {
    // set variables and useState functions to update them
    const location = useLocation();
    const { bookId } = useParams();
    const [bookInfo, setBookInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Retrieve user from location state
    const currentUser = location.state?.user;

    console.log("Current User:", currentUser);

    useEffect(() => {
        const fetchBookInfo = async () => {
            try {
                // send a GET request to the backend
                const response = await fetch(`http://localhost:3000/books/${bookId}/moreInfo`);
                if (!response.ok) {
                    throw new Error('Failed to fetch book information');
                }
                // store the response in data as a JSON
                const data = await response.json();
                setBookInfo(data);
            } catch (err) {
                setError(err.message);
            } finally {
                // set loading state to false after it has finished loading
                setLoading(false);
            }
        };
        fetchBookInfo();

        // this makes the function update only when the book ID changes
    }, [bookId]);

    // display loading message
    if (loading) {
        return <div>Loading book information...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        //create a div that will hold all of the book information
        <div className="more-info-container">
            <h2>{bookInfo.title}</h2>
            <p><strong>Author:</strong> {bookInfo.author}</p>
            <p><strong>Published on:</strong> {bookInfo.date}</p>
            <p><strong>Description:</strong></p>
            <div 
                className="book-description" 
                dangerouslySetInnerHTML={{ __html: bookInfo.description }} 
            />

            {/*create button to navigate back to the books page*/}
            <div>
            <button
                onClick={() => navigate(`/books`, { state: { user: currentUser } })}
                style={{ marginBottom: "10px" }}
            >
                Back to books...
            </button>
            </div>
        </div>

        

        
    );
};

export default MoreInfo;
