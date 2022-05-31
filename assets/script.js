/* 
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
*/

const searchButton = document.querySelector("#search-btn");
var weatherData = {};
const searchOnClick = function(event) {
    console.log("searchOnClick");
    event.preventDefault();

    let city = document.querySelector("#city-search-input").value;
    console.log(city);
    getSearchResults(city);
    // save search history to local storage
}

function getSearchResults(city) {
    console.log("getSearchResults()")
    const apiKey = '233b06be3bdfee31043f3f96e5745593';
    var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q='+ city + '&units=imperial&appid=' + apiKey;
    console.log(requestUrl);
    getWeatherApi(requestUrl);
}

function getWeatherApi(requestUrl) {
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            weatherData = data;
            console.log("data:");
            console.log(data);
            if (data.message == "city no found") {
                renderSearchDatatoPage();
            } else {
                console.log("city no found");
            }
        })
        // .catch(error => {
        //     console.log("query failed");
        // });
}

function renderSearchDatatoPage() {
    console.log("renderSearchDatatoPage()");
    console.log(JSON.parse(weatherData));
}

searchButton.addEventListener('click', searchOnClick);

