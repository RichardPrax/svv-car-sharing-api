const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const GameDay = require('../models/GameDay');

router.get('/', auth, async (req, res) => {
    try {
        const gameDays = await GameDay.find().populate('cars');
        res.status(200).json({ gameDays });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const gameDay = await GameDay.findById(req.params.id).populate('cars');
        if (!gameDay) {
            return res.status(404).json({ message: 'Spieltag nicht gefunden' });
        }
        res.status(200).json({ gameDay });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post('/create', auth, async (req, res) => {
    const { startTime, city, detailledAddress, date } = req.body;
    try {
        const newGameDay = new GameDay({ startTime, city, detailledAddress, date, cars: [] });
        await newGameDay.save();
        res.status(201).json({ newGameDay });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { startTime, city, detailledAddress, date } = req.body;
    
    try {
        const gameDay = await GameDay.findById(id);
        if (!gameDay) {
            return res.status(404).json({ message: 'Spieltag nicht gefunden' });
        }

        gameDay.startTime = startTime || gameDay.startTime;
        gameDay.city = city || gameDay.city;
        gameDay.detailledAddress = detailledAddress || gameDay.detailledAddress;
        gameDay.date = date || gameDay.date;
        
        await gameDay.save();
        res.json({ gameDay });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params;
    try {
        const gameDay = await GameDay.findByIdAndDelete(id);
        if (!gameDay) {
            return res.status(404).json({ message: 'Spieltag nicht gefunden' });
        }
        res.json({ message: 'Spieltag erfolgreich gelöscht' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


module.exports = router;