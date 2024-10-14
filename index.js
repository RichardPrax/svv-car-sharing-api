const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Load environment variables
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Define Mongoose Schema
const CarSchema = new mongoose.Schema({
    departure: String,
    location: String,
    seats: Number,
    passengers: [{ name: String }]
});

const Car = mongoose.model('Car', CarSchema);

// Routes
app.post('/cars', async (req, res) => {
    try {
        const car = new Car(req.body);
        await car.save();
        res.status(201).send(car);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.get('/cars', async (req, res) => {
    try {
        const cars = await Car.find();
        res.status(200).send(cars);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.post('/cars/:id/passengers', async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (car) {
            car.passengers.push(req.body);
            await car.save();
            res.status(200).send(car);
        } else {
            res.status(404).send('Car not found');
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

app.get("/", (req, res) => { res.send("Express on Vercel"); });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;