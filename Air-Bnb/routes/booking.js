const express    = require("express");
const router     = express.Router({ mergeParams: true });
const { isLoggedIn } = require("../middleware.js");
const wrapAsync  = require("../utils/wrapAsync.js");
const ctrl       = require("../controllers/booking.js");

// /listings/:id/bookings
router.post("/", isLoggedIn, wrapAsync(ctrl.createBooking));

module.exports = router;
