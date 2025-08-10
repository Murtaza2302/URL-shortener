import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { nanoid } from "nanoid";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose.connect("mongodb+srv://murtazanajmi05:Fu4T6fqmvRQgbOtG@cluster0.pjeksur.mongodb.net/url-shortener?retryWrites=true&w=majority&appName=Cluster0");

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Schema
const UrlSchema = new mongoose.Schema({
  longUrl: String,
  shortCode: String,
  clicks: { type: Number, default: 0 }
});
const Url = mongoose.model("Url", UrlSchema);

// API routes
app.post("/api/shorten", async (req, res) => {
  const { longUrl } = req.body;
  const shortCode = nanoid(6);
  const newUrl = new Url({ longUrl, shortCode });
  await newUrl.save();
  res.json({ shortUrl: `https://url-shortener-9ivc.onrender.com/${shortCode}` });
});

app.get("/:shortcode", async (req, res, next) => {
  // Prevent conflict with static frontend routes
  if (req.params.shortcode.includes(".")) return next();

  const { shortcode } = req.params;
  const record = await Url.findOne({ shortCode: shortcode });
  if (record) {
    record.clicks++;
    await record.save();
    res.redirect(record.longUrl);
  } else {
    res.status(404).send("Not found");
  }
});

// Serve static frontend
app.use(express.static(path.join(__dirname, "dist")));

// Wildcard for React Router (must be AFTER API + static)
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(5000, () => console.log("Backend running on port 5000"));
