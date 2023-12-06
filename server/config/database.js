const Mongoose = require('mongoose');

const USERNAME = encodeURIComponent('deeone1206');
const PASSWORD = encodeURIComponent('deeone1206');
const dbName = 'Citizen_Reporting';
const URI = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.wwsfbb7.mongodb.net/${dbName}?retryWrites=true&w=majority`;

const ConnectDB = async () => {
    try {
        await Mongoose.connect(URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

module.exports = ConnectDB;
