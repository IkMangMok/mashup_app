<template>

<gpt></gpt>
<!--<TrainSearch date="2023-10-23" start="南宁" end="防城港北"></TrainSearch>-->
<!--<WikiPedia></WikiPedia>-->

</template>



<script>
/* eslint-disable */

import gpt from './components/gpt.vue';
import TrainSearch from './components/TrainSearch.vue';
import WikiPedia from './components/WikiPedia.vue';

export default {
  name: 'App',
  components: {
    gpt,
    TrainSearch,
    WikiPedia,
  },
  mounted(){

      
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

.bm-view {
  width: 100%;
  height: 300px;
}

</style>
