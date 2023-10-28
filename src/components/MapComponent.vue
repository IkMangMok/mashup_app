<template>
  <div class="container">
    <!-- 地图和方案部分 -->
    <div class="map-plans-section">
      <div :id="mapId" class="map"></div>
      <div class="plans-wrapper">
        <button v-for="(plan, index) in plans" :key="index" @click="showSelectedPlan(index)" class="plan-button">{{ `方案 ${index + 1}` }}</button>
      </div>
    </div>
    
    <!-- 右侧的标识和按钮部分 -->
    <div class="info-section">
      <div class="info-item">当前选中地点：<span>{{ selectedLocation }}</span></div>
      <div class="info-item">导航起点：<span>{{ navigationStart }}</span></div>
      <div class="info-item">导航终点：<span>{{ navigationEnd }}</span></div>
      <button class="navigate-button set-start" @click="setStart">设为起点</button>
      <button class="navigate-button set-end" @click="setEnd">设为终点</button>
      <button class="navigate-button start-nav" @click="startNavigation">开始导航</button>
      <button class="navigate-button text" @click="generateTextAdvice">生成文本建议</button>

    </div>
  </div>
</template>

  
  <script>
import { TransNavigation,showPlanOnMap,getAdressFromPoint } from '../services/mapServices';
import { AddressEmitter ,emitter } from '../services/emitter.js'
  
  export default {
    name: 'MapComponent',

    props: {
        start: String,
        end: String,
        city: String,
    },

    mounted() {

        AddressEmitter.on('address-found', (adr) => {
            this.selectedLocation = adr;
        });
        this.$nextTick(() => {
            try {
                console.log(this.mapId)
                TransNavigation(this.start, this.end, this.city, this.mapId, (plans, map ,starts ,ends) => {
                this.plans = plans;
                this.map = map;
                this.starts = starts;
                this.ends = ends;
                console.log(this.starts[0].point,this.starts[0])


                getAdressFromPoint(this.starts[0].point, (address) => {
                    this.navigationStart = address;
                });

                getAdressFromPoint(this.ends[0].point, (address) => {
                    this.navigationEnd = address;
                });

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
            const end = this.ends[index];
            this.index = index;
            showPlanOnMap(plan,this.map,start,end);
            
        },
        setStart() {
            console.log("设置起点");
            this.navigationStart = this.selectedLocation;
        },

        setEnd() {

            console.log("设置终点");
            this.navigationEnd = this.selectedLocation
        },

        startNavigation() {
            console.log("开始导航");
            TransNavigation(this.navigationStart, this.navigationEnd, this.city, this.mapId, (plans, map ,starts ,ends) => {
                this.plans = plans;
                this.map = map;
                this.starts = starts;
                this.ends = ends;
            })
            
        },

        generateTextAdvice() {
           
            console.log("生成文本建议");
            let plan = this.plans[this.index];
            if(plan){
                  let routeString = plan.getDescription(false);
                  const routeDuration = plan.getDuration(true);
                  const routeDistance = plan.getDistance(true);
                  console.log(routeString,routeDuration,routeDistance);
                  routeString = routeString + '。总时长：' + routeDuration +",总距离：" + routeDistance;
                  emitter.emit('route-found', routeString);
            }
        },


    },
    data(){
        return{
            mapId: 'map-' + Date.now() + Math.floor(Math.random() * 1000),
            plans: [],
            map:null,
            starts:[],
            ends:[],
            selectedLocation: '',
            navigationStart:'',
            navigationEnd : '',
            index : 0 ,
        };
        
    }
  }
  </script>
  
  <style scoped>
  .container {
      display: flex;
      width: 1000px; 
      height: 600px;
      overflow: hidden;
      background-color: #f7f7f7;
      padding: 10px;
  }

  .map-plans-section {
      flex: 3;
      position: relative;
      border-right: 2px solid #e0e0e0;
      padding: 20px;
  }

  .map {
      width: 100%;
      height: 88%;
      border-radius: 10px;
      box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
  }

  .plans-wrapper {
      display: flex;
      justify-content: space-around;
      align-items: flex-end; /* 将按钮对齐到底部 */
      padding: 20px 0;
  }

  .plan-button {
      background-color: #ffffff;
      border: 1px solid #e0e0e0;
      padding: 8px 16px;
      cursor: pointer;
      border-radius: 5px;
      transition: background-color 0.3s, transform 0.2s;
  }

  .plan-button:hover {
      background-color: #e0e0e0;
      transform: scale(1.07);
  }

  .info-section {
      flex: 1.5;
      padding: 30px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
  }

  .info-item {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      padding-bottom: 10px;
  }

  .navigate-button {
      padding: 12px 24px;
      background-color: #4CAF50;
      border: none;
      color: white;
      cursor: pointer;
      border-radius: 5px;
      transition: background-color 0.3s, transform 0.2s;
  }

  .navigate-button:hover {
      background-color: #45a049;
      transform: translateY(-3px);
  }

</style>
