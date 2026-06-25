if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const userRouter = require("./routes/user.js");


const dbUrl = process.env.ATLASDB_URL;
if (!dbUrl) {
  console.error("❌ Missing ATLASDB_URL environment variable");
  process.exit(1);
}


try { require("dns").setDefaultResultOrder?.("ipv4first"); } catch {}


async function connectDB() {
  await mongoose.connect(dbUrl, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log("✅ MongoDB connected");
}


const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: { secret: process.env.SECRET },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.error("⚠️ Error in Mongo session store:", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET || "change-me",
  resave: false,
  saveUninitialized: false,

  cookie: {

    maxAge: 7 * 24 * 60 * 60 * 1000, 
    httpOnly: true,
 
  },
};


app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});


app.get("/", (req, res) => res.redirect("/listings"));
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", userRouter);


app.all("*", (req, res, next) => next(new ExpressError(404, "page not found")));
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "something went wrong" } = err;
  res.status(statusCode).render("listings/error.ejs", { message, statusCode });
});


const PORT = process.env.PORT || 8080;

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`🚀 Server listening on ${PORT}`));
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
})();
