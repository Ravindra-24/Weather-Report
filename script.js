const loader = document.querySelector(".loader");
const inputBox = document.querySelector("#input");
const button = document.querySelector("#search-btn");
const resultContainer = document.querySelector(".result");
const locator = document.querySelector(".locate");

const showLoader = () => {
  loader.style = "display:flex";
};
const hideLoader = () => {
  loader.style = "display:none";
};

const showResult = (name, country,temp, humidity,speed,currentTime,feels_like, grnd_level,pressure,sea_level,temp_max,temp_min) => `<div class="weather">
<div class="weather-head">
<img src="" class='weather-icon'/>
<h1 class="temp">${temp}°c</h1>
<h2 class="city"> ${name}, ${country}</h2>
</div>
<div class="details">
  <div class="col">
    <img src="./img/humidity.png" alt=""/>
    <div>
    <p class="humidity">${humidity}<span class='unit'>%<span></p>
    <p>Humidity</p>
  </div>
</div>
  <div class="col">
    <img src="./img/wind.png" alt=""/>
    <div>
      <p class="wind">${speed}<span class='unit'>km/h<span></p>  
      <p>Wind Speed</p>
    </div>
  </div>
</div>
</div>
<hr class='dashed-line'>
<div class="other-details">
          <p><span>Feels like:</span> <span>${feels_like}°c</span></span></p>
            <p><span>Ground level:</span> <span>${grnd_level}ft</span></p>
            <p><span>Pressure:</span> <span>${pressure}atm</span></p>
            <p><span>Sea level: </span><span>${sea_level}ft</span></p>
            <p><span>max Tempreture:</span> <span>${temp_max}°c</span></p>
            <p><span>min Tempreture:</span> <span>${temp_min}°c</span></p>
        </div>`;

const key = "8f2875f9b989ac5a9dc52fb980db0d8d";
const limit = 5;

const endpoint = (city) =>
  `http://api.openweathermap.org/geo/1.0/direct?q=${city}&${limit}=1&appid=${key}`;

const url = (lat, lon) =>`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`

const locateCity = (lat, lon) =>
  `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`

const getWeather = async () => {
  if (inputBox.value === "" || inputBox.value === null) {
    alert("Please enter a city name");
    return;
  } else {
    try {
        resultContainer.innerHTML="";
      const searchCity = inputBox.value;
      showLoader();
      const response = await fetch(endpoint(searchCity));
      const data = await response.json();
      if(data.length===0){
        resultContainer.innerHTML=`<h1 class="text-6xl text-center">No results found</h1>`;
      }else{
      const { lat, lon } = data[0];
      const getLocation = await fetch(url(lat, lon));
      const locationData = await getLocation.json();
      console.log(``,locationData );
      const currentTime = new Date().toLocaleTimeString();
        const { name, country } = data[0];
        const { humidity,feels_like, grnd_level,pressure,sea_level,temp_max,temp_min} = locationData.main;
        const temp=locationData.main.temp.toFixed(0);
        const {speed } = locationData.wind;
        resultContainer.innerHTML +=showResult(name, country,temp, humidity, speed,currentTime,feels_like, grnd_level,pressure,sea_level,temp_max,temp_min);
        weatherIcon(locationData)
    }
    } catch (error) {
      console.log(`error`, error);
    } finally {
      hideLoader();
      inputBox.value = "";
    }
  }
};

const weatherIcon = (locationData)=>{
  if(locationData.weather[0].main==="Rain"){
    document.querySelector(".weather-icon").src="./img/rain.png";
}else if(locationData.weather[0].main==="Clouds"){
document.querySelector(".weather-icon").src="./img/clouds.png";
}else if(locationData.weather[0].main==="Clear"){
document.querySelector(".weather-icon").src="./img/clear.png";
}else if(locationData.weather[0].main==="Snow"){
document.querySelector(".weather-icon").src="./img/snow.png";
}else if(locationData.weather[0].main==="Drizzle"){
document.querySelector(".weather-icon").src="./img/drizzle.png";
}else if(locationData.weather[0].main==="Mist"){
document.querySelector(".weather-icon").src="./img/mist.png";
}else if(locationData.weather[0].main==="Haze"){
document.querySelector(".weather-icon").src="./img/haze.png";
} else{
document.querySelector(".weather-icon").src="./img/mist.png";
};
}

button.addEventListener("click", getWeather);
locator.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const getWeatherByLocation = async () => {
        try {
            resultContainer.innerHTML="";
            showLoader();
            const response = await fetch(url(latitude, longitude));
            const data = await response.json();
            const location = await fetch(locateCity(latitude, longitude));
            const locationData = await location.json();
            const { city, countryName } = locationData;
            var name = city;
            var country = countryName;
            const { humidity,feels_like, grnd_level,pressure,sea_level,temp_max,temp_min} = data.main;
            const temp =data.main.temp.toFixed(0);
            const {speed } = data.wind;
            const currentTime = new Date().toLocaleTimeString().slice(0, 5);
            resultContainer.innerHTML +=showResult(name, country,temp, humidity, speed,currentTime,feels_like, grnd_level,pressure,sea_level,temp_max,temp_min);
            weatherIcon(data)
        } catch (error) {
            console.log(`error`, error);
        } finally {
            hideLoader();
        }
        };
        getWeatherByLocation();
    });
})