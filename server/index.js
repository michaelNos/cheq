const express = require("express");
const https = require("https");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const _ = require("lodash");

const app = express();
const port = 3333;

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(cors());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: ""
});

connection.query("CREATE DATABASE IF NOT EXISTS cheq", err => {
  if (err) throw err;
  connection.query("USE cheq", err => {
    if (err) throw err;
    connection.query(
      "CREATE TABLE IF NOT EXISTS vasts(" +
        "id INT NOT NULL AUTO_INCREMENT," +
        "PRIMARY KEY(id)," +
        "vast_url VARCHAR(600)," +
        'position ENUM("top_left", "top_middle", "top_right", "middle_left", "middle_right", "bottom_left", "bottom_middle", "bottom_right") DEFAULT "bottom_right",' +
        "hide_ui tinyint(1) DEFAULT NULL" +
        ")",
      err => {
        if (err) throw err;
      }
    );
  });
});

app.post("/create_vast", (req, res) => {
  const body = req.body;
  console.log(body);
  var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

  if (!pattern.test(body.vastURL)) {
    res.send("Insert correct URL");
    return false;
  }

  if (typeof body.position !== "string") {
    res.send("Position must be a string");
    return false;
  }

  if (body.hideUI !== "false" && body.hideUI !== "true") {
    res.send("HideUI must be a boolean");
    return false;
  } else {
    body.hideUI = body.hideUI == "false" ? 0 : 1;
  }

  connection.query(
    "INSERT INTO vasts SET ?",
    _.mapKeys(body, (v, k) => _.snakeCase(k)),
    (err, result) => {
      if (err) throw err;
      res.send(body);
    }
  );
});

app.get("/fetch_vast", (req, res) => {
  connection.query("SELECT * FROM vasts WHERE id = " + req.query.id, function(
    err,
    result
  ) {
    if (err) {
      console.log("err", err);
      throw err;
    }

    if (!result.length) {
      res.set("Content-Type", "text/xml");
      res.send('<VAST version="2.0"></VAST>');
      return false;
    }

    https.get(result[0].vast_url, function(result) {
      var xml = "";

      result.on("data", function(chunk) {
        xml += chunk;
      });

      result.on("error", function(e) {
        callback(e, null);
      });

      result.on("timeout", function(e) {
        callback(e, null);
      });

      result.on("end", function() {
        res.set("Content-Type", "text/xml");
        res.send(xml);
        return xml;
      });
    });
  });
});

app.get("/fetch_vasts", (req, res) => {
  connection.query("SELECT * FROM vasts", function(err, result) {
    if (err) throw err;

    if (!result.length) {
      res.set("Content-Type", "text/xml");
      res.send([]);
      return false;
    }

    res.send(result);
  });
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
