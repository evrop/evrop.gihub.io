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
				center: new google.maps.LatLng(50.431486, 30.432574)
			};
			var map = new google.maps.Map(mapCanvas, mapOptions);
			addMarker(map, 50.408442, 30.378427, 'Ресторан');
			addMarker(map, 50.448589, 30.478210, 'ЗАГС');
		});
