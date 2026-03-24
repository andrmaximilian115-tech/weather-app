const API_KEY = "bd5e378503939ddaee76f12ad7a97608";

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherCard = document.getElementById('weatherCard');
const errorBlock = document.getElementById('errorBlock');

const tempValueSpan = document.getElementById('tempValue');
const weatherIconDiv = document.getElementById('weatherIcon');
const cityNameSpan = document.getElementById('cityName').querySelector('span:first-child');
const countryCodeSpan = document.getElementById('countryCode');
const latLonSpan = document.getElementById('latLon');
const humiditySpan = document.getElementById('humidity');
const feelsLikeSpan = document.getElementById('feelsLike');
const windSpeedSpan = document.getElementById('windSpeed');
const updateTimeSpan = document.getElementById('updateTime');
const tempIndicator = document.getElementById('tempIndicator');

async function fetchWeather(city) {
    if (!city.trim()) {
        showError("Пожалуйста, введите название города");
        return;
    }
    
    tempValueSpan.innerHTML = '-- <span>°C</span>';
    cityNameSpan.innerText = 'Загрузка...';
    countryCodeSpan.innerText = '--';
    latLonSpan.innerText = 'получение данных...';
    
    hideError();
    
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=ru`
        );
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Город "${city}" не найден. Проверьте название.`);
            } else if (response.status === 401) {
                throw new Error("Ошибка API: неверный ключ. Проверьте API_KEY");
            } else {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }
        }
        
        const data = await response.json();
        updateWeatherUI(data);
        
    } catch (error) {
        console.error(error);
        showError(error.message);
        resetUIClear();
    }
}

function updateWeatherUI(data) {
    const temp = Math.round(data.main.temp);
    tempValueSpan.innerHTML = `${temp} <span>°C</span>`;
    
    const weatherMain = data.weather[0].main.toLowerCase();
    let iconHtml = '';
    if (weatherMain.includes('clear')) iconHtml = '<i class="fas fa-sun" style="color: #f5b042;"></i>';
    else if (weatherMain.includes('cloud')) iconHtml = '<i class="fas fa-cloud-sun" style="color: #6c7a89;"></i>';
    else if (weatherMain.includes('rain')) iconHtml = '<i class="fas fa-cloud-rain" style="color: #4a6e8c;"></i>';
    else if (weatherMain.includes('thunder')) iconHtml = '<i class="fas fa-bolt" style="color: #c9b037;"></i>';
    else if (weatherMain.includes('snow')) iconHtml = '<i class="fas fa-snowflake" style="color: #a0c4e5;"></i>';
    else iconHtml = '<i class="fas fa-smog"></i>';
    weatherIconDiv.innerHTML = iconHtml;
    
    cityNameSpan.innerText = data.name;
    const countryCode = data.sys.country || '??';
    countryCodeSpan.innerText = countryCode;
    
    const lat = data.coord.lat;
    const lon = data.coord.lon;
    latLonSpan.innerHTML = `${lat.toFixed(2)}° с.ш., ${lon.toFixed(2)}° в.д.`;
    
    humiditySpan.innerText = `${data.main.humidity} %`;
    
    const feelsLike = Math.round(data.main.feels_like);
    feelsLikeSpan.innerText = `${feelsLike} °C`;
    
    const windMs = data.wind.speed;
    windSpeedSpan.innerText = `${windMs.toFixed(1)} м/с`;
    
    const updateDate = new Date();
    const formattedTime = updateDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    updateTimeSpan.innerText = formattedTime;
    
    changeColorByTemp(temp);
}

function changeColorByTemp(temp) {
    let color = '';
    if (temp > 25) {
        color = '#ff5e3a';
    } else if (temp > 15) {
        color = '#ffb347';
    } else if (temp > 5) {
        color = '#3ba0ff';
    } else {
        color = '#9b59b6';
    }
    tempIndicator.style.backgroundColor = color;
    
    const weatherIconElem = weatherIconDiv.querySelector('i');
    if (weatherIconElem) {
        if (temp > 25) weatherIconElem.style.color = '#ff784b';
        else if (temp > 15) weatherIconElem.style.color = '#f5b042';
        else if (temp > 5) weatherIconElem.style.color = '#4aa3df';
        else weatherIconElem.style.color = '#b980ea';
    }
}

function resetUIClear() {
    tempValueSpan.innerHTML = '-- <span>°C</span>';
    cityNameSpan.innerText = '--';
    countryCodeSpan.innerText = '--';
    latLonSpan.innerHTML = 'широта, долгота';
    humiditySpan.innerText = '-- %';
    feelsLikeSpan.innerText = '-- °C';
    windSpeedSpan.innerText = '-- м/с';
    updateTimeSpan.innerText = '--:--';
    weatherIconDiv.innerHTML = '<i class="fas fa-cloud-moon"></i>';
    tempIndicator.style.backgroundColor = '#ccc';
}

function showError(message) {
    errorBlock.innerText = `⚠️ ${message}`;
    errorBlock.classList.remove('hidden');
    weatherCard.style.opacity = '0.6';
}

function hideError() {
    errorBlock.classList.add('hidden');
    weatherCard.style.opacity = '1';
}

searchBtn.addEventListener('click', () => {
    fetchWeather(cityInput.value);
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchWeather(cityInput.value);
    }
});

window.addEventListener('load', () => {
    fetchWeather(cityInput.value);
});
