const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const auth = require('../middleware/auth');

// Auto anbieten
router.post('/', auth, async (req, res) => {
    const { numberOfSeats, driver, departureTime, departureFrom } = req.body;
    try {
        const car = new Car({
            owner: req.user._id,
            numberOfSeats,
            driver,
            departureTime,
            departureFrom
        });
        await car.save();
        res.status(201).json(car);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Alle Autos anzeigen
router.get('/', auth, async (req, res) => {
    try {
        const cars = await Car.find().populate('owner', 'username email').populate('registeredUsers', 'username email');
        res.json(cars);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Für ein Auto eintragen
router.post('/:id/register', auth, async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) return res.status(404).json({ message: 'Car not found' });

        if (car.registeredUsers.length >= car.numberOfSeats) {
            return res.status(400).json({ message: 'No available seats' });
        }

        if (car.registeredUsers.includes(req.user._id)) {
            return res.status(400).json({ message: 'Already registered for this car' });
        }

        car.registeredUsers.push(req.user._id);
        await car.save();
        res.json({ message: 'Registered successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Von einem Auto abmelden
router.post('/:id/deregister', auth, async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) return res.status(404).json({ message: 'Car not found' });

        const index = car.registeredUsers.indexOf(req.user._id);
        if (index === -1) {
            return res.status(400).json({ message: 'Not registered for this car' });
        }

        car.registeredUsers.splice(index, 1);
        await car.save();
        res.json({ message: 'Deregistered successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
