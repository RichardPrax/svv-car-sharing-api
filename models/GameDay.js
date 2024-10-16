const mongoose = require('mongoose');

const gameDaySchema = new mongoose.Schema({
    startZeit: { type: String, required: true },
    location: { type: String, required: true },
    datum: { type: Date, required: true },
    cars: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Car' }]
}, { timestamps: true });

module.exports = mongoose.model('GameDay', gameDaySchema);
