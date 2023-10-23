<template>
    <div>
  
      <ul>
        <li v-for="(page, index) in pages" :key="index">
          <a :href="'https://zh.wikipedia.org/wiki/' + encodeURIComponent(page.title)" target="_blank">{{ page.title }}</a>
          <p v-html="page.extract"></p>
          <img v-if="page.thumbnail && page.thumbnail.source" :src="page.thumbnail.source" alt="Image">
        </li>
      </ul>
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
        pages: []
      };
    },
    mounted(){
        console.log(this.query);
        this.search();
    },
    methods: {
      async search() {
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
      }
    }
  };
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  