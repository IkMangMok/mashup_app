<template>
    <div class="container">
      <!-- 用于GPT API 测试-->
       <!-- 聊天记录 -->
      <div class="chat-history">
        <div v-for="(message, index) in chatHistory" :key="index" :class="['message-box', message.role]">
          <div>{{ message.role === 'user' ? '你: ' : 'GPT: ' }}{{ message.content }}</div>
        </div>
      </div>
      <input v-model="userInput" placeholder="请输入文本..."/>
      <button @click="getGPTResponse">提交</button>
      <div id="GPT"></div>
    </div>
  </template>
  
  <script>

  import OpenAI from 'openai';

  export default {
    name: 'ChatGpt',
    data() {
      return {
        ChatGpt: null,  // 用于存储gpt实例的变量
        chatHistory: [],  // 用于存储聊天记录的数组
        userInput: "",  // 用户的输入
        gptResponse: ""  // GPT的回应
      };
    },
    methods: {
        gpt_frontend_test(){
            this.chatHistory.push({ role: 'user', content: "这是测试用例,并没有实际接入GPT接口" });
            this.chatHistory.push({ role: 'gpt', content: "當然，我為您再次解釋「Software configuration」，並使用中國大陸的語境： "+
            "「Software configuration」在中國大陸的普通話中通常被稱為「軟件配置」。它指的是管理和維護軟件應用中的各種設定和組件的過程。"+
            "具體來說，軟件配置可以包括以下方面：1. **版本控制**：它確保軟件版本的一致性，並管理不同的軟件版本。"+
            "2. **構建管理**：這涉及管理從源碼到可執行文件的軟件構建過程。"+
            "3. **變更管理**：追踪和管理對軟件的修改，以確保其一致性和質量。"+
            "4. **發布管理**：確保軟件能夠正確且高效地部署到生產環境中。"+
            "5. **環境管理**：管理軟件在不同環境（如開發、測試、生產）中的設定。"+
            "希望這次的解釋更加清晰和正確。再次感謝您的指正！" 
            });
        },
        async getGPTResponse() {
        const API_KEY ="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";

        const openai = new OpenAI({
            apiKey: API_KEY,
            dangerouslyAllowBrowser: true 
        });

        try {
                const completion = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: this.userInput }],            //输入语句
                    //max_tokens : 10 ,
                });

                
                this.gptResponse = completion.choices[0].message.content;
                this.chatHistory.push({ role: 'user', content: this.userInput });
                this.chatHistory.push({ role: 'gpt', content: this.gptResponse });
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
      height: 300px;
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