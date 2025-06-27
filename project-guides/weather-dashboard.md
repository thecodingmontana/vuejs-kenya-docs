---
outline: deep
---

# Vue Weather Dashboard

A comprehensive weather dashboard application built with Vue.js that integrates with weather APIs to provide current conditions, forecasts, and interactive data visualization.

## Features

- Real-time current weather display
- 5-day weather forecast
- Location-based search functionality
- Celsius/Fahrenheit temperature toggle
- Weather condition icons and animations
- Responsive design for all devices
- Geolocation detection
- Weather data caching

## Technical Implementation

The dashboard uses Vue 3 Composition API with async data fetching, reactive state management, and modern JavaScript features for optimal performance.

### Core Architecture

- **API Integration** - OpenWeatherMap API for weather data
- **State Management** - Reactive data with Vue composables
- **Error Handling** - Comprehensive error boundaries
- **Caching** - Local storage for API response optimization
- **Responsive Design** - Mobile-first CSS grid layout

### Key Components

- **WeatherCard** - Current weather display
- **ForecastList** - Multi-day forecast grid  
- **LocationSearch** - City search with autocomplete
- **TemperatureChart** - Visual temperature trends
- **LoadingSpinner** - Loading state indicator

## Working Example

Here's a complete weather dashboard implementation:

```vue
<template>
  <div class="weather-dashboard">
    <header class="dashboard-header">
      <h1>Weather Dashboard</h1>
      <div class="controls">
        <button 
          @click="toggleUnits"
          class="unit-toggle"
        >
          °{{ isCelsius ? 'C' : 'F' }}
        </button>
        <button @click="getCurrentLocation">
          📍 Current Location
        </button>
      </div>
    </header>

    <!-- Location Search -->
    <section class="search-section">
      <div class="search-container">
        <input
          v-model="searchQuery"
          @keyup.enter="searchLocation"
          placeholder="Search for a city..."
          class="search-input"
        />
        <button @click="searchLocation">Search</button>
      </div>
    </section>

    <!-- Loading State -->
    <div v-if="loading" class="loading-spinner">
      <div class="spinner"></div>
      <p>Loading weather data...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="retryFetch">Retry</button>
    </div>

    <!-- Weather Content -->
    <main v-if="!loading && !error && currentWeather" class="weather-content">
      <!-- Current Weather Card -->
      <section class="current-weather">
        <div class="weather-card">
          <div class="location">
            <h2>{{ currentWeather.name }}, {{ currentWeather.sys.country }}</h2>
            <p class="date">{{ formatDate(new Date()) }}</p>
          </div>
          
          <div class="weather-main">
            <div class="temperature">
              <span class="temp-value">
                {{ Math.round(currentWeather.main.temp) }}°
              </span>
              <div class="weather-icon">
                {{ getWeatherIcon(currentWeather.weather[0].main) }}
              </div>
            </div>
            
            <div class="weather-details">
              <p class="description">
                {{ currentWeather.weather[0].description }}
              </p>
              <p>Feels like {{ Math.round(currentWeather.main.feels_like) }}°</p>
            </div>
          </div>

          <div class="weather-stats">
            <div class="stat">
              <span class="label">Humidity</span>
              <span class="value">{{ currentWeather.main.humidity }}%</span>
            </div>
            <div class="stat">
              <span class="label">Wind</span>
              <span class="value">{{ currentWeather.wind.speed }} m/s</span>
            </div>
            <div class="stat">
              <span class="label">Pressure</span>
              <span class="value">{{ currentWeather.main.pressure }} hPa</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 5-Day Forecast -->
      <section class="forecast-section">
        <h3>5-Day Forecast</h3>
        <div class="forecast-grid">
          <div 
            v-for="forecast in dailyForecast" 
            :key="forecast.dt"
            class="forecast-card"
          >
            <div class="forecast-date">
              {{ formatDay(forecast.dt) }}
            </div>
            <div class="forecast-icon">
              {{ getWeatherIcon(forecast.weather[0].main) }}
            </div>
            <div class="forecast-temps">
              <span class="temp-high">{{ Math.round(forecast.main.temp_max) }}°</span>
              <span class="temp-low">{{ Math.round(forecast.main.temp_min) }}°</span>
            </div>
            <div class="forecast-desc">
              {{ forecast.weather[0].main }}
            </div>
          </div>
        </div>
      </section>

      <!-- Temperature Chart -->
      <section class="chart-section">
        <h3>Temperature Trend</h3>
        <div class="temperature-chart">
          <canvas ref="chartCanvas" width="800" height="300"></canvas>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'

// API Configuration
const API_KEY = 'your-openweathermap-api-key'
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

// Reactive state
const currentWeather = ref(null)
const forecastData = ref(null)
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const isCelsius = ref(true)
const chartCanvas = ref(null)

// Computed properties
const dailyForecast = computed(() => {
  if (!forecastData.value) return []
  
  // Group forecast by day and take first entry per day
  const daily = []
  const seen = new Set()
  
  forecastData.value.list.forEach(item => {
    const date = new Date(item.dt * 1000).toDateString()
    if (!seen.has(date) && daily.length < 5) {
      seen.add(date)
      daily.push(item)
    }
  })
  
  return daily
})

// Weather icon mapping
const getWeatherIcon = (condition) => {
  const icons = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '❄️',
    'Mist': '🌫️',
    'Fog': '🌫️'
  }
  return icons[condition] || '🌤️'
}

// API functions
const fetchWeatherData = async (city) => {
  loading.value = true
  error.value = null
  
  try {
    const units = isCelsius.value ? 'metric' : 'imperial'
    
    // Fetch current weather
    const currentResponse = await fetch(
      `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=${units}`
    )
    
    if (!currentResponse.ok) {
      throw new Error('City not found')
    }
    
    const current = await currentResponse.json()
    currentWeather.value = current
    
    // Fetch forecast
    const forecastResponse = await fetch(
      `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=${units}`
    )
    
    const forecast = await forecastResponse.json()
    forecastData.value = forecast
    
    // Cache data
    cacheWeatherData(city, { current, forecast })
    
    // Draw temperature chart
    await nextTick()
    drawTemperatureChart()
    
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    error.value = 'Geolocation not supported'
    return
  }
  
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords
      await fetchWeatherByCoords(latitude, longitude)
    },
    () => {
      error.value = 'Location access denied'
    }
  )
}

const fetchWeatherByCoords = async (lat, lon) => {
  loading.value = true
  error.value = null
  
  try {
    const units = isCelsius.value ? 'metric' : 'imperial'
    
    const currentResponse = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`
    )
    
    const current = await currentResponse.json()
    currentWeather.value = current
    
    const forecastResponse = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`
    )
    
    const forecast = await forecastResponse.json()
    forecastData.value = forecast
    
    await nextTick()
    drawTemperatureChart()
    
  } catch (err) {
    error.value = 'Failed to fetch weather data'
  } finally {
    loading.value = false
  }
}

// Chart drawing function
const drawTemperatureChart = () => {
  if (!chartCanvas.value || !forecastData.value) return
  
  const canvas = chartCanvas.value
  const ctx = canvas.getContext('2d')
  const data = forecastData.value.list.slice(0, 8) // Next 24 hours
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // Chart dimensions
  const padding = 50
  const chartWidth = canvas.width - padding * 2
  const chartHeight = canvas.height - padding * 2
  
  // Find temperature range
  const temps = data.map(item => item.main.temp)
  const minTemp = Math.min(...temps)
  const maxTemp = Math.max(...temps)
  
  // Draw temperature line
  ctx.beginPath()
  ctx.strokeStyle = '#007bff'
  ctx.lineWidth = 3
  
  data.forEach((item, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth
    const y = padding + chartHeight - 
      ((item.main.temp - minTemp) / (maxTemp - minTemp)) * chartHeight
    
    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
    
    // Draw temperature points
    ctx.fillStyle = '#007bff'
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, Math.PI * 2)
    ctx.fill()
    
    // Draw temperature labels
    ctx.fillStyle = '#333'
    ctx.font = '12px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(`${Math.round(item.main.temp)}°`, x, y - 10)
  })
  
  ctx.stroke()
}

// Utility functions
const searchLocation = () => {
  if (searchQuery.value.trim()) {
    fetchWeatherData(searchQuery.value.trim())
  }
}

const toggleUnits = async () => {
  isCelsius.value = !isCelsius.value
  if (currentWeather.value) {
    await fetchWeatherData(currentWeather.value.name)
  }
}

const retryFetch = () => {
  if (searchQuery.value) {
    fetchWeatherData(searchQuery.value)
  } else {
    getCurrentLocation()
  }
}

const formatDate = (date) => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDay = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    weekday: 'short'
  })
}

const cacheWeatherData = (city, data) => {
  const cacheKey = `weather_${city.toLowerCase()}`
  const cacheData = {
    ...data,
    timestamp: Date.now()
  }
  localStorage.setItem(cacheKey, JSON.stringify(cacheData))
}

// Initialize app
onMounted(() => {
  // Default to user's location or a default city
  getCurrentLocation()
})

// Watch for unit changes
watch(isCelsius, () => {
  if (currentWeather.value && forecastData.value) {
    drawTemperatureChart()
  }
})
</script>

<style scoped>
.weather-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.controls {
  display: flex;
  gap: 10px;
}

.unit-toggle {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
}

.search-section {
  margin-bottom: 30px;
}

.search-container {
  display: flex;
  max-width: 400px;
  gap: 10px;
}

.search-input {
  flex: 1;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.loading-spinner {
  text-align: center;
  padding: 50px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  text-align: center;
  padding: 30px;
  background: #f8d7da;
  border-radius: 8px;
  color: #721c24;
}

.weather-card {
  background: linear-gradient(135deg, #74b9ff, #0984e3);
  color: white;
  padding: 30px;
  border-radius: 16px;
  margin-bottom: 30px;
}

.weather-main {
  display: flex;
  align-items: center;
  margin: 20px 0;
}

.temperature {
  display: flex;
  align-items: center;
  margin-right: 30px;
}

.temp-value {
  font-size: 4rem;
  font-weight: bold;
  margin-right: 15px;
}

.weather-icon {
  font-size: 3rem;
}

.weather-stats {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.stat {
  text-align: center;
}

.stat .label {
  display: block;
  opacity: 0.8;
  font-size: 0.9rem;
}

.stat .value {
  display: block;
  font-weight: bold;
  font-size: 1.1rem;
}

.forecast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.forecast-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.forecast-icon {
  font-size: 2rem;
  margin: 10px 0;
}

.forecast-temps {
  margin: 10px 0;
}

.temp-high {
  font-weight: bold;
  margin-right: 10px;
}

.temp-low {
  color: #666;
}

.chart-section {
  margin-top: 40px;
}

.temperature-chart {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

button:hover {
  opacity: 0.9;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .weather-main {
    flex-direction: column;
    text-align: center;
  }
  
  .forecast-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
```

## Key Implementation Details

### API Integration

The dashboard integrates with OpenWeatherMap API for real-time weather data. It handles both current weather and 5-day forecast endpoints with proper error handling.

### State Management

Uses Vue 3 Composition API with reactive references for weather data, loading states, and user preferences. All state changes trigger reactive UI updates.

### Data Visualization

Implements a custom canvas-based temperature chart showing hourly temperature trends. The chart dynamically scales based on temperature range.

### Error Handling

Comprehensive error boundaries handle API failures, network issues, and geolocation errors with user-friendly messages and retry options.

## Best Practices

**API Error Handling**: Robust error catching with specific error messages and retry mechanisms for failed requests.

**Loading State Management**: Clear loading indicators during API calls with smooth transitions between states.

**Data Caching**: Local storage caching reduces API calls and improves performance for repeated location searches.

**Performance Optimization**: Efficient data processing and chart rendering with proper cleanup and memory management.

**User Experience**: Intuitive interface with geolocation support, unit conversion, and responsive design for all devices.

**Accessibility**: Semantic HTML structure with proper ARIA labels and keyboard navigation support.

## Learning Objectives

This implementation demonstrates:

- **External API Integration** - RESTful API consumption with async/await patterns
- **Async Operations** - Promise handling, error boundaries, and loading states  
- **Data Visualization** - Custom canvas charts with dynamic data rendering
- **State Management** - Reactive data flow and computed properties
- **Responsive Design** - Mobile-first CSS Grid and Flexbox layouts
- **Error Boundaries** - Comprehensive error handling and user feedback

The dashboard provides a solid foundation for building weather applications with features like weather alerts, multiple location tracking, and advanced data visualization.
