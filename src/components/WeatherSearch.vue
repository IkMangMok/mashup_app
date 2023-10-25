<template>
    <div class="weather-container">
      <h2>{{ cityname }}的实时天气 😃</h2>
      <div class="weather-card" v-if="weatherData">
        <p><strong>天气情况:</strong> {{ weatherData.weather }} ☁️</p>
        <p><strong>温度:</strong> {{ weatherData.temperature }}°C 🌡️</p>
        <p><strong>风向:</strong> {{ weatherData.winddirection }} 🌬️</p>
        <p><strong>风力:</strong> {{ weatherData.windpower }}</p>
        <p><strong>湿度:</strong> {{ weatherData.humidity }}% 💧</p>
      </div>
    </div>
  </template>
  
  <script>
  import getWeather from '../services/weather.js';  // 根据实际路径修改
  
  export default {
    props:{
        cityname : String,
    },
    data() {
      return {
        weatherData: {
          weather: '',
          temperature: '',
          winddirection: '',
          windpower: '',
          humidity: ''
        }
      }
    },
    methods: {
      async fetchWeatherData() {
        try {
            console.log(this.cityname)
            this.weatherData = await getWeather(this.cityname);
        } catch (error) {
            console.error(error);
        }
      }
    },
    mounted() {
      this.fetchWeatherData();
    }
  }
  </script>
  
  <style scoped>
  .weather-container {
    font-family: 'Arial', sans-serif;
    text-align: center;
    background-color: #e0f2f1;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    width: 300px;
    margin: 20px auto;
  }
  
  .weather-card {
    background-color: #4db6ac;
    padding: 15px;
    border-radius: 8px;
    color: white;
  }
  
  strong {
    font-weight: bold;
  }
  
  h2 {
    color: #00695c;
    margin-bottom: 20px;
  }
  </style>
  