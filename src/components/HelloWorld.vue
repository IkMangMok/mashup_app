<template>
  <div class="map-container">
    <!-- 用于存放地图的容器 -->
    <div id="map"></div>
  </div>
</template>


<script>
export default {
  name: 'MapContainer'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.map-container {
  width: 100%;
  height: 100vh; /* 使容器充满视窗的高度 */
  position: relative; /* 如果您需要在地图上叠加其他元素 */
}

#map {
  width: 100%;
  height: 100%;
}
</style>
