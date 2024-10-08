var map = L.map("map", {
  center: [18.56, 73.81],
  zoom: 14,
  minZoom: 11,
  maxZoom: 20,
  boxZoom: true,
  trackResize: true,
  wheelPxPerZoomLevel: 40,
  zoomAnimation: true
});

map.on("zoomend", function() {
  if (map.getZoom() > 17.2) {
    if (!map.hasLayer( googleSat)) {
      map.removeLayer(stamen);
      map.addLayer( googleSat);
    }
  } else {
    if (!map.hasLayer(stamen)) {
      map.removeLayer( googleSat  );
      map.addLayer(stamen);
    }
  }
}); 

var googleSat = L.tileLayer(
  "http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
  {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"]
  }
);

var stamen = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
).addTo(map);

var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");

var Esri_WorldImagery = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
);

var Assets= L.tileLayer.wms("https://iwmsgis.pmc.gov.in/geoserver/PMC_test/wms", {
  layers: "Assets",
  // layers: "plotboundary",
  format: "image/png",
  transparent: true,
  tiled: true,
  version: "1.1.0",
  opacity: 1
}).addTo(map);

// var Revenue_Layer = L.tileLayer.wms("https://iwmsgis.pmc.gov.in/geoserver/PMC_test/wms", {
//   layers: "Revenue_1",
//   format: "image/png",
//   transparent: true,
//   tiled: true,
//   version: "1.1.0",
//   opacity: 1
// });

var Revenue_Layer1 = L.tileLayer.wms("https://iwmsgis.pmc.gov.in/geoserver/pmc/wms", {
  layers: "Revenue",
  format: "image/png",
  transparent: true,
  tiled: true,
  version: "1.1.0",
  opacity: 1
}).addTo(map);

// var PLU_Layer = L.tileLayer.wms("https://iwmsgis.pmc.gov.in/geoserver/PMC_test/wms", {
//   layers: "PLU_Ward",
//   format: "image/png",
//   transparent: true,
//   tiled: true,
//   version: "1.1.0",
//   opacity: 1
// });

// var DPRoad_Layer = L.tileLayer.wms("https://iwmsgis.pmc.gov.in/geoserver/PMC_test/wms", {
//   layers: "DP_Ward_Road",
//   format: "image/png",
//   transparent: true,
//   tiled: true,
//   version: "1.1.0",
//   opacity: 1
// });

var Boundary_Layer = L.tileLayer.wms("https://iwmsgis.pmc.gov.in/geoserver/pmc/wms", {
  layers: "PMC_Boundary",
  format: "image/png",
  transparent: true,
  tiled: true,
  version: "1.1.0",
  opacity: 1
}).addTo(map);

var Village_Boundary = L.tileLayer.wms("https://iwmsgis.pmc.gov.in/geoserver/pmc/wms", {
  layers: "Village_Boundary",
  format: "image/png",
  transparent: true,
  tiled: true,
  version: "1.1.0",
  opacity: 1
}).addTo(map);



// var Village_Boundary1 = L.tileLayer.wms("https://iwmsgis.pmc.gov.in/geoserver/PMC_test/wms", {
//   layers: "Village_Boundary1",
//   format: "image/png",
//   transparent: true,
//   tiled: true,
//   version: "1.1.0",
//   opacity: 1
// }).addTo(map);


//   var Plot_Layout = L.tileLayer.wms(
//   "https://iwmsgis.pmc.gov.in/geoserver/wms",
//   {
//     layers: "Plot_Layout",
//     format: "image/png",
//     transparent: true,
//     tiled: true,
//     version: "1.1.0",
//     maxZoom: 21,
//     opacity: 1,
//   }
// ).addTo(map);
// var Zone_layer = L.tileLayer.wms(
//   "https://iwmsgis.pmc.gov.in/geoserver/wms",
//   {
//     layers: "Zone_layer",
//     format: "image/png",
//     transparent: true,
//     tiled: true,
//     version: "1.1.0",
//     maxZoom: 21,
//     opacity: 1,
//   }
// ).addTo(map);

var baseLayers = {
  "OSM": osm,
  "Esri": Esri_WorldImagery,
  "Satellite": googleSat,
  "stamen": stamen,
};

var overlayLayers = {
  "Assets":  Assets,
  "Boundary": Boundary_Layer,
  "Village": Village_Boundary,
  // "Zone_layer":Zone_layer,
  // "Plot_Layout":Plot_Layout,
  "Revenue":Revenue_Layer1,
};

L.control.layers(baseLayers, overlayLayers).addTo(map);
