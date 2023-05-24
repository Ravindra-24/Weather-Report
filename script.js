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

const showResult = (name, country,temp, humidity, wind_speed,currentTime) => `<div class="flex justify-center">
<div
    class="card  min-w-sm max-w-sm border border-gray-100 bg-gray-50   transition-shadow test  shadow-lg hover:shadow-shadow-xl w-full bg-green-600 text-purple-50 rounded-md">
    <h2 class="text-md mb-2 px-4 pt-4">
        <div class="flex justify-between">
            <div class="badge relative top-0">
                <span class="mt-2 py-1 h-12px text-md font-semibold w-12px  rounded right-1 bottom-1 px-4">${name}, ${country}</span></div>
            <span class="text-lg font-bold ">${currentTime} IST</span>
        </div>
    </h2>

    <div class="flex items-center p-4">
        <div class="flex justify-center items-center w-96"><svg height="20" width="20" viewBox="0 0 32 32"
                class="fill-current h-32 w-32 text-yellow-300">
                <path
                    d="M21.743,18.6872A6.05,6.05,0,0,0,22.8,17.6006a5.9977,5.9977,0,1,0-10.7334-4.4444,7.5568,7.5568,0,0,0-5.7158,5.0879A5.9926,5.9926,0,0,0,8,30H19a5.9854,5.9854,0,0,0,2.743-11.3128ZM18,10a4.0042,4.0042,0,0,1,4,4,3.9613,3.9613,0,0,1-.8,2.3994,4.0122,4.0122,0,0,1-.94.8917,7.5416,7.5416,0,0,0-6.1339-4.2395A3.9985,3.9985,0,0,1,18,10Zm1,18H8a3.9928,3.9928,0,0,1-.6729-7.93L7.99,19.958l.1456-.6562a5.4958,5.4958,0,0,1,10.729,0l.1464.6562.6622.1123A3.9928,3.9928,0,0,1,19,28Z"
                    transform="translate(0 .005)"></path>
                <path d="M26 13.005H30V15.005H26z"></path>
                <path d="M23.071 5.929H27.071V7.929H23.071z" transform="rotate(-45 25.077 6.931)"></path>
                <path d="M17 2.005H19V6.005H17z"></path>
                <path d="M9.929 4.929H11.929V8.929H9.929z" transform="rotate(-45 10.935 6.931)"></path>
            </svg></div>
    </div>
    <div class="text-md pt-4 pb-4 px-4">
        <div class="flex justify-between items-center">
            <div class="space-y-2">
                <span class="flex space-x-2 items-center"><svg height="20" width="20" viewBox="0 0 32 32" class="fill-current"><path d="M13,30a5.0057,5.0057,0,0,1-5-5h2a3,3,0,1,0,3-3H4V20h9a5,5,0,0,1,0,10Z"></path><path d="M25 25a5.0057 5.0057 0 01-5-5h2a3 3 0 103-3H2V15H25a5 5 0 010 10zM21 12H6V10H21a3 3 0 10-3-3H16a5 5 0 115 5z"></path></svg> <span>${wind_speed}</span></span><span class="flex space-x-2 items-center"><svg height="20" width="20" viewBox="0 0 32 32" class="fill-current"><path d="M16,24V22a3.2965,3.2965,0,0,0,3-3h2A5.2668,5.2668,0,0,1,16,24Z"></path><path d="M16,28a9.0114,9.0114,0,0,1-9-9,9.9843,9.9843,0,0,1,1.4941-4.9554L15.1528,3.4367a1.04,1.04,0,0,1,1.6944,0l6.6289,10.5564A10.0633,10.0633,0,0,1,25,19,9.0114,9.0114,0,0,1,16,28ZM16,5.8483l-5.7817,9.2079A7.9771,7.9771,0,0,0,9,19a7,7,0,0,0,14,0,8.0615,8.0615,0,0,0-1.248-3.9953Z"></path></svg> <span>${humidity}</span></span>
            </div>
            <div>
                <h1 class="text-6xl"> ${temp}° </h1>
            </div>
        </div>
    </div>
</div>
</div>`;

const key = "8f2875f9b989ac5a9dc52fb980db0d8d";
const limit = 5;
const API_KEY = "654fd01a35mshb9c31d9a0f53583p152d5bjsn0200a077ba18";

const endpoint = (city) =>
  `http://api.openweathermap.org/geo/1.0/direct?q=${city}&${limit}=1&appid=${key}`;

const url = (lat, lon) =>
  `https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?lat=${lat}&lon=${lon}`;
const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": `${API_KEY}`,
    "X-RapidAPI-Host": "weather-by-api-ninjas.p.rapidapi.com",
  },
};

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
      const getLocation = await fetch(url(lat, lon), options);
      const locationData = await getLocation.json();
      
      const currentTime = new Date().toLocaleTimeString();
        const { name, country } = data[0];
        const { temp, humidity, wind_speed } = locationData;
        resultContainer.innerHTML +=showResult(name, country,temp, humidity, wind_speed,currentTime);
      }
    } catch (error) {
      console.log(`error`, error);
    } finally {
      hideLoader();
      inputBox.value = "";
    }
  }
};

button.addEventListener("click", getWeather);
locator.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const getWeatherByLocation = async () => {
        try {
            resultContainer.innerHTML="";
            showLoader();
            const response = await fetch(url(latitude, longitude), options);
            const data = await response.json();
            const location = await fetch(locateCity(latitude, longitude));
            const locationData = await location.json();
            const { city, countryName } = locationData;
            var name = city;
            var country = countryName;
            const { temp, humidity, wind_speed } = data;
            const currentTime = new Date().toLocaleTimeString();
            resultContainer.innerHTML +=showResult(name, country,temp, humidity, wind_speed,currentTime);
        } catch (error) {
            console.log(`error`, error);
        } finally {
            hideLoader();
        }
        };
        getWeatherByLocation();
    });
})