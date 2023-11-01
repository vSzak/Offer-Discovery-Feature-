// Import the 'mongoose' module, which is a MongoDB Object Modeling Tool
const mongoose = require("mongoose");

// Define a schema for the 'Coupon' model
const couponSchema = mongoose.Schema(
    {
        // 'title' is a string field for the title of the coupon
        title: {
            type: String,
        },
        // 'code' is a string field for the unique coupon code, which must be unique
        code: {
            type: String,
            unique: true,
        },
        // 'value' is a string field for the value of the coupon
        value: {
            type: String,
        },
        // 'expiry' is a date field for the coupon's expiration date, required and set to 1 week from the current date by default
        expiry: {
            type: Date,
            required: true,
            default: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week
        },
        // 'venueId' is a reference to another 'Venue' model, representing the venue associated with the coupon
        venueId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Venue", // Reference to the Venue model
            required: true,
        },
        // 'points' is a number field representing the points associated with the coupon, with a default value of 10
        points: {
            type: Number,
            default: 10,
        },
        // 'redeemed' is a boolean field indicating if the coupon has been redeemed, with a default value of true
        redeemed: {
            type: Boolean,
            default: true,
        },
    },
    {
        // Configure timestamps to automatically add 'createdAt' and 'updatedAt' fields
        timestamps: true,
        // Define how the document should be transformed when converted to JSON
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id; // Map '_id' to 'id' and remove '_id'
                delete ret._id;
            },
        },
    }
);

// Create a 'Coupon' model using the defined schema
const Coupon = mongoose.model("Coupon", couponSchema);

// Export the 'Coupon' model
module.exports = Coupon;