import bodyParser from "body-parser";
import express from "express";
import pg from "pg";
import axios from "axios";

//declaration of variables that are used in the file
const app = express();
const port = 3000;

// current user lets us know if someone is logged in and who
let currentUser = null;

// set up the Client object to be able to connect to the database
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Library",
    password: "vander2003",
    port: 5432,
});

// connect to the database and display success
db.connect().then(()=>console.log("Connected")).catch((err)=>console.log(err));

//this allows the use of the body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

//this allows the use of the style sheet
app.use(express.static("public"));

// function to check if a username already exists
async function userNameExists(username) {
    const queryResult = await db.query("SELECT COUNT(*) FROM users WHERE username = $1", [username]);
    //use parseInt to turn the string into an integer
    return parseInt(queryResult.rows[0].count) > 0;
}

// fucntion to check if a user is valid on login
async function checkValidUser(username, password){
    const queryResult = await db.query("SELECT COUNT(*) FROM users WHERE username = $1 AND password = $2", [username, password]);
    //use parseInt to turn the string into an integer
    return parseInt(queryResult.rows[0].count) > 0;
}

// this will log the user out
app.post("/logout", (req, res) => {
    // sets the current user to null to effectively log them out
    currentUser = null;
    // redirects to rerender the home page
    res.redirect('/');

    // Uncomment when this is created 
    // res.redirect('sign_in.ejs');
});

// sign in functionality
app.post("/sign_in", async (req, res) => {
    // check if the user is real with username and password
    if( await checkValidUser(req.body["username"], req.body["password"])){
        // set the current user to be the user that logged in with a database query
        currentUser = await db.query("SELECT user_id FROM users WHERE name = $1 AND password = $2", [req.body["username"], req.body["password"]]);
        // set the current user to their unique user id
        currentUser = currentUser.rows[0].user_id;
        // rerender the page
        res.redirect('/');
    }
    else{
        // this is using the same logic from mini project 3 so we dont have a sign_in.ejs yet but it should work
        // otherwise rerender the page with an error message
        //res.render('sign_in.ejs', { error: 'Invalid username or password. Please try again.' });
    }
});

// sign up functionality
app.post("/sign_up", async (req, res) => {
    // check if the username already exists
    if(await userNameExists(req.body["username"])){
        // set the error value to true
        // var error = 1;
        // rerender the sign up page with an error message
        // res.render("sign_up.ejs",{error: error})
    }
    // if the user doesnt already exist, submit them into the database
    else{
        await db.query("INSERT INTO users (username, password) VALUES ($1, $2)", [req.body["username"], req.body["password"]]);
        // render the sign in page now so the user can sign in
        //res.render("sign_in.ejs");
    }
});

// Define a route to render an EJS view with a message
app.get('/', (req, res) => {
    res.render('../../frontend/src/views/index.ejs', { message: 'Hello World from the backend!' });
});

// this was currently set up for testing but shows how to call the database for the books table
// as well as shows how to use the api call to get the information about the books
app.get('/books', async (req, res) => {
    try {
        // uses axios to get the database info
        const queryResult = await db.query("SELECT api_id FROM books WHERE id = 1");
        // finds the id of the api call specifically
        const apiId = queryResult.rows[0].api_id;

        // uses that id to call the api
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${apiId}?key=AIzaSyCK6Z28MVsyIAg7QhA5AYNLPWdv0xjNekU`);

        // gets the book title from the response
        const bookTitle = response.data.volumeInfo.title;
        // gets the thumbnail from the response
        const bookImage = response.data.volumeInfo.imageLinks?.thumbnail;

        // renders the books page to show that it got the title and the image
        // this is very subject to change currently just for testing connections and routes.
        // shows we can get the book data and render it woooooo
        res.render('../../frontend/src/views/books.ejs', { title: bookTitle, image: bookImage });

    // catches if there are errors
    } catch (error) {
        console.error("Error fetching data from Google Books API:", error);
        res.status(500).send("Error fetching data");
    }
});

//this is what the udemy videos used to show the server was running so I added it
app.listen(port,() => {
    console.log(`Server running on port ${port}.`);
});