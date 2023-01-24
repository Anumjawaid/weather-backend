const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

const dotenv = require('dotenv');
const routes = require('./Controller/routesController');
const cors = require('cors');
const mongoose = require('mongoose');

dotenv.config();
app.use(cors());
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

mongoose.set("strictQuery", false);

// mongoose.connect(`mongodb+srv://Anum:anum@cluster0.x9rxwjh.mongodb.net/wheather`
mongoose.connect(`mongodb+srv://sa:123@cluster0.gaiezys.mongodb.net/wheather`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('connection successful..');
}).catch((err) => console.log(err));


io.on('connection', (socket) => {
    console.log('a user connected');

    app.use('/', routes.route(socket));

});

server.listen(process.env.PORT, () => {
    console.log(`server listening on ${process.env.PORT}`);
});
