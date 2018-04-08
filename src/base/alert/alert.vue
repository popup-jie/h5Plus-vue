<template>
  <div class="popup-dialog" v-show="showFlag" @click.stop.prevent="clickClose">
    <div class="popup-wrapper">
      <div class="popup-content">
        <p class="text" v-show="text">{{text}}</p>
        <div @click.stop.prevent="cancel" class="operate" v-show="isShowcancel">
          {{cancelBtnText}}
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    cancelBtnText: {
      type: String,
      default: '确定'
    },
    isShowcancel: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showFlag: false
    }
  },
  methods: {
    show() {
      this.showFlag = true
    },
    hide() {
      this.showFlag = false
    },
    cancel() {
      this.hide()
    },
    clickClose() {
      this.$emit('closeAlert')
    }
  }
}
</script>

<style lang="sass" type="text/sass">
  @import "../../common/sass/variable"
  @import "../../common/sass/mixin"

  .popup-dialog
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 998
    background-color: rgba(0,0,0,.6)
    .popup-content
      animation: popup-zoom 1s
    .popup-wrapper
      position: absolute
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)
      z-index: 999
      .popup-content
        width: 270/$cale+rem
        background: $white
        font-size: 15/$cale+rem 
        .text
          color: $gray-base
          padding: 20/$cale+rem  15/$cale+rem 
          line-height: 16/$cale+rem 
        .operate
          text-align: center
          margin-left: 70%
          color: $orange
          padding-bottom: 20/$cale+rem 
  @keyframes popup-zoom
    0%
      transform: scale(0)
    50%
      transform: scale(1.1)
    100%
      transform: scale(1)
</style>