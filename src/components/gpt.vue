<template>
    <div class="container">
      <!-- 用于GPT API 测试-->
       <!-- 聊天记录 -->
        <div class="chat-history">
          <div v-for="(message, index) in chatHistory" :key="index" :class="['message-box', message.role]">
            <div v-if="message.type === 'text'">{{ message.role === 'user' ? '你: ' : 'GPT: ' }}{{ message.content }}</div>
            <MapComponent v-if="message.type === 'map'" :start="message.start" :end="message.end" :city = "message.city"/>
            <TrainSearch v-if="message.type === 'train'" :date="message.date" :start="message.start" :end="message.end"/>
            <WikiPedia v-if="message.type === 'scenary'" :query="message.location"/>
        </div>
      </div>
      <input v-model="userInput" placeholder="请输入文本..."/>
      <button @click="handleUserInput">提交</button>
      <div id="GPT"></div>
    </div>
  </template>
  
  <script>


  import OpenAI from 'openai';
  import { apiConfig } from '@/services/apiConfig.js';
  import { generateURL } from '@/services/authentication.js';
  import MapComponent from './MapComponent.vue';
  import emitter from '@/services/emitter.js';
  import TrainSearch from './TrainSearch.vue';
  import WikiPedia from './WikiPedia.vue';
  import getWeather from '@/services/weather.js';

  export default {
    name: 'ChatGpt',
    data() {
      return {
        openai: null,  // 用于存储gpt实例的变量
        chatHistory: [],  // 用于存储GPT聊天记录的数组
        sparkHistory: [],  //用于存储讯飞星火API消息的数组
        userInput: "",  // 用户的输入
        gptInput:"", //给予gpt的输入
        gptResponse: "",  // GPT的回应
        API_KEY : "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",
        ApiType:[],
        todaysWeatherData: "",  //存储天气数据
        todaysWeather:"" //天气的自然文本

      };
    },
    components: {
        MapComponent,
        TrainSearch,
        WikiPedia,
    },
    mounted(){

    
      emitter.on('route-found', (routeString) => {
          console.log(routeString);
          // 保存或处理routeString
          this.gptInput = routeString;
          this.getGPTResponse();
      });
    },
    methods: {
      //给予特定的地图ID
        sleep(ms) {
          return new Promise(resolve => setTimeout(resolve, ms));
        },
        async extractInfo(messageFormat) {
            return new Promise((resolve, reject) => {
              const URL = generateURL();
              const ws = new WebSocket(URL);
              console.log(messageFormat)
              ws.addEventListener('open', () => {
                apiConfig.payload.message.text.push({ role: 'user',  content: `这是输入文本：“${this.userInput}”${messageFormat}` });
                ws.send(JSON.stringify(apiConfig));
              });

              ws.addEventListener('message', (data) => {
                const response = JSON.parse(data.data);
                console.log(response.payload.choices.text[0].content)
                this.sparkHistory.push(response.payload.choices.text[0].content);
                if (response.payload.choices.text[0].content.endsWith('。')) {
                    resolve();
                }
              });

              ws.addEventListener('error', (error) => {
                  reject(error);
              });
            });
          },
        async APIChoose(){
        
          if (this.userInput.includes('导航')) {
              this.ApiType.push(1);
              await this.extractInfo('请判断出城市，起点和终点，输出格式例如：“城市：CC，起点：AAA，终点：BBB，以中文句号结束。”');
              this.userInput =[];
          }
          if (this.userInput.includes('飞机')) {
              this.ApiType.push(2);
              await this.extractInfo('请判断出日期，起点和终点，输出格式例如：“日期：2023-10-27，起点：AAA，终点：BBB，以中文句号结束。”');
              this.userInput =[];
          }

          if(this.userInput.includes('火车'))
          {
              this.ApiType.push(3);
              await this.extractInfo('请判断出日期，起点和终点，输出格式例如：“日期：2023-10-27，起点：AAA，终点：BBB。”，在你输出完所有结果之后，请加上一个“。”');
              this.userInput =[];
              //提取出起点和终点
          }
          if(this.userInput.includes('景点'))   //调用维基百科API
          {
              this.ApiType.push(4);
              await this.extractInfo('请提取出地点，输出格式例如：“地点：BBB。”，在你输出完所有结果之后，请加上一个“。”');
              this.userInput =[];
              //提取出地点
          }
          if(this.userInput.includes('餐馆'))
          {
              //提取出地点
          }
  
        },
        async handleUserInput() {

            // 将用户输入转发给星火大模型
            this.chatHistory.push({ role: 'user', content: this.userInput , type:'text' });
            await this.APIChoose();
            let responseText = this.sparkHistory.join('');
           // 正则表达式匹配

            const matchDate = responseText.match(/日期：(.*?)，/);
            const matchCity = responseText.match(/城市：(.*?)，/);
            const matchStart = responseText.match(/起点：(.*?)，/);
            const matchEnd = responseText.match(/终点：(.*?)。/);
            const matchLocation = responseText.match(/地点：(.*?)。/);


            let city, date , startPoint, endPoint, location;

            // 根据ApiType值提取相应的数据
            switch (this.ApiType[0]) {
              case 1:  // 城市、起点、终点
                  city = matchCity ? matchCity[1] : null;
                  startPoint = matchStart ? matchStart[1] : null;
                  endPoint = matchEnd ? matchEnd[1] : null;
                  console.log(city, startPoint, endPoint, location);
                  this.todaysWeatherData = await getWeather(city);
                  console.log(this.todaysWeatherData);
                  
                  this.chatHistory.push({ role: 'gpt', content: '', type: 'map', city: city, start: startPoint , end: endPoint })
                  this.sparkHistory =[];
                  break;

              case 2:  // 飞机
                  date = matchDate ? matchDate[1] : null;
                  startPoint = matchStart ? matchStart[1] : null;
                  endPoint = matchEnd ? matchEnd[1] : null;
                  this.sparkHistory =[];
                  break;
              case 3:  // 火车
                  date = matchDate ? matchDate[1] : null;
                  startPoint = matchStart ? matchStart[1] : null;
                  endPoint = matchEnd ? matchEnd[1] : null;
                  this.chatHistory.push({ role: 'gpt', content: '', type: 'train', date: date, start: startPoint , end: endPoint })
                  this.sparkHistory =[];
                  
                  break;
              case 4:  // 景点
                location = matchLocation ? matchLocation[1] : null;
                alert('速速科学上网!');
                await this.sleep(10000);

                this.chatHistory.push({ role: 'gpt', content: '', type: 'scenary', location: location})
                this.sparkHistory =[];
                break;
              // ... 更多的case
            }
            this.ApiType = [];
                 
              

        },
        WeatherDataProcessing() {
            console.log(this.todaysWeatherData)
            const { weather, temperature, humidity, winddirection, windpower } = this.todaysWeatherData;
            this.todaysWeather = `当前天气为${weather}，温度为${temperature}摄氏度，湿度为${humidity}%。风向为${winddirection}，风力为${windpower}级。`;
        },
        async getGPTResponse() {

          this.openai = new OpenAI({
              apiKey: this.API_KEY,
              dangerouslyAllowBrowser: true 
          });
          
          this.WeatherDataProcessing();
          console.log(this.gptInput,this.todaysWeather)
          alert('速速科学上网！');
          
          try {
                  const completion = await this.openai.chat.completions.create({
                      model: "gpt-3.5-turbo",
                      messages: [{ role: "user", content: this.gptInput +this.todaysWeather+ "这是我的输入文本，请你根据出行文本，结合今天天气，用很可爱的语气给出出行建议！" }],            //输入语句
                      //max_tokens : 10 ,
                  });

                  
                  this.gptResponse = completion.choices[0].message.content;
                  this.chatHistory.push({ role: 'gpt', content: this.gptResponse , type:'text'});
                    console.log(this.gptResponse);
                  
              } catch (error) {
                  console.error(error);
              }
        }
    }
  }
  </script>
  
  <style scoped>
    .container {
      width: 100%;
      height: 120vh;
      position: relative;
    }

    .chat-history {
    display: flex;
    flex-direction: column;  
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
    height: 100%;
    overflow-y: auto;
    background-color: rgba(255, 255, 255, 0.7);
}

.user, .gpt {
    display: inline-block;
    word-wrap: break-word; 
    padding: 10px;
    margin: 5px 0;
    border-radius: 5px;
}

.user {
    background-color: #cce5ff;
    align-self: flex-end;
    border-bottom-right-radius: 0;
}

.gpt {
    background-color: #e2e2e2;
    align-self: flex-start;
    border-bottom-left-radius: 0;
}

    
</style>