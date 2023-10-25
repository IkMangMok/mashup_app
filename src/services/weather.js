
import axios from 'axios';  // 引入axios库

const WEATHER_API_URL = 'https://restapi.amap.com/v3/weather/weatherInfo';

const getWeather = async (cityName) => {
  // 查找城市的adcode
  const citiesData = require('../assets/cityData.json');
  const cities = citiesData.sheet1;
  
  const city = cities.find(c => c.中文名.includes(cityName));
  if (!city) {
    console.log('City not found.');
    return;
  }

  const adcode = city.adcode;
  try {
    const response = await axios.get(WEATHER_API_URL, {
      params: {
        city: adcode,
        key: '07572561caa4261f74d607559800cd64'
      }
    });
    
    // 确保API调用成功
    if (response.data.status !== '1') {
      throw new Error('Weather API call failed.');
    }
    
    // 从API响应中提取所需的天气数据
    const liveWeather = response.data.lives[0];
    return {
      weather: liveWeather.weather,
      temperature: liveWeather.temperature,
      winddirection: liveWeather.winddirection,
      windpower: liveWeather.windpower,
      humidity: liveWeather.humidity
    };
  } catch (error) {
    throw new Error(`Failed to fetch weather for ${cityName}. Error: ${error.message}`);
  }
}

export default getWeather;
