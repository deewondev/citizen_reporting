const Mongoose = require('mongoose');

const SubscriptionSchema = new Mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(string) {
                return (/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]+$/.test(string));
            },
            message: 'Please enter a valid email address'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const SubscriptionModel = Mongoose.model('email_subscription', SubscriptionSchema);

module.exports = SubscriptionModel;
