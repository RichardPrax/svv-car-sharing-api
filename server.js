const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/cars');
const gameDayRoutes = require('./routes/gameDays');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./public'));
app.use(cors());

const mongodbURL = process.env.MONGODB_URI;

mongoose.connect(mongodbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('*** Connected to MongoDB ***'))
    .catch(error => console.log('Connection error:', error.message));

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/gameDays', gameDayRoutes)


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});
