const bcrypt = require('bcrypt');

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ["ADMIN", "USER"],
        default: "USER",
    },
    salt: {
        type: String,
    },
    profileImageURL: {
        type: String,
        default: '/image/default.webp',
    },
    password: {
        type: String,
        required: true,
        unique: true,
    },


},
    { timestamps: true }
);

userSchema.pre("save", async function () {
    const user = this;

    if (!user.isModified("password")) return;

    user.password = await bcrypt.hash(user.password, 10);
});


const user = mongoose.model("User", userSchema);

module.exports = user;