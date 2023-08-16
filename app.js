const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const path = require("path");
const multer = require("multer");
const mongoose = require('mongoose');

app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    layoutsDir: "views/",
    defaultLayout: false,
  })
);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));

// Connect to MongoDB
  mongoose.connect ('mongodb://localhost:27017/photoApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const photoSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
});

const Photo = mongoose.model('Photo', photoSchema);

// Set up storage for uploaded files using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

// Serve the index.html file
app.get("/", (req, res, next) => {
  res.render("main", {});
});

// Handle file upload from the client
app.post("/upload", upload.single("photo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file received" });
  }
  return res.json({
    message: "File received successfully",
    filePath: req.file.path,
  });
});

app.listen(5501);
