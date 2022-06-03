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

var previousCities = localStorage.getItem("previousCities");
const SearchHistoryLimit = 10;

if (previousCities != null) {
    var prevCityArr = JSON.parse(previousCities);
    renderSearchHistory();
} else {
    var prevCityArr = [];
}

const searchButton = document.querySelector("#search-btn");
var weatherData = {};
const searchOnClick = function(event) {
    console.log("searchOnClick");
    event.preventDefault();
    let cityEl = document.querySelector("#city-search-input");
    let city = cityEl.value;
    // clear input field when search is clicked
    cityEl.value = '';
    if (city == "") {
        alert("Please Enter a City");
        return;
    }
   
    // standardize the capitalization of the city
    city = capitalize(city);
    // getSearchResults(city);
    // save search history to local storage
    updateSearchHistory(city);
}

function renderSearchHistory() {
    console.log("renderSearchHistory()");
}

function updateSearchHistory(city) {
    console.log("updateSearchHistory()");
    // remove city from prevCityArr if it already exists
    let filteredCityArr = prevCityArr.filter(function(c) {return c !== city});
    prevCityArr = filteredCityArr;
    // add city to the end of the prevCityArr
    prevCityArr.push(city);
    // only save recent search history
    while(prevCityArr.length > SearchHistoryLimit) {
        prevCityArr.shift();
    }
    localStorage.setItem("previousCities", JSON.stringify(prevCityArr));
    console.log(prevCityArr);
}

function capitalize(str) {
    const stringArray = str.toLowerCase().split("");
    let capitalizeChar = true;
    for (let i=0; i<stringArray.length; i++) {
        if(capitalizeChar) {
            stringArray[i] = stringArray[i].toUpperCase();
            capitalizeChar = false;
        }
            if (stringArray[i] == ' ') {
            capitalizeChar = true;
        }
    }
    return stringArray.join("");
}



function getSearchResults(city) {
    console.log("getSearchResults()")
    const apiKey = '233b06be3bdfee31043f3f96e5745593';
    var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q='+ encodeURIComponent(city) + '&units=imperial&appid=' + apiKey;
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
            if (data.message != "city not found") {
                renderSearchDatatoPage();
            } else {
                console.log("city not found");
            }
        })
        // .catch(error => {
        //     console.log("query failed");
        // });
}

function renderSearchDatatoPage() {
    console.log("renderSearchDatatoPage()");
}

searchButton.addEventListener('click', searchOnClick);

