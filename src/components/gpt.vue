<template>
    <div class="container">
      <!-- 用于GPT API 测试-->
      <div id="GPT-response">{{ gptResponse }}</div>
      <input v-model="userInput" placeholder="请输入文本..."/>
      <button @click="getGPTResponse">提交</button>
      <div id="GPT"></div>
    </div>
  </template>
  
  <script>
  import OpenAI from 'openai'


  export default {
    name: 'ChatGpt',
    data() {
      return {
        ChatGpt: null,  // 用于存储gpt实例的变量
        userInput: "",  // 用户的输入
        gptResponse: ""  // GPT的回应
      };
    },
    methods: {
        async getGPTResponse() {

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: "user", content: "this.userInput" }],
        model: "gpt-3.5-turbo",
        });
        this.gptResponse = chatCompletion.choices[0].message.content;
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
  
  #GPT-response {
    margin-bottom: 10px;
  }
  </style>
  