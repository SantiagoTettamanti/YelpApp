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
    for(let i=0; i < 300; i++){   //get 50 cities randomly from cities.js
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '605bf99474442a9b89098040',
            location: `${cities[random1000].city}, ${cities[random1000].state}`, //location is determined by random1000
            title: `${sample(descriptors)} ${sample(places)}`, //title is determined by our function 'sample', by plugging in descriptors and places
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sapiente accusantium tempore nulla sint atque eum itaque cumque, saepe sed doloribus placeat, eos nesciunt ut dolorem deleniti excepturi dolores, magni ea?',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dpt3qndvg/image/upload/v1617031728/YelpCamp/nm79nhzi2difsjzzgmbx.jpg',
                  filename: 'YelpCamp/nm79nhzi2difsjzzgmbx'
                },
                {
                  url: 'https://res.cloudinary.com/dpt3qndvg/image/upload/v1617200599/YelpCamp/attqyvm734zrr8smlovm.jpg',
                  filename: 'YelpCamp/dbzpanoffjtcj5rj0bz8'
                }
              ]
            
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})