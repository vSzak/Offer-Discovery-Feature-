// Import the 'mongoose' module, which is a MongoDB Object Modeling Tool
const mongoose = require("mongoose");

// Import the 'bcrypt' module, used for password hashing and validation
const bcrypt = require("bcryptjs");

// Define a schema for the 'Member' model
const memberSchema = mongoose.Schema(
    {
        // 'firstName' is a string field for the member's first name
        firstName: {
            type: String,
        },
        // 'lastName' is a string field for the member's last name
        lastName: {
            type: String,
        },
        // 'email' is a string field for the member's email, required and must be unique
        email: {
            type: String,
            require: true,
            unique: true,
        },
        // 'password' is a string field for the member's password, required
        password: {
            type: String,
            required: true,
        },
        // 'isBroker' is a boolean field indicating if the member is a broker, required and defaults to false
        isBroker: {
            type: Boolean,
            require: true,
            default: false,
        },
    },
    {
        // Configure timestamps to automatically add 'createdAt' and 'updatedAt' fields
        timestamps: true,
        // Define how the document should be transformed when converted to JSON
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id; // Map '_id' to 'id'
                delete ret._id; // Remove '_id'
                delete ret.password; // Remove 'password' from the JSON representation
            },
        },
    }
);

// Define a method to compare the entered password with the stored hashed password
memberSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Pre-save hook to encrypt the password using bcrypt before saving
memberSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Create a 'Member' model using the defined schema
const Member = mongoose.model("Member", memberSchema);

// Export the 'Member' model
module.exports = Member;