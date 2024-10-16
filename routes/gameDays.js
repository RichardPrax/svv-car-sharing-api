const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    try {
        const gameDays = await GameDay.find().populate('gameDays');
        res.status(200).json({ message: 'Spieltage erfolgreich abgerufen', gameDays });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const gameDay = await GameDay.findById(req.params.id).populate('gameDays');
        if (!gameDay) {
            return res.status(404).json({ message: 'Spieltag nicht gefunden' });
        }
        res.status(200).json({ message: 'Spieltag erfolgreich abgerufen', gameDay });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post('/create', auth, async (req, res) => {
    const { startTime, location, date } = req.body;
    try {
        const newGameDay = new GameDay({ startTime, location, date, cars: [] });
        await newGameDay.save();
        res.status(201).json({ message: 'Spieltag erfolgreich erstellt', gameDay: newGameDay });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { startTime, location, date } = req.body;
    
    try {
        const gameDay = await GameDay.findById(id);
        if (!gameDay) {
            return res.status(404).json({ message: 'Spieltag nicht gefunden' });
        }

        gameDay.startTime = startTime || gameDay.startTime;
        gameDay.location = location || gameDay.location;
        gameDay.date = date || gameDay.date;
        
        await gameDay.save();
        res.json({ message: 'Spieltag erfolgreich aktualisiert', gameDay });
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