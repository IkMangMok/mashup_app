<template>
   <div class="maincontainer">
          <div class="chat-history">
            <div v-for="(message, index) in chatHistory" :key="index" :class="['message-box', message.role]">
              <div v-if="message.type === 'text'">{{ message.role === 'user' ? '你: ' : 'GPT: ' }}{{ message.content }}</div>
              <MapComponent v-if="message.type === 'map'" :start="message.start" :end="message.end" :city = "message.city"/>
              <TrainSearch v-if="message.type === 'train'" :date="message.date" :start="message.start" :end="message.end" />
              <WikiPedia v-if="message.type === 'scenary'" :query="message.location" />
              <WeatherSearch v-if="message.type === 'weather'" :cityname="message.city" />
              <MetroMap v-if="message.type === 'metromap'" :cityname="message.city" />
          </div>
        </div>
        <div class="input-section">
            <input v-model="userInput" placeholder="请输入文本..."/>
            <button @click="handleUserInput">提交</button>
        </div>
    </div>
  </template>
  
  <script>


  import OpenAI from 'openai';
  import { apiConfig } from '@/services/apiConfig.js';
  import { generateURL } from '@/services/authentication.js';
  import MapComponent from './MapComponent.vue';
  import {emitter,EventBus} from '@/services/emitter.js';
  import TrainSearch from './TrainSearch.vue';
  import WikiPedia from './WikiPedia.vue';
  import WeatherSearch from './WeatherSearch.vue';
  import getWeather from '@/services/weather.js';
  
  export default {
    name: 'ChatGpt',
    data() {
      return {
        openai: null,  // 用于存储gpt实例的变量
        chatHistory: [],  // 用于存储聊天记录的数组
        sparkHistory: '',  //用于存储讯飞星火API消息
        userInput: "",  // 用户的输入
        gptInput:"", //给予gpt的输入
        gptResponse: "",  // GPT的回应
        API_KEY : "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",
        ApiType : 0,
        todaysWeatherData: "",  //存储天气数据
        todaysWeather:"" //天气的自然文本

      };
    },
    components: {
        MapComponent,
        TrainSearch,
        WikiPedia,
        WeatherSearch,

    },
    mounted(){

      EventBus.on('triggerHandleUserInput', (info) => {
          console.log(info);
          // 保存或处理routeString
          this.userInput = info;
          this.handleUserInput();
      });
      emitter.on('route-found', (routeString) => {
          console.log(routeString);
          // 保存或处理routeString
          this.gptInput = routeString;
          this.getTravelAdvice();
      });
    },
    methods: {
      //给予特定的地图ID
        sleep(ms) {
          return new Promise(resolve => setTimeout(resolve, ms));
        },
        async APIChoose(){
        
          const apiConfigurations = [
          {
            keywords: ['导航','地图'],
            apiType: 1,
            extractionMessage: '请判断出城市，起点和终点，输出格式例如：“城市：CC，起点：AAA，终点：BBB。”'
          },
          {
            keywords: ['飞机','航班'],
            apiType: 2,
            extractionMessage: '请判断出日期，起点和终点，输出格式例如：“日期：yyyy-mm-dd，起点：AAA，终点：BBB。”'
          },
          {
            keywords: ['火车','高铁'],
            apiType: 3,
            extractionMessage: '请判断出日期，起点和终点，输出格式例如：“日期：yyyy-mm-dd，起点：AAA，终点：BBB。”'
          },
          {
            keywords: ['景点','旅游'],
            apiType: 4,
            extractionMessage: '请提取出地点，输出格式例如：“地点：BBB。”,当你输出完所有结果后，以句号结束。'
          },
          {
            keywords: ['天气'],
            apiType: 5,
            extractionMessage: '请提取出城市，输出格式例如：“城市：CC。”'
          },
          {
            keywords: ['GPT'],
            apiType: 6,
          },
          {
            keywords: ['无'],
            apiType: 0,
          },
        ];
        let keywordsList = apiConfigurations.map((config, index) => {
            return {
                index: index,
                keywords: config.keywords
            };
        });
        console.log(JSON.stringify(keywordsList))
          let matchedConfig = null;
          for (let config of apiConfigurations) {
              for (let keyword of config.keywords) {
                  if (this.userInput.includes(keyword)) {
                      this.ApiType = config.apiType;
                      if(this.ApiType != 6){
                          await this.getsparkResponse(`这是输入文本：“${this.userInput}”${config.extractionMessage}`);
                      }
                      matchedConfig = config;
                      break;
                  }
              }
              if (matchedConfig) break;
          }
          if(!matchedConfig)
          {
            this.ApiType = 0;
            await this.getsparkResponse(this.userInput);
            this.chatHistory.push({ role: 'gpt', content: this.sparkHistory, type: 'text'});
            this.gptResponse = '';
            this.sparkHistory = '';
          }
        },
        formatDate(inputDate){
          if (!inputDate) return null;
  
          // 尝试匹配 yyyy-mm-dd 格式
          const match = inputDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
          if (match) return inputDate; // 已经是所需格式
          // 尝试从 Date 对象转换
          const dateObj = new Date(inputDate);
          if (dateObj.toString() !== "Invalid Date") {
              const yyyy = dateObj.getFullYear();
              const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
              const dd = String(dateObj.getDate()).padStart(2, '0');
              return `${yyyy}-${mm}-${dd}`;
          }
          return null;
        },
        handleMissingValue(missingValues)
        {
          if (missingValues.length > 0) {
            console.log("以下值缺失:", missingValues.join(", "));
            this.chatHistory.push({ role: 'gpt', content: `以下值缺失: ${missingValues.join(", ")}`, type: 'text' });
            this.gptInput = this.userInput;
            console.log(this.userInput)
            this.getGPTResponse();
            this.gptInput = '';
            this.userInput = '';
            return false;
          }
          else{
            return true;
          }
        },
        async handleUserInput() {

            // 将用户输入转发给星火大模型
            this.chatHistory.push({ role: 'user', content: this.userInput , type:'text' });
            await this.APIChoose();
            let responseText = this.sparkHistory;
           // 正则表达式匹配
            responseText += '。';
            const matchDate = responseText.match(/日期：(.*?)，/);
            const matchCity = responseText.match(/城市：(.*?)，/);
            const matchStart = responseText.match(/起点：(.*?)，/);
            const matchEnd = responseText.match(/终点：(.*?)。/);
            const matchLocation = responseText.match(/地点：(.*?)。/);
            const matchWeatherCity = responseText.match(/城市：(.*?)。/);

            let city, date , startPoint, endPoint, location;
            let today, yyyy, mm, dd, defaultDate,missingValues = [];
            // 根据ApiType值提取相应的数据
            switch (this.ApiType) {
              case 1:  // 城市、起点、终点
                  city = matchCity ? matchCity[1] : null;
                  startPoint = matchStart ? matchStart[1] : null;
                  endPoint = matchEnd ? matchEnd[1] : null;
                  console.log(city, startPoint, endPoint, location);
                  this.todaysWeatherData = await getWeather(city);
                  console.log(this.todaysWeatherData);
                  
                  if (!city || city == 'CC') {
                      missingValues.push("城市");
                  }
                  if (!startPoint || startPoint == 'AAA') {
                      missingValues.push("起点");
                  }
                  if (!endPoint || endPoint == 'BBB') {
                      missingValues.push("终点");
                  }

                  if(this.handleMissingValue(missingValues)){
                        this.chatHistory.push({ role: 'gpt', content: '', type: 'map', city: city, start: startPoint , end: endPoint });
                  }
                  
                  this.sparkHistory =[];

                  break;

              case 2:  // 飞机
                  today = new Date();
                  yyyy = today.getFullYear();
                  mm = String(today.getMonth() + 1).padStart(2, '0');
                  dd = String(today.getDate()).padStart(2, '0');
                  defaultDate = `${yyyy}-${mm}-${dd}`;
                  if(!matchDate){
                      date = defaultDate;
                  }
                  else{
                    date = this.formatDate(matchDate[1])? this.formatDate(matchDate[1]) : defaultDate;  
                  }
                  if (!startPoint || startPoint == 'AAA') {
                      missingValues.push("起点");
                  }
                  if (!endPoint || endPoint == 'BBB') {
                      missingValues.push("终点");
                  }

                  this.handleMissingValues(missingValues);  // 使用函数处理重复逻辑
                  this.sparkHistory = [];
                  break;
              case 3:  // 火车
                  today = new Date();
                  yyyy = today.getFullYear();
                  mm = String(today.getMonth() + 1).padStart(2, '0');
                  dd = String(today.getDate()).padStart(2, '0');
                  defaultDate = `${yyyy}-${mm}-${dd}`;
                  if(!matchDate){
                      date = defaultDate;
                  }
                  else{
                    date = this.formatDate(matchDate[1])? this.formatDate(matchDate[1]) : defaultDate;  
                  }
                  console.log(defaultDate,matchDate,date)
                  startPoint = matchStart ? matchStart[1] : null;
                  endPoint = matchEnd ? matchEnd[1] : null;

                  if (!startPoint || startPoint == 'AAA') {
                      missingValues.push("起点");
                  }
                  if (!endPoint || endPoint == 'BBB') {
                      missingValues.push("终点");
                  }

                  if(this.handleMissingValue(missingValues))
                  {
                      this.chatHistory.push({ role: 'gpt', content: '', type: 'train', date: date, start: startPoint , end: endPoint })
                  }
                  this.sparkHistory =[];
                  
                  break;
              case 4:  // 景点
                location = matchLocation ? matchLocation[1] : null;
                console.log(location,matchLocation);
                if (!location || location == 'BBB') {
                    missingValues.push("景点");
                }
                if(this.handleMissingValue(missingValues))
                {
                    alert('速速科学上网!');
                    this.chatHistory.push({ role: 'gpt', content: '', type: 'scenary', location: location})
                }
                
                this.sparkHistory =[];
                break;
              case 5:     //天气
                city = matchWeatherCity ? matchWeatherCity[1] : null;

                if (!city || city == 'CC') {
                      missingValues.push("城市");
                  }
                if(this.handleMissingValue(missingValues)){
                    this.chatHistory.push({ role: 'gpt', content: '', type: 'weather', city: city})
                }
                
                this.sparkHistory =[];
                break;
                case 6:   //GPT
                    this.gptInput = this.userInput;
                    this.getGPTResponse();
                    break;
            
              default:
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
        async getTravelAdvice() {

          this.WeatherDataProcessing();
          console.log(this.gptInput,this.todaysWeather)
          this.gptInput += this.todaysWeather+ "这是我的输入文本，请你根据出行文本，结合今天天气，用很可爱的语气给出出行建议！" 
          this.getGPTResponse();
          this.gptInput = '';
         
        },
        async getGPTResponse()
        {
          alert('速速科学上网！');

          this.openai = new OpenAI({
              apiKey: this.API_KEY,
              dangerouslyAllowBrowser: true 
          });
          console.log(this.gptInput)
          try {
                  const completion = await this.openai.chat.completions.create({
                      model: "gpt-3.5-turbo",
                      messages: [{ role: "user", content: this.gptInput}],            //输入语句
                      //max_tokens : 10 ,
                  });

                  this.gptResponse = completion.choices[0].message.content;
                  this.chatHistory.push({ role: 'gpt', content: this.gptResponse , type:'text'});
                    console.log(this.gptResponse);
                  
              } catch (error) {
                  console.error(error);
              }
        },
        async getsparkResponse(messageInfo){
            return new Promise((resolve, reject) => {
                const URL = generateURL();
                const ws = new WebSocket(URL);

                ws.addEventListener('open', () => {
                    apiConfig.payload.message.text.push({ role: 'user', content: messageInfo });
                    ws.send(JSON.stringify(apiConfig));
                });

                ws.addEventListener('message', (data) => {
                    const response = JSON.parse(data.data);

                    if(response.header.code !== 0) {
                        reject(new Error(response.header.message));  // 如果返回的code不为0，则直接抛出错误
                        return;
                    }

                    console.log(response.payload.choices.text[0].content);
                    this.sparkHistory += response.payload.choices.text[0].content;  // 将接收到的 content 累加

                    if (response.header.status === 2 && response.payload.choices.status === 2) { 
                         
                        resolve();
                    }
                });

                ws.addEventListener('error', (error) => {
                    reject(error);
                });
            });
        },

    }
  }
  </script>
  
  <style scoped>
.maincontainer {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;  
}

.chat-history {
    flex-grow: 1;
    overflow-y: auto;
    padding: 10px;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    background-color: rgba(255, 255, 255, 0.7);
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* 这里将内容左对齐 */
}

.message-box {
    display: inline-flex;  /* 修改为 inline-flex 以根据内容自适应宽度 */
    justify-content: flex-end;
}

.user, .gpt {
    padding: 10px;
    margin: 5px 0;
    border-radius: 5px;
    display: inline-block; 
    max-width: 100%;  /* 限制最大宽度 */
}

.user {
    background-color: #cce5ff;
    border-bottom-right-radius: 0;
    align-self: flex-end;  /* 用户消息右对齐 */
}

.gpt {
    background-color: #e2e2e2;
    border-bottom-left-radius: 0;
    align-self: flex-start;  /* GPT消息左对齐 */
    flex-shrink: 0;
}


.input-section {
    display: flex;  /* 设置为flex布局以使子元素水平对齐 */
    background-color: #f7f7f7;
    padding: 10px;
    align-items: center; /* 使元素在交叉轴上居中对齐 */
}

.input-section input {
    flex: 1;  /* 使输入框占据剩余的空间 */
    padding: 10px;
    border: none;
    border-radius: 5px;
    outline: none;
    margin-right: 10px;  /* 添加右边距以与按钮留出空隙 */
}

.input-section button {
    padding: 5px 15px;  /* 给按钮增加些许内边距以增加可点击区域 */
}


</style>