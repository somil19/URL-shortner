//statefull authentication using sessionId
//const sessionIdUserMap = new Map(); //map data structure to store session id and user
// function setUser(id, user) {
//   // sessionIdUserMap.set(id, user);
// }
// function getUser(id) {
//   return sessionIdUserMap.get(id);
// }

//stateless authentication using JWT token
const jwt = require("jsonwebtoken");
const secret = "som@19";
function setUser(user) {
  const payLoad = { _id: user.id, email: user.email };
  const token = jwt.sign(payLoad, secret); //generate a new JWT token
  console.log(token);
  return token;
}
function getUser(token) {
  if (!token) return null;
  return jwt.verify(token, secret); //verify the JWT token
}
module.exports = { setUser, getUser };
