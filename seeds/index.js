const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true, 
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Database connected');
});

const sample = array => array[Math.floor(Math.random() * array.length)]; //function to give a random element out of an array


const seedDB = async() => {
    await Campground.deleteMany({}); //start by deleting everything from the DB
    for(let i=0; i < 50; i++){   //get 50 cities randomly from cities.js
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`, //location is determined by random1000
            title: `${sample(descriptors)} ${sample(places)}` //title is determined by our function 'sample', by plugging in descriptors and places
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})