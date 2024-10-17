const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    numberOfSeats: { type: Number, required: true },
    driver: { type: String, required: true },
    departureTime: { type: String, required: true },
    departureFrom: { type: String, required: true },
    registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    gameDay: { type: mongoose.Schema.Types.ObjectId, ref: 'GameDay', required: true },
    info: {type: String, required: false},
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);