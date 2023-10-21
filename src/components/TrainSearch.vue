<template>
  <div>
    <div v-if="data && data.length">
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

  </div>
</template>

<script>
/* eslint-disable */

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
                        availableSeats: parts[30]
                    },
                    secondClass: {
                        price: '',
                        availableSeats: parts[31]
                    },
                    economyClass: {
                        price: '',
                        availableSeats: parts[32]
                    },
                    noSeat: {
                        price: '',
                        availableSeats: parts[33]
                    }
                };
            });
            this.data = parsedData;
        })
        .catch(error => {
            console.error("加载数据出错:", error);
        });
}

    },
};
</script>

<style scoped>
/* 根据需要添加样式 */
</style>
