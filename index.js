// Import required packages
const express = require("express");
const app = express();

const path = require("path");
const mongoose = require("mongoose");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");


// -------------------- APP CONFIGURATION --------------------

// Set views folder
app.set("views", path.join(__dirname, "views"));

// Set EJS as template engine
app.set("view engine", "ejs");

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Enable PUT and DELETE requests from forms
app.use(methodOverride("_method"));


// -------------------- DATABASE CONNECTION --------------------

main()
    .then(() => {
        console.log("Connection successful");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
}


// -------------------- SAMPLE DATA INSERT --------------------

// let chat1 = new Chat({
//     from: "neha",
//     to: "priya",
//     msg: "send me your exam sheets",
//     created_at: new Date()
// });

// chat1.save().then((res) => {
//     console.log(res);
// });


// -------------------- ROUTES --------------------

// Root Route
app.get("/", (req, res) => {
    res.send("Working Root");
});


// -------------------- READ ALL CHATS --------------------

// Display all chats
app.get("/chats", async (req, res) => {

    let chats = await Chat.find();

    res.render("index.ejs", { chats });
});


// -------------------- CREATE CHAT --------------------

// Show form for creating a new chat
app.get("/chats/new", (req, res) => {
    res.render("new.ejs");
});


// Save new chat in database
app.post("/chats", (req, res) => {

    // Get form data
    let { from, to, msg } = req.body;

    // Create new chat object
    let newChat = new Chat({
        from,
        to,
        msg,
        created_at: new Date()
    });

    // Save chat
    newChat.save()
        .then((result) => {

            console.log("Chat was saved");

            // Redirect to all chats page
            res.redirect("/chats");
        })
        .catch((err) => {

            console.log(err);
            res.send("Error saving chat");
        });
});


// -------------------- EDIT CHAT --------------------

// Show edit form
app.get("/chats/:id/edit", async (req, res) => {

    let { id } = req.params;

    // Find chat using ID
    let chat = await Chat.findById(id);

    res.render("edit.ejs", { chat });
});


// Update chat message
app.put("/chats/:id", async (req, res) => {

    let { id } = req.params;

    // Rename msg to newMsg
    let { msg: newMsg } = req.body;

    // Update message in database
    let updatedChat = await Chat.findByIdAndUpdate(
        id,
        { msg: newMsg },
        {
            runValidators: true,
            new: true
        }
    );

    console.log(updatedChat);

    // Go back to chats page
    res.redirect("/chats");
});


// -------------------- DELETE CHAT --------------------

// Delete a chat
app.delete("/chats/:id", async (req, res) => {

    let { id } = req.params;

    let deletedChat = await Chat.findByIdAndDelete(id);

    console.log(deletedChat);

    res.redirect("/chats");
});


// -------------------- SERVER --------------------

app.listen(8080, () => {
    console.log("App is listening on port 8080");
});