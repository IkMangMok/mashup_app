/* global BMapGL */
/* eslint-disable */
import emitter from './emitter.js';

function showmap(){

}

//导航
function TransNavigation(startPoint,endPoint,city,mapId) {
    if (typeof BMapGL === 'undefined') {
      console.error('百度地图API未加载');
      return;
    }

    try{
        var map = new BMapGL.Map(mapId);
        map.centerAndZoom(new BMapGL.Point(116.331398,39.897445), 12);
    }catch(error){
        console.error("Error with BMapGL:", error.message);
    }
    var sPoint = new BMapGL.Point(0.1,0.1);
    var ePoint = new BMapGL.Point(0.1,0.1);
    var StartGeo = new BMapGL.Geocoder();
    var EndGeo = new BMapGL.Geocoder();
    // 将地址解析结果显示在地图上，并调整地图视野
    StartGeo.getPoint(startPoint, function(point){
        if(point){
            sPoint = point;
            EndGeo.getPoint(endPoint, function(point){
                if(point){
                    ePoint = point;

                    console.log(sPoint, ePoint);
                    var transit = new BMapGL.TransitRoute(map, {
                        renderOptions: {map: map},
                        onSearchComplete: function(results) {

                            if (transit.getStatus() === BMAP_STATUS_SUCCESS) {
                                var plan = results.getPlan(0); 
                                var routeString = ''; 

                                routeString = plan.getDescription(false);
                                
                                
                                // 在此处，您可以将 routeString 返回给 gpt.vue 或者进行其他处理
                                console.log(routeString);
                               
                                emitter.emit('route-found', routeString);
                            }                      
                      }
                    });
                    transit.search(sPoint, ePoint);
                    console.log(sPoint, ePoint);
       
                } else {
                    alert('终点地址没有找到对应的坐标！');
                }
            }, city);
        } else {
            alert('起点地址没有找到对应的坐标！');
        }
    }, city);
  
  }



export {
    TransNavigation,
    showmap,
  };
  