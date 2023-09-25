const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');

const app = express();
const port = 8000;


app.use(
  session({
    store: new FileStore({ path: './session-data' }),
    secret: 'secretkey', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, 
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/views/login.html');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'ajay' && password === 'ajay123') {
    req.session.authenticated = true;
    res.redirect('/home');
  } else {
    res.redirect('/login');
  }
});

// Home page
app.get('/home', (req, res) => {
  if (req.session.authenticated) {
    res.sendFile(__dirname + '/views/home.html');
  } else {
    res.redirect('/login');
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
