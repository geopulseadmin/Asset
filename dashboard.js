// var main_url = "https://iwmsgis.pmc.gov.in/geoserver/"
var main_url = "https://iwmsgis.pmc.gov.in/geoserver/"

// html page code ......................


function toggleFilter(label) {
  const input = label.nextElementSibling; // Get the input element next to the label
  const ul = input.nextElementSibling; // Get the ul element next to the input

  // Toggle 'active' class for the clicked filter input and its associated ul
  input.classList.toggle('active');
  ul.classList.toggle('active');
}

// Function to close filter groups when clicking outside
document.addEventListener('click', function (event) {
  if (!event.target.closest('.filter-group')) {
    document.querySelectorAll('.filter-input').forEach(filterInput => {
      filterInput.classList.remove('active');
      filterInput.nextElementSibling.classList.remove('active');
    });
  }
});

// Function to filter checkboxes based on search input
function filterCheckboxes(input) {
  const filter = input.value.toLowerCase();
  const ul = input.nextElementSibling;
  const li = ul.getElementsByTagName('li');

  for (let i = 0; i < li.length; i++) {
    const text = li[i].textContent || li[i].innerText;
    if (text.toLowerCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  // Add event listeners to filter inputs
  document.querySelectorAll('.filter-input').forEach(input => {
    input.addEventListener('input', function (event) {
      event.stopPropagation(); // Stop event propagation
      filterCheckboxes(this);
    });
    // Stop event propagation for click events on the input element
    input.addEventListener('click', function (event) {
      event.stopPropagation(); // Stop event propagation
    });
    // Stop event propagation for mousedown events on the input element to prevent the div from closing
    input.addEventListener('mousedown', function (event) {
      event.stopPropagation(); // Stop event propagation
    });
  });

  // Add event listeners to checkboxes to stop propagation
  document.querySelectorAll('.filter-group input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('click', function (event) {
      event.stopPropagation(); // Stop event propagation
    });
  });
});


// });

// toggleFilterend---------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  const filters = document.getElementById('filters');
  const map = document.getElementById('map');
  const tableBtn = document.getElementById('openTableBtn');
  const tableinfo = document.getElementById('tablecontainer');
  const button = document.getElementById('toggleFilters');
  const layerToggle = document.getElementById('layerToggle');
  const layersList = document.querySelector('.leaflet-control-layers-list');
  

  let filtersVisible = false;
  let layersVisible = false;
  

  button.addEventListener('click', function () {
    if (!filtersVisible) {
      map.classList.add('shifted'); // Move the map
      filters.classList.add('active');
      button.innerHTML = '<i class="fa-solid fa-filter"></i>';
           // Hide layers list when filters are visible
      if (layerToggle) {
        layersList.style.display = 'block'; // Hide layers list
        layersVisible = false;
      }
    } else {
      filters.classList.remove('active');
      map.classList.remove('shifted'); // Move the map back

     
      
      tableinfo.style.right = '10px'; // Adjusted position for tableinfo
      button.innerHTML = '<i class="fa-solid fa-filter"></i>';
    }
    filtersVisible = !filtersVisible;
  });
  if (layerToggle) {
    layerToggle.addEventListener('click', function (event) {
      event.preventDefault(); // Prevent default anchor behavior

      if (!layersVisible) {
        layersList.style.display = 'block'; // Show layers list
        // Hide filters when layers list is visible
        if (filtersVisible) {
          filters.classList.remove('active');
          map.classList.remove('shifted'); // Move the map back
          filtersVisible = false;
        }
      } else {
        layersList.style.display = 'none'; // Hide layers list
      }
      layersVisible = !layersVisible;
    });
  }

  
  
     window.closeFilters = function () {
                filters.classList.remove('active');
                map.classList.remove('shifted'); // Move the map back
                filtersVisible = false;
            }

            window.toggleFilter = function (element) {
              const icon = element.querySelector('.icon-container i');
              const input = element.nextElementSibling; // Input field
              const ul = input.nextElementSibling; // UL list
          
              // Check current display state
              const isListVisible = ul.style.display === 'block';
          
              // Toggle visibility based on the current state
              if (isListVisible) {
                  ul.style.display = 'none';
                  input.style.display = 'none'; // Hide the input field
                  icon.classList.remove('fa-angle-up');
                  icon.classList.add('fa-angle-down');
              } else {
                  ul.style.display = 'block';
                  input.style.display = 'block'; // Show the input field
                  icon.classList.remove('fa-angle-down');
                  icon.classList.add('fa-angle-up');
              }
          };
          
  // -------------------------------------------------------------------------

  // Ensure zoom control doesn't move
  const zoomControl = document.querySelector('.leaflet-control-zoom');
  if (zoomControl) {
    zoomControl.style.position = 'fixed';
  }
});



function updateTableStats(stats) {
  document.getElementById('tablestats').innerText = stats;
}



$(document).ready(function () {


  var cql_filter1 ='';


  // initializeCheckboxes();
//   function getCheckedValuess() {
//     var checkedValues = [];
//     var checkboxes = document.querySelectorAll("#checkboxContainer input[type='checkbox']:checked");
//     checkboxes.forEach(function(checkbox) {
//         checkedValues.push("'" + checkbox.value + "'"); // Push value wrapped in single quotes
//     });

//     if (checkedValues.length === 0) {
//         checkedValues.push("''"); // Push an empty string to simulate no results
//     }

//     return checkedValues;
// }


// document.getElementById("checkboxContainer").addEventListener("change", function() {
//     var checkedValues = getCheckedValuess();
   
    var filterString1 = "";

    loadinitialData(filterString1);
    // FilterAndZoom(filterString1)

  getCheckedValues(function (filterString) {
    console.log("Filter Stringinside: ", filterString1); 
    const mainfilter = combineFilters(filterString1, filterString);
    console.log("Filter Stringinside: ", mainfilter); 
    FilterAndZoom(mainfilter);
    DataTableFilter(mainfilter)
   

  // });
});




  


  function loadinitialData(cql_filter) {

    const filternames = ["reservatio", "name", "peth_name", "survey_no"];//accordn column names , if want add one more filter criteria add here
    var workspace = 'PMC_test';
    var layerName = 'Assets';
    filternames.forEach(function (filtername) {
      var url = `${main_url}${workspace}/wms?service=WFS&version=1.1.0&request=GetFeature&typeName=${layerName}&propertyName=${filtername}&outputFormat=application/json`;

        if (cql_filter) {
            url += `&cql_filter=${encodeURIComponent(cql_filter)}`;
         
        }
     
      $.getJSON(url, function (data) {
        var projectFiSet = new Set();
        var projectFiMap = new Map();

        // Iterate through the features and add non-null values to the set
        $.each(data.features, function (index, feature) {
          var column_name = feature.properties[filtername];
          if (column_name !== null && column_name !== "#N/A") {
            if (projectFiMap.has(column_name)) {
              // projectFiMap.set(column_name, projectFiMap.get(column_name) + 1);
              projectFiMap.set(column_name, (projectFiMap.get(column_name) || 0) + 1);
            } else {
              projectFiMap.set(column_name, 1);
            }
          }
        });
        var uniqueProjectFiList = Array.from(projectFiMap.entries()).map(([name, count]) => `${name} (${count})`);
        populateDropdown(filtername, uniqueProjectFiList);
      });
    });

    // FilterAndZoom(cql_filter)
  }

  // function combineFilters(cql_filter, filterString) {
  //   return `(${cql_filter}) AND (${filterString})`;
  // }


});


// function initializeCheckboxes() {
//   var columns = { "All": "All","Haveli": "Haveli", "Mawal": "Mawal", "Bhor": "Bhor", "Purandar": "Purandar", "Mulshi": "Mulshi", "Khed": "Khed", "Shirur": "Shirur" };
//   var checkboxContainer = document.getElementById("checkboxContainer");

//   // Clear any existing checkboxes
//   checkboxContainer.innerHTML = '';

//   // Populate checkboxContainer with checkboxes
//   for (var key in columns) {
//     if (columns.hasOwnProperty(key)) {
//       var checkboxDiv = document.createElement("div");
//       checkboxDiv.classList.add("form-check", "me-2"); // Adjust classes as per your styling needs

//       var checkboxInput = document.createElement("input");
//       checkboxInput.type = "checkbox";
//       checkboxInput.classList.add("form-check-input");
//       checkboxInput.id = key;
//       checkboxInput.value = key; // Use key as the value (e.g., Work_ID, Budget_Code)

//       var checkboxLabel = document.createElement("label");
//       checkboxLabel.classList.add("form-check-label");
//       checkboxLabel.setAttribute("for", key);
//       checkboxLabel.textContent = columns[key]; // Use columns[key] to get the column name

//       checkboxDiv.appendChild(checkboxInput);
//       checkboxDiv.appendChild(checkboxLabel);

//       checkboxContainer.appendChild(checkboxDiv);

//       if (key === "Work_ID") {
//         checkboxInput.checked = true;
//       }
//     }
//   }
// }


function DataTableFilter(cql_filter1) {
  var layers = ["PMC_test:Assets"];
  var typeName = layers.join(',');
  var cqlFilter = cql_filter1;
  var workspace = 'PMC_test'
  var geoServerURL =
    `${main_url}${workspace}/wms?service=WFS&version=1.1.0&request=GetFeature&typeName=${typeName}&outputFormat=application/json`;
  if (cql_filter1 !== '') {
    geoServerURL += "&CQL_FILTER=" + encodeURIComponent(cqlFilter);
  }
  // ;&CQL_FILTER=${encodeURIComponent(cqlFilter)}`;
  var headers = ["reservatio","name","survey_no", "peth_name","parcel_id", "area_1"];
  

  showtable(typeName, geoServerURL, cqlFilter, headers);

}




function populateDropdown(dropdownId, data) {
  var ul = $("#" + dropdownId);
  ul.empty();
  data.forEach(function (item) {
    // console.log(item, "items")
    var listItem = $('<li><label><input type="checkbox" class="select2-option-checkbox" value="' + item + '"> ' + item + '</label></li>');
    ul.append(listItem);
  });
}


function getCheckedValues(callback) {
  var selectedValues = {};
  const filternames = ["reservatio", "name", "peth_name", "survey_no"];

  filternames.forEach(function (filtername) {
    selectedValues[filtername] = []; // Initialize empty array for each filtername

    $('#' + filtername).on('click', 'input[type="checkbox"]', function (event) {
      event.stopPropagation();
      var values = [];
      $('#' + filtername + ' input[type="checkbox"]:checked').each(function () {
        var single_val = $(this).val();
        // console.log(single_val, "single_val")
        if (single_val) {
          // Remove the count from the value
          var actualValue = single_val.split(' (')[0];
          values.push(actualValue);
        }
      });

      // Update selectedValues for the current filtername
      selectedValues[filtername] = values;

      // Construct filter strings for all filter names
      var filters = [];
      for (var key in selectedValues) {
        if (selectedValues[key].length > 0) {
          filters.push(`${key} IN ('${selectedValues[key].join("','")}')`);
        }
      }

      // Join all filter strings with "AND"
      var filterString = filters.join(" AND ");



      // Update the selected count in the label
      var label = $('label[for="' + filtername + '"]');
      if (label.length > 0) {
        var selectedCount = values.length;
        var countText = selectedCount > 0 ? ' (' + selectedCount + ')' : '';
        label.find('.selected-count').text(countText);
      }


      // Call the callback function with filterString
      if (typeof callback === 'function') {
        callback(filterString);
      }
    });
  });
}

// function FilterAndZoom(filter) {
//   fitbouss(filter)

// };




function FilterAndZoom(filter) {
  fitbous(filter)
  Assets.setParams({
    CQL_FILTER: filter,
    maxZoom: 19.5,
  }).addTo(map);
  Assets.setParams({
    CQL_FILTER: filter,
    maxZoom: 19.5,
  }).addTo(map);

};


function fitbous(filter) {
  var layers = ["PMC_test:Assets"];
  var bounds = null;

  var processLayer = function (layerName, callback) {
    var urlm =
      main_url + "ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
      layerName +
      "&CQL_FILTER=" +
      filter +
      "&outputFormat=application/json";

    $.getJSON(urlm, function (data) {
      var geojson = L.geoJson(data);
      var layerBounds = geojson.getBounds();
      if (bounds) {
        bounds.extend(layerBounds);
      } else {
        bounds = layerBounds;
      }
      callback();
    });
  };

  var layersProcessed = 0;
  layers.forEach(function (layerName) {
    processLayer(layerName, function () {
      layersProcessed++;
      if (layersProcessed === layers.length) {
        // Apply the combined bounds to the map after all layers are processed
        if (bounds) {
          map.fitBounds(bounds);
        }
      }
    });
  });
}


function fitbouss(filter) {
  var layers = ["zone:Taluka_boundary"];
  var bounds = null;

  var processLayer = function (layerName, callback) {
    var urlm =
      main_url + "ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
      layerName +
      "&CQL_FILTER=" +
      filter +
      "&outputFormat=application/json";

    $.getJSON(urlm, function (data) {
      var geojson = L.geoJson(data);
      var layerBounds = geojson.getBounds();
      if (bounds) {
        bounds.extend(layerBounds);
      } else {
        bounds = layerBounds;
      }
      callback();
    });
  };

  var layersProcessed = 0;
  layers.forEach(function (layerName) {
    processLayer(layerName, function () {
      layersProcessed++;
      if (layersProcessed === layers.length) {
        // Apply the combined bounds to the map after all layers are processed
        if (bounds) {
          map.fitBounds(bounds);
        }
      }
    });
  });
}

// for dashboard table dynamic


function showtable(typeName, geoServerURL, cqlFilter, headers) {


  tableData(typeName, geoServerURL, cqlFilter, headers);

  var currentPage = 1;
  var rowsPerPage = 10;
  var buttonsToShow = 3;

  function setupPagination(data, rowsPerPage, headers, tableContainer) {
    var paginationContainer = document.createElement('div');
    paginationContainer.id = 'pagination';

    var pageCount = Math.ceil(data.length / rowsPerPage);

    function renderPageButtons(startPage) {
      paginationContainer.innerHTML = ""; // Clear any existing content

      // Previous Button
      var prevButton = document.createElement('button');
      prevButton.innerHTML = '&larr;';
      prevButton.disabled = currentPage === 1;
      prevButton.addEventListener('click', function () {
        if (currentPage > 1) {
          currentPage--;
          createTable(data, currentPage, rowsPerPage, headers);
          renderPageButtons(Math.max(1, currentPage - Math.floor(buttonsToShow / 2)));
        }
      });
      paginationContainer.appendChild(prevButton);

      // Page Buttons
      var endPage = Math.min(startPage + buttonsToShow - 1, pageCount);
      for (var i = startPage; i <= endPage; i++) {
        var pageButton = document.createElement('button');
        pageButton.innerText = i;
        if (i === currentPage) {
          pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', function (event) {
          currentPage = Number(event.target.innerText);
          createTable(data, currentPage, rowsPerPage, headers);
          renderPageButtons(Math.max(1, currentPage - Math.floor(buttonsToShow / 2)));
        });
        paginationContainer.appendChild(pageButton);
      }

      // Next Button
      var nextButton = document.createElement('button');
      nextButton.innerHTML = '&rarr;'; 
      nextButton.disabled = currentPage === pageCount;
      nextButton.addEventListener('click', function () {
        if (currentPage < pageCount) {
          currentPage++;
          createTable(data, currentPage, rowsPerPage, headers);
          renderPageButtons(Math.max(1, currentPage - Math.floor(buttonsToShow / 2)));
        }
      });
      paginationContainer.appendChild(nextButton);
    }

    renderPageButtons(1);
    tableContainer.appendChild(paginationContainer); // Append paginationContainer after rendering buttons
  }




  function createTable(data, headers) {
    var tableContainer = document.getElementById('tablecontainer');
    if (!tableContainer) {
      console.error("Table container not found");
      return;
    }
    tableContainer.innerHTML = ""; // Clear any existing content
    // Create container for minimize button and pagination
    var topContainer = document.createElement('div');
    topContainer.className = 'top-container';

    // Create download CSV button
    var downloadButton = document.createElement('button');
    downloadButton.innerHTML = '<i class="fa-solid fa-download"></i>';
    downloadButton.className = 'download-button';
    downloadButton.addEventListener('click', function () {
      downloadCSV(data, headers);
    });
    topContainer.appendChild(downloadButton);

    // Create minimize button
    var minimizeButton = document.createElement('button');
    minimizeButton.innerHTML = '<i class="fas fa-minus"></i>';
    minimizeButton.className = 'minimize-button';
    minimizeButton.addEventListener('click', function () {
      var tableDetail = document.querySelector('.tableDetail');
      if (tableDetail.style.display === 'none') {
        tableDetail.style.display = 'block';
        minimizeButton.innerHTML = '<i class="fas fa-minus"></i>';
        document.getElementById('openTableBtn').style.display = 'none'; // Hide the show button
      } else {
        tableDetail.style.display = 'none';
        minimizeButton.style.display = 'none';
        downloadButton.style.display='none';
      
        document.getElementById('openTableBtn').style.display = 'block'; // Show the show button
      }
    });
    tableContainer.appendChild(minimizeButton);
       // Create pagination controls
       var paginationContainer = document.createElement('div');
       paginationContainer.id = 'pagination';
   
       // Append pagination container to top container
       topContainer.appendChild(paginationContainer);
   
       // Append top container to tableContainer
       tableContainer.appendChild(topContainer);
       
    // Create tableDetail div
    var tableDetail = document.createElement('div');
    tableDetail.className = 'tableDetail';
    tableContainer.appendChild(tableDetail);

    var table = document.createElement('table');
    table.className = 'data-table'; // Add a class for styling
    table.id = 'data-table'; // Add an ID for DataTables initialization

    var thead = document.createElement('thead');
    var headerRow = document.createElement('tr');

    // Add 'Serial No' as the first header
    headers.unshift('Sr_no');

    // Create header cells
    headers.forEach(headerText => {
      var th = document.createElement('th');
      th.textContent = headerText;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    var tbody = document.createElement('tbody');

     data.forEach((item, index) => {
      var row = document.createElement('tr');

      // Add serial number as the first column
      var serialNumberCell = document.createElement('td');
      serialNumberCell.textContent = index + 1;
      row.appendChild(serialNumberCell);

      // Add other data columns
      headers.slice(1).forEach(header => { // Exclude the first header (Serial No)
        if (header !== 'Serial No' && header !== 'geometry') {
          var cell = document.createElement('td');
          cell.textContent = item[header] || ''; // Handle cases where item[header] might be undefined
          row.appendChild(cell);
        }
      });

      
      row.addEventListener('click', function () {
        // console.log(item);
        var boundsLayer = L.geoJSON(item.geometry, {
          style: {
            fillColor: "blue", // Fill color
            fillOpacity: 0.3, // Fill opacity
            color: "blue", // Border color
            weight: 2, // Border weight
          },
        }).addTo(map); // Add the bounds layer to the map

        var bounds = boundsLayer.getBounds();
        map.fitBounds(bounds);

        // Remove the bounds layer after 5 seconds
        setTimeout(function () {
          map.removeLayer(boundsLayer);
        }, 5000);
      });

      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    tableDetail.appendChild(table);

    // Initialize DataTables after rendering the table
    $(document).ready(function () {
      if ($.fn.DataTable.isDataTable('#data-table')) {
        $('#data-table').DataTable().destroy(); // Destroy existing DataTable if initialized
      }
      $('#data-table').DataTable({
        paging: true, // Enable pagination
        lengthChange: true, // Enable the 'Show X entries' dropdown
        searching: true, // Enable search box
        ordering: true, // Enable column sorting
        info: true, // Enable showing 'Showing X of Y entries' info
        autoWidth: false, 
        scrollY: 400,
        scrollX: true,
        scrollCollapse: true,
        fixedHeader: true
      });
    });
  }

  // Function to show the hidden table
  function showTable() {
    var tableDetail = document.querySelector('.tableDetail');
    var minimizeButton = document.querySelector('.minimize-button');
    var downloadButton = document.querySelector('.download-button')
    tableDetail.style.display = 'block';
    minimizeButton.style.display = 'block';
    minimizeButton.style.display = 'block';
    downloadButton.style.display ='block';
    // minimizeButton.innerText = '-';
    document.getElementById('openTableBtn').style.display = 'none'; // Hide the show button
  }

  // Add event listener to the show table button
  document.getElementById('openTableBtn').addEventListener('click', showTable);


  // Function to download table data as CSV
  
  function downloadCSV(data, headers) {
    var csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headers.join(",") + "\n"; // Add headers

    data.forEach((item, index) => {
        var row = [index + 1]; // Add serial number as the first column
        headers.slice(1).forEach(header => {
            if (header !== 'Serial No' && header !== 'geometry') {
                // Ensure NAME column values are not split
                let value = item[header] ? `"${item[header]}"` : '';
                row.push(value); // Handle cases where item[header] might be undefined
            }
        });
        csvContent += row.join(",") + "\n"; // Add row
    });

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "table_data.csv");
    document.body.appendChild(link);

    link.click(); // This will download the data file named "table_data.csv"
}



  

  // -------------------------------------------------------------
    function tableData(typeName, geoServerURL, cqlFilter, headers) {
      $.getJSON(geoServerURL, function (data) {
        var filteredData = data;
        if (!data || !data.features) {
          console.error("No data received or features not available");
          return;
      }
      
    
        const work_id = [];
        var exampleData = filteredData.features.map(feature => {
          let mappedData = {};
          headers.forEach(header => {
            // Convert header to camelCase or other naming convention if necessary
            let propertyName = header.replace(/ /g, '');
            if (header === 'label') {
              mappedData[propertyName] = (feature.properties[header]).toFixed(2); // Format to two decimal places
          } else {
              mappedData[propertyName] = feature.properties[header];
          }
          });
          mappedData.geometry = feature.geometry;
          work_id.push(feature.properties.label)

          return mappedData;
        });

        const shapeAreaSum = data.features.reduce((sum, feature) => {
          return sum + feature.properties.label;
        }, 0);
        let uniqueCount = new Set(work_id).size;
        console.log(work_id.label, "lllllllllllll",work_id,uniqueCount)
        document.getElementById('tablestats').innerHTML = `
        
        <div class="stat-button">
          <div class="stat-label">Total Count:</div>
          <div class="stat-value" id="">${uniqueCount}</div>
        </div>
      `;
      
        createTable(exampleData, headers);
      });
    }

  };

$(document).ready(function () {
  // Handle click event on minimize-button
  $('#minimize-button').click(function () {
    // Hide the pagination div
    $('#pagination').hide();
  });
});


document.addEventListener('DOMContentLoaded', (event) => {
  var columns = { "name": "Name", "parcel_id": "parcel_id","survey_no":"Survey No." };
  var select = document.getElementById("search_type");

  // Populate dropdown with column names
  for (var key in columns) {
    if (columns.hasOwnProperty(key)) {
      var option = document.createElement("option");
      option.text = columns[key]; // Use columns[key] to get the column name
      option.value = key; // Use key as the value (e.g., Work_ID, Budget_Code)
      select.appendChild(option);
    }
  }

  let selectedValue;

  $("#search_type").change(function () {
    var selectedValue = $(this).val();
    var selectedText = $("#search_type option:selected").text(); // Get the selected option text
    $("#searchInputDashboard").attr("placeholder", "Search " + selectedText); // Set the input placeholder
    var layerName = 'Assets'
    var workspace = 'PMC_test'
    function getValues(callback) {
      var geoServerURL = `${main_url}${workspace}/wms?service=WFS&version=1.1.0&request=GetFeature&typeName=${layerName}&propertyName=${selectedValue}&outputFormat=application/json`;
      // console.log(geoServerURL, "geoServerURLsearch");

      $.getJSON(geoServerURL, function (data) {
        var workTypeSet = new Set();

        // Populate the Set with work types
        $.each(data.features, function (index, feature) {
          var workType = feature.properties[selectedValue];

          // Convert number (double) values to strings
          if (typeof workType === 'number') {
            workType = workType.toString();
          }
          if (workType !== null) {
            workTypeSet.add(workType);
          }
        });

        // Convert the Set to an array
        var uniqueWorkTypes = Array.from(workTypeSet);
        callback(uniqueWorkTypes);
      });
    }

    getValues(function (data) {
      autocomplete(document.getElementById("searchInputDashboard"), data);
    });
  });

  // autocomplete function
  function autocomplete(input, arr) {
    let currentFocus;
    input.addEventListener("input", function () {
      let list, item, i, val = this.value.toLowerCase(); // Convert input value to lowercase for case-insensitive comparison
      closeAllLists();
      if (!val) return false;
      currentFocus = -1;
      list = document.createElement("ul");
      list.setAttribute("id", "autocomplete-list");
      list.setAttribute("class", "autocomplete-items");
      document.getElementById("autocompleteSuggestions").appendChild(list);
      for (i = 0; i < arr.length; i++) {
        if (arr[i].toLowerCase().includes(val)) { // Check if the suggestion contains the input value
          item = document.createElement("li");
          item.innerHTML = arr[i].replace(new RegExp(val, 'gi'), (match) => `<strong>${match}</strong>`); // Highlight matching letters
          item.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          item.addEventListener("click", function () {
            selectedValue = this.getElementsByTagName("input")[0].value; // Store the selected value
    
            var searchtypefield = $("#search_type").val();
           
            let cqlFilter;

            cqlFilter = `${searchtypefield} IN ('${selectedValue}')`;

            Assets.setParams({
              CQL_FILTER: cqlFilter,
              maxZoom: 19.5,
              // styles: "Missing_Link_"
            });

            Assets.addTo(map).bringToFront();

            // Assets.setParams({
            //   CQL_FILTER: cqlFilter,
            //   maxZoom: 19.5,
            //   // styles: "Missing_Link_"
            // });

            // Assets.addTo(map).bringToFront();

            fitbous(cqlFilter);

            DataTableFilter(cqlFilter)



            input.value = selectedValue;
            closeAllLists();
          });
          list.appendChild(item);
        }
      }
    });

    input.addEventListener("keydown", function (e) {
      let x = document.getElementById("autocomplete-list");
      if (x) x = x.getElementsByTagName("li");
      if (e.keyCode === 40) {
        currentFocus++;
        addActive(x);
      } else if (e.keyCode === 38) { //up
        currentFocus--;
        addActive(x);
      } else if (e.keyCode === 13) {
        e.preventDefault();
        if (currentFocus > -1) {
          if (x) {
            selectedValue = x[currentFocus].getElementsByTagName("input")[0].value; // Store the selected value
            input.value = selectedValue;
            closeAllLists();
          }
        }
      }
    });

    function addActive(x) {
      if (!x) return false;
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
      for (let i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }

    function closeAllLists(elmnt) {
      let x = document.getElementsByClassName("autocomplete-items");
      for (let i = 0; i < x.length; i++) {
        if (elmnt !== x[i] && elmnt !== input) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }

    document.addEventListener("click", function (e) {
      closeAllLists(e.target);
    });
  }
});




//Pop-Up show


function getCheckedValuess() {
  var checkedValues = [];
  var checkboxes = document.querySelectorAll("#checkboxContainer input[type='checkbox']:checked");
  checkboxes.forEach(function(checkbox) {
      checkedValues.push("'" + checkbox.value + "'"); // Push value wrapped in single quotes
  });

  if (checkedValues.length === 0) {
      checkedValues.push("''"); // Push an empty string to simulate no results
  }

  return checkedValues;
}


const layerDetails = {
  "PMC_test:Assets": ["reservatio","name","survey_no", "peth_name","parcel_id", "area_1"],
};

function getCheckedValuesforpopuups() {
  return new Promise((resolve, reject) => {
    var selectedValues = {};
    const filternames = ["reservatio","name","survey_no", "peth_name","parcel_id", "area_1"];

    filternames.forEach(function (filtername) {
      selectedValues[filtername] = []; // Initialize empty array for each filtername

      $('#' + filtername + ' input[type="checkbox"]:checked').each(function () {
        var single_val = $(this).val();
        if (single_val) {
          var actualValue = single_val.split(' (')[0];
          selectedValues[filtername].push(actualValue);
          console.log(selectedValues,"lllllllllll99999999999999")
        }
      });
    });

    var filters = [];
    for (var key in selectedValues) {
      if (selectedValues[key].length > 0) {
        filters.push(`${key} IN ('${selectedValues[key].join("','")}')`);
      }
    }
    var checkedValues = getCheckedValuess();

    
    if (checkedValues)
    {
      var filterString = filters.join(" AND ");
    }

    resolve(filterString);
  });
}

function combineFilters(cql_filter123, filterString) {
  if (cql_filter123) {
    return `${cql_filter123} AND ${filterString}`;
  } else {
    return filterString;
  }
}

// console.log("hehehe")
map.on("click", async (e) => {
  let bbox = map.getBounds().toBBoxString();
  let size = map.getSize();

  const layerDetails = {
    "PMC_test:Assets": [
      "peth_name",
      "parcel_id",
      "compensati",
      "date",
      "name",
      "reservatio",
      "survey_no",
      "reservatio",
      "property_u"
    ],
  };

  // Mapping of field names to display names
  const fieldDisplayNames = {
    "peth_name": "Peth Name",
    "parcel_id": "Parcel ID",
    "compensati": "Compensation",
    "date": "Date",
    "name": "Name",
    "reservatio": "Type of Asset",
    "survey_no": "Survey No",
    "reservatio": "Reservation",
    "property_u": "Property Use",
  };

  let workspace = 'PMC_test';
  let filterString = await getCheckedValuesforpopuups();

  let searchtypefield = $("#search_type").val();
  let searchtypefield1 = $("#searchInputDashboard").val();

  let cqlFilter123 = "";

  if (searchtypefield1) {
    cqlFilter123 = `${searchtypefield} IN ('${searchtypefield1}')`;
  } else {
    if (filterString.trim() !== "") {
      cqlFilter123 = combineFilters(cqlFilter123, filterString);
    }
  }

  console.log(cqlFilter123, "cqlFilter123");

  for (let layer in layerDetails) {
    let selectedKeys = layerDetails[layer];
    let urrr = `${main_url}${workspace}/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&FORMAT=image%2Fpng&TRANSPARENT=true&QUERY_LAYERS=${layer}&STYLES&LAYERS=${layer}&exceptions=application%2Fvnd.ogc.se_inimage&INFO_FORMAT=application/json&FEATURE_COUNT=50&X=${Math.round(e.containerPoint.x)}&Y=${Math.round(e.containerPoint.y)}&SRS=EPSG%3A4326&WIDTH=${size.x}&HEIGHT=${size.y}&BBOX=${bbox}&CQL_FILTER=${cqlFilter123}`;

    try {
      let response = await fetch(urrr);
      let html = await response.json();
      let features = html.features;

      // Only show the popup if features are found
      if (features && features.length > 0) {
        let detaildata = "";

        features.forEach((feature, index) => {
          let htmldata = feature.properties;
          let txtk1 = "";

          for (let key of selectedKeys) {
            if (htmldata.hasOwnProperty(key)) {
              let value = htmldata[key];
              txtk1 += "<tr><td>" + fieldDisplayNames[key] + "</td><td>" + value + "</td></tr>";
            }
          }

          detaildata += `<div style='max-height: 350px; max-height: 250px;'><table style='width:110%;' class='popup-table'>
                          <tr><td colspan="2">Feature ${index + 1}</td></tr>${txtk1}
                          <tr><td>Co-Ordinates</td><td>${e.latlng}</td></tr>
                        </table></div>`;
        });

        L.popup().setLatLng(e.latlng).setContent(detaildata).openOn(map);
      } else {
        console.log("No features found at this location.");
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
});
