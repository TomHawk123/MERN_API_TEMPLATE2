const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
configureDotenv = require("dotenv").config();
const cors = require("cors");
const { PORT, MONGO_URI, THIS_HOST_URL } = process.env;
const User = require("./src/models/UsersModel");

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("> Connected to MongoDB"))
  .catch((err) => console.error("> Error connecting to MONGO_URI : " + err));

app.use(cors({ origin: `${THIS_HOST_URL}` }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello from simple server :)");
});

app.post("/create/user", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    if (username.length < 3 || password.length < 8) {
      return res.status(400).json({
        msg: "Username must be at least 3 characters and password must be at least 8 characters",
      });
    }

    const checkIfUserAlreadyExists = User.exists({ username });
    if (checkIfUserAlreadyExists) {
      return res.status(400).json({ msg: "Username already exists" });
    }
    const newUser = new User({ username, password });
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (error) {
    console.error("error in create/user: ", error);
  }
});

app.listen(PORT, () =>
  console.log("> Server is up and running on PORT : " + PORT)
);
