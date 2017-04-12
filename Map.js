//variables for map and marks
var elevator;
var map;
// 2-level array for washed markets data
var washedData = [];



//init the google map in the webpage
function initMap() {

    //create the google map
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 41.85081542, lng: -87.69123528},
        zoom: 12
    });


    var infowindow = new google.maps.InfoWindow({
        content: ""
    });

    //create a new httprequest for this session
    var xmlhttp = new XMLHttpRequest();
    //json format data resource url
    var url = "https://data.cityofchicago.org/api/views/s6ha-ppgi/rows.json?accessType=DOWNLOAD";
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

    //once the request is accepted, process the fowllowing function to get data and complete the app information
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            //get the text content from the page response
            var myArr = xmlhttp.responseText;
            var text = myArr;
            json = JSON.parse(text);
            //alert(json.data[1][1]);
            //document.getElementById("id01").innerHTML = myArr;

            //
            //add the information of the markets here
            //
            for (var i = 0; i<100; i++) {
                var dataLine = [];
                dataLine.push(json.data[i][19]);
                dataLine.push(json.data[i][20]);
                dataLine.push(json.data[i][8]);

                washedData.push(dataLine);
            };
            //alert(washedData);
            //number of the markets
            var numberOfMarkets = washedData.length;

            //add markers on the map
            var markers = [];
            google.maps.event.addListener(map, 'idle', function() {
                // Create an ElevationService
                elevator = new google.maps.ElevationService();
                $.each(markers, function(key, value)
                {
                    value.setMap(null);
                });
                // getting bounds of current location
                var boundBox = map.getBounds();
                var southWest = boundBox.getSouthWest();
                var northEast = boundBox.getNorthEast();
                var locations = [];
                for (var j = 0; j < numberOfMarkets; j++)
                {
                    var location = new google.maps.LatLng(
                        southWest.lat() ,
                        southWest.lng()
                    );
                    locations.push(location);
                }

                // Create a LocationElevationRequest object using the array's one value
                var positionalRequest = {
                    'locations': locations
                };

                elevator.getElevationForLocations(positionalRequest, function(results, status)
                {
                    if (status === google.maps.ElevationStatus.OK)
                    {
                        //if the infowindow is open
                        var prev_infowindow =false;

                        $.each(results, function(key, value) {

                            //alert(key);
                            markers[key] = new google.maps.Marker({
                                position: {lat: Number(washedData[key][0]), lng: Number(washedData[key][1])},
                                map: map,
                                //icon: 'http://google-maps-icons.googlecode.com/files/red' + ('0' + key.toString()).slice(-2) + '.png'
                            });
                            google.maps.event.addListener(markers[key], 'click', function() {
                                //if another window is open, close it
                                if( prev_infowindow ) {
                                    prev_infowindow.close();
                                }
                                infowindow.setContent(washedData[key][2]);
                                infowindow.open(map, markers[key]);

                            });

                        });
                    }
                });

            });

        }
    };

}





