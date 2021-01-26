<template>
  <div id="app">
    <Test1 />
  </div>
</template>

<script>
import Test1 from './test1';
import { a1, b1 } from 'common/types';
export default {
  name: 'App',
  components: {
    Test1
  },
  created () {
    console.log('a1, b1', a1, b1);
  }
};
</script>

<style lang="less">
  html, body, #app {
    width: 100%;
    height: 100%;
  }
  img[data-origin="hq"] {
    max-width: 200px!important;
  }
</style>
