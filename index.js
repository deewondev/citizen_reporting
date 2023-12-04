const express = require('express');
const expressLayout = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const app = express();
const PORT = 4000 || process.env.PORT;
require('dotenv').config();
const ConnectDB = require('./server/config/database');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
}));

// Static Files
app.use(express.static('public'));

// Template Engines
app.use(expressLayout);
app.set('view engine', 'ejs');
app.set('layout', './layouts/main');

// Routes
app.use(require('./server/routes/main'));
app.use(require('./server/routes/admin'));

const appConnect = async() => {
    try {
        await ConnectDB();
        app.listen(PORT, () => {
            console.log(`Listening to PORT ${PORT}`);
        });        
    } catch (error) {
        console.log(error);
    }
}

appConnect();
