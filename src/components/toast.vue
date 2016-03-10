<template>
  <div class="toast" v-show="show">
    <div class="toast-inner">
      <div class="toast-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .toast {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    background: rgba(0, 0, 0, .5);

    &-inner {
      position: fixed;
      width: 120px;
      min-height: 120px;
      top: 180px;
      left: 50%;
      margin-left: -60px;
      background: #fff;
      text-align: center;
      border-radius: 5px;
      /*color: #fff;*/
    }
    &-content {
      padding-top: 50px;
    }

  }
</style>

<script>
  export default {
    props: {
      show: {
        type: Boolean,
        default: false
      },
      time: {
        type: Number,
        default: 2000
      },
      callback: {
        type: Function,
        default: function () {
          console.log('error')
        }
      }
    },
    watch: {
      show: function (val) {
        console.log(val)
        const _this = this
        if (val) {
          clearTimeout(this.timeout)
          this.timeout = setTimeout(function () {
            _this.show = false
            _this.callback()
          }, _this.time)
        }
      }
    }
  }
</script>
