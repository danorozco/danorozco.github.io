// Knockout JS ViewModel
var ViewModel = function(map, request, fsFullUrl) {

	var self = this

	//Observable array populated with location that appear in side window in the view.
	self.obsLocArray = ko.observableArray([]);

	var locArray = [];

	var markers = [];

	//Google API for pop-up windows on map of selected locations.
	var infowindow = new google.maps.InfoWindow();

	//Google API for obtaining list of locations around specified neighborhood.
	//This becomes our 'destinations in the neighborhood' list.
	service = new google.maps.places.PlacesService(map);
	service.nearbySearch(request, callback);

	//Callback function for nearbySearch Google API.
	function callback(results, status) {
		//When status OK locArray gets populated the results from Google based on certain parameters.
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

		//Return list set to a max length.
		var locArraryLength = 25

		//Upon reaching the max length all locations are removed from array using splice method.
		if (locArray.length > locArraryLength) {
			for (var i = locArraryLength; i < locArray.length; i++) {
				locArray.splice(locArraryLength);
			}
		}

		//for loop cycles through locArray to obtain location to be sent to setMarker function.
		for (var i = 0; i < locArray.length; i++) {
			self.obsLocArray.push(locArray[i]);
			var location = locArray[i];
			setMarkers(location);
		}

		//Searchbar filter.  Filters the list based on entries in search bar.
		//Items that do not fit search criteria are filtered from list and markers are also removed for those locations.
		$('#searchBar').bind('keyup', function(e) {

			//observable array is cleared out and all markers are removed and will be re-populated from items in filtered list.
			self.obsLocArray.removeAll();
			for (var i = 0; i < markers.length; i++) {
				markers[i].setMap(null);
			}
			markers.length = 0;

			//Locations that match criteria when compared to search bar and locArray will be pushed back to observable array.
			//List is repopulated from observable array and markers are re-applied to map.
			//locArray is our master array of locations while observable array becomes our dynamic array for the View.
			var searchVal = $('#searchBar').val();
			for (var i = 0; i < locArray.length; i++) {
				var str = locArray[i].name.toLowerCase();
				if (str.indexOf(searchVal.toLowerCase()) > -1) {
					self.obsLocArray.push(locArray[i]);
					var location = locArray[i];
					setMarkers(location);
				}
			}
		});

		//setMarker function that applies the markers to the map based on locations passed into function.
		function setMarkers(location) {
			var marker = new google.maps.Marker({
				position: location.location,
				map: map,
				title: location.name,
			});
			google.maps.event.addListener(marker, 'click', function() {
				self.showInfoWindow(location);
			});
			markers.push(marker);
		}
	}

	//Google bouncing animation.  Activated when hovering over item on list.
	self.setMarkerAnimation = function(loc) {
		var marker = (markers[self.obsLocArray().indexOf(loc)]);
		marker.setAnimation(google.maps.Animation.BOUNCE);
	};

	//Google animation is set to null.  This setting to null occurs when mouse is no longer hovering over item in list.
	self.resetMarkerAnimation = function() {
		for (var i =0; i < markers.length; i++) {
			markers[i].setAnimation(null);
		}
	};

	//Info window that appears over each marker.
	self.showInfoWindow = function(loc) {
		var marker = (markers[self.obsLocArray().indexOf(loc)]);

		//ajax call to bring in information from FourSquare. 
		//FourSquare information is used to populate infowindow above markers.
		//When successful, HTML info is created and populates the infowindow box.
		//When failed, infowindow box indicates FourSquare data not available.
		$.ajax({
			url: fsFullUrl + '&query=' + loc.name,
		}).success (function(data){
			var venue = data.response.venues[0];
			var winHTML =
				'<div class="infoWindow">' +
					'<div>' +
						'<h3>' + venue.name + '</h3>' +
						'<p>' + venue.location.address + '</p>' +
						'<p class="checkIn">' + venue.hereNow.summary + '</p>' +
					'</div>' +
					'<div class="fsAsset">' +
						'<img src="img/fs.png" height=17 width=100>' +
					'</div>' +
				'</div>'
			//markers are reset to original color and selected marker set to green.
			for (var i = 0; i < markers.length; i++) {
				markers[i].setIcon();
			};
			marker.setIcon('img/marker_green.png');

			//info window set and opened.
			infowindow.setContent(winHTML);
			infowindow.open(map,marker);
		}).fail (function() {
			infowindow.setContent('<h4>Four Square Info NA</h4>')
			infowindow.open(map,marker);
		});
	};
};

//initialize function is called on window load.
function initialize() {

	//zoom value of map is set to 16. This value seems to be the optimal view for this application.
	var zoomVal = 16;

	//initial center used for center of map.  Wrigley Field (Wrigleyville neighborhood) is the set as the coordinates for neighborhood.
	var initCenter = new google.maps.LatLng(41.948438, -87.655333);

	//Map options used for the creation of the map in Google Maps API
	//zooming is disabled by setting max and min to zoomVal.
	//scrollwheel is disabled to not allow scrolling of zoom.
	//Default UI is disabled.
	//Map is draggable to help pan around the neighborhood.
	var mapOptions = {
		center: initCenter,
		zoom: zoomVal,
		maxZoom: zoomVal,
		minZoom: zoomVal,
		disableDefaultUI: true,
		scrollwheel: false,
		draggable: true
	};

	//Google API to create the map that is displayed in the View.
	var map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);

	//Request settings for the nearbysearch list. This list created is restaurants and bars within certain radius of Wrigley Field.
	var request = {
		location: initCenter,
		radius : '500',
		types: ['restaurant','bar']
	};


	//Foursquare credentials.
	var fsURL = 'https://api.foursquare.com/v2/venues/search?';
	var fsClientID = '0VUR3DQX5PADBG3WECYJHU5NV22U1O33UA5A4UYK3ATIJGGQ';
	var fsClientSecret = '0SBDKS3055KICHE3Y5PLP00WFKYQFMRVAUCEGVHZ1WBAZGLK';
	var fsVersion = '20150329';
	var fsM = 'foursquare';
	var fsLL = '41.948438,-87.655333&v=20150339'

	//Foursquare API Url constructed using the above FourSquare credentials.
	var fsFullUrl = fsURL + 'client_id=' + fsClientID + '&client_secret=' + fsClientSecret + '&ll=' + fsLL + '&v=' + fsVersion + '&m=' + fsM;

	//Apply Knockout JS bindings to the ViewModel function.  Passing Map, request, and fsFullUrl parameters.
	ko.applyBindings(new ViewModel(map, request, fsFullUrl));
};

//Initialize function is called after window is loaded with Google Map.
google.maps.event.addDomListener(window, 'load', initialize);