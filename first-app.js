const http = require("http");

const server = http.createServer((req, res) => {
  res.write("Hello Ankit");
  res.end(0);
});

server.listen(3000);
