import 'dotenv/config';

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import methodOverride from "method-override";
import ExpressError from './utils/expressError.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import flash from 'express-flash';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from './models/user.js';
const DB_URL = process.env.ALTASDB_URL;

// Import Router
import listingRoutes from './routes/listing.js';
import reviewRoutes from './routes/reviews.js';
import userRoutes from './routes/user.js';

main()
  .then(() => console.log("Connected to Database"))
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect(DB_URL);
}

const app = express();
const port = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views/pages"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride('_method'));

const store = MongoStore.create({
    mongoUrl: DB_URL,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log('Error in Mongo Session Store : ', err);
});

const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.edited = req.flash("edited");
  res.locals.reviewCreated = req.flash("reviewCreated");
  res.locals.reviewDeleted = req.flash("reviewDeleted");
  res.locals.currUser = req.user;
  next();
});

app.get('/', (req, res) => {
    res.redirect('/home');
}); 

// Routers
app.use("/home", listingRoutes);
app.use("/home/:id/review", reviewRoutes);
app.use("/", userRoutes);

// 404
app.use((req, res, next) => {
  next(new ExpressError(404, 'Page Not Found'));
});

// Error handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong" } = err;

  if (req.xhr || req.get("Accept")?.includes("json")) {
    return res.status(statusCode).json({ statusCode, message });
  }

  res.render("error.ejs", { statusCode, message });
});

app.listen(port, (req, res) => {
    console.log(`server is listening on port : ${port}`);
});