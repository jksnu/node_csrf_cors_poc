const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const cors = require('cors');
const utils = require('./util/utils');

const port = 8000;
const app = express(); 
dotenv.config({
  path: path.join(__dirname, '../.env')
});

//middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//csrf middle ware
var csrfProtection = csrf({ cookie: true });
/*app.all('*', (req, res, next) => {
  if(process.env.NODE_ENV === 'development') {
    return next();
  } else {
    return csrfProtection(req, res, next);
  }
}, (req, res, next) => {
  //res.cookie('XSRF-TOKEN', req.csrfToken());
  next();
});*/
app.use(csrfProtection);

//CORS middle ware
const corsOptions = {
  origin: (origin, callback) => {
    if (process.env.ALLOWED_ORIGINS && process.env.NODE_ENV !== 'development') {
      const whiteList = process.env.ALLOWED_ORIGINS.split(',');
      if(whiteList.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    } else {
      callback(null, true);
    }
  },
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH', 'OPTION'],
  allowedHeaders: [
    'Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'csrf-token',
    'xsrf-token', 'x-csrf-token', 'x-xsrf-token'
  ]
}
app.use(cors(corsOptions));

//handling unhandled error
app.use((err, req, res, next) => {
  if (err.code == 'EBADCSRFTOKEN') {
    // handle CSRF token errors here
    res.status(403).json({ code: 403, message: err.message });
  } else {
    return next(createError(404));
  } 
});

//routes
app.get('/', (req, res) => {
  res.cookie('XSRF-TOKEN', req.csrfToken(), { httpOnly: false });
  res.json({"status": "Success", "message": "Hello world"});
});

app.post('/registerUser', (req, res) => {  
  const username = req.body.username;
  const password = req.body.password;
  utils.addUser(username, password);
  res.json('User is registered successfully');
});

app.get('/users', csrfProtection, (req, res) => {
  res.json(utils.getUsers());
});

app.delete('/delete/:username', csrfProtection, (req, res) => {
  const username = req.params.username;
  utils.deleteUser(username);
  res.json("User is deleted successfully");
});

app.post('/login', csrfProtection, (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  utils.login(username, password);
  res.json("User has logged in successfully");
});

app.post('/logout', csrfProtection, (req, res) => {
  const username = req.body.username;
  utils.logout(username);
  res.json("User has logged out successfully");
});

app.listen(port, () => {
  console.log(`app is listening at port ${port} by Process ${process.pid}`);
});



