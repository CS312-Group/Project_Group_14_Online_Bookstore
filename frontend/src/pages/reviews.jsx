import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Reviews = () => {
    const { bookId } = useParams(); 
    const navigate = useNavigate();
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
                const response = await fetch(
                    `http://localhost:3000/books/${bookId}/reviews`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch reviews");
                }
                const data = await response.json();
                setBookTitle(data.title);
                setReviews(data.reviews);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [bookId]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
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
            const data = await response.json();
            setReviews(data.reviews);
            setFormData({ author: "", title: "", review_content: "", score: 1 });
        } catch (err) {
            console.error("Error submitting review:", err);
        }
    };

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
                    onClick={() => navigate("/books")}
                >
                    ← Back to Books
                </button>
            </div>

            <h1>Reviews for "{bookTitle}"</h1>
            <div id="reviews-section">
                {reviews.length > 0 ? (
                    <>
                        <h2>Existing Reviews:</h2>
                        <ul>
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
                <h2>Submit a New Review</h2>
                <form onSubmit={handleSubmit}>
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

                    <label htmlFor="review_content">Review:</label>
                    <textarea
                        id="review_content"
                        name="review_content"
                        value={formData.review_content}
                        onChange={handleChange}
                        required
                    ></textarea>
                    <br />

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

                    <button type="submit">Submit Review</button>
                </form>
            </div>
        </div>
    );
};

export default Reviews;
