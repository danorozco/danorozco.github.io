

var ViewModel = function(map, request) {

	var self = this

	self.obsLocArray = ko.observableArray([]);

	var locArray = [];

	var markers = [];

	var infoWindows = [];
	
	service = new google.maps.places.PlacesService(map);
	service.nearbySearch(request, callback);

	function callback(results, status) {
  		if (status == google.maps.places.PlacesServiceStatus.OK) {
    		for (var i = 0; i < results.length; i++) {
      			var place = results[i];
				locArray.push({
					"name" : place.name,
					"location" : place.geometry.location,
					"locType" : place.types
      			});
    		}
  		}
  		var locArraryLength = 25
  		if (locArray.length > locArraryLength) { 
  			for (var i = locArraryLength; i < locArray.length; i++) {
  				locArray.splice(locArraryLength)
  			}
  		}
  		for (var i = 0; i < locArray.length; i++) {
  			self.obsLocArray.push(locArray[i]);
  			var location = locArray[i];
			var marker = new google.maps.Marker({
				position: location.location,
				map: map,
				title: location.name,
			});
			markers.push(marker);
  		}
	}

	function setMarkers(map, locArray) {
		for (var i = 0; i < locArray.length; i++){
			var location = locArray[i];
			var marker = new google.maps.Marker({
				position: location.location,
				map: map,
				title: location.name,
			});
		}

	}

	self.setMarkerAnimation = function(loc) {
		var marker = (markers[locArray.indexOf(loc)]);
		marker.setAnimation(google.maps.Animation.BOUNCE);
	}

	self.resetMarkerAnimation = function(){
		for (var i =0; i < markers.length; i++){
			markers[i].setAnimation(null);
		}
	}

	var infowindow = new google.maps.InfoWindow({
			content: "hello"
		});

	self.showInfoWindow = function(loc, fsFullUrl) {
		var marker = (markers[locArray.indexOf(loc)]);
		infowindow.setContent(loc.name);
		infowindow.open(map,marker);

        $.ajax({
            url: fsFullUrl,
            //type: 'GET',
            dataType: 'jsonp',
            contentType: 'application/json'
        });
    }
}


function initialize() {

	var zoomVal = 16;

	var initCenter = new google.maps.LatLng(41.948438, -87.655333);

	var mapOptions = {
		center: initCenter,
		zoom: zoomVal,
		maxZoom: zoomVal,
		minZoom: zoomVal,
		disableDefaultUI: true,
		scrollwheel: false,
		draggable: false
	};

	var map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);

	var request = {
		location: initCenter,
		radius : '500',
		types: ['restaurant','bar']
	};

	var fsURL = 'https://api.foursquare.com/v2/venues/search?';
	var fsClientID = '0VUR3DQX5PADBG3WECYJHU5NV22U1O33UA5A4UYK3ATIJGGQ';
	var fsClientSecret = '0SBDKS3055KICHE3Y5PLP00WFKYQFMRVAUCEGVHZ1WBAZGLK';
	var fsVersion = '20150329';
	var fsM = 'foursquare';
	var fsFullUrl = 'https://api.foursquare.com/v2/venues/search?client_id=0VUR3DQX5PADBG3WECYJHU5NV22U1O33UA5A4UYK3ATIJGGQ&client_secret=0SBDKS3055KICHE3Y5PLP00WFKYQFMRVAUCEGVHZ1WBAZGLK&ll=41.948438,-87.655333&v=20150339&m=foursquare';


	ko.applyBindings(new ViewModel(map, request));
}

google.maps.event.addDomListener(window, 'load', initialize);