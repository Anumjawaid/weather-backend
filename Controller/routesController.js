const route = require('express').Router();
const mongoose = require('mongoose');
const userSchema = require('../Model/userModel.js')(mongoose);
const userModule = new mongoose.model('userLogin', userSchema);
const routedata = require('./dataController.js');
const request = require("request");
const bcrypt = require("bcrypt")
const saltRounds = 10
const apiKey = "a355251073b74f4899d63723232001"

// routedata.getWeatherDefault();
// for testing if server is working or not
// routedata.CheckMaster('Karachi')
route.post('/', async (req, res) => {
    let a=await routedata.SingleRoute('khuzdarhhh')
    res.send({ message: 'hello from server' });

})


// Prerequisite city name and logged in user id format req.body.data.soso
route.post('/addCity', async (req, res) => {
    const result = await userModule.findById(req.body.data._id ) 
    console.log(result,"result")
    let city=result.cities.find(element=>element==req.body.data.city)
    if(city!=undefined){
         res.send({ message: 'This City Has ALready Been In your List' });
    }
    else{
    routedata.SingleRoute(req,res)
    // res.send({ message: 'hello from server' });
    }

})








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
    res.send({ message: "User Created" ,result,result});
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