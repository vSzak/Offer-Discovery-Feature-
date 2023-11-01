// Import necessary modules and packages
const { BadRequestError, NotFoundError } = require("@dqticket/common");
const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const { currentVenue } = require("../middleware/current-venue");
const Coupon = require("../models/couponModel");
const Deal = require("../models/dealModel");
const Member = require("../models/memberModel"); // New Member model
const Offer = require("../models/offerModel"); // New Offer model
const voucher = require("voucher-code-generator");
const sendEmail = require("../utils/email"); // Function to send emails

const router = express.Router();

// Create a coupon and send offer by email
router.post(
    "/",
    currentVenue,
    asyncHandler(async (req, res) => {
        const { title, code, value, expiry } = req.body;

        // Generate a unique coupon code
        const couponCode = voucher.generate({
            length: 4,
            charset: 'alphanumeric',
            count: Deal.totalCreated,
        });

        // Create a new coupon and associate it with the current venue
        const coupon = await Coupon.create({
            title,
            code,
            value,
            expiry,
            venueId: req.currentVenue.id,
        });
        await coupon.save();

        // Create an offer associated with the coupon
        const offer = await Offer.create({
            couponId: coupon.id,
            venueId: req.currentVenue.id,
            expirationDate: expiry,
        });

        // Find the list of members who should receive this offer
        const members = await Member.find({ venueId: req.currentVenue.id });

        // Send emails to members with offer details
        members.forEach((member) => {
            sendEmail({
                to: member.email,
                subject: "New Offer Available",
                text: `Check out our latest offer: ${title}`,
            });
        });

        res.status(201).send(coupon);
    })
);

// Get all coupons associated with the current venue
router.get(
    "/",
    currentVenue,
    asyncHandler(async (req, res) => {
        const coupons = await Coupon.find({
            venueId: req.currentVenue.id,
        });

        res.send(coupons);
    })
);

// Get a single coupon by its code
router.get(
    "/:code",
    currentVenue,
    asyncHandler(async (req, res) => {
        const code = req.params.code;
        const coupon = await Coupon.findOne({ code });

        if (!coupon) {
            throw new NotFoundError();
        }
        if (coupon.expiry < new Date() / 1000) {
            throw new BadRequestError("Coupon Expired");
        } else {
            res.send(coupon);
        }
    })
);

// Claim an offer by members
router.post(
    "/claim/:offerId",
    asyncHandler(async (req, res) => {
        const offerId = req.params.offerId;
        const member = req.member; // Authenticate and get the current member

        const offer = await Offer.findOne({ _id: offerId });

        if (!offer) {
            throw new NotFoundError("Offer not found");
        }
        if (offer.expirationDate < new Date()) {
            throw new BadRequestError("Offer has expired");
        }

        // Mark the offer as claimed by the member
        offer.claimedBy = member.id;
        await offer.save();

        res.send("Offer claimed successfully");
    })
);

module.exports = router;