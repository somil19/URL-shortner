const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { connectToMongoDb } = require("./connect");
const { restrictToLoggedInUserOnly, checkAuth } = require("./middleware/auth");
const app = express();
const PORT = 8005;
const urlRouter = require("./routes/url");
const URL = require("./models/url");
const statiRouter = require("./routes/staticRouter"); //importing staticRouter
const userRoute = require("./routes/user");
const path = require("path");
connectToMongoDb("mongodb://127.0.0.1:27017/urlShortner")
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());
app.use("/", checkAuth, statiRouter);
app.use("/url", restrictToLoggedInUserOnly, urlRouter); //if we send a request to /url it will go to urlRouter and the rest of the path will be handled by urlRouter
app.use("/user", userRoute);
//Now its time to do server side rendering using ejs (means we are now connecting UI to the server)
//One way is to do it with express but this is not the best way
/*app.use("/url/", async (req, res) => {
  const urls = await URL.find({});
  const htmlResponse = `
      <html>
        <head>
          <title>URL Shortener</title>
        </head>
        <body>
          <h1>URL Shortener</h1>
          <ul>
            ${urls
              .map(
                (url) =>
                  `<li>${url.shortId}-${url.redirectUrl}-${url.visitHistory}</li>`
              )
              .join("")}
          </ul>
        </body>
      </html>
    `;
  res.send(htmlResponse);
});*/

//Now using ejs
app.set("view engine", "ejs"); // setting the view engine to ejs

app.set("views", path.resolve("./views")); // setting the views folder to views/ejs

app.get("/test", async (req, res) => {
  const urls = await URL.find({});
  return res.render("home", {
    url: urls,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
