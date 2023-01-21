const route = require('express').Router();
const mongoose = require('mongoose');
const userSchema = require('../Model/userModel.js')(mongoose);
const userModule = new mongoose.model('userLogin', userSchema);
const bcrypt = require("bcrypt")
const saltRounds = 10
 
// for testing if server is working or not
route.get('/', async (req, res) => {
    res.send({ message: 'hello from server' });
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