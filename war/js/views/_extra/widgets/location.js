var $_GET = {};

document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function ()
{
  function decode(s)
  {
  	return decodeURIComponent(s.split("+").join(" "));
  }
  $_GET[decode(arguments[1])] = decode(arguments[2]);
});

function initialize()
{
  var myOptions = {
    zoom: 15,
    //center: new google.maps.LatLng(51.92721355524459,4.536414742469788),
    center: new google.maps.LatLng($_GET["latitude"], $_GET["longitude"]),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  
  var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

  //var image = 'img/icon_marker.png';
  
  //var myLatLng = new google.maps.LatLng(51.92721355524459,4.536414742469788);
  var myLatLng = new google.maps.LatLng($_GET["latitude"], $_GET["longitude"]);
  
  var beachMarker = new google.maps.Marker(
  {
	  position: myLatLng,
	  map: map
	  //icon: image
  });
}