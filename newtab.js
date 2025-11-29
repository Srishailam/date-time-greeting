// Get all DOM elements
const greetingElement = document.getElementById('greeting');
const emojiElement = document.getElementById('emoji');
const timeElement = document.getElementById('time');
const dayElement = document.getElementById('day');
const dateElement = document.getElementById('date');

// Weather elements
const weatherLoading = document.getElementById('weatherLoading');
const weatherContent = document.getElementById('weatherContent');
const weatherError = document.getElementById('weatherError');
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const weatherIconElement = document.getElementById('weatherIcon');
const weatherDescElement = document.getElementById('weatherDescription');
const humidityElement = document.getElementById('humidity');
const windSpeedElement = document.getElementById('windSpeed');

// Get settings from config file
let TEMPERATURE_UNIT = CONFIG.TEMPERATURE_UNIT || 'fahrenheit';
let TEMP_SYMBOL = TEMPERATURE_UNIT === 'fahrenheit' ? '°F' : '°C';

// Store last known coordinates and city name for temp unit switching
let lastKnownCoords = null;
let lastKnownCity = null;

// Function to get greeting based on time of day
function getGreeting(hour) {
    if (hour >= 5 && hour < 12) {
        return {
            text: 'Good Morning!',
            emoji: '🌅',
            className: 'morning'
        };
    } else if (hour >= 12 && hour < 17) {
        return {
            text: 'Good Afternoon!',
            emoji: '☀️',
            className: 'afternoon'
        };
    } else if (hour >= 17 && hour < 21) {
        return {
            text: 'Good Evening!',
            emoji: '🌆',
            className: 'evening'
        };
    } else {
        return {
            text: 'Good Night!',
            emoji: '🌙',
            className: 'night'
        };
    }
}

// Function to format time with AM/PM
function formatTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    
    return `${hours}:${minutes}:${seconds} ${ampm}`;
}

// Function to get day name
function getDayName(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
}

// Function to format date
function formatDate(date) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    return `${month} ${day}, ${year}`;
}

// Function to update all elements
function updateDateTime() {
    const now = new Date();
    const hour = now.getHours();
    
    // Update greeting and emoji
    const greeting = getGreeting(hour);
    greetingElement.textContent = greeting.text;
    emojiElement.textContent = greeting.emoji;
    
    // Update body class for background gradient
    document.body.className = greeting.className;
    
    // Update time
    timeElement.textContent = formatTime(now);
    
    // Update day
    dayElement.textContent = getDayName(now);
    
    // Update date
    dateElement.textContent = formatDate(now);
}

// Function to get weather emoji and description based on WMO code
// Open-Meteo uses WMO Weather interpretation codes
function getWeatherInfo(wmoCode) {
    const weatherMap = {
        0: { emoji: '☀️', description: 'Clear sky' },
        1: { emoji: '🌤️', description: 'Mainly clear' },
        2: { emoji: '⛅', description: 'Partly cloudy' },
        3: { emoji: '☁️', description: 'Overcast' },
        45: { emoji: '🌫️', description: 'Foggy' },
        48: { emoji: '🌫️', description: 'Rime fog' },
        51: { emoji: '🌦️', description: 'Light drizzle' },
        53: { emoji: '🌦️', description: 'Moderate drizzle' },
        55: { emoji: '🌧️', description: 'Dense drizzle' },
        61: { emoji: '🌧️', description: 'Slight rain' },
        63: { emoji: '🌧️', description: 'Moderate rain' },
        65: { emoji: '🌧️', description: 'Heavy rain' },
        71: { emoji: '🌨️', description: 'Slight snow' },
        73: { emoji: '🌨️', description: 'Moderate snow' },
        75: { emoji: '❄️', description: 'Heavy snow' },
        77: { emoji: '❄️', description: 'Snow grains' },
        80: { emoji: '🌦️', description: 'Slight rain showers' },
        81: { emoji: '🌧️', description: 'Moderate rain showers' },
        82: { emoji: '⛈️', description: 'Violent rain showers' },
        85: { emoji: '🌨️', description: 'Slight snow showers' },
        86: { emoji: '❄️', description: 'Heavy snow showers' },
        95: { emoji: '⛈️', description: 'Thunderstorm' },
        96: { emoji: '⛈️', description: 'Thunderstorm with hail' },
        99: { emoji: '⛈️', description: 'Thunderstorm with heavy hail' }
    };
    
    return weatherMap[wmoCode] || { emoji: '🌤️', description: 'Unknown' };
}

// Function to fetch weather data from Open-Meteo (no API key needed!)
async function fetchWeather(latitude, longitude) {
    try {
        const tempUnit = TEMPERATURE_UNIT === 'fahrenheit' ? 'fahrenheit' : 'celsius';
        const windUnit = TEMPERATURE_UNIT === 'fahrenheit' ? 'mph' : 'kmh';
        
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&temperature_unit=${tempUnit}&wind_speed_unit=${windUnit}&timezone=auto`
        );
        
        if (!response.ok) {
            throw new Error(`Weather API Error: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather:', error);
        throw error;
    }
}

// Function to fetch 5-day forecast from Open-Meteo
async function fetchForecast(latitude, longitude) {
    try {
        const tempUnit = TEMPERATURE_UNIT === 'fahrenheit' ? 'fahrenheit' : 'celsius';
        
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=${tempUnit}&timezone=auto&forecast_days=5`
        );
        
        if (!response.ok) {
            throw new Error('Forecast API request failed');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching forecast:', error);
        return null;
    }
}

// Function to process Open-Meteo forecast data into daily highs/lows
function processForecastData(forecastData) {
    if (!forecastData || !forecastData.daily) return [];
    
    const { daily } = forecastData;
    const forecasts = [];
    
    for (let i = 0; i < Math.min(5, daily.time.length); i++) {
        const date = new Date(daily.time[i]);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const high = Math.round(daily.temperature_2m_max[i]);
        const low = Math.round(daily.temperature_2m_min[i]);
        const wmoCode = daily.weather_code[i];
        const weatherInfo = getWeatherInfo(wmoCode);
        
        forecasts.push({
            dayName,
            high,
            low,
            emoji: weatherInfo.emoji,
            description: weatherInfo.description
        });
    }
    
    return forecasts;
}

// Function to display weather data from Open-Meteo
async function displayWeather(weatherData, forecastData = null, cityInfo = null) {
    const temp = Math.round(weatherData.current.temperature_2m);
    const humidity = weatherData.current.relative_humidity_2m;
    const windSpeed = Math.round(weatherData.current.wind_speed_10m);
    const windUnit = TEMPERATURE_UNIT === 'fahrenheit' ? 'mph' : 'km/h';
    const wmoCode = weatherData.current.weather_code;
    const weatherInfo = getWeatherInfo(wmoCode);
    
    // Get city info if not provided
    if (!cityInfo && lastKnownCity) {
        cityInfo = lastKnownCity;
    } else if (!cityInfo && lastKnownCoords) {
        cityInfo = await getCityName(lastKnownCoords.latitude, lastKnownCoords.longitude);
        lastKnownCity = cityInfo;
    }
    
    const locationText = cityInfo 
        ? `${cityInfo.city}${cityInfo.country ? ', ' + cityInfo.country.toUpperCase() : ''}`
        : 'Your Location';
    
    // Update UI
    locationElement.textContent = locationText;
    temperatureElement.textContent = `${temp}${TEMP_SYMBOL}`;
    weatherIconElement.textContent = weatherInfo.emoji;
    weatherDescElement.textContent = weatherInfo.description;
    humidityElement.textContent = humidity;
    windSpeedElement.textContent = windSpeed;
    
    // Update wind unit in HTML
    const windSpeedLabel = document.querySelector('#windSpeed').parentElement;
    windSpeedLabel.innerHTML = `<span class="detail-icon">💨</span><span id="windSpeed">${windSpeed}</span> ${windUnit} Wind`;
    
    // Show weather content, hide loading
    weatherLoading.style.display = 'none';
    weatherContent.style.display = 'block';
    
    // Display forecast if available
    if (forecastData) {
        displayForecast(forecastData);
    }
}

// Function to display 5-day forecast
function displayForecast(forecastData) {
    const dailyForecasts = processForecastData(forecastData);
    
    if (dailyForecasts.length === 0) return;
    
    // Check if forecast section already exists
    let forecastSection = document.getElementById('forecastSection');
    
    if (!forecastSection) {
        // Create forecast section
        forecastSection = document.createElement('div');
        forecastSection.id = 'forecastSection';
        forecastSection.className = 'forecast-section';
        
        const weatherSection = document.getElementById('weatherSection');
        weatherSection.appendChild(forecastSection);
    }
    
    // Clear existing content
    forecastSection.innerHTML = '<div class="forecast-title">5-Day Forecast</div>';
    
    // Create forecast cards container
    const forecastContainer = document.createElement('div');
    forecastContainer.className = 'forecast-container';
    
    dailyForecasts.forEach(day => {
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <div class="forecast-day">${day.dayName}</div>
            <div class="forecast-emoji">${day.emoji}</div>
            <div class="forecast-high">${day.high}${TEMP_SYMBOL}</div>
            <div class="forecast-low">${day.low}${TEMP_SYMBOL}</div>
        `;
        forecastContainer.appendChild(card);
    });
    
    forecastSection.appendChild(forecastContainer);
}

// Function to show weather error
function showWeatherError(message, details) {
    weatherLoading.style.display = 'none';
    weatherError.style.display = 'block';
    
    const errorTextElement = weatherError.querySelector('.error-text');
    if (message) {
        errorTextElement.textContent = message;
    }
    
    // Add detailed error information if available
    if (details) {
        const existingDetails = weatherError.querySelector('.error-details');
        if (existingDetails) {
            existingDetails.remove();
        }
        
        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'error-details';
        detailsDiv.style.fontSize = '14px';
        detailsDiv.style.marginTop = '10px';
        detailsDiv.style.opacity = '0.8';
        detailsDiv.textContent = details;
        weatherError.appendChild(detailsDiv);
    }
}

// Function to get city name from coordinates using reverse geocoding
async function getCityName(latitude, longitude) {
    try {
        const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?latitude=${latitude}&longitude=${longitude}&count=1`
        );
        
        if (!response.ok) {
            throw new Error('Geocoding API Error');
        }
        
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            const result = data.results[0];
            return {
                city: result.name,
                country: result.country_code || result.country || ''
            };
        }
        return { city: 'Unknown Location', country: '' };
    } catch (error) {
        console.error('Error getting city name:', error);
        return { city: 'Your Location', country: '' };
    }
}

// Function to get location and weather
function getLocationAndWeather() {
    // Choose location method based on config
    const locationMethod = CONFIG.LOCATION_METHOD || 'geolocation';
    
    if (locationMethod === 'ip') {
        // Use IP-based location
        fetchWeatherByIP();
        return;
    }
    
    // Otherwise use browser geolocation (accurate GPS/WiFi location)
    if ('geolocation' in navigator) {
        console.log('Requesting precise geolocation...');
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude, accuracy } = position.coords;
                    console.log(`Location found: ${latitude}, ${longitude} (accuracy: ${Math.round(accuracy)}m)`);
                    
                    // Store coordinates for temp unit switching
                    lastKnownCoords = { latitude, longitude };
                    
                    // Get city name and fetch weather
                    const cityInfo = await getCityName(latitude, longitude);
                    lastKnownCity = cityInfo;
                    
                    // Fetch both current weather and forecast
                    const [weatherData, forecastData] = await Promise.all([
                        fetchWeather(latitude, longitude),
                        fetchForecast(latitude, longitude)
                    ]);
                    displayWeather(weatherData, forecastData, cityInfo);
                    
                    // Save successful location
                    localStorage.setItem('lastKnownLocation', JSON.stringify({ 
                        latitude, 
                        longitude,
                        city: cityInfo.city,
                        country: cityInfo.country,
                        accuracy,
                        timestamp: Date.now(),
                        source: 'geolocation'
                    }));
                } catch (error) {
                    console.error('Weather fetch error:', error);
                    // If it's an API key error, show it directly instead of trying fallback
                    if (error.message.includes('Invalid API key') || error.message.includes('API key')) {
                        showWeatherError('Weather API Error', error.message);
                    } else {
                        tryFallbackLocation();
                    }
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                
                // Provide more specific error messages
                let errorMessage = 'Unable to get precise location';
                if (error.code === 1) {
                    console.log('Location permission denied. Falling back to IP-based location...');
                    // Automatically fall back to IP location
                    fetchWeatherByIP();
                    return;
                } else if (error.code === 2) {
                    errorMessage = 'Location unavailable. Trying IP-based location...';
                    tryFallbackLocation();
                    return;
                } else if (error.code === 3) {
                    console.log('Geolocation timeout. Using IP-based location...');
                    // On timeout, immediately use IP location
                    fetchWeatherByIP();
                    return;
                }
                
                console.log(errorMessage);
                // Try fallback methods
                tryFallbackLocation();
            },
            {
                enableHighAccuracy: true,  // Request GPS for accuracy
                timeout: 10000,  // 10 seconds timeout (faster fallback)
                maximumAge: 300000 // Cache position for 5 minutes
            }
        );
    } else {
        console.log('Geolocation not supported. Using IP location...');
        fetchWeatherByIP();
    }
}

// Function to get location from IP address
async function getLocationFromIP() {
    try {
        // Using ipapi.co - free service, no API key needed
        const response = await fetch('https://ipapi.co/json/');
        
        if (!response.ok) {
            throw new Error('IP location service unavailable');
        }
        
        const data = await response.json();
        console.log('Location from IP:', data);
        
        // Get coordinates and city
        const latitude = data.latitude;
        const longitude = data.longitude;
        const city = data.city;
        const country = data.country_code;
        
        return { latitude, longitude, city, country };
    } catch (error) {
        console.error('Error getting location from IP:', error);
        throw error;
    }
}

// Function to fetch weather using IP-based location
async function fetchWeatherByIP() {
    try {
        console.log('Detecting location from IP address...');
        const location = await getLocationFromIP();
        
        // Store coordinates and city for temp unit switching
        lastKnownCoords = { latitude: location.latitude, longitude: location.longitude };
        lastKnownCity = { city: location.city, country: location.country };
        
        // Fetch both current weather and forecast
        const [weatherData, forecastData] = await Promise.all([
            fetchWeather(location.latitude, location.longitude),
            fetchForecast(location.latitude, location.longitude)
        ]);
        displayWeather(weatherData, forecastData, lastKnownCity);
        
        // Save location for future use
        localStorage.setItem('lastKnownLocation', JSON.stringify({
            latitude: location.latitude,
            longitude: location.longitude,
            city: location.city,
            country: location.country,
            source: 'ip'
        }));
        
        console.log('Weather fetched successfully for:', location.city);
    } catch (error) {
        console.error('Error fetching weather by IP:', error);
        showWeatherError('Unable to fetch weather data', error.message);
    }
}


// Fallback function to try alternative methods
async function tryFallbackLocation() {
    // Try to use last known location from localStorage
    const lastLocation = localStorage.getItem('lastKnownLocation');
    if (lastLocation) {
        try {
            const locationData = JSON.parse(lastLocation);
            const { latitude, longitude } = locationData;
            
            lastKnownCoords = { latitude, longitude };
            if (locationData.city) {
                lastKnownCity = { city: locationData.city, country: locationData.country };
            }
            
            const [weatherData, forecastData] = await Promise.all([
                fetchWeather(latitude, longitude),
                fetchForecast(latitude, longitude)
            ]);
            displayWeather(weatherData, forecastData, lastKnownCity);
            return;
        } catch (error) {
            console.error('Failed to use cached location:', error);
        }
    }
    
    // Try IP-based location as final fallback
    fetchWeatherByIP();
}

// Update immediately when page loads
updateDateTime();
getLocationAndWeather();

// Setup temperature toggle buttons with event listeners
const toggleF = document.getElementById('toggleF');
const toggleC = document.getElementById('toggleC');

if (toggleF && toggleC) {
    // Set initial state
    toggleF.classList.toggle('active', TEMPERATURE_UNIT === 'fahrenheit');
    toggleC.classList.toggle('active', TEMPERATURE_UNIT === 'celsius');
    
    // Add click event listeners
    toggleF.addEventListener('click', () => switchTempUnit('fahrenheit'));
    toggleC.addEventListener('click', () => switchTempUnit('celsius'));
}

// Update every second to keep time current
setInterval(updateDateTime, 1000);

// Function to switch temperature units
async function switchTempUnit(unit) {
    console.log('Switching to', unit);
    if (unit === TEMPERATURE_UNIT) return; // Already in this unit
    
    TEMPERATURE_UNIT = unit;
    TEMP_SYMBOL = unit === 'fahrenheit' ? '°F' : '°C';
    
    // Update toggle button states
    const toggleF = document.getElementById('toggleF');
    const toggleC = document.getElementById('toggleC');
    if (toggleF && toggleC) {
        toggleF.classList.toggle('active', unit === 'fahrenheit');
        toggleC.classList.toggle('active', unit === 'celsius');
    }
    
    // Re-fetch weather with new unit - smooth transition
    if (lastKnownCoords) {
        try {
            // Add updating class for visual feedback
            weatherContent.classList.add('updating');
            
            const [weatherData, forecastData] = await Promise.all([
                fetchWeather(lastKnownCoords.latitude, lastKnownCoords.longitude),
                fetchForecast(lastKnownCoords.latitude, lastKnownCoords.longitude)
            ]);
            
            // Small delay for smooth transition
            setTimeout(() => {
                displayWeather(weatherData, forecastData, lastKnownCity);
                weatherContent.classList.remove('updating');
            }, 200);
            
        } catch (error) {
            console.error('Error switching temperature unit:', error);
            weatherContent.classList.remove('updating');
        }
    }
}

// Update weather every 10 minutes
setInterval(getLocationAndWeather, 600000);

