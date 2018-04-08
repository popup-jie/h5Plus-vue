<template>
  <transition name="slide">
    <div class="service">
      <m-header title="充值协议" :type="3" @back="back"></m-header>
      <scroll class="service-content" ref="service">
        <div class="service-wrap">
          <h1 class="service-title">《充值协议》</h1>

          <p>尊敬的用户，为保障您的合法权益，请您在充值前仔细阅读本《充值协议》，以了解熟嘻的充值、余额使用规则并避免造成误解。当您当点击“确定充值”按钮后，即视为您已阅读、理解本协议，并同意按本协议的规定进行充值或使用账户余额。</p>

          <h4 class="service-subtitle">一、定义</h4>
          <p>充值金额：您通过“熟嘻”软件向您已注册的用户帐号实际支付的金额。</p>
          <p>账户余额：您的用户帐号中显示的金额，包括1.充值金额，2. 通过熟嘻 “充值活动”赠送的返现金额（不含红包）。</p>

          <h4 class="service-subtitle">二、账户余额有效期</h4>
          <p>用户账户余额的有效期为自充值之日起至使用完毕为止。</p>

          <h4 class="service-subtitle">三、充值赠送活动规则</h4>
          <p>我们会通过充值页面或具体活动页面及时公布不同数额的充值金额可享受的一定数额的返现金额或红包，例如，充值100元返现20元，则您的账户可得金额为120元，若以红包方式赠送，例如，充值100元赠送20元红包，则您的账户可得金额为100元，可得红包20元，具体活动详情，您可通过充值或关注我们的活动页面进行了解。</p>

          <h4 class="service-subtitle">四、账户余额的使用规则</h4>
          <p>账户余额可用于购买 “倾停”店面、熟嘻商城及其它指定物品，也可用于支付熟嘻共享物品的押金，不能进行转移或转赠；</p>
          <p>返利金额可直接用于购买“倾停”店面、熟嘻商城及其它指定物品，也可支付熟嘻共享物品的押金，不能进行转移或转赠；</p>
          <p>用户帐号使用期间，实际充值金额将会被优先使用。</p>

          <h4 class="service-subtitle">五、保证与承诺</h4>
          <p>您完全理解并同意，我们包含充值赠送在内的所有优惠推广活动仅适用于正当、合法按照《用户服务协议》使用我们服务的用户。一旦发现您的用户帐号存在任何利用前述规则从事作弊行为以获取不正当经济利益的情形，我们有权冻结或关闭您的用户帐号以及任何其他与作弊行为相关的用户帐号、收回或取消已赠送的返现金额或追加因作弊行为取得的所有不正当的经济利益，并且保留停止向您提供服务以及根据作弊行为的严重程度进一步追究法律责任的权利。</p>

          <h4 class="service-subtitle">六、特别说明</h4>
          <p>您完全理解并同意，我们有权随时修改本协议内容，届时将通过在官网或“熟嘻”软件上公布修改后的协议，该公布将被视为平台已通知用户。如果您选择继续充值即表示您同意并接受修改后的协议并受其约束；如果您不同意我们对本协议的修改，请立即放弃充值或停止使用本服务。</p>
          <p>在适用法律法规允许的范围内，本协议下充值、返现及账户余额的使用规则的最终解释权归深圳市云知科技有限公司所有。</p>
        </div>
      </scroll>

    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header'
import Scroll from 'base/scroll/scroll'
import { initPage } from 'common/js/mixin'
export default {
  mixins: [initPage],
  methods: {
    back() {
      this.$router.goBack()
    },
  },
  created() {
    document.title='充值成功'
    this.$nextTick(() => {
      this._initPage(this.$refs.service)
    })
  },
  components: {
    MHeader,
    Scroll
  }
}
</script>

<style lang="sass" type="text/sass">
  @import "../../common/sass/variable"
  @import "../../common/sass/mixin"

  .service
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background-color: $white
    .service-content
      position: fixed
      top: 44px
      bottom: 0
      width: 100%
      overflow: hidden 
    // 服务协议
    .service-wrap
      padding: 15px
      p
        font-size: 14px
        color: $gray-base
        text-indent: 10px
        line-height: 25px
        margin-top: 10px
      b
        color: $text_color
      .rules
        text-indent: 10px
      a
        color: $blue
        text-decoration: underline
    .service-title
      font-size: 20px
      color: $text_color
      text-align: center
      font-weight: bold
      line-height: 30px
      margin-bottom: 20px
    .service-subtitle
      font-size: 16px
      color: $text_color
      font-weight: bold
      line-height: 24px
      margin-top: 25px
</style>