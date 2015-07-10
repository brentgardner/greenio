var restify = require('restify');
var mongojs = require('mongojs');

var ip_addr = '127.0.0.1';
var port = '8080';
var connection_string = '127.0.0.1:27017/greenio';
var db = mongojs(connection_string, ['greenio']);
var readings = db.collection("readings");

var server = restify.createServer({
  name : 'greenio'
});

server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());

var PATH = '/readings'
server.get({path : PATH , version : '0.0.1'} , findAllReadings);
server.get({path : PATH +'/:readingId' , version : '0.0.1'} , findReading);
server.post({path : PATH , version: '0.0.1'} ,postNewReading);
server.del({path : PATH +'/:readingId' , version: '0.0.1'} ,deleteReading);

server.listen(port, ip_addr, function(){
  console.log('%s listening at %s ', server.name, server.url);
});

/**
 * @api {get} /readings Request All Readings
 * @apiName findAllReadings
 * @apiGroup Readings
 *
 * @apiSuccess {Number} deviceId The numeric Id of the device transmitting the reading.
 * @apiSuccess {Date} readOn The Date and Time that the reading was made.
 * @apiSuccess {Number} ph The PH of the liquid mixture.
 * @apiSuccess {Number} airTemp The air Tempurature.
 * @apiSuccess {Number} liqTemp The liauid Tempurature.
 * @apiSuccess {Object} location The GPS cords of the device.
 * @apiSuccess {Date} postedOn The Date and Time that the reading was written.
 */
function findAllReadings(req, res , next){
    res.setHeader('Access-Control-Allow-Origin','*');
    readings.find().limit(20).sort({postedOn : -1} , function(err , success){
        console.log('Response success '+success);
        console.log('Response error '+err);
        if(success){
            res.send(200 , success);
            return next();
        }else{
            return next(err);
        }

    });

}

/**
 * @api {get} /readings/:id Request User information
 * @apiName postNewReading
 * @apiGroup Readings
 *
 * @apiParam {Number} _Id readings unique ID.
 *
 * @apiSuccess {Number} deviceId The numeric Id of the device transmitting the reading.
 * @apiSuccess {Date} readOn The Date and Time that the reading was made.
 * @apiSuccess {Number} ph The PH of the liquid mixture.
 * @apiSuccess {Number} airTemp The air Tempurature.
 * @apiSuccess {Number} liqTemp The liauid Tempurature.
 * @apiSuccess {Object} location The GPS cords of the device.
 * @apiSuccess {Date} postedOn The Date and Time that the reading was written.
 */
function findReading(req, res , next){
    res.setHeader('Access-Control-Allow-Origin','*');
    readings.findOne({_id:mongojs.ObjectId(req.params.jobId)} , function(err , success){
        console.log('Response success '+success);
        console.log('Response error '+err);
        if(success){
            res.send(200 , success);
            return next();
        }
        return next(err);
    })
}

/**
 * @api {post} /readings
 * @apiName postNewReading
 * @apiGroup Readings
 *
 * @apiParam {Object} reading object.
 *
 * @apiSuccess {String} _id The unique ID of the reading.
 * @apiSuccess {Number} deviceId The numeric Id of the device transmitting the reading.
 * @apiSuccess {Date} readOn The Date and Time that the reading was made.
 * @apiSuccess {Number} ph The PH of the liquid mixture.
 * @apiSuccess {Number} airTemp The air Tempurature.
 * @apiSuccess {Number} liqTemp The liauid Tempurature.
 * @apiSuccess {Object} location The GPS cords of the device.
 * @apiSuccess {Date} postedOn The Date and Time that the reading was written.
 */
function postNewReading(req , res , next){
    var Reading = {};
    reading.deviceId = req.params.deviceId;
    reading.readOn = req.params.readOn;
    reading.ph = req.params.ph;
    reading.airTemp = req.params.airTemp;
    reading.liqTemp = req.params.liqTemp;
    reading.location = req.params.location;
    reading.postedOn = new Date();

    res.setHeader('Access-Control-Allow-Origin','*');

    readings.save(reading , function(err , success){
        console.log('Response success '+success);
        console.log('Response error '+err);
        if(success){
            res.send(201 , reading);
            return next();
        }else{
            return next(err);
        }
    });
}

/**
 * @api {post} /readings
 * @apiName postNewReading
 * @apiGroup Readings
 *
 * @apiParam {String} readingId unique id of the reading.
 */
function deleteReading(req , res , next){
    res.setHeader('Access-Control-Allow-Origin','*');
    readings.remove({_id:mongojs.ObjectId(req.params.readingId)} , function(err , success){
        console.log('Response success '+success);
        console.log('Response error '+err);
        if(success){
            res.send(204);
            return next();
        } else{
            return next(err);
        }
    })

}
