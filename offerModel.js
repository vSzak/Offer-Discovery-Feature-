// Import the 'mongoose' module, which is a MongoDB Object Modeling Tool
const mongoose = require("mongoose");

// Define a schema for the 'Offer' model
const offerSchema = new mongoose.Schema({
    // 'couponId' is a reference to a 'Coupon' model, indicating the associated coupon for this offer
    couponId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon", // Reference to the 'Coupon' model
        required: true,
    },
    // 'venueId' is a reference to a 'Venue' model, indicating the venue associated with this offer
    venueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Venue", // Reference to the 'Venue' model
        required: true,
    },
    // 'expirationDate' is a date field representing the expiration date of the offer, required
    expirationDate: {
        type: Date,
        required: true,
    },
    // 'claimedBy' is a reference to a 'Member' model, indicating the member who claimed the offer, with a default value of null
    claimedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member", // Reference to the 'Member' model
        default: null,
    },
});

// Create an 'Offer' model using the defined schema
const Offer = mongoose.model("Offer", offerSchema);

// Export the 'Offer' model
module.exports = Offer;