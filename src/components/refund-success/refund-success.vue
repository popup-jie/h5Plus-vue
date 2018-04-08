<template>
  <transition name="slide">
    <div class="refundSuccess" ref="refundSuccess">
      <m-header title="线上钱包" :type="3" @back="back"></m-header>
      <div class="refund-success">
        <p class="refund-img"></p>
        <!-- <img src="./refund.png" > -->
        <h4 class="refund-title">押金退款申请已提交</h4>
        <p class="refund-con">系统将在3-5个工作日内将押金退还至<br>原支付账号，请注意查收</p>
        <p class="refund-btn" @click="returnHome">完成</p>
      </div>
    </div>
  </transition>
</template>


<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header'
import { initPage } from 'common/js/mixin'
export default {
  mixins: [initPage],
  created() {
    document.title="线上钱包"
    this.$nextTick(() => {
      this._initPage(this.$refs.refundSuccess)
    })
  },
  methods: {
    back() {
      this.$router.goBack()
    },
    returnHome() {
      this.$router.push('/home')
    }
  },
  components: {
    MHeader
  }
}
</script>  


<style lang="sass" type="text/sass">
  @import "../../common/sass/variable"
  @import "../../common/sass/mixin"


  .refundSuccess
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background-color: $white
    .refund-success
      text-align: center
      background-color: $white
      .refund-img
        width: 150/$cale+rem
        height: 110/$cale+rem
        +bg-image('./refund')
        background-size: 100% 100%
        margin-left: 30%
        margin-top: 25%
      .refund-title
        font-size: 20/$cale+rem
        color: $mall-main
        line-height: 28/$cale+rem
        margin-top: 20/$cale+rem
      .refund-con
        font-size: 14/$cale+rem
        color: $text_light
        line-height: 20/$cale+rem
        margin-top: 20/$cale+rem
      .refund-btn
        +size-height(60%, 44/$cale+rem)
        +radius(44/$cale+rem)
        margin: 20/$cale+rem auto 0
        font-size: 17/$cale+rem
        color: $white
        background-color: $mall-main
</style>  