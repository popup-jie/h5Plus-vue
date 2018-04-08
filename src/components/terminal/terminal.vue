<template>
  <div class="terminal-order">
    <div>
      <m-header title="提交订单" :type="3" @back="back"></m-header>
      <scroll class="scroll-wrapper" :data="datas.info">
        <div>
          <h3 class="shop_name">
            <!-- <i class="icon-position"> -->
            <img src="./position.png" alt="" class="icon-position">
            <!-- </i> -->
            <span>{{datas.cloud8Name}}</span>
          </h3>
          <ul class="cart_list">
            <li class="order-detail" v-for="(el,index) in datas.info" id="'gid' + el.gid" :key="index">
              <img class="img" v-bind:src="datas.address + el.goodsPic">
              <div class="pro">
                <p class="name" id="goodsName">{{el.goodsName}}</p>
                <p class="gray">¥{{el.price}}</p>
              </div>
              <div class="num_wrap">
                <span class="gray">×{{el.number}}</span>
                <span class="price">¥{{el.totalPrice}}</span>
              </div>
            </li>
          </ul>
          <ul class="payment-list">
            <li id="discount" @click="chooseRed">红包抵扣
              <span class="gold" id="redAcount">{{redMoneyTxt}}</span>
              <img src="./arrow-right.png" alt="" class="icon-arrow-right">
            </li>
            <!-- .toFixed(1) -->
            <li id="total">总计：¥
              <span class="orderPay">{{datas.price}}</span>
              <span class="gold noPay">待支付：¥
                <span id="waitPay">{{waitPay}}</span>
              </span>
            </li>
          </ul>

        </div>

      </scroll>
      <div class="pay-btn">
        <span class="price noPrice" style="font-weight: 0">
          待支付¥
          <span id="totalMoney">{{waitPay}}</span>
          <span class="originalPrice_content"> | 已优惠
            <span id="originalPrice" style="text-decoration:none;">{{hasDiscounted.toFixed(1)}}</span>
          </span>
        </span>
        <span class="btn choosed" @click="pay">立即支付</span>
        <!-- <span class="btn default-btn none">正在支付</span> -->
      </div>

      <!-- 支付方式 -->
      <pay v-show="payShow" ref="pay" @closeAlert="closeAlert" @payforSuccess="payforSuccess" @payforOther="payforOther" @passwordError="passwordError" :payfor="payforType" :userWalletId="redId" :showWallet="showWallet" :showVip="showVip" :showWalletmoney="datas.availableAmount" :payforallMoney="waitPay">
      </pay>
      <!-- :showWalletmoney="datas.availableAmount" -->
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header'
import Scroll from 'base/scroll/scroll'
import Pay from 'components/pay/pay'
import { mapGetters, mapMutations } from 'vuex'
import { setToastMsg,share } from 'common/js/mixin'
import { addOrderBySaoMa, addOrder, toConfirmOrder } from 'api/lattice'
import { cloud8Pay } from 'api/pay'

export default {
  mixins: [setToastMsg,share],
  computed: {
    redId() {
      if (this.redPacketMoney == '' || this.redPacketMoney == null) {
        return this.datas.userWalletId
      } else {
        return this.userWalletId
      }
    },
    ...mapGetters([
      'userToken',
      'userInfoId',
      'orderNo',
      'redPacketMoney',
      'userWalletId',
      'orderGoodsIds',
      'themeId'

    ])
    //  'machineId',
    //   'cabinetNum',
    //   
    //   'redPacketMoney',
    //   'userWalletId'
  },
  data() {
    return {
      datas: [],
      redMoneyTxt: '暂无可用红包', //红包金额显示字样
      waitPay: null, //待支付金额
      hasDiscounted: 0, //已优惠金额
      payforType: 3, //支付类型 1:充值支付 2:共享支付 3:订单支付 4:小程序共享支付 5:会员卡充值支付 6:购买会员卡 7:会员卡和商品一起支付
      payShow: false, //支付弹窗是否显示
      showWallet: true,//线上钱包支付是否展示
      showVip: false,//会员卡支付是否展示
      goodsInfo: null,//商品id#商品数量
      payWay: 3,//支付方式 3:线上钱包 6：会员卡支付
      availableAmount: 100,//测试-线上钱包余额
      visitBookRetempId: '',//拜帖临时表ID
    }
  },
  created() {
    this._toConfirmOrder()
    this._shareDetail()
  },
  deactivated() {
    this.payShow = false
  },
  // created() {
  //   this._addOrderBySaoMa()
  // },
  methods: {
    back() {
      this.$router.goBack()
      return
    },
    _toConfirmOrder() {
      //初始化页面
      toConfirmOrder(this.userInfoId,this.themeId,this.orderGoodsIds,this.orderNo).then((res) => {
        console.log(res)
        this.datas = res
        if (this.redPacketMoney == '' || this.redPacketMoney == null) {
          this.setUserWalletId(res.userWalletId)
          //未从红包页面带入红包金额
          this.hasDiscounted = res.kyhbMax //已优惠金额
          if (res.kyhbMax == 0) {
            //可用红包为0
            this.redMoneyTxt = '暂无可用红包'
            this.waitPay = res.price
          } else {
            //可用红包不为0
            if (res.kyhbMax > res.price) {
              //可用红包大于总金额
              this.waitPay = 0
              this.redMoneyTxt = res.kyhbMax + '元'
            } else {
              //可用红包小于总金额
              this.waitPay = res.price - res.kyhbMax
              this.redMoneyTxt = res.kyhbMax + '元'
            }
          }
        } else {
          this.setUserWalletId(this.userWalletId)
          //从红包页面带入红包金额
          this.hasDiscounted = this.redPacketMoney //已优惠金额
          this.redMoneyTxt = this.redPacketMoney + '元'
          if (this.redPacketMoney > res.price) {
            //带入金额大于总金额
            this.waitPay = 0
          } else {
            //带入金额小于总金额
            this.waitPay = res.price - this.redPacketMoney
          }
        }

      })
    },
    pay() {
      //立即支付
      this.payShow = true
      // this._toConfirmOrder() 测试
    },
    closeAlert() {
      this.payShow = false
    },
    payforSuccess() {//支付成功
      this.$refs.pay.payforSuccess()
      this.closeAlert()
      this.$router.push(`/orderpaysuccess`)
    },
    chooseRed() {
      this.$router.push(`/myred`)
    },
    ...mapMutations({
      setUserWalletId: 'SET_USER_WALLET_ID'
    })
  },
  components: {
    MHeader,
    Scroll,
    Pay
  }
}
</script>


<style type="text/sass" lang="sass">
  @import "../../common/sass/variable"
  @import "../../common/sass/mixin"
  .terminal-order
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: $white
    .scroll-wrapper
      position: fixed
      top: 44px
      bottom: 50px
      width: 100%
      overflow: hidden
    .shop_name
      +size-height(100%, 42px)
      font-size: 16px
      padding: 0 15px 0
      background: url("addr_bg.png") repeat-x left bottom
      background-size: 7% auto
      .icon-position
        +size(18px,20px)
        margin-top: 10px
    .order-detail
      position: relative
      padding: 10px 15px
      width: 100%
      // +size(100%, 120px)
      &:before
        content: ''
        +position(absolute, (right 15px bottom 0 left 15px))
        +b-solid(1px, $border-light, bottom)
      .gray
        color: $gray
      .img
        +position(absolute, (top 10px left 15px))
        +size(65px)
      .pro
        height: 67px
        padding-left: 75px
        position: relative
        .gray
          position: absolute
          bottom: 0px
          font-size: 15px
          line-height: 20px
      .name
        height: 44px
        font-size: 15px
        color: $text_color
        line-height: 22px
        display: -webkit-box
        -webkit-line-clamp: 2
        -webkit-box-orient: vertical
        overflow: hidden
      .num_wrap
        +position(absolute, (top 15% right 15px))
        .gray
          font-size: 13px
      .price
        font-size: 17px
        text-align: right
        min-width: 60px
        display: inline-block
    .order-title
      position: relative
      padding: 20px 15px 10px 28px
      line-height: 20px
      font-size: 13px
      color: $gray-base
      &:before
        content: ""
        +position(absolute, (top 20px left 15px))
        +size(4px, 20px)
        background: $new-main
    .payment-list
      li
        position: relative
        padding: 12px 15px
        font-size: 15px
        line-height: 20px
        & + li:before
          content: ''
          +position(absolute, (top 0 right 0 left 15px))
          +b-solid(1px, $border-light, bottom) 
      .icon-arrow-right
        +size(8px,14px)
        position: absolute
        right: 10px
        margin-top: 3px
      #total
        color: $gray    
      .gold
        float: right
        font-size: 12px
        color: $new-main
        margin-right: 15px
      .noPay
        color: $gray-dark !important
        font-size: 14px !important
        margin-right: 0 !important
    .pay-btn
      +position(fixed, (bottom 0 left 0))
      +size-height(100%, 48px)
      background-color: rgba(51, 51, 51, 0.95)
      .originalPrice_content
        font-size: 12px
        color: $gray
        margin-left: 4px
        text-decoration: none
      .price
        display: block
        padding: 0 15px
        font-size: 16px
        color: $white
        i
          font-style: normal
        &.sharing-text
          font-size: 17px
      .current-price
        margin-left: 5px
        font-size: 12px
        color: $gray-light
        position: relative
        &:before
          content: ''
          +position(absolute, (top 50% right -1px left -1px))
          +b-solid(1px, $gray-light, top)
          +rotate(30deg)
      #originalPrice_content
        margin-left: 10px
        font-size: 12px
        text-decoration: line-through
      #originalPrice
        font-size: 12px
        text-decoration: line-through
      .timer
        font-size: 17px
        line-height: 24px
        color: $white
        padding-left: 15px
      .btn
        +size(120px, 100%)
        +position(absolute, (top 0 right 0))
        background-color: $new-main
        font-size: 18px
        color: $white
        text-align: center
        display: block
        float: right
        &.default-btn
          background-color: $new-main
      &.percent
        padding: 0
        .btn
          width: 100%      
</style>    