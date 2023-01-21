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
    let locationArray = ["Karachi", "Lahore", "Islamabad", "Quetta", "Peshawar","Hyderabad","Multan","Faislabad","Ziarat"]
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
                console.log(getUserName[0]._id)
                    if(getUserName.length !=0) {
                  


                        // updatae record in db
                    }
                    else {
                        // add rewcord in db
                        console.log("DASAS")
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
module.exports = { getWeatherDefault,test };