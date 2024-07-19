const express = require("express");
const router = express.Router();
const Url = require("../models/url");
const shortid = require("shortid");

// Route to shorten a URL
router.post("/shorten", async (req, res) => {
  const { longUrl, userId, title } = req.body;
  const shortUrl = shortid.generate();

  try {
    console.log(req.body);
    const url = new Url({ longUrl, shortUrl, user: userId, title: title });
    await url.save();
    res.status(201).json({ shortUrl });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ error: "URL shortening failed", msg: error.message });
  }
});

// Route to redirect short URL to the original long URL
router.get("/:shortUrl", async (req, res) => {
  const { shortUrl } = req.params;
  const referrer = req.get("Referer") || "Direct";

  try {
    const url = await Url.findOne({ shortUrl });
    if (url) {
      url.clicks++;
      url.clickDetails.push({ referrer });
      await url.save();
      return res.redirect(url.longUrl);
    } else {
      return res.status(404).json({ error: "URL not found" });
    }
  } catch (error) {
    res.status(400).json({ error: "Redirection failed", msg: error.message });
  }
});

// Route to get analytics for a short URL
router.get("/analytics/:shortUrl", async (req, res) => {
  const { shortUrl } = req.params;

  try {
    const url = await Url.findOne({ shortUrl }).populate("user");
    if (url) {
      res.json({
        longUrl: url.longUrl,
        shortUrl: url.shortUrl,
        clicks: url.clicks,
        clickDetails: url.clickDetails,
      });
    } else {
      res.status(404).json({ error: "URL not found" });
    }
  } catch (error) {
    res
      .status(400)
      .json({ error: "Failed to retrieve analytics", msg: error.message });
  }
});

// Route to get all URLs created by a user
router.get("/urlsinfo/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const urls = await Url.find({ user: userId });
    console.log(userId, urls);
    res.json(urls);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Failed to retrieve user URLs", msg: error.message });
  }
});

module.exports = router;
