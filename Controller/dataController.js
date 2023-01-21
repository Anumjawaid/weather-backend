const routedata = require('express').Router();
const mongoose = require('mongoose');
const request = require("request");
const dataSchema = require('../Model/dataModel.js')(mongoose);
const dataModule = new mongoose.model('MasterData', dataSchema);
const apiKey = "a355251073b74f4899d63723232001"

function test() {
    let yourSchema = new dataModule;
    yourSchema.detail = {}

    yourSchema.save()
    console.log(yourSchema)
}


const getWeatherDefault = () => {
    let locationArray = ["Karachi", "Lahore", "Islamabad", "Quetta", "Peshawar","Hyderabad",'Ziarat',"Khuzdar"]
    let weatherarr = [];
    for (let i = 0; i < locationArray.length; i++) {
        // Use that city name to fetch data
        // Use the API_KEY     
        let url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${locationArray[i]}&aqi=no`;
        request(url, async function (err, response, body) {
            // On return, check the json data fetched
            if (err) {
                res.render('index', { weather: null, error: 'Error, please try again' });
            } else {

                let weather = JSON.parse(body);
                const getUserName=await(dataModule.find({Name:locationArray[i]}) )
                
                    if(getUserName.length !=0) {
                  
                        console.log(getUserName[0]._id,"d")

                        // updatae record in db
                    }
                    else {
                        // add rewcord in db
                        console.log("DASAS",weather)
                        let addActivity = new dataModule({
                            Name: weather.location.name,
                            detail: {temp: weather.current.temp_c, condition: weather.current.condition }
                           
                        });
                        const result =  addActivity.save();
                    }
            
               
            }
        })
    }
}


async function SingleRoute(req,res){
    let url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${req.body.data.city}&aqi=no`;
    await request(url, async function (err, response, body) {
        // On return, check the json data fetched
        if (err) {
            res.render('index', { weather: null, error: 'Error, please try again' });
        } else {

            let weather = JSON.parse(body);
            // const getUserName=await(dataModule.find({Name:rname}) )
            if(weather.error == undefined){
                res.send({message:"Able"})
                // return {message:weather}

            }
            else{
                // return {message:"No such City Exist"}
                res.send({message:"Error"})
            }
            
            
                // if(getUserName.length !=0) {
              
                //     console.log(getUserName[0]._id,"d")

                //     // updatae record in db

                // }
                // else {
                //     // add rewcord in db
                //     console.log("DASAS",weather)
                    
                // }
        
           
        }
    })

}
module.exports = { getWeatherDefault,test,SingleRoute };