// Requires and const definition
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://vlad:socialize@socialize-vgoeq.mongodb.net/test?retryWrites=true&w=majority";
const http = require('http');
const normalizePort = require('normalize-port');
const locationPicker = require("location-picker")

// Configuración CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Routes
const user_routes = require('./routes/user.routes');
const follow_routes = require('./routes/follow.routes');
const group_routes = require('./routes/groups.routes');
const publication_routes = require('./routes/publication.route');
const group_follows_routes = require('./routes/groupFollows.routes');
const messages = require('./routes/messages.route');
app.use('/api', user_routes);
app.use('/api', follow_routes);
app.use('/api', group_routes);
app.use('/api', publication_routes);
app.use('/api', group_follows_routes);
app.use('/api', messages);


var server = http.createServer(app);
var io = require('socket.io').listen(server);


io.on('connection', (socket) => {

  socket.on('join', function (data) {
    //joining
    if (data.room) {
      socket.leave(socket.room);
      socket.broadcast.to(data.room).emit('left room', {
        user: data.user,
        message: 'ha abandonado la sala.'
      });
    }

    socket.join(data.room);

    console.log(data.user + 'joined the room : ' + data.room);

    socket.broadcast.to(data.room).emit('new user joined', {
      user: data.user,
      message: 'ha entrado en la sala.'
    });
  });

  socket.on('message', function (data) {

    io.in(data.room).emit('new message', {
      user: data.user,
      message: data.message
    });
  })
});


// Database
mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.connect(mongoURI, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log("BD conectada");
    console.log("Node running on " + port)
    // Creación del servidor
    server.listen(port);

  })
  .catch(err => console.log(err));