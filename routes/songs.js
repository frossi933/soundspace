var fs = require('fs');
var multer = require('multer');
var express = require('express');
var mp3Duration = require('mp3-duration');


var router = express.Router();

var multerOpts = multer.diskStorage({
  destination : function(req, file, callback){
    callback(null, 'songs');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname)
  }
})

var upload = multer({ storage : multerOpts });

router.post('/', upload.single('song'), function(req, res) {

  var name = req.file.originalname;
  console.log("new file: "+name);
  res.redirect('/');
});

router.get('/', function(req,res){
  fs.readdir('songs/', function(err, files){

    var songs = [];

    files.forEach(function(file){
      mp3Duration('songs/'+file, function (err, duration) {
        if (err) return console.log(err.message);

        songs.push({ name : file , time : duration });
      });
    });

    setTimeout(function(){
      res.send(JSON.stringify(songs));
    }, 5000);

  })
});


module.exports = router;
