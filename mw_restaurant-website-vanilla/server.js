const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

const app = express();

// Middleware

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(express.static("/public"));

// Connect to Database
mongoose.connect(process.server.env.MONGODB_URI)

//https://nodejs.org/api/events.html#emitteroneventname-listener
const db = mongoose.connection 
db.once('open', () => {
    console.log("Connected to MongoDB")
})



// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
