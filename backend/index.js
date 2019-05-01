// Requires and const definition
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/proyecto_daw";

// Configuración CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
const user_routes = require('./routes/user.routes');
const follow_routes = require('./routes/follow.routes');
const group_routes = require('./routes/groups.routes');
const publication_routes = require('./routes/publication.route');
app.use('/api', user_routes);
app.use('/api', follow_routes);
app.use('/api', group_routes);
app.use('/api', publication_routes);

// Database
mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.connect(mongoURI, { useNewUrlParser: true })
  .then(() => {
    console.log("BD conectada");

    // Creación del servidor
    app.set('port', process.env.PORT || 3000);

    app.listen(app.get('port'), () => {
      console.log("Puerto " + app.get('port'));
    })
  })
  .catch(err => console.log(err));