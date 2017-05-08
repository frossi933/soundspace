var express = require('express');
var player = require('../lib/play.js');

var router = express.Router();

var openConnections = [];
var idMsg = 0;

player.eventEmitter.on("listUpdated", function(){
  openConnections.forEach(writeListData);
});

var writeListData = function(resp) {
    resp.write('id: ' + (idMsg++) + '\n');
    resp.write('data:' + JSON.stringify(player.playlist()) +   '\n\n');
};

// simple route to register the clients
router.get('/', function(req, res) {

    // disable timeout
    req.socket.setTimeout(0);

    // send headers for event-stream connection
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    res.write('\n');

    openConnections.push(res);
    writeListData(res);
    // When the request is closed, e.g. the browser window
    // is closed. We search through the open connections
    // array and remove this connection.
    req.on("close", function() {
        var toRemove;
        for (var j =0 ; j < openConnections.length ; j++) {
            if (openConnections[j] == res) {
                toRemove =j;
                break;
            }
        }
        openConnections.splice(j,1);
    });
});

router.post('/', function(req, res) {
  console.log(req.body);
  player.add('songs/'+req.body.name, req.body.time);
  res.send("ok");
});


module.exports = router;
