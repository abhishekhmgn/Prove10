const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 5000 // So we can run on heroku || (OR) localhost:5000
const mongoose = require('mongoose');
const cors = require('cors'); // Place this with other requires (like 'path' and 'express')
const app = express();
const session = require('express-session');
const csrf = require('csurf');
const flash = require('connect-flash');
const http = require('http').createServer(app);


const MongoDBStore = require('connect-mongodb-session')(session);

const corsOptions = {
    origin: "https://cse341-project-master.herokuapp.com/",
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

const csrfProtection = csrf();

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    family: 4
};

const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://Dragoncat99:Echomoon11@cluster0.ma3ou.mongodb.net/shop?retryWrites=true&w=majority&authSource=admin";

// Route setup. You can implement more in the future!
//Proves

const pr10Routes = require('./routes/pr10');


const store = new MongoDBStore({
    uri: MONGODB_URL,
    collection: 'sessions'
});

app.set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')))
    .use(bodyParser.urlencoded({ extended: false })) // For parsing the body of a POST
    .use(bodyParser.json())
    .use(session({
        secret: "UwU",
        resave: false,
        saveUninitialized: false,
        store: store
    }));
app.use(csrfProtection);

app.use(flash());

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    //console.log(req.session.user._id);
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use((req, res, next) => {
        res.locals.isLoggedIn = req.session.loggedIn;
        res.locals.csrfToken = req.csrfToken();
        next();
    })
    //Prove routes

.use('/pr10', pr10Routes)

.get('/', (req, res, next) => {
        // This is the primary index, always handled last. 
        res.render('pages/index', {
            title: 'Welcome to my store!',
            path: '/',
            isLoggedIn: req.session.loggedIn
        });
    })
    .use((req, res, next) => {
        // 404 page
        res.render('pages/404', {
            title: '404 - Page Not Found',
            path: req.url,
            isLoggedIn: req.session.loggedIn
        });
    })
    .use((err, req, res, next) => {
        console.log(err);
        res.render('pages/500', {
            title: '500 - Server Error',
            path: req.url
        })
    });



mongoose
    .connect(
        MONGODB_URL, options
    )
    .then(result => {
        // This should be your user handling code implement following the course videos 
        const server = app.listen(PORT);
        const io = require('socket.io')(server);
        io.on('connection', (socket) => {
            console.log('Client connected!');
            socket.on('broadcast', data => {
                // console.log('Data' + data)
                socket.broadcast.emit("broadcast", data);
            });
        })

    })
    .catch(err => {
        console.log(err);
    });