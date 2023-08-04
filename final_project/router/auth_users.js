const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    const validUser = users.filter((user) => {
        return (user.username === username);
    });
    if (validUser.length > 0) {
        return true;
    } else {
        return false;
    }

}

const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("Customer successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;
    if (isValid(username)) {
        books[isbn].reviews[username] = review;
        return res.status(200).send(`Review for the book with isbn ${isbn} added/updated.`);
    } else {
        return res.status(400).json({ message: "Invalid customer. Please login again." });
    }
});


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    if (isValid(username)) {
        delete books[isbn].reviews[username];
        return res.status(200).send(`Review for the book with isbn ${isbn} posted by ${username} deleted.`);
    } else {
        return res.status(400).json({ message: "Invalid customer. Please login again." });
    }
    
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
