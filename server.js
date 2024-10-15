const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Lade Umgebungsvariablen
dotenv.config();

// Importiere Routen
const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/cars');

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./public'));
app.use(cors());

// Verbinde mit MongoDB
const mongodbURL = process.env.MONGODB_URI;

mongoose.connect(mongodbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('*** Connected to MongoDB ***'))
    .catch(error => console.log('Connection error:', error.message));

// Routen verwenden
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);

// Fehlerbehandlung (optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});
