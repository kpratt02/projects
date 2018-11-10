// Initialization of mongo
//This is my boot test
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var validator = require('validator'); 

//Twilio Credentials
var accountSid = 'AC75a01a0d4fe8e0a9b719572d4b157efe';
var authToken = '8c1ae0e40949674706ee33b8b7384e7f';
var twilio = require('twilio')(accountSid, authToken);

var app = express();
app.use(cors());
app.use(express.static(__dirname + '/views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

var mongoUri = process.env.MONGODB_URI || process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/fierce-mesa';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
});

//Test

app.use(express.static(__dirname + '/public'));

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


app.post('/add-event', function(req, res) {

    var food      = req.body.food,
        location  = req.body.location, //building 
        room      = req.body.room,
        /* TODO: these times should be changed to js objects
                 this means we have to change how they are inserted
                 on the submission form (as is they are just plaintext)
                 */

        timeS     = req.body.timeStart,
        timeE     = req.body.timeEnd

        console.log(timeS + ' ' + timeE);
        console.log(parseFloat(timeS));

        /* picture = picure TODO: implement picture support
                                  (or not if we have to pay for a mongo server
                                  space TBD) */
        comment   = req.body.comment,
        extraInfo = req.body.extraInfo;


       var cellnum = req.body.cellnum;
       var number = '+1' + cellnum.toString();
        twilio.messages.create({
             to: number,
             from: '+14158533420',
             body: 'Your event has been made! Use feedme with your friends! Contact us at 415-853-3420. Happy eating! When your event is live, see it at: https://frozen-depths-55905.herokuapp.com/map.html'
         })
         .then((message) => console.log("Message Sent"));


        //function infoValid()

    var eventObj = {"food": food, "location": location, "room": room,
                    "timeStart": timeS, "timeEnd": timeE, "comment": comment,
                    "extraInfo": extraInfo};

	  db.collection("events", function(error, collection){
		collection.insert( eventObj );
		//response.send (eventObj);
    res.redirect('back');
   
		// TODO: What really needs to be done is return the current list of 
		//       events.  However, you cannot do a res.send and a res.redirect
		//       the redirect is needed so the page just refreshes
		//       Ideally we can just return a string of the 'events' collection
    
		//res.redirect('back');
    //response.send("<script>window.location='https://fierce-mesa-12672.herokuapp.com/'</script>");
	});
});


var eventListAll = [];

//This should print out all the events. There needs to be an if clause that
//checks to see if the times are relevant
app.get('/print-events', function(request, response){

  var now = new Date();
  var eventList = [];
  currTime = now.getHours()-5 + ':' + now.getMinutes();

  console.log(currTime);

  db.collection('events', function(er, collection){
    collection.find().toArray(function(err,results){
      if (!err) {
        for (var count = 0; count < results.length; count++){

          if (results[count].timeStart <= currTime && results[count].timeEnd >= currTime){
            eventList.push(results[count]);
          }
          //TODO: Write something that checks for relevant info
        }
        response.send(eventList);
      }
    });
  });


/*

  db.collection('events', function(er, collection){
    collection.find().toArray(function(err,results){
      if (!err) {
        for (var count = 0; count < results.length; count++){

          if (results[count].timeStart <= currTime && results[count].timeEnd >= currTime){
            eventList.push(results[count]);
            //start here 
            var food = results[count].food;
            var location = results[count].location;
            var room = results[count].room;
            var timeStart = formatTime(results[count].timeStart);
            var timeEnd = formatTime(results[count].timeEnd);
            var xtrainfo = results[count].extraInfo;
            var toOutput = "Food: " + food;
            if (location != null){
             toOutput +=  "  Location: " + location;
            }
            if (room != null){
              toOutput += "  Room: " + room;
             }
            toOutput += " from " + timeStart + " until " + timeEnd + "; come and get it!";
            if (xtrainfo != null && xtrainfo != ""){
              toOutput += "   Extra Info: " + xtrainfo;
            }
            eventList.push(toOutput);
          }
          //TODO: Write something that checks for relevant info
        }
        response.send(eventList);
      }
    });
  });
*/


//converts 24 hr time to 12 hr for user legibility
function formatTime(timeIn){
  var tmpArr = timeIn.split(':'), timeOut;
  if(+tmpArr[0] == 12) {
    timeOut = tmpArr[0] + ':' + tmpArr[1] + ' PM';
  } else {
    if(+tmpArr[0] == 00) {
      timeOut = '12:' + tmpArr[1] + ' AM';
    } else {
      if(+tmpArr[0] > 12) {
      timeOut = (+tmpArr[0]-12) + ':' + tmpArr[1] + ' PM';
    } else {
      timeOut = (+tmpArr[0]) + ':' + tmpArr[1] + ' AM';
    }
    }
    }
  return timeOut;
}

});




app.get('/see-all-events', function(request, response){

  db.collection('events', function(er, collection){
    collection.find().toArray(function(err,results){
      eventListAll = [];
      if (!err) {
        for (var count = 0; count < results.length; count++){

            eventListAll.push(results[count]);
                
          //TODO: Write something that checks for relevant info
        }

        response.send(eventListAll);
      }

    });
  });
});

app.post('/print', function(request, response){

  var now = new Date();
  var eventList = [];
  currTime = now.getHours()-5 + ':' + now.getMinutes();

  console.log(currTime);

  db.collection('events', function(er, collection){
    collection.find().toArray(function(err,results){
      if (!err) {
        for (var count = 0; count < results.length; count++){

          //if (results[count].timeStart <= currTime && results[count].timeEnd >= currTime){
            eventList.push(results[count]);
          //}
        }
        response.send(eventList);
      }
    });
  });
});

app.get('/prints', function(request, response){

  var now = new Date();
  var eventList = [];
  currTime = now.getHours()-5 + ':' + now.getMinutes();

  console.log(currTime);

  db.collection('events', function(er, collection){
    collection.find().toArray(function(err,results){
      if (!err) {
        for (var count = 0; count < results.length; count++){

          //if (results[count].timeStart <= currTime && results[count].timeEnd >= currTime){
            eventList.push(results[count]);
          //}
        }
        response.send(eventList);
      }
    });
  });
});


//proof of concept geolocations
// TODO: hard code all academic and res buildings on campus
//       or at least enough to get the point accross
var building_locations =
{
	"TischLibrary" : {"lat":42.406204, "lng":-71.118877},
	"Halligan" : {"lat":42.408215, "lng":-71.116240},
	"574" : {"lat":42.403515, "lng":-71.113987},
  "CampusCenter" : {"lat":42.405700, "lng":-71.119791},
  "Carm" : {"lat":42.409489, "lng":-71.122417},
  "PrezLawn" : {"lat":42.407049, "lng":-71.120636},
  "Dewick" : {"lat":42.405327, "lng":-71.121081},
  "TischGym" : {"lat":42.409026, "lng":-71.115491},
  "SEC" : {"lat":42.405984, "lng":-71.116886},
  "SoGo" : {"lat":42.404970, "lng":-71.118651},

};


//function geolocation_of_building (building) 
//{
	//building_locations[building];
//}

//TODO Add support so the page refreshes to the page where there is an 
//     updated list of all the events
/* This can be accomplished in one of two ways, we either integrate one mongo 
   intance into all .js files (seems kinda hacky and we need to mess with 
   nodejs dependencies) or we pass a lot of strings around from file to file

   I dont know how to send a string (string being json object of all the 
   events) to the index page from here.  So we might have to hardcode the 
   index.html file into app.get('/').  But thats a pretty gross solution

   These problems all come from the fact that mongo is initiated here, but 
   the same mongo object has to be referenced in create_map.js and 
   javascript doesnt reealy do class inherentence 
   */
app.get('/', function(request, response) {
    console.log("in / get function");
    
    response.render('index');
    console.log(eventListAll);
    response.send(eventListAll);

});

app.get('/index', function(request, response) {
  response.render('index');
})
app.get('/map', function (request, response) {
    response.render('map');
});

app.get('/event', function(request, response) {
    response.render('event');
});






app.post('/', function(request, response){
 db.collection('events', function(er, collection){
    collection.find().toArray(function(err,results){
      response.send(results);
    });
  });
});

app.get('/checkin', function(request, response) {
  
  var createdAt = Date();

  db.collection("checkin", function(error, collection){
    collection.insert({"createdAt":createdAt})
  });

  response.redirect('back');
  //response.send("<script>window.location='https://fierce-mesa-12672.herokuapp.com/'</script>");
});

app.get('/sms', function(request, response) {
     twilio.messages

     //user = request.body.phone
         .create({
             to: '+16512605777',
             from: '+14158533420',
             body: 'It worked, twilio = life'
         })
         .then((message) => console.log("didn't work"));
 });

/* TODO: add a passive mongo listener that will send email reminders to people */
/* TODO: add a heroku app */
/* TODO: add event markers (graphics) */
/* TODO: make the markers have all the relevant information 
             -This really comes down to fixing the index page so it is 
              connected with the mongo data base (see above) */
/* TODO (stretch): integrate current location with google maps so that we just 
                   pull up google maps to show directions */
/* TODO (last): make the website actually look half professional */

app.listen(process.env.PORT || 3000);