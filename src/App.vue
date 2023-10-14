<template>

  <HelloWorld msg="Welcome to Your Vue.js App"/>
  <gpt></gpt>
</template>



<script>
import HelloWorld from './components/HelloWorld.vue'
import gpt from './components/gpt.vue';
export default {
  name: 'App',
  components: {
    HelloWorld,
    gpt,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-image: url(~@/assets/bg.png);  /* 添加这行代码 */
  background-size: cover;  /* 背景图片会覆盖整个元素 */
  background-position: center;  /* 背景图片居中 */
  background-repeat: no-repeat;  /* 不重复背景图片 */
}
</style>
