// Set API key, longitude, and latitude
let api = "232f1a91a4893327ac3317c3786ac2be";

// Set a static array of month names.
let monthNames = [
	'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Weather data is returned in kelving, so convert to F
function kToF(k) {
    return Math.round((k - 273) * (9 / 5) + 32);
}

// This function will return the date in the format "January 1"
function getDate(m, d) {
    return monthNames[m] + ' ' + d;
}


function getJson(url){
    let request = new XMLHttpRequest();
request.open('GET', url, true);

request.onload = function() {
  if (this.status >= 200 && this.status < 400) {
    // Success!
    let data = JSON.parse(this.response);
  } else {
    console.log("The weather server returned an error!");
  }
};

request.onerror = function() {
  console.log("Invalid API request to the weather server!");
};

request.send();
}

// This function will show the weather data for the given location
// In this case, it's RPI Ambulance HQ in Troy, NY
function showPosition() {
    let x = document.getElementById('today');
    let dat2 = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=" + api;
    
    let alldata = getJson(dat2);
        for(let i = 0; i < 4; i++){
            // Weather data is given in 3 hour increments, but we're only interested in the weather each day.
            let num = i * 8;
            // This will give you the JSON object for each day.
            let dat = alldata.list[num];

            // This sets the source for the weather icons.
            let imgsrc = "public/img/weather icons/" + dat.weather[0].icon + ".svg"
            let temp = kToF(dat.main.feels_like);
            let date = new Date();
            let desc = dat.weather[0].description;
            desc = desc.charAt(0).toUpperCase() + desc.slice(1);
            // Check to see if we are about to display today or tomorrow. If not,
            // print out the date.
            switch(i){
                case 0:
                    x.innerHTML += `<h4 class="title">Today</h4>`;
                    break;
                case 1:
                    x.innerHTML += `<h4 class="title">Tomorrow</h4>`;
                    break;
                default:
                    x.innerHTML += `<h4 class="title">${getDate(date.getMonth(), date.getDate() + i)}</h4>`;
                    break;
            }
            x.innerHTML += `
            <div class="row">
            <div class="col-md-3">
            <img class="mx-auto" src='${imgsrc}' class='weather' height="100" width="100">
            </div>
            <div class="col-md-9">
            <h3 class="mx-auto title">Temp: ${temp} \xB0 F</h3>
            <span class="mx-auto">${desc}</span><br/>
            <span class="mx-auto">Humidity: ${dat.main.humidity}%</span><br/>
            </div>
            <br/>
            </div>`;
        }
}
$(document).ready(showPosition);