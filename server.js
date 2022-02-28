require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let urls = [];

app.get('/api/shorturl/:code', function(req, res) {
  res.redirect(urls[req.params["code"]]);
});

app.post("/api/shorturl",
  (req, res) => {
    const url = new URL(req.body.url);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      res.json({ error: 'invalid url' });
    }
    else {
      dns.lookup(url.hostname, (err, addresses) => {
        if (err) {
          res.json({ error: 'invalid url' });
        }
        //console.log('addresses: %j', addresses)
      });
  
      let code = urls.length;
      urls.push(req.body.url);
      res.json({ original_url: req.body.url, short_url: code });
    }
  }
);


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
