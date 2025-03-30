const apiKey = 'e3bb4c2471544267ad0142222253003';  

async function getWeather() {
    let city = document.getElementById('cityInput').value;
    let url = `http://api.weatherapi.com/v1/current.json?key=e3bb4c2471544267ad0142222253003&q=${city}`;

    let response = await fetch(url);
    let data = await response.json();

    if (response.ok) {
        document.getElementById('weatherResult').innerHTML = `
            <h2>${data.location.name}, ${data.location.country}</h2>
            <h3>${data.current.temp_c}°C</h3>
            <p>${data.current.condition.text}</p>
            <img src="${data.current.condition.icon}" alt="weather icon">
            <p>Humidity: ${data.current.humidity}% | Wind: ${data.current.wind_kph} km/h</p>
            <p>Feels Like: ${data.current.feelslike_c}°C</p>
            <p>Pressure: ${data.current.pressure_mb} hPa</p>
            <p>Visibility: ${data.current.vis_km} km</p>
            <p>Cloud Cover: ${data.current.cloud}%</p>
            <p>Dew Point: ${calculateDewPoint(data.current.temp_c, data.current.humidity)}°C</p>
            <p>Sunrise: ${data.location.localtime.split(' ')[1]}</p>
            <p>Sunset: N/A (Only in forecast data)</p>
        `;

        updateBackground(data.current.condition.text);
    } else {
        document.getElementById('weatherResult').innerHTML = `<p>City not found!</p>`;
    }
}

function updateBackground(condition) {
  const body = document.body;
  body.classList.remove('sunny', 'rainy', 'cloudy', 'snowy');
  
  if (condition.includes('sunny')) {
      body.classList.add('sunny');
  } else if (condition.includes('rain')) {
      body.classList.add('rainy');
  } else if (condition.includes('cloud')) {
      body.classList.add('cloudy');
  } else if (condition.includes('snow')) {
      body.classList.add('snowy');
  }
}

async function getLocation() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
          let lat = position.coords.latitude;
          let lon = position.coords.longitude;
          let url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`;

          let response = await fetch(url);
          let data = await response.json();
          document.getElementById('cityInput').value = data.location.name;
          getWeather();
      });
  } else {
      alert("Geolocation not supported");
  }
}

function calculateDewPoint(temp, humidity) {
  return (temp - ((100 - humidity) / 5)).toFixed(1);
}


document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});
