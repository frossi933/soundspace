var express = require('express');
var player = require('../lib/play.js');

var router = express.Router();


router.get('/play', function(req, res){
  player.play();
  res.send("ok");
});

router.get('/pause', function(req, res){
  player.pause();
  res.send("ok");
});

router.get('/next', function(req, res){
  player.next();
  res.send("ok");
});

router.get('/prev', function(req, res){
  player.prev();
  res.send("ok");
});

module.exports = router;
