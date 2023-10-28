<template>
  <div class="container">
    <div class="wiki-section">
      <ul>
        <li v-for="(page, index) in pages" :key="index" class="result-box">
          <a :href="'https://zh.wikipedia.org/wiki/' + encodeURIComponent(page.title)" target="_blank">{{ page.title }}</a>
          <p v-html="page.extract"></p>
          <img v-if="page.thumbnail && page.thumbnail.source" :src="page.thumbnail.source" alt="Image" class="thumbnail">
        </li>
      </ul>
    </div>
    <div class="tourist-section">
        <div v-if="SearchData && SearchData.length">
            <div class="result-title">景点搜索结果：</div>
            <div v-for="(scenic, index) in SearchData" :key="index" class="scenic-box">
                <h3>{{ scenic.name }}</h3>
                <p v-html="scenic.content"></p>
            </div>
        </div>
    </div>

  </div>
</template>
  
  <script>
  import axios from 'axios';

  export default {
    props:{
        query: String,
    },
    data() {
      return {
        pages: [],
        SearchData:[],
      };
    },
    mounted(){
        console.log(this.query);
        this.TouristSearch();
        this.search();

    },
    methods: {
      async search() {
        alert('速速科学上网!');
        if (this.query) {
          try {
            const response = await axios.get('https://zh.wikipedia.org/w/api.php', {
              params: {
                format: 'json',
                action: 'query',
                generator: 'search',
                gsrnamespace: 0,
                gsrlimit: 10,
                prop: 'pageimages|extracts',
                pilimit: 'max',
                exintro: true,
                explaintext: true,
                exsentences: 1,
                exlimit: 'max',
                origin: '*',
                gsrsearch: this.query
              }
            });
            this.pages = Object.values(response.data.query.pages);
          } catch (error) {
            console.error('Error:', error);
          }
        }
      },
      async TouristSearch() {
          axios.get('https://apis.tianapi.com/scenic/index', {
            params: {
              key: 'd6f57a0a2eb04561224ce00ce2476948',
              word: this.query,
              num: 5,
            }
          })
          .then(response => {
            console.log(response.data);
            this.SearchData = response.data.result.list;
          })
          .catch(err => {
            console.error(err);
          });
      },

    },
    
  };
  </script>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  max-height: 600px; /* 为容器设置最大高度为视口的90%，您可以根据需要调整 */
  overflow-y: auto; /* 如果内容超出容器高度，会出现滚动条 */
}

.wiki-section {
  flex: 0.7;
  padding: 10px;
  border-right: 1px solid #ccc;
  min-width: 500px;
  overflow-y: auto; /* 如果内容超出容器高度，会出现滚动条 */
}


.result-box {
  padding: 10px;
  border: 1px solid #e0e0e0;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: #f9f9f9;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.thumbnail {
  max-width: 150px;
  margin-top: 10px;
  border-radius: 4px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

ul {
  list-style-type: none;
  padding-left: 0; /* 去除默认的padding，确保列表内容与其他内容对齐 */
}

.tourist-section {
    padding: 15px;
    background-color: #f5f5f5;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-top: 20px;
    overflow :auto ;
}

.result-title {
    font-weight: bold;
    margin-bottom: 10px;
    color: #333;
}

.scenic-box {
    padding: 8px;
    background-color: #e9e9e9;
    border-radius: 4px;
    margin-bottom: 10px;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
}

.scenic-box h3 {
    font-size: 16px;
    margin-bottom: 8px;
}

</style>
