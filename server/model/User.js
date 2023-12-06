const Mongoose = require('mongoose');

const UserSchema = new Mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
    }
});

const UserModel = Mongoose.model('User', UserSchema);

module.exports = UserModel;
