<template>
  <div>
    <div class="content-row">
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th colspan="7">{{ train_date }}</th>
                    </tr>
                    <tr>
                        <th>车次</th>
                        <th>起点站</th>
                        <th>终点站</th>
                        <th>发车时间</th>
                        <th>到达时间</th>
                        <th>耗时</th>
                        <th>商务座</th>
                        <th>一等座</th>
                        <th>二等座</th>
                        <th>无座</th>


                    </tr>
                </thead>
                <tbody>
                    <tr v-for="train in data" :key="train.travelcode">
                        <td>{{ train.trainCode }}</td>
                        <td>{{ train.fromStation }}</td>
                        <td>{{ train.toStation }}</td>
                        <td>{{ train.startTime }}</td>
                        <td>{{ train.arriveTime }}</td>
                        <td>{{ train.duration }}</td>
                        <td>{{ train.firstClass.availableSeats }} </td>
                        <td>{{ train.secondClass.availableSeats }} </td>
                        <td>{{ train.economyClass.availableSeats }} </td>
                        <td>{{ train.noSeat.availableSeats }} </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div :id="mapId" class="map-wrapper"></div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
/* global BMapGL */

import { showTrain } from '@/services/mapServices';
import {fetchTrainData} from '@/services/trainsearch.js'

export default {
    name: 'TrainSearch',
    props:{
        date : String,
        start : String,
        end : String,
    },
    data() {
        return {
            mapId: 'map-' + Date.now() + Math.floor(Math.random() * 1000),
            map:null,
            train_date: this.date,
            from_station: this.start,
            to_station: this.end,
            purpose_codes: 'ADULT',
            data: []
        };

    },
    mounted(){

        this.loadData();
    },
    methods: {
        loadData() {
    fetchTrainData(this.train_date, this.from_station, this.to_station)
        .then(result => {
            const rawData = result.data.result;
            const StationMap = result.data.map;
            const parsedData = rawData.map(item => {
                const decoded = decodeURIComponent(item);
                const parts = decoded.split('|');
                return {
        
                    travelcode : parts[2],
                    trainCode: parts[3],
                    fromStation: StationMap[parts[6]],
                    toStation: StationMap[parts[7]],
                    startTime: parts[8],
                    arriveTime: parts[9],
                    duration: parts[10],
                    firstClass: {
                        price: '',
                        availableSeats: parts[32]
                    },
                    secondClass: {
                        price: '',
                        availableSeats: parts[31]
                    },
                    economyClass: {
                        price: '',
                        availableSeats: parts[30]
                    },
                    noSeat: {
                        price: '',
                        availableSeats: parts[26]
                    }
                };
            });
            this.data = parsedData;
        })
        .catch(error => {
            console.error("加载数据出错:", error);
        });
  
        showTrain(this.start, this.end, this.mapId);
}

    },
};
</script>

<style scoped>

.content-row {
    height: 800px;  /* 或您想要的其他值 */
    display: flex;
    flex-direction: column;
}

.table-container {
    max-height: 400px;  /* content-row高度减去map-wrapper高度 */
    overflow-y: auto;
    flex-grow: 1;  /* 允许table-container在必要时扩展其高度 */
}

table {
    width: 100%;
    border-collapse: collapse;    /* 合并相邻的边框 */
    font-size: 14px;
    text-align: left;             /* 文本居左对齐 */
    margin-bottom: 20px;          /* 表格下方添加20像素的间隔 */
    max-height: 400px;
    overflow-y: auto;
}

/* 表头样式 */
thead th {
    background-color: #f5f5f5;   /* 背景颜色 */
    border: 1px solid #e0e0e0;   /* 边框 */
    padding: 8px 15px;           /* 内部填充空间 */
}

/* 表体的行和单元格样式 */
tbody tr {
    border-bottom: 1px solid #e0e0e0;
}

tbody td {
    padding: 8px 15px;
    border-right: 1px solid #e0e0e0;  /* 右侧添加边框 */
}

/* 最后一个单元格不添加右边框 */
tbody td:last-child {
    border-right: none;
}

/* 表体的行在鼠标悬停时更改背景颜色 */
tbody tr:hover {
    background-color: #fafafa;
}

.table-container {
    flex: 1;                /* 表格容器将尽可能多地占用空间，但它将与map-wrapper共享空间 */
    width: 700px;
    max-height: 1200px;
    overflow-x: auto;       /* 如果表格太宽，则允许横向滚动 */
    overflow-y: auto;       /* 如果表格太长，则允许纵向滚动 */
    margin-bottom: 20px;
}
.map-wrapper {
    flex: 1;
    width: 700px;
    height: 400px;
    margin-top: 20px;
}
.map-wrapper {
    height: 400px;  /* 或您想要的其他值 */
}
</style>
