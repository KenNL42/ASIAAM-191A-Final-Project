/* NOTE:
data.location_lat <- access users' location latitude
data.location_long <- access users' location longitude
data.resourcelat <- access user reported resource location latitude
data.resourcelong <- access user reported resource location longitude
*/
const map = L.map('map').setView([34.0709, -118.444], 5);

const url = "https://opensheet.elk.sh/1RFDPVCED6oKJYgqE04U2lJbO4oSF_ECeC3GcbaKvoZg/Form+Responses+1"

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

fetch(url)
	.then(response => {
		return response.json();
		})
  .then(data =>{
    formatData(data)
  }
)

let feelingpositive = L.featureGroup();
let feelingneutral = L.featureGroup();
let feelingnegative = L.featureGroup();
let resourcearea = L.featureGroup();

let layers = {
  "Positive <svg height='10' width='10'><circle cx='5' cy='5' r='4' stroke='black' stroke-width='1' fill='green' /></svg>": feelingpositive,
  "Neutral <svg height='10' width='10'><circle cx='5' cy='5' r='4' stroke='black' stroke-width='1' fill='yellow' /></svg>": feelingneutral,
  "Negative <svg height='10' width='10'><circle cx='5' cy='5' r='4' stroke='black' stroke-width='1' fill='red' /></svg>": feelingnegative,
  "Resource Locations <svg height='10' width='10'><circle cx='5' cy='5' r='4' stroke='black' stroke-width='1' fill='blue' /></svg>": resourcearea
}

L.control.layers(null,layers, {collapsed:false}).addTo(map)
  
function addMarker(data){
  let circleOptions = {
      radius: 8,
      fillColor: "#ff7800",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
  }
  if(data["Which best describes how you've been feeling?"] == "Positive"){
      circleOptions.fillColor = "green"
      feelingpositive.addLayer(L.circleMarker([data.location_lat,data.location_long], circleOptions).
      bindPopup(`<h3>${data["What city do you live?"]}</h3> <p>${"How I Handle my emotional well-being: " + data['whatdoyoudotomanageyouremotionalwell-being']}</p>`))
  }
 if(data["Which best describes how you've been feeling?"] =="Neutral"){
   circleOptions.fillColor = "yellow"
   feelingneutral.addLayer(L.circleMarker([data.location_lat,data.location_long], circleOptions).
   bindPopup(`<h3>${data["What city do you live?"]}</h3> <p>${"How I Handle my emotional well-being: " + data['whatdoyoudotomanageyouremotionalwell-being']}</p>`))
 }
 if(data["Which best describes how you've been feeling?"] =="Negative"){
  circleOptions.fillColor = "red"
  feelingnegative.addLayer(L.circleMarker([data.location_lat,data.location_long], circleOptions).
  bindPopup(`<h3>${data["What city do you live?"]}</h3> <p>${"How I Handle my emotional well-being: " + data['whatdoyoudotomanageyouremotionalwell-being']}</p>`))
}
if(!data.resource_lat==0 || !data.resource_long==0){
  circleOptions.fillColor = "blue"
  resourcearea.addLayer(L.circleMarker([data.resource_lat,data.resource_long], circleOptions).
  bindPopup('<b>Users\' Physical Locations of Resources</b>'))
}
  // return data.timestamp
}

// add markers for location of physical resources
// need to rework this for scalability
function addResourcesMarker(){
  let circleOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  }

  // manually input data
  data = {
    0: {
      name: "Campus Assault Resources and Education (CARE)",
      Address: "330 De Neve Dr. 205 Covel Commons, Los Angeles, CA, 90095",
      lat: 34.075170,
      long: -118.453640
    },
    1: {
      name: "Collegiate Recovery Program",
      Address: "Student Activities Center, Suite B44 220 Westwood Plaza Box 951453",
      lat: 34.071538,
      long: -118.444151
    },
    2: {
      name: "Counseling and Psychological Services (CAPS)",
      Address: "John Wooden Center West, 221 Westwood Plaza, Box 951556, Los Angeles, CA 90095-1556",
      lat: 34.072880,
      long: -118.444850
    },
    3: {
      name: "PEERS Friendship Program",
      Address: "300 UCLA Medical Plaza Los Angeles, CA 90095-6967",
      lat: 34.064400,
      long: -118.446070
    },
    4: {
      name: "UCLA Psychology Clinic",
      Address: "220 Westwood Plaza #105, Los Angeles, CA 90095",
      lat: 34.072808,
      long: -118.444913
    },
    5: {
      name: "Acacia",
      Address: "1019 Gayley Ave | Floor 2 Los Angeles, CA 90024",
      lat: 34.0613855,
      long: -118.447897
    },
    6: {
      name: "Samahang Pilipino Education and Retention",
      Address: "220 Westwood Plaza #105, Los Angeles, CA 90095",
      lat: 34.072808,
      long: -118.444913
    },
    7: {
      name: "MEChA Calmécac",
      Address: "220 Westwood Plaza #105, Los Angeles, CA 90095",
      lat: 34.072808,
      long: -118.444913
    },
    8: {
      name: "Retention of American Indians Now!",
      Address: "220 Westwood Plaza #105, Los Angeles, CA 90095",
      lat: 34.072808,
      long: -118.444913
    },
    9: {
      name: "Southeast Asian Campus Learning Education and Retention",
      Address: "220 Westwood Plaza #105, Los Angeles, CA 90095",
      lat: 34.072808,
      long: -118.444913
    }
  }
  for (let [key, value] of Object.entries(data)) {
    circleOptions.fillColor = "blue"
    resourcearea.addLayer(L.circleMarker([value.lat, value.long], circleOptions).
    bindPopup(`<b>${value.name}</b>`))
  }
}



// Function to add stories by appending each user story
function addStories(data){
  
  // get rid of blank answer
  if (!data["Describe your emotional/social wellbeing in as much detail as you are comfortable with"]) return;
  
  const newDiv = document.createElement("div");
  newDiv.className = "stories";
  newDiv.innerHTML = "<b>How Are You Doing?</b><br>";
  newDiv.innerHTML += data["Describe your emotional/social wellbeing in as much detail as you are comfortable with"];
  newDiv.innerHTML += "<br><b><br>What's helped you?</b><br>";
  newDiv.innerHTML += data['What do you do to manage your emotional well-being?'];

  if (data.whichcampusresourcesifanyhaveyoufoundhelpfulinmanagingyourmentalhealth){
    newDiv.innerHTML += "<br><b><br>What campus resources have you used?</b><br>";
    newDiv.innerHTML += data['Which campus resources, if any, have you found helpful in managing your mental health?'];
  }

  const spaceForStories = document.getElementById('snapshot')
  spaceForStories.appendChild(newDiv);
}

function displayWellnessCount(data){
  var wellness = {};
  
  // count all wellness status
  for (var i in data){
    // store wellness data
    emotion = data[i]["Which best describes how you've been feeling?"];
    if (emotion != ""){
      if (wellness[emotion] == null){
        wellness[emotion] = 0;
      }
      wellness[emotion] += 1;
    }
  }

  chartWellnessData = [];
  x_val = [];
  y_val = [];
  for (const [key, value] of Object.entries(wellness)) {
    x_val.push(key);
    y_val.push(value);
  }
  chartWellnessData['x'] = x_val;
  chartWellnessData['y'] = y_val;

  renderChart(chartWellnessData, "Emotional Wellness", "chartDiv");
}

function displayResourceCount(data){
  resource_dict = {}
  for (var i in data){
    // store wellness data
    resource = data[i]["Which campus resources, if any, have you found helpful in managing your mental health?"];
    resource_arr = resource.split(', ');
    
    // ignore blank data and "none"
    if (resource_arr.includes("none") || resource_arr.includes("None") || resource_arr.includes("")) {
      continue;
    }
    for (var j = 0; j < resource_arr.length; j++){
      if (resource_dict[resource_arr[j]] == null){
        resource_dict[resource_arr[j]] = 0;
      }
      resource_dict[resource_arr[j]] += 1;
    }
  }
  
  temp = {}
  temp['x'] = Object.keys(resource_dict);
  temp['y'] = Object.values(resource_dict);
  
  renderChart(temp, "Resources Count", "chartDiv");
}

var global_formatted_data;
function formatData(theData){
  const formattedData = [];
  const rows = theData;
  for(const row of rows) {
    const formattedRow = {}
    for(const key in row) {
      // if(key.startsWith("gsx$")) {
      //       formattedRow[key.replace("gsx$", "")] = row[key].$t;
      // }
      formattedRow[key] = row[key]
    }
    formattedData.push(formattedRow);
  }
  console.log(formattedData);
  formattedData.forEach(addMarker);
  formattedData.forEach(addStories);

  global_formatted_data = formattedData; // store to global variable so data is used in graph

  loadChart(0); // show wellness count as default

  // show markers
  feelingpositive.addTo(map)
  feelingneutral.addTo(map)
  feelingnegative.addTo(map)
  resourcearea.addTo(map)
  let allLayers = L.featureGroup([feelingpositive, feelingneutral, feelingnegative, resourcearea]);
  map.fitBounds(allLayers.getBounds())

  addResourcesMarker()
}

// switch page between wellness and resources
function loadChart(page){
  document.getElementById('chartDiv').remove();
  if (page==0){
    displayWellnessCount(global_formatted_data);
  }
  else {
    displayResourceCount(global_formatted_data);
  }
}

// create chart
function renderChart(chartData, title, divID){
  // delete previous canvas and append a new one
  canvas = document.createElement('canvas');
  canvas.setAttribute("id",divID);
  parent = document.getElementById("reportModal");
  parent.appendChild(canvas);

  // create a chart
  var xValues = chartData['x'];
  var yValues = chartData['y'];
  var barColors = ["red", "yellow","green", "blue", "purple", "orange", "black", "gray", "pink"];

  new Chart(divID, {
    type: "bar",
    data: {
      labels: xValues,
      datasets: [{
        backgroundColor: barColors,
        data: yValues
      }]
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero:true
          }
        }]
      },
      legend: {
        display: false
      },
      title: {
          display: true,
          text: title,
      }
    }
  });
}

//--------------create modal-------------------//
//----------about section-------------
// Get the modal
var aboutModal = document.getElementById("aboutModal");

// Get the button that opens the modal
var aboutBtn = document.getElementById("aboutButton");

// Get the <span> element that closes the modal
var aboutClose = document.getElementsByClassName("aboutClose")[0];

// When the user clicks on the button, open the modal
aboutBtn.onclick = function() {
  aboutModal.style.display = "block";
  // loadChart(0);
}

// When the user clicks on <span> (x), close the modal
aboutClose.onclick = function() {
  aboutModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == aboutModal) {
    aboutModal.style.display = "none";
  }
}
