const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./Controller/routesController');

dotenv.config();
app.use(cors());
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

mongoose.set("strictQuery", false);

//mongoose.connect(`mongodb+srv://Anum:anum@cluster0.x9rxwjh.mongodb.net/wheather`
mongoose.connect(`mongodb+srv://sa:123@cluster0.gaiezys.mongodb.net/wheather`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('connection successful..');
}).catch((err) => console.log(err)); 
app.use('/', routes);

app.listen(process.env.PORT || 3001, () => {
    console.log(`server listening on ${process.env.PORT}`)
})