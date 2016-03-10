<template>
  <router-view
    v-ref:list
    keep-alive>
  </router-view>
</template>
<style lang="scss">
  @import "./styles/1px.css";
  @import "./styles/app.scss";
</style>
<script>
  export default {
    data () {
      return {
        name: ''
      }
    }
  }
</script>
