import "./css/style.css";
const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;
const locationInput = document.getElementById("location");
const weatherInfoElement = document.getElementById("weatherInfoCard");
const weatherLocationForm = document.getElementById("weatherLocationForm");

weatherLocationForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let locationInputValue = locationInput.value;

  if (locationInputValue) {
    fetch(
      `${API_URL}/geo/1.0/direct?q=${locationInputValue}&limit=10&appid=${API_KEY}`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.length) {
          const responseData = data[0];
          const { lat, lon, name } = responseData;
          weatherInfoElement.innerHTML = `<h2 class="heading02 mb-20">${name}</h2>`;
          return fetch(
            `${API_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
          );
        } else {
          return "No Response";
        }
      })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const currentCityData = data;
        const weatherCityData = currentCityData.weather[0];
        const weatherIcon = weatherCityData.icon;
        const currentCityWind = currentCityData.wind;
        // console.log(currentCityWind.speed, currentCityWind.deg);
        weatherInfoElement.innerHTML += `<div class="weather-img mb-20">
              <img src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="${weatherCityData.main}" width="50" height="50" loading="lazy">
          </div>
          <div class="weather-info">
              <h3 id="main" class="mb-20">${weatherCityData.main}</h3>
              <p class="description">${weatherCityData.description} | ${currentCityWind.deg} <sup>0</sup>C</p>
          </div>`;

          locationInput.value = "";
      })
      .catch(() => {
        weatherInfoElement.innerHTML = `<p>Try another city</p>`;
        return "No Response";
      });
  } else {
    const validationError = document.createElement("p");
    validationError.textContent = "Value cannot be empty";
    validationError.style.color ="red";
    validationError.style.textAlign ="start";
    validationError.style.padding ="5px";
    locationInput.after(validationError);
  }
});
