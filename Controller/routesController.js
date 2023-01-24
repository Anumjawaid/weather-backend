const route = require('express').Router();
const mongoose = require('mongoose');
const userSchema = require('../Model/userModel.js')(mongoose);
const userModule = new mongoose.model('userLogin', userSchema);
const routedata = require('./dataController.js');
const request = require("request");
const bcrypt = require("bcrypt")
const saltRounds = 10
const apiKey = "a355251073b74f4899d63723232001"
let city5=[]



const returnRouter = function (socket) {
function validateUser(hash) {

    bcrypt
      .compare(password, hash)
      .then(res => {
        console.log(res) // return true
      })
      .catch(err => console.error(err.message))        
}

routedata.getWeatherDefault();
let interval;

if (interval) {
    clearInterval(interval);
}

interval = setInterval(() => routedata.getWeatherDefault(), 5000);
interval2 = setInterval(() => {
    console.log(globalUserArr,"global")
    // console.log(routedata.weatherarr,"weatherARRAY")
}, 7000);
// for testing if server is working or not
route.get('/', async (req, res) => {

    res.send({ message: 'hello from server' });

})
// route.get('/ff',routedata.test)


// Prerequisite city name and logged in user id format req.body.data.soso
route.post('/addCity', async (req, res) => {
    const result = await userModule.findById(req.body.data._id ) 
    console.log(result,"result")
    let city=result.cities.find(element=>element==req.body.data.city)
    if(city!=undefined){
         res.send({ message: 'This City Has ALready Been In your List' });
    }
    else{
    routedata.SingleRoute(req,res,result,userModule)
    // res.send({ message: 'hello from server' });
    }

})

//Specific city modal for a user
route.post('/getWeather', async (req, res) => {

    // Get a single city
    let city = req.body.q;
    let weather;
    // Use that city name to fetch data
    // Use the API_KEY 
    let url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;
    await request(url, (err, response, body) => {

        // On return, check the json data fetched
        if (err) {
            res.render('index', { weather: null, error: 'Error, please try again' });
        } else {
            console.log("here")
            weather = JSON.parse(body);
        }
    })
    setTimeout(function () {
        try {
            console.log(weather)
            res.send({ data: weather });
        } catch (e) {
            reject(e);
        }
    }, 1000);

});

       


//  for adding user
route.post('/addUser', async (req, res) => {
    // console.log(routedata.weatherarr,"rr")
   

    const addActivity = new userModule({
        firstName: req.body.data.firstName,
        lastName: req.body.data.lastName,
        email: req.body.data.email,
        password: await bcrypt.hash(req.body.data.password, saltRounds),
        cities: routedata.weatherarr.slice(0,5)

    });

    const result = await addActivity.save();
    routedata.globalUserArr.push({id:result._id,city:result.cities})
    console.log(globalUserArr,"dasdasd")
    res.send({ message: "User Created" ,result:result});
});



// for querying user

route.post('/queryUser', async (req, res) => {
    console.log(req.body,"req")

    const result = await userModule.find({ email: req.body.data.email })
    if (result.length != 0) {
        let valid = await validateUser(req.body.data.password, result[0].password)
        res.send({ message: valid ,result:result});
    }
    else {
        res.send({ message: "User doesnot exist" });
    }

});






return route;
}
module.exports = {
    route: returnRouter
};
