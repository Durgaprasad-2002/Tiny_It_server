const express = require("express");
const cors = require("cors");
const body_Parser = require("body-parser");
const geoip = require("geoip-lite");
const DBConnection = require("./Connection");
const URLSHORTNER = require("./routes/url");
const USERRouter = require("./routes/user");
const PORT = process.env.PORT || 5000;
const Url = require("./models/url");
const shortid = require("shortid");

DBConnection.then(() => console.log("Connected to Database")).catch(() =>
  console.log("Connection to Database is Failed")
);

const app = express();

app.use(cors());

app.use(body_Parser.json());

app.use(body_Parser.urlencoded({ extended: true }));

// Route to redirect short URL to the original long URL
app.get("/:shortUrl", async (req, res) => {
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

app.use("/api/url", URLSHORTNER);

app.use("/api/user", USERRouter);

app.listen(PORT, () => console.log(`Server is Started at PORT:${PORT}`));
