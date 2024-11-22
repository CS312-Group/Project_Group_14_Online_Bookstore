import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/signup';
import Signin from './pages/signin';
import Books from './pages/books';
import Reviews from './pages/reviews';
import Home from "./pages/home";

const App = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/signin" element={<Signin />} />
                    <Route path="/books" element={<Books />} />
                    <Route path="/books/:bookId/reviews" element={<Reviews />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
