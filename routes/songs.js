var fs = require('fs');
var multer = require('multer');
var express = require('express');


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
});

router.get('/', function(req,res){
  fs.readdir('songs/', function(err, files){
    res.send(JSON.stringify(files));
  })
});


module.exports = router;
