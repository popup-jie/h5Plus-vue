<template>
  <div class="orderPaySuccess" ref="orderPaySuccess">
    <!-- <m-header title="支付成功" :type="3" @back="back"></m-header> -->
    <div class="orderPayImg">
      <img src="./paySuccess.png">
    </div>
    <h2>支付成功</h2>
    <h6 class="text">感谢您的关注与支持，在商品出货后，请注意查收商品！</h6>
    <a class="btn-outline" @click="lookOrder">查看订单</a>
    <a class="btn-outline" @click="returnFirst">返回首页</a>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header'
import { initPage, share } from 'common/js/mixin'
import { mapGetters } from 'Vuex'

export default {
  mixins: [initPage, share],
  computed: {
    ...mapGetters(['programType'])
  },
  data() {
    return {}
  },
  created() {
    document.title = '支付成功'
    localStorage.removeItem('payforsuc')
    this._shareDetail()
    this.$nextTick(() => {
      this._initPage(this.$refs.orderPaySuccess)
    })
  },
  methods: {
    lookOrder() {
       if (window.__wxjs_environment === 'miniprogram') {
         this.$router.goBack()
         var path = '/page/order/order?fromOrderSuccess=true'
         //通过JSSDK的api使小程序跳转到指定的小程序页面
         wx.miniProgram.redirectTo({ url: path })
       }
       else {
      this.$router.replace(`/myorder`)
       }
    },
    returnFirst() {
      this.$router.replace(`/home`)
    }
  },
  components: {
    MHeader
  }
}
</script>


<style type="text/sass" lang="sass">
  @import "../../common/sass/variable"
  @import "../../common/sass/mixin"
  .orderPaySuccess
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: $white
    text-align: center
    .orderPayImg
      width: 32%
      margin: 42/$cale+rem auto 22/$cale+rem
    img
      width: 100%
    h2
      color: $new-main
      font-size: 24/$cale+rem
      line-height: 33/$cale+rem
      margin-bottom: 20/$cale+rem
      font-weight: bold
    h6
      color: $gray-dark
      line-height: 21/$cale+rem
      text-align: left
      padding: 0 40/$cale+rem
      font-size: 14/$cale+rem
      color: $gray-base
    p
      margin-top: 20/$cale+rem
      color: $gray
      font-size: 12/$cale+rem
      line-height: 17/$cale+rem
    a
      margin-top: 40/$cale+rem
      display: inline-block
      +size-height(56%,42/$cale+rem)
      background-color: $new-main
      color: $white
      font-size: 18/$cale+rem
      font-weight: bold
      border-radius: 40/$cale+rem
    .btn-outline
      display: block
      +size-height(56%,42/$cale+rem)
      margin: 20/$cale+rem auto 0
      background-color: #fff
      color: $new-main
      border: 1/$cale+rem solid $new-main
      font-size: 18/$cale+rem
      border-radius: 40/$cale+rem
</style>    