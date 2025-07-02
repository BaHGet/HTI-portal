require('dotenv').config()
const mongoose = require("mongoose");

const dbConnection = async() => {
    try {
        mongoose.connect(
            `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.ck4qxr9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
        );
    } catch (error) {
        return error
    }

    const db = mongoose.connection;
    db.on("error", (error) => console.error(error));
    db.once("open", () => console.log("Connected to Database"));
    return db;
}

module.exports.dbConnection = dbConnection;