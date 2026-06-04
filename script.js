let hourlyData = [];

// 🌙 DARK MODE
function toggleTheme(){
    document.body.classList.toggle("dark");
}

// 📍 GPS WEATHER
function getLocationWeather(){
    navigator.geolocation.getCurrentPosition(async (pos)=>{

        let lat = pos.coords.latitude;
        let lon = pos.coords.longitude;

        let url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;

        let res = await fetch(url);
        let data = await res.json();

        showData("Your Location", data);
    });
}

// 🌍 CITY WEATHER
async function getWeather(){

    let city = document.getElementById("cityInput").value;

    let geo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
    let geoData = await geo.json();

    if(!geoData.results || geoData.results.length === 0){
        alert("City not found");
        return;
    }

    let lat = geoData.results[0].latitude;
    let lon = geoData.results[0].longitude;

    let url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;

    let res = await fetch(url);
    let data = await res.json();

    showData(city, data);
}

// 📊 SHOW DATA
function showData(name, data){

    let temp = data.current.temperature_2m;
    let wind = data.current.wind_speed_10m;
    let humidity = data.current.relative_humidity_2m;
    let code = data.current.weather_code;

    let condition = "";

    if(code === 0) condition = "Clear ☀️";
    else if(code <= 3) condition = "Cloudy ☁️";
    else if(code <= 48) condition = "Fog 🌫️";
    else if(code <= 67) condition = "Rain 🌧️";
    else condition = "Normal Weather 🌍";

    document.getElementById("current").innerHTML = `
        <div style="padding:10px">
            <h3>📍 ${name}</h3>
            <p>🌡️ Temperature: ${temp}°C</p>
            <p>💨 Wind: ${wind} km/h</p>
            <p>💧 Humidity: ${humidity}%</p>
            <p>🌈 Condition: ${condition}</p>
        </div>
    `;

    hourlyData = data.hourly.temperature_2m;

    let weekHTML = "";

    for(let i=0;i<7;i++){

        let date = new Date(data.daily.time[i]);

        weekHTML += `
        <div class="day" onclick="showHour(${i})">
            <b>${date.toDateString().slice(0,3)}</b>
            <br>
            ${data.daily.temperature_2m_max[i]}° / ${data.daily.temperature_2m_min[i]}°
        </div>`;
    }

    document.getElementById("week").innerHTML = weekHTML;

    document.getElementById("hourly").innerHTML = "<h3>Select a day</h3>";
}

// ⏰ HOURLY VIEW
function showHour(dayIndex){

    let start = dayIndex * 24;

    let html = "<h3>⏰ Hourly Weather</h3>";

    for(let i=start;i<start+24;i++){
        html += `<p>Hour ${i%24}: ${hourlyData[i]}°C</p>`;
    }

    document.getElementById("hourly").innerHTML = html;
}
