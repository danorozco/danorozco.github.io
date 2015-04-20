var ViewModel = function(map, request, fsFullUrl) {

	var self = this

	self.obsLocArray = ko.observableArray([]);

	var locArray = [];

	this.locArrays = [];

	var markers = [];

	var infowindow = new google.maps.InfoWindow();
	
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
  			setMarkers(location);
  		}

		$('#searchBar').bind('keyup', function(e) {

		self.obsLocArray.removeAll();
		for (var i = 0; i < markers.length; i++) {
    		markers[i].setMap(null);
    	}
    	markers.length = 0;

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

		function setMarkers(location) {
			var marker = new google.maps.Marker({
				position: location.location,
				map: map,
				title: location.name,
			});
			  google.maps.event.addListener(marker, 'click', function() {
			  self.showInfoWindow(location);});
			markers.push(marker);
		}
	}


	function testx(){
		console.log("xyz");
	}

	self.setMarkerAnimation = function(loc) {
		var marker = (markers[self.obsLocArray().indexOf(loc)]);
		marker.setAnimation(google.maps.Animation.BOUNCE);
	}

	self.resetMarkerAnimation = function(){
		for (var i =0; i < markers.length; i++){
			markers[i].setAnimation(null);
		}
	}

	self.showInfoWindow = function(loc) {
		var marker = (markers[self.obsLocArray().indexOf(loc)]);
		var test2 = '';

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
					'</div>'+
					'<div class="fsAsset">' + 
						'<img src="img/fs.png" height=17 width=100>' + 
					'</div>' + 
				'</div>'
			infowindow.setContent(winHTML);
			infowindow.open(map,marker);
			for (var i = 0; i < markers.length; i++) {
			 	markers[i].setIcon();
			 };
			 marker.setIcon('img/marker_green.png');			
        }).fail (function(){
        	infowindow.setContent('<h4>Four Square Info NA</h4>')
        	infowindow.open(map,marker);
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
	var fsLL = '41.948438,-87.655333&v=20150339'

	var fsFullUrl = fsURL + 'client_id=' + fsClientID + '&client_secret=' + fsClientSecret + '&ll=' + fsLL + '&v=' + fsVersion + '&m=' + fsM;

	ko.applyBindings(new ViewModel(map, request, fsFullUrl));
}

google.maps.event.addDomListener(window, 'load', initialize);