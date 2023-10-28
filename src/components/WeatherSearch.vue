<template>
  <div class="weather-container">
    <div class="current-weather">
      <div class="date-display">{{ currentDate }}</div> 
      <h2>{{ cityname }}的实时天气 😃</h2>
      <div class="weather-card" v-if="weatherData">
        <p><strong>天气情况:</strong> {{ weatherData.weather }} ☁️</p>
        <p><strong>温度:</strong> {{ weatherData.temperature }}°C 🌡️</p>
        <p><strong>风向:</strong> {{ weatherData.winddirection }} 🌬️</p>
        <p><strong>风力:</strong> {{ weatherData.windpower }}</p>
        <p><strong>湿度:</strong> {{ weatherData.humidity }}% 💧</p>
      </div>
    </div>
    <div class="weekly-weather" v-if="weeklyWeather">
        <h3 class="weekly-title">{{ cityname }}的一周天气：</h3> 
        <div class="weather-day" v-for="day in weeklyWeather" :key="day.date">
            <span class="day-date">{{ day.date }}</span>
            <span class="day-weather">{{ day.weather }}</span>
            <span class="day-temperature">{{ day.lowest }} - {{ day.highest }}</span>
        </div>
    </div>
  </div>
</template>
  
  <script>
  import axios from 'axios';
  import getWeather from '../services/weather.js';  
  
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
        },
        currentDate: '', // 新的属性来存储日期
        weeklyWeather: [], // 一个数组来存储一周的天气数据
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
      },
      getCurrentDateTime() { // 
          const date = new Date();
          const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
          const formattedTime = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`; // 加上秒数
          this.currentDate = `${formattedDate} ${formattedTime}`; // 合并日期和时间
      },
      getWeeklyWeather(){
  
          axios.get('https://apis.tianapi.com/tianqi/index', {
              params: {
                key: 'd6f57a0a2eb04561224ce00ce2476948',
                city: this.cityname,
                type: 7,
              }
            })
            .then(response => {
              console.log(response.data);
              this.weeklyWeather = response.data.result.list;
            })
            .catch(err => {
              console.error(err);
            });
      },
    },
    mounted() {
      this.fetchWeatherData();
      this.getCurrentDateTime();
      this.getWeeklyWeather();
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
      width: 800px;
      margin: 20px auto;
      display: flex;
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

    .weekly-weather {
          margin-top: 20px;
          border-radius: 8px;
          background-color: #e0f7fa;
          padding: 15px;
    }
    .current-weather {
        margin-top: 20px;
        border-radius: 8px;
        background-color: #e0f2f1;
        padding: 15px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        color: #00695c;  /* 与标题颜色相同 */
    }
    .current-weather, .weekly-weather {
        flex: 1;  /* 确保两个容器都占据相同的空间 */
        padding: 0 15px;  /* 添加一些内边距 */
    }
    .weather-day {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr; /* 将每个天气天分为3部分 */
        gap: 10px; /* 为每个部分之间设置间隙 */
        padding: 10px 0;
        border-bottom: 1px solid #cfd8dc; /* 添加底部边框以分隔每天 */
    }

    .weather-day:last-child {
        border-bottom: none; /* 删除最后一天的底部边框 */
    }

    .day-date {
        font-weight: bold;
    }

    .day-weather {
        text-align: center; /* 将天气描述居中 */
    }

    .day-temperature {
        text-align: right; /* 将温度放在右侧 */
    }
    .weekly-title {
        font-weight: bold;
        margin-bottom: 15px;
        color: #00695c;
        text-align: center;
    }
  </style>
  