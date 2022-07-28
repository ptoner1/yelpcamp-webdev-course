const mongoose = require('mongoose');
const cities = require('./cities');
const seedHelpers = require('./seedHelpers');
// const images = require('./images');
const Campground = require('../models/campground');


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewURLParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const randomPrice = Math.floor(Math.random() * 20 + 10);

const seeddb = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        // const image = images[i];
        const random1000 = Math.floor(Math.random() * 1000);
        const random18 = Math.floor(Math.random() * 18);
        const random21 = Math.floor(Math.random() * 21);
        const camp = new Campground({
            author: '62d6aeb82116352cae266410',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            title: `${seedHelpers.descriptors[random18]} ${seedHelpers.places[random21]}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/ptone1/image/upload/v1658860532/yelp-camp/rpwat3fo4ohydmywhbt3.jpg',
                    filename: 'yelp-camp/rpwat3fo4ohydmywhbt3'
                }, {
                    url: 'https://res.cloudinary.com/ptone1/image/upload/v1658953996/yelp-camp/mtuzhsdbs2txjqmcbjmc.jpg',
                    filename: 'yelp-camp/rpwat3fo4ohydmywhbt3'
                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam veritatis, ex eum itaque atque delectus quasi sequi voluptatibus. Deserunt inventore blanditiis sint facilis reiciendis consectetur eos tempora dolorem nulla placeat.',
            price: randomPrice,

        })
        await camp.save()
    }
}

seeddb();