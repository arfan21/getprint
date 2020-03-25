const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const myLiffId = process.env.MY_LIFF_ID;
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const db = require('./keys').mongoURI;
//const Mitra = require("./models/Mitra");
const mitra = require("./routes/api/mitra");

mongoose
    .connect(db,{ useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("mongoDB Connected"))
    .catch((err) => console.log(err));

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

//route api
app.use(express.static('public'));
app.use('/api/', mitra);

app.get('/send-id', function(req, res) {
    res.json({id: myLiffId});
});

app.get('*', function(req, res, next) {
    let err = new Error("Page Doesn't Exist");
    err.statusCode = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    console.error(err.message);
    
    // Define a common server error status code if none is part of the err.
    if (!err.statusCode) err.statusCode = 500; 
  
    if (err.shouldRedirect) {
      // Gets a customErrorPage.html.
      res.render('pagenotfound.html')
  
    } else {
      // Gets the original err data, If shouldRedirect is not declared in the error.
      res.status(err.statusCode).send(err.message);
    }
});


app.listen(port, () => console.log(`app listening on port ${port}!`));