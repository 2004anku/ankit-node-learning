const http = require("http");

const server = http.createServer((req, res) => {
  console.log(req.url);
  console.log(res.body);
  res.write("Hello Ankit");
  res.end(0);
});

server.listen(3000);
//  new section started form momday
