const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/expressError.js");

// POST /listings/:id/bookings
module.exports.createBooking = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) throw new ExpressError(404, "Listing not found");

  const { checkIn, checkOut, guests } = req.body;
  const cin  = new Date(checkIn);
  const cout = new Date(checkOut);
  const today = new Date(); today.setHours(0,0,0,0);

  if (cin < today)   { req.flash("error", "Check-in date cannot be in the past."); return res.redirect(`/listings/${listing._id}`); }
  if (cout <= cin)   { req.flash("error", "Check-out must be after check-in.");     return res.redirect(`/listings/${listing._id}`); }

  // Conflict check
  const conflict = await Booking.findOne({
    listing: listing._id,
    status: "confirmed",
    checkIn:  { $lt: cout },
    checkOut: { $gt: cin  },
  });
  if (conflict) {
    req.flash("error", "Those dates are already booked. Please choose different dates.");
    return res.redirect(`/listings/${listing._id}`);
  }

  const nights = Math.ceil((cout - cin) / (1000 * 60 * 60 * 24));
  const totalPrice = nights * listing.price;

  await Booking.create({
    listing: listing._id,
    user: req.user._id,
    checkIn: cin,
    checkOut: cout,
    guests: guests || 1,
    totalPrice,
  });

  req.flash("success", `Booking confirmed! ${nights} night${nights > 1 ? "s" : ""} · ₹${totalPrice.toLocaleString("en-IN")}`);
  res.redirect("/bookings");
};

// GET /bookings
module.exports.myBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("listing")
    .sort({ checkIn: 1 });
  res.render("bookings/index.ejs", { bookings });
};

// DELETE /bookings/:bookingId
module.exports.cancelBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.bookingId);
  if (!booking) throw new ExpressError(404, "Booking not found");
  if (!booking.user.equals(req.user._id)) throw new ExpressError(403, "Not authorised");

  const checkIn = new Date(booking.checkIn);
  const now = new Date();
  if (checkIn <= now) {
    req.flash("error", "Cannot cancel a booking that has already started.");
    return res.redirect("/bookings");
  }

  booking.status = "cancelled";
  await booking.save();
  req.flash("success", "Booking cancelled successfully.");
  res.redirect("/bookings");
};
