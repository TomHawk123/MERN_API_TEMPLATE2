const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
configureDotenv = require("dotenv").config();
const cors = require("cors");
const http = require("http");

const { PORT, MONGO_URI, MERN_CLIENT_URL } = process.env;
const User = require("./src/models/UsersModel");

try {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
  }
  if (!MERN_CLIENT_URL) {
    throw new Error("MERN_CLIENT_URL is not defined");
  }
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("> Connected to MongoDB"))
    .catch((err) => console.error("> Error connecting to MONGO_URI : " + err));
} catch (error) {
  throw new Error(error);
}

app.use(cors({ origin: `${MERN_CLIENT_URL}` }));
app.use(express.json());

http.createServer(app);

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

    const checkIfUserAlreadyExists = await User.exists({ username });
    if (checkIfUserAlreadyExists) {
      return res.status(400).json({ msg: "Username already exists" });
    }

    const newUser = new User({ username, password });
    await newUser.save();

    return res.status(201).json({ success: true });
  } catch (error) {
    console.error("error in create/user: ", error);
  }
});

app.listen(PORT, () =>
  console.log("> Server is up and running on PORT : " + PORT)
);
