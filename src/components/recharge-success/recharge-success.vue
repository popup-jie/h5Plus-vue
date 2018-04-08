<template>
  <div class="baiTieSuccess" ref="baiTieSuccess">
    <div class="baiTieImg">
      <img src="./recharge-success.png">
    </div>
    <h2>充值成功</h2>
    <h6 class="text">您可点击
      <span class="jq-myAccount" @click="back">我的账户</span>查看余额</h6>
    <a class="jq-finish" @click="back">完成</a>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header'
import { initPage } from 'common/js/mixin'
export default {
  mixins: [initPage],
  created() {
    localStorage.removeItem('payforsuc')
    this.$nextTick(() => {
      this._initPage(this.$refs.baiTieSuccess)
    })
  },
  methods: {
    back() {
      this.$router.goBack()
      // this.$router.replace(`/home`)
    }
  }
}
</script>

<style lang="sass" type="text/sass">
  @import "../../common/sass/variable"
  @import "../../common/sass/mixin"
  .baiTieSuccess
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background-color: $white
    text-align: center
    .baiTieImg
      width: 48.53%
      margin: 42px auto 22px
    img
      width: 100%
    h2
      color: $new-main
      font-size: 24px
      line-height: 33px
      font-weight: bold
      margin-bottom: 20px
    h6
      font-size: 15px
      color: $gray-dark
      line-height: 21px
      text-align: center
      padding: 0 15px
    p
      margin-top: 20px
      color: $gray
      font-size: 12px
      line-height: 17px
    a
      margin-top: 40px
      display: inline-block
      +size-height(56%,42px)
      background-color: $new-main
      color: $white
      font-size: 18px
      font-weight: bold
      border-radius: 40px
    .jq-myAccount
      border: 1px solid $new-main
      background-color: $white
      border-radius: 3px
      color: $new-main
      padding: 1px 5px
      margin: 0 10px
      font-size: 14px
    .btn-outline
      margin-top: 20px
      background-color: #fff
      color: $new-main
      border: 1px solid $new-main
</style>        