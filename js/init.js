/* NOTE:
data.locationlat <- access users' location latitude
data.locationlong <- access users' location longitude
data.resourcelat <- access user reported resource location latitude
data.resourcelong <- access user reported resource location longitude
*/
const map = L.map('map').setView([34.0709, -118.444], 5);

const url = "https://spreadsheets.google.com/feeds/list/1RFDPVCED6oKJYgqE04U2lJbO4oSF_ECeC3GcbaKvoZg/o5hgy6r/public/values?alt=json"

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

fetch(url)
	.then(response => {
		return response.json();
		})
  .then(data =>{
    //console.log(data)
    formatData(data)
  }
)

let feelingpositive = L.featureGroup();
let feelingneutral = L.featureGroup();
let feelingnegative = L.featureGroup();

let layers = {
  "Positive": feelingpositive,
  "Neutral": feelingneutral,
  "Negative": feelingnegative
}

L.control.layers(null,layers).addTo(map) 
  
function addMarker(data){
  let circleOptions = {
      radius: 4,
      fillColor: "#ff7800",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
  }
  if(data.whichbestdescribeshowyouvebeenfeeling == "Positive"){
      circleOptions.fillColor = "green"
      feelingpositive.addLayer(L.circleMarker([data.locationlat,data.locationlong], circleOptions).
      bindPopup(`<h2>${data.whatcitydoyoulive}</h2>`))
  }
 if(data.whichbestdescribeshowyouvebeenfeeling =="Neutral"){
   circleOptions.fillColor = "yellow"
   feelingneutral.addLayer(L.circleMarker([data.locationlat,data.locationlong], circleOptions).
   bindPopup(`<h2>${data.whatcitydoyoulive}</h2>`))
 }
 if(data.whichbestdescribeshowyouvebeenfeeling =="Negative"){
  circleOptions.fillColor = "red"
  feelingnegative.addLayer(L.circleMarker([data.locationlat,data.locationlong], circleOptions).
  bindPopup(`<h2>${data.whatcitydoyoulive}</h2>`))
}
  return data.timestamp
}


/* Don't need to create button for locations for now
function createButtons(lat,lng,title){
  const newButton = document.createElement("button");
  newButton.id = "button"+title;
  newButton.innerHTML = title;
  newButton.setAttribute("lat",lat); 
  newButton.setAttribute("lng",lng);
  newButton.addEventListener('click', function(){
      map.flyTo([lat,lng]);
  })
  const spaceForButtons = document.getElementById('contents')
  spaceForButtons.appendChild(newButton).addClass('test');
}*/

// Function to add stories by appending each user story
function addStories(data){
  //console.log(data.describeyouremotionalsocialwellbeinginasmuchdetailasyouarecomfortablewith);
  
  // get rid of blank answer
  if (!data.describeyouremotionalsocialwellbeinginasmuchdetailasyouarecomfortablewith) return;
  
  const newDiv = document.createElement("div");
  newDiv.className = "stories";
  newDiv.innerHTML = "<b>My emotional well-being</b><br>👉";
  newDiv.innerHTML += data.describeyouremotionalsocialwellbeinginasmuchdetailasyouarecomfortablewith;
  newDiv.innerHTML += "<br><b>How I manage my emotional well-being</b><br>👉";
  newDiv.innerHTML += data['whatdoyoudotomanageyouremotionalwell-being'];

  if (data.whichcampusresourcesifanyhaveyoufoundhelpfulinmanagingyourmentalhealth){
    newDiv.innerHTML += "<br><b>Campus resources that I used</b><br>👉";
    newDiv.innerHTML += data['whichcampusresourcesifanyhaveyoufoundhelpfulinmanagingyourmentalhealth'];
  }

  const spaceForStories = document.getElementById('snapshot')
  spaceForStories.appendChild(newDiv);
}

function printWellnessStats(data){
  var wellness = {};
  
  // count all wellness status
  for (var i in data){
    emotion = data[i]['whichbestdescribeshowyouvebeenfeeling'];
    if (emotion != ""){
      if (wellness[emotion] == null){
        wellness[emotion] = 0;
      }
      wellness[emotion] += 1;
    }
  }

  // print on screen
  for (const [key, value] of Object.entries(wellness)) {
    const newDiv = document.createElement("div");
    newDiv.className = "stats";
    newDiv.innerHTML = key + ":" + value;
    console.log(key);

    const spaceForStories = document.getElementsByClassName('survey')[0];
    spaceForStories.appendChild(newDiv);
  }

}

function formatData(theData){
  const formattedData = [];
  const rows = theData.feed.entry;
  for(const row of rows) {
    const formattedRow = {}
    for(const key in row) {
      if(key.startsWith("gsx$")) {
            formattedRow[key.replace("gsx$", "")] = row[key].$t;
      }
    }
    formattedData.push(formattedRow);
  }
  console.log(formattedData);
  formattedData.forEach(addMarker);
  formattedData.forEach(addStories);
  printWellnessStats(formattedData);
}