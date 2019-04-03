const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/db";

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// CORS
app.use(cors());


// Routes





mongoose.connect(mongoURI, { useNewUrlParser: true })
        .then(() => console.log("DB connected"))
        .catch(err => console.log(err));

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});