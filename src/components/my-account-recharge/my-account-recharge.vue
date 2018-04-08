<template>
  <div class="myRecharge-container">
    <m-header title="钱包充值" :type="3" @back="back"></m-header>
    <div class="recharge-wrap" ref="rechargeWrap">
      <div class="account-money">
        <h5>账户余额</h5>
        <p class="amount">&yen;{{(userWalletMoney != '') ? userWalletMoney.toFixed(2) : zero}}</p>
      </div>
      <h4 class="recharge-title">充值金额</h4>
      <ul class="recharge-list">
        <li ref="recharge" v-for="(cell, index) in amounts" @click="choose(index)" :data-index="index" :class="{active:choosed==index,noRed:(cell.total==undefined || cell.total==0)}" :key="index">
          <span>{{cell.money}}元</span>
          <p v-if="cell.total!=undefined && cell.total != 0">赠{{cell.total}}元红包</p>
        </li>
      </ul>
      <p class="agree_tips">点击充值，即表示已阅读并同意
        <router-link to="/rechargeAgreements" class="gold">充值协议</router-link>
      </p>
      <div class="fixed-btn" @click="rechargeConfirm">确定充值</div>
    </div>

    <!-- 支付方式 -->
    <!-- :orderNo="orderNo" -->
    <pay v-show="payShow" @closeAlert="closeAlert" @payforSuccess="payforSuccess" :payfor="payforType" :rechMoney="returnMoney">
    </pay>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header'
import { mapGetters, mapMutations } from 'vuex'
import { queryAllRechargeInfos, queryUserFundInfo } from 'api/userCenter'
import { addRecharge, unifiedPay } from 'api/pay'
import Pay from 'components/pay/pay'
import { hasClass } from 'common/js/dom'
import { initPage, setToastMsg,share } from 'common/js/mixin'
export default {
  mixins: [initPage, setToastMsg,share],
  data() {
    return {
      zero: '0.00',
      amounts: '', //金额配置列表
      // avaAmount:'', //线上钱包可用余额
      choosed: 1, //选中金额列表
      // orderNo: '', //充值编号
      returnMoney: null, //接口返回充值金额
      money: '', //li下的span的金额
      payforType: 1, //支付类型 1:充值支付 2:共享支付 3:订单支付4:小程序共享支付5:会员卡充值支付6:购买会员卡7:会员卡和商品一起支付
      payShow: false //支付弹窗是否显示
    }
  },
  computed: {
    ...mapGetters(['userToken', 'userWalletMoney'])
  },
  created() {
    document.title = '钱包充值'
    this._shareDetail()
    this.$nextTick(() => {
      this._initPage(this.$refs.rechargeWrap)
    })
    this._queryUserFundInfo()
    this._queryAllRechargeInfos()
  },
  methods: {
    back() {
      this.$router.goBack()
    },
    // 关闭窗口
    closeAlert() {
      this.payShow = false
    },
    choose(index) {
      this.choosed = index
      // this._addRecharge()
    },
    rechargeConfirm() {
      this._addRecharge()
      this.payShow = true
    },
    _queryAllRechargeInfos() {
      queryAllRechargeInfos().then(res => {
        if (res.success) {
          this.amounts = res.list
        } else {
          this.setToastMsg(res.msg)
        }
      })
    },
    getData(_index) {
      return document
        .querySelectorAll('li[data-index="' + _index + '"]')[0]
        .getElementsByTagName('span')[0].innerHTML
    },
    _addRecharge() {
      this.money = parseInt(this.getData(this.choosed))
      addRecharge(this.userToken, this.money).then(res => {
        if (res.success) {
          this.setOrderNo(res.orderNo)
          this.returnMoney = parseInt(res.money)
          // this.returnMoney = 0.01
        } else {
          this.setToastMsg(res.msg)
        }
      })
    },
    payforSuccess() {
      this.setUserWalletMoney(this.returnMoney)
      this._queryAllRechargeInfos()
      this.payShow = false //弹窗隐藏
      this.$router.push(`/rechargesuccess`)
    },
    _queryUserFundInfo() {
      queryUserFundInfo(this.userToken).then(res => {
        //设置用户余额
        this.setUserWalletMoney(res.availableAmount)
      })
    },
    ...mapMutations({
      setUserWalletMoney: 'SET_USER_WALLET_MONEY',
      setOrderNo: 'SET_ORDERNO'
    })
  },
  components: {
    MHeader,
    Pay
  }
}
</script>

<style lang="sass" type="text/sass">
  @import "../../common/sass/variable"
  @import "../../common/sass/mixin"
  .myRecharge-container
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background-color: $white
    .recharge-wrap
      padding: 0 15/$cale+rem 65/$cale+rem
      .tips
        font-size: 12/$cale+rem
        color: $gray
        line-height: 17/$cale+rem
      .agree_tips
        width: 100%
        font-size: 12/$cale+rem
        color: $gray
        position: fixed
        left: 20%
        bottom: 90/$cale+rem
        .gold
          padding-left: 5/$cale+rem
          color: $mall-main
      .fixed-btn
        width: 92%
        height: 50/$cale+rem
        line-height: 50/$cale+rem
        position: fixed
        left: 4%
        bottom: 20/$cale+rem
        background: $mall-main
        +radius($border-radius-base)
        text-align: center
        color: $white
        font-size: 17/$cale+rem
        letter-spacing: 1.5px
    .account-money
      +size(100%, 220/$cale+rem)
      margin: 10/$cale+rem 0 0
      position: relative
      color: $white
      text-align: center
      +bg-image('./recharge')
      background-size: 100% 100%
      &.order-amount
        +size(100%, 223/$cale+rem)
        margin: 10/$cale+rem 0
        +bg-image('./recharge-bg')
        background-size: 100% 100%
      h5
        font-size: 20/$cale+rem
        color: $white
        font-weight: 600
        line-height: 28/$cale+rem
        padding-top: 55/$cale+rem
      .amount
        font-size: 46/$cale+rem
        color: $white
        line-height: 65/$cale+rem
      .order-amount
        font-size: 17/$cale+rem
        color: $white
        line-height: 24/$cale+rem
        padding-top: 8/$cale+rem
      i
        font-style: normal
      .small
        font-size: 12/$cale+rem
    .recharge-title
      font-size: 15/$cale+rem
      color: $gray-dark
    .recharge-list
      overflow: hidden    
      li
        +size(45%, 60/$cale+rem)    
        margin: 10/$cale+rem 0
        float: left
        font-size: 20/$cale+rem
        text-align: center
        background-color: $gray-bg
        +radius($border-radius-base)
        padding: 10/$cale+rem 0 0
        &:nth-child(2n-1)
          margin-right: 12.5/$cale+rem
        &:nth-child(2n)
          margin-left: 12.5/$cale+rem   
        &.active      
          background: $mall-main
          span,p
            color: $white
      li.noRed
        padding: 0
        span
          line-height: 60/$cale+rem
      li.noRedHeight
        padding: 0
        span
          line-height: 60/$cale+rem !important         
      span
        color: $text_light
        display: inline-block
        line-height: 28/$cale+rem
      p
        font-size: 14/$cale+rem
        line-height: 20/$cale+rem
        color: $red
    li
      border-bottom: 1/$cale+rem solid #ececec
    li:last-child
      border-bottom: none
</style>