const route = require('express').Router();
const mongoose = require('mongoose');
const request = require("request");

const apiKey = "a355251073b74f4899d63723232001"


const getWeatherDefault=()=>{
    let locationArray=["Karachi","Lahore","Islamabad","Quetta","Peshawar"]
    let weatherarr = [];
        for(let i=0;i<locationArray.length;i++){
             // Use that city name to fetch data
             // Use the API_KEY 
              let url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${locationArray[i]}&aqi=no`;
              request(url, function(err, response, body) {
                // On return, check the json data fetched
                if (err) {
                    res.render('index', { weather: null, error: 'Error, please try again' });
                } else {
                   
                    let weather = JSON.parse(body);
                    weatherarr.push({name:weather.location.name,temp:weather.current.temp_c,condition:weather.current.condition})
                    console.log(weatherarr);
                }
            })
        }
    }


route.get('/', (req, res) => {
        getWeatherDefault()
});
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

module.exports = route;