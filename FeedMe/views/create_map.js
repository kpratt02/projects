var myLat = 0;
var myLng = 0;
var request = new XMLHttpRequest();
var me = new google.maps.LatLng(myLat, myLng);
var myOptions = {
	zoom: 15, // The larger the zoom number, the bigger the zoom
	center: me,
	mapTypeId: google.maps.MapTypeId.ROADMAP
};
var map;
var marker;
var infowindow = new google.maps.InfoWindow();
var rectangle = new google.maps.Rectangle();
var lookup = [];
lookup.push("hello");
var markers = [];
markers.push("hello");



function init()
{
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	getMyLocation();
}

function getMyLocation() {
	if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
		navigator.geolocation.getCurrentPosition(function(position) {
			myLat = position.coords.latitude;
			myLng = position.coords.longitude;
			renderMap();
		});
	}
	else {
		alert("Geolocation is not supported by your web browser.  What a shame!");
	}
}

function renderMap()
{
	me = new google.maps.LatLng(myLat, myLng);
	
	// Update map and go there...
	map.panTo(me);
	
	// Create a marker
	marker = new google.maps.Marker({
		position: me,
		title: "Your Location"
	});
	marker.setMap(map);
		
	// Open info window on click of marker
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(marker.title);
		infowindow.open(map, marker);
	});

	placeEvents();

}

function placeEvents(){
    var sendIt = new XMLHttpRequest();
    var url = "https://frozen-depths-55905.herokuapp.com/print";
    sendIt.open("POST", url, true);

    sendIt.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    sendIt.send();
    sendIt.onreadystatechange = function()
    {
        if (sendIt.readyState == 4 && sendIt.status == 200)
        {
            rawData = sendIt.responseText;
            events = JSON.parse(rawData);
            eventss = JSON.parse(rawData);
            format_events(eventss);
            for (count = 0; count < events.length; count++){
                var food = events[count].food;
                var location = events[count].location;
                if (location == null){
                    console.log("not added");
                    continue;
                }
                var room = events[count].room;
                var timeStart = events[count].timeStart;
                var timeEnd = events[count].timeEnd;
                var xtrainfo = events[count].extraInfo;
                var position = isLocationFree(location);
                var infoContent = "";
                if (position == 0){
                    infoContent += '<div id="content"><div id="siteNotice"></div><h1 id="firstHeading" class="firstHeading">'
                        + location + '</h1></div>';
                }
                else{
                    infoContent += '<h1 id="firstHeading" class="firstHeading">' + "Also Here: " + '</h1>';
                }
                infoContent += '<p>' + "Food: " + food + '</p>';
                infoContent += '<p>' + "Room: " + room + '</p>';
                infoContent += '<p>' + "Start Time: " + formatTime(timeStart) + '</p>';
                infoContent += '<p>' + "End Time: " + formatTime(timeEnd) + '</p>';
                infoContent += '<p>' + "Additional Information: " + xtrainfo + '</p>';
                if(position == 0){
                    markers.push(infoContent);
                }
                else {
                    var oldWindow = markers[position];
                    oldWindow += infoContent;
                    markers[position] = oldWindow;
                }
            }
            for (count = 1; count < lookup.length; count++){
                    var infoText = markers[count] 
                    infoText += '</div>';
                    var newInfoWindow = new google.maps.InfoWindow ({
                        content: infoText
                    });
                    var newMarker = new google.maps.Marker({
                        position: geolocation_of_building(lookup[count]),
                        icon: 'FMsmall.png',
                        map: map,
                        title: location,
                        infowindow: newInfoWindow
                    });
                    google.maps.event.addListener(newMarker, 'click', function() {
                        this.infowindow.open(map, this);
                    }); 
                newMarker.setMap(map);
            }
        }
    }
}

/*
function placeEvents()
{
	var sendIt = new XMLHttpRequest();
	var url = "https://frozen-depths-55905.herokuapp.com/print";
	
	sendIt.open("POST", url, true);
	sendIt.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	

	sendIt.send();
	sendIt.onreadystatechange = function()
	{
		if (sendIt.readyState == 4 && sendIt.status == 200)
		{
			rawData = sendIt.responseText;
			events = JSON.parse(rawData);
			eventss = JSON.parse(rawData);
			format_events(eventss);

			for (count = 0; count < events.length; count++)
			{
				var food = events[count].food;
            	var location = events[count].location;
           	 	var room = events[count].room;
            	var timeStart = events[count].timeStart;
            	var timeEnd = events[count].timeEnd;
            	var xtrainfo = events[count].extraInfo;
				var infoContent = '<div id="content"><div id="siteNotice"></div><h1 id="firstHeading" class="firstHeading">'
									+ food + '</h1></div>';
				infoContent += '<div id="bodyContent"><p>' + "Location: " + location + '</p>';
				infoContent += '<p>' + "Room: " + room + '</p>';
				infoContent += '<p>' + "Start Time: " + formatTime(timeStart) + '</p>';
				infoContent += '<p>' + "End Time: " + formatTime(timeEnd) + '</p>';
				infoContent += '<p>' + "Additional Information: " + xtrainfo + '</p></div>';
				var newInfoWindow = new google.maps.InfoWindow ({
					content:infoContent
				});
    			var newMarker = new google.maps.Marker({
        			position: geolocation_of_building(location),
        			icon: 'FMsmall.png',
        			map: map,
        			title: events[count].food,
        			infowindow: newInfoWindow
  				});
				google.maps.event.addListener(newMarker, 'click', function() {
					this.infowindow.open(map, this);
				});
  				newMarker.setMap(map);
			}
		}
	}
}
*/


function format_events (all_events)
{
    var len = all_events.length;
    var toprint = "";
    for (i = 0; i < len; i++) {
        if (all_events[i] != null) {
            var groupings = [];
            groupings.push(all_events[i]);
            var build = all_events[i].location;
            delete all_events[i];
            for (j = i + 1; j < len; j++) {
                if (all_events[i] != null) {
                    if (build == all_events[j].location) {
                        groupings.push(all_events);
                        delete all_events[j]
                    }
                }
            }
            toprint += print_grouping(groupings);
        }
    }
 
 
    document.getElementById('list_of_event').innerHTML = toprint;
 
}

/*
function format_events (all_events) {
    var h = new Object();
    h["TischLibrary"] = '<div id="content">';
    h["Halligan"] = '<div id="content">';
    h["574"]= '<div id="content">';
    h["CampusCenter"]= '<div id="content">';
    h["Carm"]= '<div id="content">';
    h["PrezLawns"]= '<div id="content">';
    h["Dewick"]= '<div id="content">';
    h["TischGym"]= '<div id="content">';
    h["SEC"]= '<div id="content">';
    h["SoGo"]= '<div id="content">';
 
    var curString = "";
    for (i = 0; i < all_events.length; i++) {
       
        var food = all_events[i].food;
        var location = all_events[i].location;  
        var room = all_events[i].room;
        var timeStart = all_events[i].timeStart;
        var timeEnd = all_events[i].timeEnd;
        var xtrainfo = all_events[i].extraInfo;
 
 
        curString = h["" + all_events[i].location];
        console.log(curString);
        if (curString == '<div id="content">') {
            curString += '<div id="siteNotice"></div><h1 id="firstHeading" class="firstHeading">'
                            + location + '</h1></div>';
            curString += '<div id="bodyContent"><p>' + "Food: " + food + '</p>';
            curString += '<p>' + "Room: " + room + '</p>';
            curString += '<p>' + "Start Time: " + timeStart + '</p>';
            curString += '<p>' + "End Time: " + timeEnd + '</p>';
            curString += '<p>' + "Additional Information: " + xtrainfo + '</p>';
            h[all_events[i]] = curString           
        } else {
            curString += '<div id="bodyContent"><p>' + "Food: " + food + '</p>';
            curString += '<p>' + "Room: " + room + '</p>';
            curString += '<p>' + "Start Time: " + timeStart + '</p>';
            curString += '<p>' + "End Time: " + timeEnd + '</p>';
            curString += '<p>' + "Additional Information: " + xtrainfo + '</p>';
        }
    }
 
    for (i in h) {
        if (h[i] == '<div id="content">') {
            h[i] = "";
        } else {
        	console.log ("else");
            h[i] += '</div>'
        }
    }

    var printString = "";
    for (i in h) {
        printString += h[i];
        console.log(h[i]);
    }
    document.getElementById('list_of_event').innerHTML = printString;

 
}*/

 
function print_grouping (groupings) {
    var infoContent = "";
    for (i in groupings) {
        var food = groupings[i].food;
        var location = groupings[i].location;  
        var room = groupings[i].room;
        var timeStart = groupings[i].timeStart;
        var timeEnd = groupings[i].timeEnd;
        var xtrainfo = groupings[i].extraInfo;
 
        infoContent = '<div id="content"><div id="siteNotice"></div><h1 id="firstHeading" class="firstHeading">'
                        + location + '</h1></div>';
        infoContent += '<div id="bodyContent"><p>' + "Food: " + food + '</p>';
        infoContent += '<p>' + "Room: " + room + '</p>';
        infoContent += '<p>' + "Start Time: " + formatTime(timeStart) + '</p>';
        infoContent += '<p>' + "End Time: " + formatTime(timeEnd) + '</p>';
        infoContent += '<p>' + "Additional Information: " + xtrainfo + '</p></div>'
    }
 
    //TODO send this
    return infoContent;
}


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


function geolocation_of_building (building) 
{
	var latLng = building_locations[building];
	return latLng;
}


function isLocationFree(search) {
    var i;
    for (i = 0; i < lookup.length; i++){
        if (lookup[i] == search){
            return i;
        }
    }
    lookup.push(search);
    return 0;
}



























