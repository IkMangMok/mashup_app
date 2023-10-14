

<template>
  <div class="container">
    <!-- 用于存放地图的容器 -->
    <div id="map"></div>
  </div>
</template>


<script>
/* global BMapGL */


export default {
  name: 'HelloWorld',
  data() {
    return {
      map: null  // 用于存储地图实例的变量
    };
  },
  mounted() {
    // 初始化地图
    //this.initializeMap();
  },
  methods: {
    initializeMap() {
      if (typeof BMapGL === 'undefined') {
        console.error('百度地图API未加载');
        return;
      }

      this.map = new BMapGL.Map("map");  // 使用BMapGL，WebGL版的初始化
      const point = new BMapGL.Point(116.404, 39.915);
      this.map.centerAndZoom(point, 15);
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  width: 120vh;
  height: 100vh;
  position: relative;
 /* background-image: url("~@/assets/bg.png");
  background-size: auto;  /* 保持背景图片的原始大小 */
 /* background-repeat: no-repeat;
  background-position: center top; */

}

#map {
  width: 20%;
  height: 20%;  /* 让地图充满整个容器 */
}
</style>
