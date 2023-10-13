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
}
</style>
