let http = require("http");
let static = require("node-static");

let file = new static.Server("./public");

function accept(req, res) {
    file.serve(req, res);
}

http.createServer(accept).listen(8080);