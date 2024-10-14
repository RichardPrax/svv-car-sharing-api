const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// middleware setup
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static('./public'));
app.use(cors());

const mongodbURL = 'mongodb+srv://richardprax:<qwertz123asdfg>@carsharing.mlcav.mongodb.net/?retryWrites=true&w=majority&appName=carsharing';

mongoose.connect(mongodbURL)
    .then(result => console.log('*** Connentec ***'))
    .catch(error => handleError(error.message));

function handleError(error){
    console.log(error);
}


const studentSchmea = new mongoose.Schema(
    {
        "id": {type:Number, required:true, unique:true},
        "first_name": {type:String, required:true},
        "last_name": {type:String, required:true}
    }
);

mongoose.model('Students', studentSchmea);

// API

app.get('/', (req,res) => {
    res.send('HI');
})

app.get('/students', async (req,res) => {
    const result = await Student.find();
    res.send(result);
})