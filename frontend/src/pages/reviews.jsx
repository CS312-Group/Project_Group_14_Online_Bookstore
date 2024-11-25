import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const Reviews = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // Retrieve user from location state
    const currentUser = location.state?.user;

    console.log("Current User:", currentUser);
    // set variables and the useStates for them
    const { bookId } = useParams(); 
    const [bookTitle, setBookTitle] = useState("");
    const [reviews, setReviews] = useState([]);
    const [formData, setFormData] = useState({
        author: "",
        title: "",
        review_content: "",
        score: 1,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch reviews and book title on component mount
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                // send a GET request to the backend
                const response = await fetch(
                    `http://localhost:3000/books/${bookId}/reviews`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch reviews");
                }
                // store the response in the data variable as json
                const data = await response.json();

                // set the book title and reviews
                setBookTitle(data.title);
                setReviews(data.reviews);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
        // set it so this only updates when the bookId changes
    }, [bookId]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        // allows us to handle the submission with javascript instead of the default
        e.preventDefault();

        try {
            // send a POST request to the backend
            const response = await fetch(
                `http://localhost:3000/books/${bookId}/reviews`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                }
            );
            if (!response.ok) {
                throw new Error("Failed to submit review");
            }
            // set the data variable with the response value as json
            const data = await response.json();

            // set the review and form data
            setReviews(data.reviews);
            setFormData({ author: "", title: "", review_content: "", score: 1 });
        } catch (err) {
            console.error("Error submitting review:", err);
        }
    };

    // display the loading message
    if (loading) {
        return <div>Loading reviews...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            {/* Back to Books Button */}
            <div id="back-button-container">
                <button
                    className="back-button"
                    onClick={() => navigate("/books",  { state: { user: currentUser } })}
                >
                    ← Back to Books
                </button>
            </div>

            {/*Display the book title*/}
            <h1>Reviews for "{bookTitle}"</h1>
            <div id="reviews-section">
                {reviews.length > 0 ? (
                    <>
                        <h2>Existing Reviews:</h2>
                        <ul>
                            {/*Display the reviews and info associated*/}
                            {reviews.map((review) => (
                                <li key={review.id}>
                                    <strong>Author:</strong> {review.author}
                                    <br />
                                    <strong>Title:</strong> {review.title}
                                    <br />
                                    <strong>Review:</strong> {review.review_content}
                                    <br />
                                    <strong>Score:</strong> {review.score} / 5
                                    <hr />
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <p>No reviews available for this book yet.</p>
                )}
            </div>
            <div id="new-review-form">
                {/*Create the form to submit a review*/}
                <h2>Submit a New Review</h2>
                <form onSubmit={handleSubmit}>
                    {/*create area for author*/}
                    <label htmlFor="author">Author:</label>
                    <input
                        type="text"
                        id="author"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        required
                    />
                    <br />

                    {/*create area for title*/}
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                    <br />

                    {/*create area for review content*/}
                    <label htmlFor="review_content">Review:</label>
                    <textarea
                        id="review_content"
                        name="review_content"
                        value={formData.review_content}
                        onChange={handleChange}
                        required
                    ></textarea>
                    <br />

                    {/*create area for score*/}
                    <label htmlFor="score">Score (1-5):</label>
                    <input
                        type="number"
                        id="score"
                        name="score"
                        value={formData.score}
                        onChange={handleChange}
                        min="1"
                        max="5"
                        required
                    />
                    <br />

                    {/*Submit button for the form*/}
                    <button type="submit">Submit Review</button>
                </form>
            </div>
        </div>
    );
};

export default Reviews;
