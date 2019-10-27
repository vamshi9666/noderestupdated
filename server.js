const http = require("http");
const app = require("./app");
const port = process.env.PORT || 3000;
const server = http.createServer(app);
console.log("running");
server.listen(port, () => {
  console.log(" server runing on port ", port);
});
