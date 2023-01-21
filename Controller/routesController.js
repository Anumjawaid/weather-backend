const route = require('express').Router();
const mongoose = require('mongoose');
const userSchema = require('../Model/userModel.js')(mongoose);
const userModule = new mongoose.model('userLogin', userSchema);
const routedata = require('./dataController.js');
const request = require("request");
const bcrypt = require("bcrypt")
const saltRounds = 10

routedata.getWeatherDefault();
// for testing if server is working or not
route.get('/', async (req, res) => {

    res.send({ message: 'hello from server' });

})
const apiKey = "a355251073b74f4899d63723232001"



route.post('/getWeather', async (req, res)=>{

        // Get a single city
        let city = req.body.q;
        let weather;
        // Use that city name to fetch data
        // Use the API_KEY 
        let url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;
        await request(url,(err, response, body) =>{
    
            // On return, check the json data fetched
            if (err) {
                res.render('index', { weather: null, error: 'Error, please try again' });
            } else {
                console.log("here")
                 weather = JSON.parse(body);
            }
        })
        setTimeout(function() {
            try {
                console.log(weather)
                res.send({data:weather});
            } catch(e) {
                 reject(e);
            }
        }, 1000);
       
    });




//  for adding user
route.post('/addUser', async (req, res) => {
    console.log(req.body,"rr")
    const addActivity = new userModule({
        firstName: req.body.data.firstName,
        lastName: req.body.data.lastName,
        email: req.body.data.email,
        password: await bcrypt.hash(req.body.data.password, saltRounds),
        cities: ['karachi','Lahore','Islamabad','Quetta','Peshawar']

    });

    const result = await addActivity.save();
    res.send({ message: "User Created" });
});



// for querying user

route.post('/queryUser', async (req, res) => {

    const result = await userModule.find({ email: req.body.data.email })
    if (result.length != 0) {
        let valid = await validateUser(req.body.data.password, result[0].password)
        res.send({ message: valid });
    }
    else {
        res.send({ message: "User doesnot exist" });
    }

});




async function validateUser(password, hash) {
    let ret = false

    await bcrypt
        .compare(password, hash)
        .then(res => {
            if (res) {
                ret = true
            }
            else {
                ret = false
            }
            return res
        })
        .catch(err => {
            ret = false
            return false
        }
        )

    return ret
}
module.exports = route;