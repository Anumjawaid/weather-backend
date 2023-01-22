const routedata = require('express').Router();
const mongoose = require('mongoose');
const request = require("request");
const dataSchema = require('../Model/dataModel.js')(mongoose);
const dataModule = new mongoose.model('MasterData', dataSchema);

// const userroute = require('./routesController.js');
const apiKey = "a355251073b74f4899d63723232001"
let weatherarr = [];
function test() {
    let yourSchema = new dataModule;
    yourSchema.detail = {}

    yourSchema.save()
    console.log(yourSchema)
}


const getWeatherDefault = () => {
    let locationArray = ["Karachi", "Lahore", "Islamabad", "Quetta", "Peshawar", "Hyderabad", 'Ziarat', "Khuzdar"]

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
                // console.log(weather)
                const getUserName = await (dataModule.find({ Name: locationArray[i] }))
                // console.log(getUserName)

                weatherarr.push({
                    Name: weather.location.name,
                    detail: { temp: weather.current.temp_c, condition: weather.current.condition }
                })
                if (getUserName.length != 0) {
                    // console.log(getUserName[0]._id)
                    const _id = getUserName[0]._id;
                    const updateactivity = await dataModule.findByIdAndUpdate({ _id },
                        {
                            $set: {
                                Name: weather.location.name,
                                detail: { temp: weather.current.temp_c, condition: weather.current.condition }
                            }
                        });


                    // updatae record in db
                }
                else {
                    // add rewcord in db
                    // console.log("DASAS", weather)



                    let addActivity = new dataModule({
                        Name: weather.location.name,
                        detail: { temp: weather.current.temp_c, condition: weather.current.condition }

                    });
                    const result = addActivity.save();
                }


            }
        })
    }
}


async function SingleRoute(req, res, user, Module) {
    const getDesc = await (dataModule.find({ Name: req.body.data.city }))
    console.log(getDesc, "getDesc")
    // userid
    let _id = req.body.data._id
    // Master Id

    if (getDesc.length != 0) {
        let _mid = getDesc[0]._id
        let city = { Name: getDesc[0].Name, detail: getDesc[0].detail }
        let newcity = [...user.cities, city]
        // If City Exist then Map to User
        console.log(user, "user")
        console.log(newcity, "city")
        const updateactivity = await Module.findByIdAndUpdate({ _id },
            {
                $set: {
                    cities: newcity
                }
            },
            { new: true }
        );
        res.send({ message: valid, result: updateactivity })

    }
    else {
        // Add to Master and Update to User
        console.log(user, "user")
        console.log(Module, "module")
        let _uid = user._id
        console.log(_uid, "dff")
        let url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${req.body.data.city}&aqi=no`;
        await request(url, async function (err, response, body) {
            // On return, check the json data fetched
            if (err) {
                res.render('index', { weather: null, error: 'Error, please try again' });
            } else {

                let weather = JSON.parse(body);
                // const getUserName=await(dataModule.find({Name:rname}) )
                if (weather.error == undefined) {

                    let addActivity = new dataModule({
                        Name: weather.location.name,
                        detail: { temp: weather.current.temp_c, condition: weather.current.condition }

                    });
                    const result = addActivity.save();
                    
                    let _id = req.body.data._id
                    let city = {
                        Name: weather.location.name,
                        detail: { temp: weather.current.temp_c, condition: weather.current.condition }
                    }
                    let newcity = [...user.cities, city]
                    const updateactivity = await Module.findByIdAndUpdate({ _id },
                        {
                            $set: {
                                cities: newcity
                            }
                        },
                        { new: true }
                    );
                    console.log(updateactivity, "fdf")


                    res.send({ message: "Able" ,result:updateactivity})

                }
                else {
                    res.send({ message: "No such City Exist" })
                }




            }
        })
    

}
}

// Need to look on the below code since It should have to be reusable in terms of Route and Single Calling
// async function GetCity(cityname) {
//     let weather
//     let url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityname}&aqi=no`;
//     return request(url, async function (err, response, body) {
//         // On return, check the json data fetched
//         if (err) {
//             res.render('index', { weather: null, error: 'Error, please try again' });

//         } else {

//             weather = JSON.parse(body);
//             // const getUserName=await(dataModule.find({Name:rname}) )
//             if (weather.error == undefined) {
//                 // Check if this city is in master if yes then update with Id Else add to master List aswell



//             }
//             else {
//                 // return {message:"No such City Exist"}

//             }




//         }
//     })
//     return weather

// }


async function CheckMaster(cityName) {
    const getDesc = await (dataModule.find({ Name: cityName }))
    console.log(getDesc, "getDesc")
    if (getDesc.length != 0) {
        // If City Exist then Map to User

    }
    else {
        // Add to Master and Update to User
    }

}
module.exports = { getWeatherDefault, test, SingleRoute, CheckMaster, weatherarr }