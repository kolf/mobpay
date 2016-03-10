<template>
  <div class="alert" v-show="show">
    <div class="alert-inner">
      <div class="alert-hd">{{title}}</div>
      <div class="alert-bd"><slot></slot></div>
      <div class="alert-ft ui-border-t">
        <a href="javascript:;" @click="hide" class="primary">{{text}}</a>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  .alert{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    background: rgba(0,0,0,.5);
    &-inner{
       position: fixed;
       z-index: 4;
       width: 85%;
       top: 50%;
       left: 50%;
       -webkit-transform: translate(-50%,-50%);
       transform: translate(-50%,-50%);
       background-color: #fafafc;
       text-align: center;
       border-radius: 3px;
    }
      &-hd{
        padding: 1.2em 0 .5em
      }
      &-bd{
         padding: 0 20px;
         color: #888;
          font-size: 16px;
       }
       &-ft{
          position: relative;
          line-height: 42px;
          margin-top: 20px;
          display: -webkit-box;
          display: -webkit-flex;
          display: -ms-flexbox;
          display: flex;
          a{
            display: block;
            -webkit-box-flex: 1;
            -webkit-flex: 1;
            -ms-flex: 1;
            flex: 1;
            color: #ef473a;
            text-decoration: none;
            font-size: 16px;
            -webkit-tap-highlight-color: rgba(0,0,0,0)
          }
        }
  }
</style>
<script>
  export default {
    props: {
      show: {
        type: Boolean,
        default: false,
        twoWay: true
      },
      title: {
        type: String,
        required: true
      },
      text: {
        type: String,
        default: '确定'
      }
    },
    methods: {
      hide: function () {
        this.show = false
        this.$dispatch('hide')
      }
    },
    watch: {
      show: function (val) {
        if (val) {
          this.$dispatch('show')
        }
      }
    }
  }
</script>
