const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const myLiffId = process.env.MY_LIFF_ID;
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const db = require('./keys').mongoURI;
const mitra = require("./routes/api/mitra");
const pesanan = require("./routes/api/pesanan");

mongoose
    .connect(db,{ useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("mongoDB Connected"))
    .catch((err) => console.log(err));

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

//route api
app.use(express.static('public'));
app.use('/api/', mitra);
app.use('/api/', pesanan);

app.get('/send-id', function(req, res) {
    res.json({id: myLiffId});
});


app.get('*', function(req, res){
    if (req.accepts('html')) {
        res.send('404', '<script>location.href = "/pagenotfound.html";</script>');
        return;
    }
});

app.listen(port, () => console.log(`app listening on port ${port}!`));