const express = require("express");
const { handleGenerateNewShortURL } = require("../controllers/url");
const router = express.Router();
const URL = require("../models/url");
const { formatISO } = require("date-fns");
router.post("/", handleGenerateNewShortURL);
router.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  console.log(shortId);
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: formatISO(new Date(), "HH:mm:ss / dd-MM-yyyy"),
        },
      },
    }
  );
  if (entry) {
    res.redirect(entry.redirectUrl);
  } else {
    console.log("URL not found");
    res.status(400).send("URL not found");
  }
});

router.get("/analytics/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
    lastVisit: result.visitHistory[result.visitHistory.length - 1],
  });
});

module.exports = router;
