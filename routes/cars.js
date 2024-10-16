const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const GameDay = require('../models/GameDay');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
    const { numberOfSeats, driver, departureTime, departureFrom, gameDay } = req.body;
    try {
        const gameDayDoc = await GameDay.findById(gameDay);
        if (!gameDayDoc) {
            return res.status(404).json({ message: 'Spieltag nicht gefunden' });
        }

        const car = new Car({
            owner: req.user._id,
            numberOfSeats,
            driver,
            departureTime,
            departureFrom,
            gameDay,
            registeredUsers: []
        });

        await car.save();

        gameDayDoc.cars.push(car._id);
        await gameDayDoc.save();

        res.status(201).json(car);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const cars = await Car.find()
            .populate('owner', 'username')
            .populate('registeredUsers', 'username')
            .populate('gameDay', 'startTime location date');
        res.json(cars);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const car = await Car.findById(req.params.id).populate('owner', 'username')
        .populate('registeredUsers', 'username')
        .populate('gameDay', 'startTime location date');
        if (!car) return res.status(404).json({ message: 'Auto nicht gefunden' });

        res.json(car);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/:id/register', auth, async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) return res.status(404).json({ message: 'Auto nicht gefunden' });

        if (car.registeredUsers.length >= car.numberOfSeats) {
            return res.status(400).json({ message: 'Keine verfügbaren Plätze' });
        }

        if (car.registeredUsers.includes(req.user._id)) {
            return res.status(400).json({ message: 'Bereits für dieses Auto registriert' });
        }

        car.registeredUsers.push(req.user._id);
        await car.save();
        res.json({ message: 'Erfolgreich registriert' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/:id/deregister', auth, async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) return res.status(404).json({ message: 'Auto nicht gefunden' });

        const index = car.registeredUsers.indexOf(req.user._id);
        if (index === -1) {
            return res.status(400).json({ message: 'Nicht für dieses Auto registriert' });
        }

        car.registeredUsers.splice(index, 1);
        await car.save();
        res.json({ message: 'Erfolgreich abgemeldet' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
