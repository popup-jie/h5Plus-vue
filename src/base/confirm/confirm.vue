<template>
  <div class="confirm-dialog" v-show="showFlag" @click.stop.prevent="clickClose">
    <div class="confirm-wrapper">
      <div class="confirm-content">
        <p class="title" v-show="title">{{title}}</p>
        <p class="imgurl">
          <img :src="imgurl" v-show="imgurl" />
        </p>
        <p class="text" v-show="text" v-html="text"></p>
        <div class="operate">
          <div @click.stop.prevent="confirm" class="operate-btn left" v-show="isShowconfirm">{{confirmBtnText}}</div>
          <div @click.stop.prevent="cancel" class="operate-btn right" v-show="isShowcancel">{{cancelBtnText}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    confirmBtnText: {
      type: String,
      default: '确定'
    },
    cancelBtnText: {
      type: String,
      default: '取消'
    },
    imgurl: {
      type: String,
      default: ''
    },
    isShowcancel: {
      type: Boolean,
      default: true
    },
    isShowconfirm: {
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
    confirm() {
      this.hide()
      // 数字为点击按钮所代表的type值
      this.$emit('confirm', '1')
    },
    cancel() {
      this.hide()
      this.$emit('cancel', '2')
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

  .confirm-dialog
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 998
    background-color: rgba(0,0,0,.6)
    .imgurl
      text-align: center
      img
        width: 5.15rem
        height: auto
        margin: .75rem auto
        text-align: center
    .confirm-content
      animation: confirm-zoom 0.5s
    .confirm-wrapper
      position: absolute
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)
      z-index: 999
      .confirm-content
        width: 270/$cale+rem
        border-radius: 7/$cale+rem
        background: $white
        .title
          padding: 20/$cale+rem 15/$cale+rem 10/$cale+rem
          line-height: 22/$cale+rem
          text-align: center
          font-size: 16/$cale+rem
          font-weight: bold
          color: #000
        .text
          font-size: 13/$cale+rem  
          color: $gray-base
          padding: 1/$cale+rem 15/$cale+rem 10/$cale+rem
          line-height: 18/$cale+rem
          text-align: center
        .operate
          height: 44/$cale+rem
          display: flex
          align-items: center
          text-align: center
          font-size: 17/$cale+rem
          .operate-btn
            flex: 1
            line-height: 22/$cale+rem
            padding: 10/$cale+rem 0
            border-top: 1/$cale+rem solid #ececec
            color: $text_color
            &.left
              border-right: 1/$cale+rem solid #ececec
            &.right
              color: $text_lighter

  @keyframes confirm-zoom
    0%
      transform: scale(0)
    50%
      transform: scale(1.1)
    100%
      transform: scale(1)
</style>