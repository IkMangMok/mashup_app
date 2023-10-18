<template>
    <div class="container">
      <!-- 用于GPT API 测试-->
       <!-- 聊天记录 -->
        <div class="chat-history">
          <div v-for="(message, index) in chatHistory" :key="index" :class="['message-box', message.role]">
            <div v-if="message.type === 'text'">{{ message.role === 'user' ? '你: ' : 'GPT: ' }}{{ message.content }}</div>
            <MapComponent v-if="message.type === 'map'" :start="message.start" :end="message.end" />

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

  export default {
    name: 'ChatGpt',
    data() {
      return {
        openai: null,  // 用于存储gpt实例的变量
        chatHistory: [],  // 用于存储GPT聊天记录的数组
        sparkHistory: [],  //用于存储讯飞星火API消息的数组
        userInput: "",  // 用户的输入
        gptResponse: "",  // GPT的回应
        API_KEY : "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",
        ApiType:[],

      };
    },
    components: {
        MapComponent,
    },
    methods: {
      //给予特定的地图ID

        async APIChoose(){
        
              return new Promise((resolve, reject) => {
                  if(this.userInput.includes('导航'))   //早期先使用关键词解决
                  {
                      //提取出起点和终点
                      this.ApiType.push(1);
                      const URL = generateURL();
                      const ws = new WebSocket(URL);
                      console.log(this.userInput);
                      ws.addEventListener('open', () => {
                        // 动态填充payload.message.text字段
                        apiConfig.payload.message.text.push({ role: 'user',  content: '这是输入文本：“' + this.userInput+'”请提取出起点和终点，输出格式例如：“起点：AAA,终点：BBB@”,不要忘记结尾的@' });
                        console.log(apiConfig);
                        ws.send(JSON.stringify(apiConfig));
                      });

                      ws.addEventListener('message', (data) => {
                        const response = JSON.parse(data.data);
                        this.sparkHistory.push(response.payload.choices.text[0].content);
                        console.log(this.sparkHistory.join(''));  // 将所有响应拼接在一起并打印
                        if (response.payload.choices.text[0].content.endsWith('@')) {         
                            resolve();
                        }
                      });

                      ws.addEventListener('error', (error) => {
                          reject(error);  // 在遇到错误时调用reject
                      });

                  }
                  if(this.userInput.includes('飞机'))
                  {
                      //提取出起点和终点
                  }
                  if(this.userInput.includes('火车'))
                  {
                      //提取出起点和终点
                  }
                  if(this.userInput.includes('酒店'))
                  {
                      //提取出地点
                  }
                  if(this.userInput.includes('餐馆'))
                  {
                      //提取出地点
                  }
              });
  
        },
        async handleUserInput() {

              // 将用户输入转发给星火大模型
              await this.APIChoose();
              if(this.ApiType.includes(1))
              {
                  let responseText = this.sparkHistory.join('');
                  console.log(responseText)
                  let startPoint = responseText.split('，')[0].split('：')[1];
                  let endPoint = responseText.split('，')[1].split('：')[1].slice(0, -1);  
                  console.log(startPoint); 
                  console.log(endPoint);
                  this.chatHistory.push({ role: 'gpt', content: '', type: 'map', start: startPoint , end: endPoint })
                  this.sparkHistory =[];
              }


         
        },

        async getGPTResponse() {

          this.openai = new OpenAI({
              apiKey: this.API_KEY,
              dangerouslyAllowBrowser: true 
          });
          
          
          try {
                  const completion = await this.openai.chat.completions.create({
                      model: "gpt-3.5-turbo",
                      messages: [{ role: "user", content: this.userInput }],            //输入语句
                      //max_tokens : 10 ,
                  });

                  
                  this.gptResponse = completion.choices[0].message.content;
                  this.chatHistory.push({ role: 'user', content: this.userInput , type:'text' });
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
      overflow: hidden;  /* 清除浮动，避免其它元素与浮动元素重叠 */
      border: 1px solid #ccc;
      padding: 10px;
      margin-bottom: 10px;
      height: 100%;
      overflow-y: auto;
      background-color: rgba(255, 255, 255, 0.7);;  /* 設置背景顏色 */
    }
    .user, .gpt {
    display: inline-block;  /* 使消息盒子为内联块级元素 */
    word-wrap: break-word;  /* 如果消息超出容器宽度，则自动换行 */
    padding: 10px;
    margin: 5px 0;
    border-radius: 5px;
}

    .user {
      background-color: #cce5ff;
      float: right;  /* 将用户消息浮动到右侧 */
      border-bottom-right-radius: 0;
    }

    .gpt {
      background-color: #e2e2e2;

      float: left;  /* 将GPT消息浮动到左侧 */
      border-bottom-left-radius: 0;
    }
</style>