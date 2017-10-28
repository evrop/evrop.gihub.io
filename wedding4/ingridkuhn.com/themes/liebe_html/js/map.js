   $(document).ready(function () {

   			var addMarker = function(map, lat, lng, title) {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(lat, lng),
                    map: map,
                    title: title
                });

                (new google.maps.InfoWindow({
                    content: title
                })).open(map, marker);
            };

		   //Google Map

			var mapCanvas = document.getElementById('map-canvas');
			var mapOptions = {
				zoom: 12,
				scrollwheel: false,
				center: new google.maps.LatLng(50.431486, 30.432574),
                styles: [
                    {
                        "featureType": "landscape",
                        "elementType": "all",
                        "stylers": [{"visibility": "on"}, {"color": "#cacdcf"}, {"lightness": "60"}]
                    },
                    {"featureType": "landscape.man_made", "elementType": "all", "stylers": [{"visibility": "off"}]},
                    {"featureType": "poi.attraction", "elementType": "all", "stylers": [{"visibility": "off"}]},
                    {"featureType": "poi.business", "elementType": "all", "stylers": [{"visibility": "off"}]},
                    {"featureType": "poi.government", "elementType": "all", "stylers": [{"visibility": "off"}]},
                    {"featureType": "poi.medical", "elementType": "all", "stylers": [{"visibility": "off"}]},
                    {"featureType": "poi.park", "elementType": "geometry", "stylers": [{"color": "#dbe5ba"}]},
                    {"featureType": "poi.place_of_worship", "elementType": "all", "stylers": [{"visibility": "off"}]},
                    {"featureType": "road", "elementType": "geometry", "stylers": [{"visibility": "simplified"}]},
                    {"featureType": "transit.line", "elementType": "all", "stylers": [{"visibility": "simplified"}]},
                    {"featureType": "water", "elementType": "all", "stylers": [{"color": "#b5dbef"}]}]
			};
			var map = new google.maps.Map(mapCanvas, mapOptions);
			addMarker(map, 50.408442, 30.378427, 'Ресторан');
			addMarker(map, 50.448589, 30.478210, 'ЗАГС');
			addMarker(map, 50.460347, 30.357631, 'Место встречи');
		});
