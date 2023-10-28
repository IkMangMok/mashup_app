/* global BMapGL */
/* eslint-disable */
import {AddressEmitter} from './emitter.js';

async function showTrain(start, end, mapId){
    let map;
    try {
        map = new BMapGL.Map(mapId);
        map.centerAndZoom(start, 7);
    } catch (error) {
        console.error("Error with BMapGL:", error.message);
        return;
    }
    const StartGeo = new BMapGL.Geocoder();
    const EndGeo = new BMapGL.Geocoder();
    console.log(start,end)
    const sPoint = await getPoint(StartGeo, start ,start);
    const ePoint = await getPoint(EndGeo, end ,end);
    console.log(sPoint,ePoint)
    const polyline = new BMapGL.Polyline([
        sPoint,
        ePoint
    ]);
    console.log(polyline)
    map.addOverlay(polyline);


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
            const path = segment.getPath();
            const polyline = new BMapGL.Polyline(path);
            map.addOverlay(polyline);
        } else if (plan.getTotalType(i) == 1) { // 如果是公交或地铁线路

            const path = segment.getPath();
            const polyline = new BMapGL.Polyline(path,{strokeColor : '#0066FF', strokeWeight : 6});
            map.addOverlay(polyline);
        }
    }


    // 你还可以添加起点和终点的标记
    console.log(start,end);
    const startMarker = new BMapGL.Marker(start.point);
    const endMarker = new BMapGL.Marker(end.point);
    map.addOverlay(startMarker);
    map.addOverlay(endMarker);


}


async function TransNavigation(startPoint, endPoint, city, mapId, callback) {
    if (typeof BMapGL === 'undefined') {
        console.error('百度地图API未加载');
        return;
    }

    let map;
    try {
        map = new BMapGL.Map(mapId);  //创建地图实例
        map.centerAndZoom(city, 12);
    } catch (error) {
        console.error("Error with BMapGL:", error.message);
        return;
    }

    const StartGeo = new BMapGL.Geocoder(); //创建地址编码
    const EndGeo = new BMapGL.Geocoder();

    try {
        const sPoint = await getPoint(StartGeo, startPoint, city);
        const ePoint = await getPoint(EndGeo, endPoint, city);

        console.log(sPoint, ePoint);

        const transit = new BMapGL.TransitRoute(map, {//搜索完成后进行赋值
        
            onSearchComplete: function(results){
                if (transit.getStatus() === BMAP_STATUS_SUCCESS) {
                    let plans = [];
                    let starts = [];
                    let ends = [];
                    for(let i = 0; i < results.getNumPlans(); i++) {
                        plans.push(results.getPlan(i));
                        starts.push(results.getStart());
                        ends.push(results.getEnd());
                    }
                    if(plans.length > 0)
                    {
                        showPlanOnMap(plans[0],map,starts[0],ends[0]);
                    }
                    callback && callback(plans, map ,starts ,ends);  // 将方案返回给回调函数
                }
            },
        });
        transit.setPageCapacity(5);  // 设置每页返回方案个数为5
    
        transit.search(sPoint, ePoint);

        map.addEventListener('click', function (e) {

            getAdressFromPoint(e.latlng, (adr)=>{
                console.log(adr)
                AddressEmitter.emit('address-found', adr);
            })
        });

    } catch (error) {
        alert(error.message);
    }
}


function getAdressFromPoint(point, callback) {
    
    var geoc = new BMapGL.Geocoder();
    geoc.getLocation(point, function(rs) {
        var address = rs.address;
        callback(address);  // 使用回调函数返回地址
    });
}

export {
    TransNavigation,
    showPlanOnMap,
    showTrain,
    getAdressFromPoint,
  };
  