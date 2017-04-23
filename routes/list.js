var express = require('express');
var player = require('../lib/play.js');

var router = express.Router();

router.get('/', function(req, res){
  res.send(JSON.stringify(player.list()));
});

router.post('/', function(req, res) {

  console.log(req.body);
  var name = req.body.name;
  player.add('songs/'+name);
  res.send("ok");
});


module.exports = router;
