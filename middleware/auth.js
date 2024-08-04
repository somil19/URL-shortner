const { getUser } = require("../service/auth");
async function restrictToLoggedInUserOnly(req, res, next) {
  try {
    const userUid = req.cookies?.uid;
    if (!userUid) {
      return res.redirect("/login"); // Redirect to login page if user is not logged in
    }
    const user = getUser(userUid);
    if (!user) {
      // If user credentials are invalid
      return res.redirect("/login");
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in restrictToLoggedInUserOnly middleware:", error);
    return res.status(500).send("Internal Server Error1");
  }
}
async function checkAuth(req, res, next) {
  try {
    const userUid = req.cookies?.uid;
    const user = getUser(userUid);
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in checkAuth middleware:", error);
    return res.status(500).send("Internal Server Error");
  }
}
module.exports = { restrictToLoggedInUserOnly, checkAuth };
