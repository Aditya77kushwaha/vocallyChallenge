const app = require("./index.js");
const port = process.env.PORT || 8888;

app.listen(port, () => {
  console.log("Server running on port ", port);
});