<template>
  <!-- 意见反馈成功 -->
  <div class='feedback-success'>
    <m-header title="反馈成功" :type="3" @back="back"></m-header>
    <div class="feedback-success-content">
      <img class='successPic' src='./feedbackSuccess.png'>
      <div class='success_title'>反馈成功</div>
      <div class='desc'>感谢您对“菁亭”的关注与支持，您的反馈我们会认真查看，并尽快修复与完善！</div>
      <div class='btnClose' @click='back'>关闭</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header'
export default {
  methods: {
    back() {
      this.$router.push('/home')
    },
  },
  components: {
    MHeader
  }
}
</script>

<style type="text/sass" lang="sass">
  @import "../../common/sass/variable"
  @import "../../common/sass/mixin"

  .feedback-success
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background-color: $white
    text-align: center
    .feedback-success-content
      padding-top: 40/$cale+rem
      position: fixed
      top: 44/$cale+rem
      bottom: 0
      width: 100%
      overflow: hidden
      .successPic
        width: 117/$cale+rem
        height: 112/$cale+rem
        vertical-align: top
      .success_title
        font-size: 20/$cale+rem
        line-height: 28/$cale+rem
        font-weight: bold
        padding: 20/$cale+rem 0
        color: $mall-main
      .desc
        font-size: 14/$cale+rem
        line-height: 20/$cale+rem
        color: $text_color
        padding: 0 45/$cale+rem
      .btnClose
        margin: 40/$cale+rem auto 0
        width: 210/$cale+rem
        height: 44/$cale+rem
        line-height: 44/$cale+rem
        background-color: $mall-main
        color: $white
        border-radius: 40/$cale+rem
        font-size: 16/$cale+rem
</style>