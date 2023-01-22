const express = require('express');
const app = express();
const dotenv = require('dotenv');
const http = require("http");
const cors = require('cors');
const { Server } = require("socket.io");
const mongoose = require('mongoose');
const routes = require('./Controller/routesController');

dotenv.config();
app.use(cors());
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

mongoose.set("strictQuery", false);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3003",
        methods: ["GET", "POST"],
    },
});
//mongoose.connect(`mongodb+srv://Anum:anum@cluster0.x9rxwjh.mongodb.net/wheather`
mongoose.connect(`mongodb+srv://Anum:anum@cluster0.x9rxwjh.mongodb.net/wheather`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('connection successful..');
}).catch((err) => console.log(err));


// io.on("connection", (socket) => {
//     console.log(`New client connected`);
//     app.use('/', routes);

// });
app.use('/',routes)


app.listen(process.env.PORT || 3001, () => {
    console.log(`server listening on ${process.env.PORT}`)
})