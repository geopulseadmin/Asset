var map, geojson;
const API_URL = "http://localhost/dashboard/";


var puneBounds = [
  [18.3959588740000299, 73.7333954610000433,], // Southwest coordinates (latitude, longitude)
  [18.6207124050000630, 74.0115263580000828]  // Northeast coordinates (latitude, longitude)
];

var map = L.map("map", {
  center:[18.52, 73.89],
  zoom: 12,
  minZoom: 10,
  maxZoom: 19,
  preferCanvas:true,
  boxZoom: true,
  trackResize: true,
  wheelPxPerZoomLevel: 40,
  zoomAnimation: true,
  zoomSnap: 0.2, 
  zoomDelta: 0.3, 
  maxBounds: puneBounds,
  fadeAnimation: true,
  zoomAnimationThreshold: 10,
  bounceAtZoomLimits: true,
  inertia: true      
});



var googleSat = L.tileLayer(
  "http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
  {
    maxZoom: 21,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }
).addTo(map);

var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom:19,
});

var Esri_WorldImagery = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    maxZoom:19.9,
  }
);
var baseLayers = {};

var MissingLink = L.tileLayer.wms(
  "https://portal.geopulsea.com/geoserver/MissingLinks/wms",
  {
    layers: "Missing_link",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    maxZoom: 21,
    opacity: 1,
  }
).addTo(map);
// .addTo(map);  zone:DP
var Missing_Links_buffer = L.tileLayer.wms(
  "https://portal.geopulsea.com/geoserver/MissingLinks/wms",
  {
    layers: "Missing_Links_buffer_",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    maxZoom: 21,
    opacity: 1,
  }
).addTo(map);
// var Revenue = L.tileLayer.wms(
//   "https://portal.geopulsea.com/geoserver/zone/wms",
//   {
//     layers: "Revenue",
//     format: "image/png",
//     transparent: true,
//     tiled: true,
//     version: "1.1.0",
//     maxZoom: 21,
//     opacity: 1,
//   }
// ).addTo(map);


var WMSlayers = {
  "OSM": osm,
  "Esri": Esri_WorldImagery,
  "Satellite": googleSat,
  Missing_Links_buffer:Missing_Links_buffer,
  MissingLink:MissingLink,
  // Revenue:Revenue,

};

var control = new L.control.layers(baseLayers, WMSlayers).addTo(map);
control.setPosition('topright');


