const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const bookingSchema = new Schema({
  listing  : { type: Schema.Types.ObjectId, ref: "Listing", required: true },
  user     : { type: Schema.Types.ObjectId, ref: "User",    required: true },
  checkIn  : { type: Date, required: true },
  checkOut : { type: Date, required: true },
  guests   : { type: Number, default: 1, min: 1, max: 16 },
  totalPrice: { type: Number, required: true },
  status   : { type: String, enum: ["confirmed", "cancelled"], default: "confirmed" },
  createdAt: { type: Date, default: Date.now },
});

// Index for fast availability queries
bookingSchema.index({ listing: 1, status: 1, checkIn: 1, checkOut: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
