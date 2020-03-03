// Set API key, longitude, and latitude
const api = "232f1a91a4893327ac3317c3786ac2be";

// Set a static array of month names.
var monthNames = [
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

// This function will show the weather data for the given location
// In this case, it's RPI Ambulance HQ in Troy, NY
function showPosition() {
    var dat2 = "public/forecast.json";
    var x = document.getElementById('today');
    //var dat2 = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=" + api;
    $.getJSON(dat2, function (data) {
        alldata = data;
    }).then(function () {

        for(var i = 0; i < 4; i++){
            // Weather data is given in 3 hour increments, but we're only interested in the weather each day.
            var num = i * 8;
            
            // This will give you the JSON object for each day.
            var dat = alldata.list[num];

            // This sets the source for the weather icons.
            var imgsrc = "public/img/weather icons/" + dat.weather[0].icon + ".svg"
            var temp = kToF(dat.main.feels_like);
            var date = new Date();
            var desc = dat.weather[0].description;
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
    });
}
$(document).ready(showPosition);