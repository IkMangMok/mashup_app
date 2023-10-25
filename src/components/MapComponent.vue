<template>
    <div>
      <div :id="mapId" style="width: 500px; height: 300px; min-height: 300px;"></div>
      <div class="plans-wrapper">
        <button v-for="(plan, index) in plans" :key="index" @click="showSelectedPlan(index)">{{ `方案 ${index + 1}` }}</button>
      </div>
    </div>
  </template>
  
  <script>
import { TransNavigation,showPlanOnMap } from '../services/mapServices';
  
  export default {
    name: 'MapComponent',

    props: {
        start: String,
        end: String,
        city: String,
    },

    mounted() {
            
        this.$nextTick(() => {
            try {
                console.log(this.mapId)
                TransNavigation(this.start, this.end, this.city, this.mapId, (plans, map ,starts ,ends) => {
                this.plans = plans;
                this.map = map;
                this.starts = starts;
                this.ends = ends;
                });
            } catch (error) {
                console.error("Error with TransNavigation:", error.message);
            }
        });
    },
    methods:{
        showSelectedPlan(index) {
            const plan = this.plans[index];
            const start = this.starts[index];
            const end = this.ends[index]
            showPlanOnMap(plan,this.map,start,end);
            
        },

    },
    data(){
        return{
            mapId: 'map-' + Date.now() + Math.floor(Math.random() * 1000),
            plans: [],
            map:null,
            starts:[],
            ends:[],
        };
        
    }
  }
  </script>
  
  <style scoped>
  /* 这里是地图组件的样式 */
  .plans-wrapper {
    display: flex;
    justify-content: space-between;  /* 按钮之间有均匀的间距 */
    flex-wrap: wrap; /* 按钮过多需要换行 */
}

  </style>
  