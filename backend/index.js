// Requires and cont definition
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/proyecto_daw";

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Routes
const user_routes = require('./routes/user.routes');
app.use('/api', user_routes);

// Database
mongoose.Promise = global.Promise;
mongoose.connect(mongoURI, { useNewUrlParser: true })
        .then(() => {
          console.log("BD conectada");

          // Creación del servidor
          app.listen(3000, () => {
            console.log("Servidor conectado");
          })
        })
        .catch(err => console.log(err));