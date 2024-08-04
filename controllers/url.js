const shortid = require("shortid"); //Nano ID is a library for generating random IDs.
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ err: "url is required" });
  const shortID = shortid(); // generate 8 character id
  await URL.create({
    shortId: shortID,
    redirectUrl: body.url,
    visitHistory: [],
    createdBy: req.user._id,
  });

  // return res.json({ shortId: shortID });
  return res.render("home", {
    shortId: shortID,
  });
}

module.exports = { handleGenerateNewShortURL };
