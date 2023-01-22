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
// route.get('/ff',routedata.test)


route.post('/getWeather', function(req, res) {

        // Get a single city
        let city = req.body.city;
        // Use that city name to fetch data
        // Use the API_KEY 
        let url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;
        request(url, function(err, response, body) {
    
            // On return, check the json data fetched
            if (err) {
                res.render('index', { weather: null, error: 'Error, please try again' });
            } else {
                let weather = JSON.parse(body);
                console.log(weather);
            }
        })
     
    
    });




//  for adding user
route.post('/addUser', async (req, res) => {
    console.log(req.body,"req")
    let cities=await GetDefaultCities()

    const addActivity = new userModule({
        firstName: req.body.data.firstName,
        lastName: req.body.data.lastName,
        email: req.body.data.email,
        password:await bcrypt.hash(req.body.data.password, saltRounds),
        cities:cities
       
    });

    const result = await addActivity.save();
    res.send({ message: 'data added' });
});



// for querying user

route.post('/queryUser', async (req, res) => {
    console.log(req.body,"req")

   const result = await userModule.find({email: req.body.email})
   console.log(result)
    res.send({ message: 'data added' });
});

async function GetDefaultCities(){
    return [
        {name:"karachi",condition:{"gfgdf":"ffdfg"}},
        {name:"Islamad",condition:{"gfgdf":"ffdfg"}},
        {name:"peshawar",condition:{"gfgdf":"ffdfg"}}
]
}


function validateUser(hash) {

    bcrypt
      .compare(password, hash)
      .then(res => {
        console.log(res) // return true
      })
      .catch(err => console.error(err.message))        
}
module.exports = route;