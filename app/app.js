import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import expressLayout from 'express-ejs-layouts';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import router from './server/routes/main.js';
import admin from './server/routes/admin.js';
import connectDB from './server/config/db.js';
import session from 'express-session';

const app = express();
const PORT = 5000 || process.env.PORT;

connectDB();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    cookie: { maxAge: new Date(Date.now() + (3600000)) }
}));

// Public
app.use(express.static('public'));

// Templating EJS Engine
app.use(expressLayout);
app.set('layout', 'layouts/main');
app.set('view engine', 'ejs');

app.use('/', router);
app.use('/', admin);

app.listen(PORT, () => console.log(`app listening on localhost:${PORT}`));
