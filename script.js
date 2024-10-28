const greetDate = document.querySelector('.greet-date');
const greetTime = document.querySelector('.greet-time');
const greetText = document.querySelector('.greet-text');

const tempLocation = document.querySelector('.temp-location');
const tempValue = document.querySelector('.temp-value');
const windValue = document.querySelector('.wind span');
const humidityValue = document.querySelector('.humidity span');
const rainValue = document.querySelector('.rain span');
const feelsLikeValue = document.querySelector('.feels-like');
const tempText = document.querySelector('.temp-text')
const input = document.querySelector('.search-field');
const search = document.querySelector('.search');
const loadingScreen = document.getElementById('loading-screen')
const theme = document.querySelector('.theme');
const currentLocationWeather = document.querySelector('.current-location-btn');
const minTemps = [...document.querySelectorAll('.daily-forecast-card-temperature-min')]
const maxTemps = [...document.querySelectorAll('.daily-forecast-card-temperature-max')]
let forecastDate = [...document.querySelectorAll('.daily-forecast-card-date')];
forecastDate.shift()


const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
var one = new Date();
const setData = () => {
    var one = new Date();

    let hourStr;
    let minStr = one.getMinutes();
    greetDate.innerText = `${one.getDate()} ${monthNames[one.getMonth()].substring(0, 3)} ${one.getFullYear()}`
    if (one.getHours() > 12) {
        hourStr = `${one.getHours() - 12}`;
    }
    else {
        hourStr = `${one.getHours()}`;
    }
    if (parseInt(hourStr) <= 9) {
        hourStr = `0${hourStr}`
    }
    if (parseInt(minStr) <= 9) {
        minStr = `0${minStr}`
    }
    greetTime.innerText = `${hourStr}:${minStr} ${one.getHours() >= 12 && one.getMinutes() > 0 ? 'PM' : 'AM'}`

    let greeting;
    hour = one.getHours();
    if (hour < 12) {
        greeting = "Morning!";
    } else if (hour < 17) {
        greeting = "Afternoon!";
    } else if (hour < 21) {
        greeting = "Evening!";
    } else {
        greeting = "Night!";
    }
    greetText.innerText = greeting;
}

setData();
setInterval(() => {
    setData();
}, 1000)

const displayWeather = (data) => {
    // console.log(one.getDate());
    loadingScreen.style.display = 'flex';
    var one = new Date();
    tempLocation.innerText = `${data.location.name}, ${data.location.country}`
    tempValue.innerText = `${Math.round(data.current.temp_c)}°`
    windValue.innerText = `${data.current.wind_mph} mph`
    humidityValue.innerText = `${data.current.humidity}`
    rainValue.innerText = `${data.current.precip_mm} mm`
    feelsLikeValue.innerText = `Feels Like ${data.current.feelslike_c}°`
    tempText.innerText = data.current.condition.text
    let lat = data.location.lat;
    let lon = data.location.lon;
    // console.log(lat,lon);
    forecastDate.forEach((date) => {
        one.setDate(one.getDate() + 1);
        date.innerText = `${monthNames[one.getMonth()].substring(0, 3)} ${one.getDate()}`
    })
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min`)
        .then((res) => res.json())
        .then((forecastData) => {
            minTemps.forEach((minTemp, i) => {
                minTemp.innerText = `${forecastData.daily.temperature_2m_min[i]}°`
            })
            maxTemps.forEach((maxTemp, i) => {
                maxTemp.innerText = `${forecastData.daily.temperature_2m_max[i]}°`
            })
            localStorage.setItem('latitude', lat);
            localStorage.setItem('longitude', lon);
            loadingScreen.style.display = 'none';
        }).catch((error) => {
            console.log(error);
            loadingScreen.style.display = 'none';
        })
}

if (localStorage.getItem('latitude')) {
    fetch(`https://api.weatherapi.com/v1/current.json?key=ba0a0a300d1148b6813125405242710&q=${localStorage.getItem('latitude')},${localStorage.getItem('longitude')}`)
        .then((res) => res.json())
        .then((data) => {
            displayWeather(data)
        }).catch((error) => {
            console.log(error);
        })
}
else {

    let areCoordinatesObtained = false;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }

    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        fetch(`https://api.weatherapi.com/v1/current.json?key=ba0a0a300d1148b6813125405242710&q=${latitude},${longitude}`)
            .then((res) => res.json())
            .then((data) => {
                displayWeather(data);

            }).catch((error) => {
                console.log(error);
            })

        areCoordinatesObtained = true;
    }
    function error() {
        console.log("Unable to retrieve your location");
    }
}



search.addEventListener('click', () => {
    if (input.value) {
        fetch(`https://api.weatherapi.com/v1/current.json?key=ba0a0a300d1148b6813125405242710&q=${input.value}`)
            .then((res) => res.json())
            .then((data) => {
                displayWeather(data)
                // localStorage.setItem('recentPlace', input.value);
            }).catch((error) => {
                console.log(error);
                loadingScreen.style.display = 'none';

            })
    }
})

currentLocationWeather.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }

    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        fetch(`https://api.weatherapi.com/v1/current.json?key=ba0a0a300d1148b6813125405242710&q=${latitude},${longitude}`)
            .then((res) => res.json())
            .then((data) => {
                displayWeather(data);

            }).catch((error) => {
                console.log(error);
            })

        areCoordinatesObtained = true;
    }
    function error() {
        console.log("Unable to retrieve your location");
    }
})


theme.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
})
