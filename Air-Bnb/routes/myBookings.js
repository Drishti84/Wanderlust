const express   = require("express");
const router    = express.Router();
const { isLoggedIn } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ctrl      = require("../controllers/booking.js");

router.get("/",                     isLoggedIn, wrapAsync(ctrl.myBookings));
router.delete("/:bookingId",        isLoggedIn, wrapAsync(ctrl.cancelBooking));

module.exports = router;
