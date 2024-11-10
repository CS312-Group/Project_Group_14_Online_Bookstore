import bodyParser from "body-parser";
import express from "express";
import pg from "pg";

//declaration of variables that are used in the file
const app = express();
const port = 3000;
let currentUser = null;

// set up the Client object to be able to connect to the database
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Library",
    password: "12345",
    port: 5432,
});

// connect to the database and display success
db.connect().then(()=>console.log("Connected")).catch((err)=>console.log(err));

//this allows the use of the body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

//this allows the use of the style sheet
app.use(express.static("public"));

// Define a route to render an EJS view with a message
app.get('/', (req, res) => {
    res.render('../../frontend/src/views/index.ejs', { message: 'Hello World from the backend!' });
});

//this is what the udemy videos used to show the server was running so I added it
app.listen(port,() => {
    console.log(`Server running on port ${port}.`);
});