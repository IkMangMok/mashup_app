/* global BMapGL */

//显示一个空荡荡的地图

function showmap(){

}

//导航
function TransNavigation(startPoint,endPoint,mapId) {
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
    //创建搜索类
    var local = new BMapGL.LocalSearch(map, {
      renderOptions:{map: map}
    });

    local.search(startPoint);  //搜索起点
    local.search(endPoint);


  }



module.exports = {
  TransNavigation,
  showmap,
};