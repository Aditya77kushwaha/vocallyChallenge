const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { Todo, User } = require("./Model");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const path = require("path");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit")
dotenv.config();

// cooldown of 10 min if exceeds 100 requests
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, //10 minutes
  max: 100,
})

app.use(limiter)
app.set('trust proxy', 1)

mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) console.log(err);
    console.log("Connected to MongoDB");
  }
);

app.use(express.json());
app.use(cors());

//Error handling
const createError = (status, message) => {
  const err = new Error();
  err.status = status;
  err.message = message;
  return err;
};

//Authorisation
const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(createError(401, "You are not authenticated!"));

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));
    req.user = user;
    next();
  });
};

app.get("/", (req, res) => {
  res.json({ msg: "Hello owrld" })
})

//user routes
//REGISTER
app.post("/register", async (req, res, next) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //save user and respond
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    next(err);
    // res.status(500).json(err);
    // console.log(err);
  }
});

//LOGIN
app.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("user not found");

    //Authentication
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).json("wrong password");

    const token = jwt.sign({ id: user._id }, process.env.JWT);
    const { password, ...others } = user._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(others);
  } catch (err) {
    next(err);
    // res.status(500).json(err);
  }
});

//todo routes
//get all todos of a user
app.get("/todos/:id", async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    const todos = await Todo.find({ userId: user._id });
    res.status(200).json(todos);
  } catch (err) {
    next(err);
    // res.status(500).json(err);
  }
});

//get a todo
app.get("/todo/:id", async (req, res, next) => {
  try {
    const todos = await Todo.findById(req.params.id);
    res.status(200).json(todos);
  } catch (err) {
    next(err);
    // res.status(500).json(err);
  }
});

//update a todo
app.put("/todos/:id", verifyToken, async (req, res, next) => {
  //   const todo = await Todo.findById(req.params.id);
  console.log("Update");
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    // console.log("Update");
    res.status(200).json(updatedTodo);
  } catch (err) {
    next(err);
    // res.status(500).json(err);
  }
});

//delete a todo
app.delete("/todos/:id", verifyToken, async (req, res, next) => {
  const todo = await Todo.findById(req.params.id);
  try {
    await todo.delete();
    res.status(200).json("Todo has been deleted...");
  } catch (err) {
    next(err);
    // res.status(500).json(err);
  }
});

//create a new todo
app.post("/todo", verifyToken, async (req, res, next) => {
  console.log(req.body);
  // const newTodo = await pool.query("insert into todo (description) values($1)", [req.body.todo])
  const newTodo = new Todo(req.body);
  try {
    const savedTodo = await newTodo.save();
    res.status(200).json(savedTodo);
  } catch (err) {
    next(err);
    // res.status(500).json(err);
    // console.log(err);
  }
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

app.use(express.static(path.join(__dirname, "/ui/build")));

app.get("*", (req, res, next) => {
  res.sendFile(path.join(__dirname, "/ui/build", "index.html"));
});

module.exports = app;
