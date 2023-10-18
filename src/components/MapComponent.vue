<template>
    <div>
      <div :id="mapId" style="width: 500px; height: 300px;"></div>
    </div>
  </template>
  
  <script>
  import { TransNavigation } from '../services/mapServices';
  
  export default {
    name: 'MapComponent',

    props: {
        start: String,
        end: String
    },


    mounted() {
            
        this.$nextTick(() => {
            try {
                console.log(this.mapId)
                TransNavigation(this.start, this.end, this.mapId);
            } catch (error) {
                console.error("Error with TransNavigation:", error.message);
            }
        });
    },
    methods:{

    },
    data(){
        return{
            mapId: 'map-' + Date.now() + Math.floor(Math.random() * 1000),
        };
        
    }
  }
  </script>
  
  <style scoped>
  /* 这里是地图组件的样式 */
  </style>
  