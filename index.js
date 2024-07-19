const express = require("express");
const cors = require("cors");
const body_Parser = require("body-parser");
const geoip = require("geoip-lite");
const DBConnection = require("./Connection");
const URLSHORTNER = require("./routes/url");
const USERRouter = require("./routes/user");
const PORT = process.env.PORT || 5000;

DBConnection.then(() => console.log("Connected to Database")).catch(() =>
  console.log("Connection to Database is Failed")
);

const app = express();

app.use(cors());

app.use((req, res, next) => {
  next();
});

app.use(body_Parser.json());

app.use(body_Parser.urlencoded({ extended: true }));

app.use("/api/url", URLSHORTNER);

app.use("/api/user", USERRouter);

app.listen(PORT, () => console.log(`Server is Started at PORT:${PORT}`));
