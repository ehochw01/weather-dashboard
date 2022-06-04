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
var hasSearched = false;
const SearchHistoryLimit = 11;
const apiKey = '233b06be3bdfee31043f3f96e5745593';

if (previousCities != null) {
    var prevCityArr = JSON.parse(previousCities);
    console.log(prevCityArr);
    renderSearchHistory();
} else {
    var prevCityArr = [];
}

const searchButton = document.querySelector("#search-btn");
const searchOnClick = function(event) {
    hasSearched = true;
    console.log("searchOnClick");
    event.preventDefault();
    let cityEl = document.querySelector("#city-search-input");
    let city = cityEl.value;
    if (city == "") {
        alert("Please Enter a City");
        return;
    }
   
    // standardize the capitalization of the city
    city = capitalize(city);
    getSearchResults(city);
    // save search history to local storage
}

function renderSearchHistory() {
    console.log("renderSearchHistory()");
    let historyEl = document.querySelector("#history-buttons");
    while(historyEl.firstChild){
        historyEl.removeChild(historyEl.firstChild);
    }
    if (hasSearched) {
        indexDisplay =  prevCityArr.length - 2;
    } else {
        indexDisplay =  prevCityArr.length - 1;
    }

    for (let i = indexDisplay; i >= 0; i--) {
        let button = document.createElement('button');
        button.setAttribute("class", "btn btn-secondary btn-block");
        button.setAttribute("type", "button");
        button.innerHTML = prevCityArr[i];
        historyEl.appendChild(button);
        button.onclick = function () {
            hasSearched = true;
            let city = button.innerHTML;
            let cityEl = document.querySelector("#city-search-input");
            cityEl.value = '';
            cityEl.setAttribute("placeholder", city);
            getSearchResults(city);
            // updateSearchHistory(city);
        }
    }

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
    renderSearchHistory();
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
            if (stringArray[i] == ' ' || stringArray[i] == '.') {
            capitalizeChar = true;
        }
    }
    return stringArray.join("");
}

function getSearchResults(city) {
    console.log("getSearchResults()");
    const requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q='+ encodeURIComponent(city) + '&units=imperial&appid=' + apiKey;
    getWeatherApi(requestUrl, city);
}
// use the weather request to get the latitude and longitude of a city
function getWeatherApi(requestUrl, city) {
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("data:");
            console.log(data);
            let cityEl = document.querySelector("#city-search-input");
            // clear input field when search is clicked
            cityEl.value = '';
            if (data.cod == "404") {
                cityEl.setAttribute("placeholder", "Enter a City");
                alert("city not found");
            } else {
                cityEl.setAttribute("placeholder", city);
                updateSearchHistory(city);
                getOneCallApi(data.coord.lat, data.coord.lon, city);
            } 
        })
        // .catch(error => {
        //     console.log("query failed");
        // });
}

function getOneCallApi(lat, lon, city) {
    console.log("lat: " + lat + " lon: " + lon);
    const requestURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&units=imperial&appid=" + apiKey;
    fetch(requestURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log("data:");
        console.log(data);
        if (data.message != "wrong latitude" && data.message != "wrong longitude") {
            renderCurrentWeather(data, city);
        } else {
            console.log(data.message);
        }
    })
    // .catch(error => {
    //     console.log("query failed");
    // });
}

function renderCurrentWeather(weatherData, city) {
    console.log("renderCurrentWeather()");
    const currentEl = document.querySelector("#current-card");
    currentEl.setAttribute("class", "card d-flex");
    const currentElbody = document.querySelector("#current-card-body");
    currentElbody.children[0].innerHTML = city + " " + moment().format("l");
    for (let i = 1; i < currentElbody.children.length; i++) {
        switch(i) {
            case 1:
                currentElbody.children[i].innerHTML = "Temp: " + weatherData.current.temp + "°F";
                break;
            case 2:
                currentElbody.children[i].innerHTML = "Wind: " + weatherData.current.wind_speed + " mph";
                break;
            case 3:
                currentElbody.children[i].innerHTML = "Humidity: " + weatherData.current.humidity + "%";
                break;
        }
    }
    let uvi = weatherData.current.uvi;
    let color = "badge-light";
    if (uvi <= 3) {
        color = "badge-success";
    } else if (uvi <= 7) {
        color = "badge-warning";
    } else {
        color = "badge-warning";
    }
    uviEl = document.getElementById("uv-index");
    uviEl.innerHTML = `UV Index: <span class="badge ${color}">${uvi}</span>`;
    renderForecast(weatherData.daily)
}

function renderForecast(weatherData){
    console.log("renderForecast()");
    const cardGroupEl = document.getElementById("forecast-cards");
    console.log(weatherData);
    for(let i=1; i < 6; i++) {
        const date = moment.unix(weatherData[i].dt).format("l");
        const iconCode = weatherData[i].weather[0].icon;
        const temp = weatherData[i].temp.day;
        const wind = weatherData[i].wind_speed;
        const humidity = weatherData[i].humidity;
        console.log(weatherData[i]);

        const card = document.createElement("div");
        card.setAttribute("class", "card");
        card.innerHTML = 
        `<div class="card-body">
            <h4 class="card-title">${date}</h4>
            <img src="http://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Weather Icon">
            <p>Temp: ${temp}°F</p>
            <p>Wind: ${wind} mph</p>
            <p>Humidity: ${humidity}5</p>
        <div>`;
        cardGroupEl.appendChild(card);
    }
    
}

searchButton.addEventListener('click', searchOnClick);

