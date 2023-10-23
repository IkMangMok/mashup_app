/* global BMapGL */
/* eslint-disable */
import emitter from './emitter.js';

function showmap(){

}

//导航
function getPoint(geo, address, city) {
    return new Promise((resolve, reject) => {
        geo.getPoint(address, function(point) {
            if (point) {
                resolve(point);
            } else {
                reject(new Error(`地址 ${address} 没有找到对应的坐标！`));
            }
        }, city);
    });
}



function showPlanOnMap(plan, map ,start ,end) {

    // 首先，清除地图上的所有覆盖物
    map.clearOverlays();

    // 对于每一个路段，根据其类型添加到地图上
    for (let i = 0; i < plan.getNumTotal(); i++) {
        const segment = plan.getTotal(i);
        console.log(plan.getTotalType(i));
        // 检查路段的类型
        if (plan.getTotalType(i) == 0) { // 如果是步行路段
            const polyline = segment.getPolyline();
            map.addOverlay(polyline);
        } else if (plan.getTotalType(i) == 1) { // 如果是公交或地铁线路
            // 对于线路对象，你可能需要处理该对象的数据来获取或渲染折线
            // 这里是一个简化的示例，具体的处理可能会根据实际情况有所不同
            const path = segment.getPath();
            const polyline = new BMapGL.Polyline(path);
            map.addOverlay(polyline);
        }
    }


    // 你还可以添加起点和终点的标记
    console.log(start,end);
    const startMarker = new BMapGL.Marker(start.point);
    const endMarker = new BMapGL.Marker(end.point);
    map.addOverlay(startMarker);
    map.addOverlay(endMarker);

    let routeString = plan.getDescription(false);
    const routeDuration = plan.getDuration(true);
    const routeDistance = plan.getDistance(true);
    console.log(routeString,routeDuration,routeDistance);
    routeString = routeString + '。总时长：' + routeDuration +",总距离：" + routeDistance;
    //emitter.emit('route-found', routeString);
}


async function TransNavigation(startPoint, endPoint, city, mapId) {
    if (typeof BMapGL === 'undefined') {
        console.error('百度地图API未加载');
        return;
    }

    let map;
    try {
        map = new BMapGL.Map(mapId);
        map.centerAndZoom(city, 12);
    } catch (error) {
        console.error("Error with BMapGL:", error.message);
        return;
    }

    const StartGeo = new BMapGL.Geocoder();
    const EndGeo = new BMapGL.Geocoder();

    try {
        const sPoint = await getPoint(StartGeo, startPoint, city);
        const ePoint = await getPoint(EndGeo, endPoint, city);

        console.log(sPoint, ePoint);

        const transit = new BMapGL.TransitRoute(map, {
            renderOptions: { map: map },
            onSearchComplete: function(results){
                if (transit.getStatus() === BMAP_STATUS_SUCCESS) {
                    let i = 0;
                    // 获取所有的方案
                    let start = results.getStart();
                    let end = results.getEnd();
                    for(i = 0 ; i < results.getNumPlans(); i++)
                    {
                        const plan = results.getPlan(i);
                        // 为每个方案添加一个按钮               
                        const button = document.createElement('button');
                        button.innerHTML = `方案 ${i + 1}`;
                        button.onclick = () => showPlanOnMap(plan, map , start, end);
                        document.body.appendChild(button);
            
                    }

                }
            },
        });
        transit.setPageCapacity(5);  // 设置每页返回方案个数为2

        transit.search(sPoint, ePoint);
    } catch (error) {
        alert(error.message);
    }
}




export {
    TransNavigation,
    showmap,
  };
  