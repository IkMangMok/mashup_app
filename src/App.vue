<template>
  <div class="main-container">
    <SideBar></SideBar>
    <div class="content-container">
      <TitleView></TitleView>
      <gpt></gpt>
    </div>
  </div>
</template>


<script>
/* eslint-disable */

import gpt from './components/gpt.vue';
import SideBar from './view/SideBar.vue'
import TitleView from './view/TitleView.vue'
export default {
  name: 'App',
  components: {
    gpt,
    TitleView,
    SideBar,
  },

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-image: url(~@/assets/bg.png); 
  background-size: cover;  /* 背景图片会覆盖整个元素 */
  background-position: center;  /* 背景图片居中 */
  background-repeat: no-repeat;  /* 不重复背景图片 */
  border: 1px solid black;
}

.main-container {
  display: flex;
  flex-direction: row;
}

.content-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.gpt {
  max-width: 800px;
  max-height: 800px;
  overflow: auto;
  margin: 0 auto;  /* 使gpt在其容器中居中 */
}


</style>
