const port = 3000

const express = require("express"),
      Promise = require("bluebird"),
      http = require("http"),
      fs = require("fs"),
      path = require("path"),
      { spawn } = require('child_process'),
      isWin = process.platform === "win32",
      assetsRoot = path.join(__dirname, "..");

function render(assets,orig_file) {
  let file = path.join(assets, orig_file);
  return function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    return res.send(fs.readFileSync(file));
  };
};

function webpack() {  
  if (isWin) {
    return spawn('cmd', ['/s','/c',path.join(__dirname,"node_modules/.bin/webpack"), '--progress', '--colors', '--watch'], {
      env: process.env,
      stdio: "inherit"
    });
  } else {
    return spawn(path.join(__dirname,"node_modules/.bin/webpack"), ['--progress', '--colors', '--watch'], {
      env: process.env,
      stdio: "inherit"
    });    
  }
    
}

async function start() {
  let app = express()
  app.set("env", process.env.NODE_ENV);
  app.set("port", port);
  app.disable('x-powered-by');
  let server = http.createServer(app)
  let assets = path.join(assetsRoot,"react/dist")
  app.use("/assets", express["static"](path.join(assets, "assets")));
  let page = render(assets,"index.html");
  app.use("/markup", express["static"](path.join(assetsRoot, "markup")));
  app.use("/",page);

  let listen = Promise.promisify(server.listen,{context: server})
  await listen(port)    
  console.log("static listening at",port)
  if (process.env.RUN_WEBPACK == 1) webpack();
}

start()