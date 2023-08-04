const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "Customer successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "Customer already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register customer." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const keys = Object.keys(books);
  const booksByAuthor = keys
    .filter(key => books[key].author == author)
    .reduce((obj, key) => {
      obj[key] = books[key];
      return obj;
    }, {});
  res.send(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const keys = Object.keys(books);
  const booksByTitle = keys
    .filter(key => books[key].title == title)
    .reduce((obj, key) => {
      obj[key] = books[key];
      return obj;
    }, {});
  res.send(booksByTitle);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews)
});




// Nodejs Program Promise callbacks or Async-Await functions
// Getting the list of books available in the shop
const getAllBooks = async () => {
  try {
    const url = 'https://subhasankar0-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/'
    const response = await axios.get(url);
    console.log(response.data);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
getAllBooks();


// Getting the book details based on ISBN
const getBooksByIsbn = () => {
  const url = 'https://subhasankar0-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/isbn/1'
  axios.get(url).then((response) => {
    console.log(response.data);
  }).catch((error) => {
    console.log('error', error)
  });
}
getBooksByIsbn();


// Getting the book details based on Author
const getBooksByAuthor = async () => {
  try {
    const url = 'https://subhasankar0-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/author/Jane Austen'
    const response = await axios.get(url);
    console.log(response.data);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
getBooksByAuthor();


// Getting the book details based on Title
const getBooksByTitle = async () => {
  try {
    const url = 'https://subhasankar0-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/title/Things Fall Apart'
    const response = await axios.get(url);
    console.log(response.data);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
getBooksByTitle();


module.exports.general = public_users;
