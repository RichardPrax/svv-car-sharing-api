const mongoose = require('mongoose');

const gameDaySchema = new mongoose.Schema({
    startTime: { type: String, required: true },
    city: { type: String, required: true },
    detailledAddress: {type: String, required: tue},
    date: { type: Date, required: true },
    cars: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Car' }]
}, { timestamps: true });

module.exports = mongoose.model('GameDay', gameDaySchema);
