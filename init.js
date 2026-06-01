// Import Mongoose
const mongoose = require("mongoose");

// Import Chat model
const Chat = require("./models/chat.js");


// -------------------- DATABASE CONNECTION --------------------

// Connect to MongoDB
main()
    .then(() => {
        console.log("Connection successful");
    })
    .catch((err) => {
        console.log(err);
    });

// Function to connect to MongoDB
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
}


// -------------------- SAMPLE CHAT DATA --------------------

// Array of chat objects to be inserted into database
let allChats = [
    {
        from: "neha",
        to: "priya",
        msg: "send me your exam sheets",
        created_at: new Date()
    },
    {
        from: "priya",
        to: "neha",
        msg: "send me your exam sheets",
        created_at: new Date()
    }
];


// -------------------- INSERT DATA --------------------

// Insert all chats into MongoDB collection
Chat.insertMany(allChats)
    .then((result) => {
        console.log("Sample data inserted successfully");
        console.log(result);
    })
    .catch((err) => {
        console.log(err);
    });