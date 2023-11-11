require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Item = require("./models/Item");

const app = express();

const port = process.env.PORT || 4000;

// Connect to MongoDB
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.htktv52.mongodb.net/${process.env.MONGODB_DATABASE_NAME}?retryWrites=true&w=majority`)
  .then(() => console.log("Tones MongoDB is Connected"))
  .catch((err) => console.log(err));

// Middleware
  // Enable Cors
app.use(cors());

  // Serve static files (Where all your pages will exist (Public Folder 👀))
app.use(express.static("public"));

  // Parse request
app.use(express.urlencoded({ extended: false }));

  //Parse JSON requests
app.use(express.json());

  // Setup EJS Template Engine 👀
app.set("view engine", "ejs");

// Logic Goes Here
  // Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/item", async (req, res) => {
  const items = await Item.find({});
  res.render("item", { items });
});

  // Create
app.post("/item", async (req, res) => {
  const newItem = new Item(req.body);
  try {
    await newItem.save();
    res.redirect("/item");
  } catch (error) {
    res.redirect("/item?error=true");
  }
});

  // Update
app.post('/item/update/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    await Item.findByIdAndUpdate(id, { name, description });
    res.redirect('/item');
  } catch (err) {
    //you can set up custom error handling on the client side using this information
    res.redirect(`/item?error=true`);
  }
});

  // Delete
app.delete('/item/delete/:id', async (req, res) => {
  const { id } = req.params;
  await Item.findByIdAndDelete(id);
    //Send success back to the client-side function
  res.status(200).json({ message: 'Item deleted successfully' });
});

// Start Server Here
app.listen(port, () => {
  console.log(`Your server is running on http://localhost:${port} You Betta Get on Board!`);
});
