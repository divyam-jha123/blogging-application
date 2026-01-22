const jwt = require('jsonwebtoken');
require('dotenv').config();
// generate token

const secret = process.env.SECRET_KEY;

function createToken(user) {
    const payload = {
        _id: user._id,
        name: user.userName,
        email: user.email,
        role: user.role,
        profileImageURL: user.profileImageURL,
    }

    const token = jwt.sign(payload, secret, { expiresIn: '30h' });

    return token;
}

function verifyUser(token) {
    const payload = jwt.verify(token, secret);    

    return payload;
}

module.exports = {
    createToken,
    verifyUser,
}