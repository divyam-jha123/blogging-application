const mongoose = require("mongoose");

const connectDb = (url) => {
    return mongoose
        .connect(url)
    .then(() => {
        console.log("database sucessfully connected...");
    })
    .catch((err) => {
        console.log("MongoDb connection error:", err);
    });
}

module.exports = connectDb;
