// Variable to keep track of legend visibility
var legendVisible = true;

// Add the manual legend control to the map
var legendControl = L.control({ position: "topleft" });

legendControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "info legend");

  // Manually define the layer names and their corresponding colors/icons
  var layers = [
    { name: "Assets", color: "#A9A9A9" }, // Gray for Assets
    { name: "Chawl Building", color: "#E74C3C" }, // Red for Chawl Building
    { name: "Commercial_Building", color: "#E67E22" }, // Orange
    { name: "Commercial_Land", color: "#F39C12" }, // Yellow-Orange
    { name: "Cremation_Ground", color: "#8E44AD" }, // Purple
    { name: "Culture_Center", color: "#3498DB" }, // Blue
    { name: "Education_School", color: "#1ABC9C" }, // Green-Bluegit pull origin asset

    { name: "Fire_Station", color: "#C0392B" }, // Dark Red
    { name: "Garden", color: "#27AE60" }, // Green
    { name: "Health_Center", color: "#2ECC71" }, // Light Green
    { name: "STP", color: "#2980B9" }, // Dark Blue
    { name: "type_asset is \"", color: "#34495E" }, // Dark Gray
  ];

  // Populate the legend manually
  // Populate the legend manually
div.innerHTML += "<strong>Assets</strong><hr style='border: none; height: 2px; background-color: red;'>";

layers.forEach(function (layer) {
  if (layer.color) {
    // Create a colored box and add a background color to the legend item
    div.innerHTML +=
      '<div style="background-color:;">' + // Red background for each item
      '<i style="background:' + layer.color + '; width: 17px; height: 17px; display: inline-block; margin-right: 8px;"></i>' +
      layer.name + 
      "</div>";
  }
});


  // Apply CSS for legend positioning and styling
  div.style.position = "fixed";
  div.style.width = "180px";
  div.style.backgroundColor = "white";
  // div.style.border = "2px solid #8AC0EE";
  div.style.padding = "10px";
  div.style.fontFamily = "Arial, sans-serif";
  div.style.fontSize = "13px";
  div.style.color = "#333";
  // div.style.top="5px";
  // div.style.borderRadius = "8px";
  div.style.maxHeight = "365px";
  // div.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";

  // Initially hide the legend
  div.style.display = "none";

  return div;
};

// Add the legend to the map
legendControl.addTo(map);

// -----------------------------------------------------
// Add collapsible button for showing/hiding the legend
var collapseButton = L.control({ position: "topleft" });

collapseButton.onAdd = function (map) {
  var button = L.DomUtil.create("button", "collapse-button");
  button.innerHTML = "<i class='fa-solid fa-list' style='color:#8AC0EE;'></i>"; // Icon for button

  // Apply button styling
  button.style.backgroundColor = "transparent";
  button.style.border = "none";
  button.style.cursor = "pointer";
  button.style.textAlign = "center";
  button.style.fontSize = "16px";

  // Toggle legend visibility when the button is clicked
  button.onclick = function () {
    var legendDiv = document.querySelector(".info.legend");

    if (legendDiv.style.display === "none") {
      legendDiv.style.display = "block"; // Show legend
      legendVisible = true; // Set visibility to true
    } else {
      legendDiv.style.display = "none"; // Hide legend
      legendVisible = false; // Set visibility to false
    }
  };

  return button;
};

// Add the toggle button to the map
collapseButton.addTo(map);

// Move the collapse button to the .col-1 div
document.querySelector('.col-1').appendChild(document.querySelector('.collapse-button'));

// -----------------------------------------------------
// North Image and scale

// Add scale to the map
L.control.scale().addTo(map);

// Create a custom control for the north arrow
var northArrowControl = L.Control.extend({
  options: {
    position: "bottomleft",
  },

  onAdd: function (map) {
    var container = L.DomUtil.create("div", "leaflet-bar leaflet-control");
    container.innerHTML = '<img src="png/002-cardinal-point.png" class="border-0;" alt="" style="width: 30px; height:50px; background-color: white;">';
    return container;
  },
});

// Add the north arrow to the map
map.addControl(new northArrowControl());

// -----------------------------------------------------
// Close legend when the map is clicked
map.on('click', function () {
  var legendDiv = document.querySelector(".info.legend");

  // Check if the legend is visible and hide it on map click
  if (legendVisible) {
    legendDiv.style.display = "none"; // Hide legend
    legendVisible = false; // Set visibility to false
  }
});
