import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const MoreInfo = () => {
    const { bookId } = useParams();
    const [bookInfo, setBookInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookInfo = async () => {
            try {
                const response = await fetch(`http://localhost:3000/books/${bookId}/moreInfo`);
                if (!response.ok) {
                    throw new Error('Failed to fetch book information');
                }
                const data = await response.json();
                setBookInfo(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookInfo();
    }, [bookId]);

    if (loading) {
        return <div>Loading book information...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="more-info-container">
            <h2>{bookInfo.title}</h2>
            <p><strong>Author:</strong> {bookInfo.author}</p>
            <p><strong>Published on:</strong> {bookInfo.date}</p>
            <p><strong>Description:</strong></p>
            <div 
                className="book-description" 
                dangerouslySetInnerHTML={{ __html: bookInfo.description }} 
            />

            <div>
            <button
                onClick={() => navigate(`/books`)}
                style={{ marginBottom: "10px" }}
            >
                Back to books...
            </button>
            </div>
        </div>

        

        
    );
};

export default MoreInfo;
