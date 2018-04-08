<template>
  <div class="confirm-order">
    <m-header title="确认订单" :type="3" @back="back"></m-header>
    <div class="confirm-order-wrapper" ref="confirmOrderWrapper">
      <div class="scroll-inner">
        <!--收货地址-->
        <template v-if="receiveAddress">
          <div class="receiveAddress" @click="manageAddress">
            <span class="icon-address"></span>
            <div class="address-info">
              <p class="name">
                <span class="left">收货人：{{receiveAddress.receiver}}</span>
                <span class="right">{{receiveAddress.phoneNo}}</span>
              </p>
              <p class="address">收货地址：{{receiveAddress.provinceName + receiveAddress.cityName +receiveAddress.areaName + receiveAddress.detailAddress}}</p>
            </div>
            <span class="icon-arrow"></span>
          </div>
        </template>
        <template v-else>
          <div class="noReceiveAddress" @click="addAddress">
            <span class="icon-address"></span>
            <span class="txt">没有地址信息，请点击后添加地址</span>
          </div>
        </template>
        <!--商品列表区-->
        <div class="goods-list">
          <div class="goods-item" v-for="(item,index) in goodsData">
            <div class="item-info">
              <img class="pic" :src="pictureAddress+item.picture" />
              <div class="detail">
                <div class="left">
                  <p class="name">{{item.goodsName}}</p>
                  <p class="norms">{{item.specificationsName}}</p>
                </div>
                <div class="right">
                  <p class="price">&yen;{{item.price.toFixed(2)}}</p>
                  <p class="oldprice" v-show="IsSuperVip  && (item.price !== item.originalPrice)">&yen;{{item.originalPrice.toFixed(2)}}</p>
                  <p class="count">x{{item.num}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="operate-area">
          <div class="operate-item">
            <span class="txt">发票类型</span>
            <span class="info" @click="chooseInvoice">{{invoice[selectedInvoice]}}
              <span class="icon-arrow"></span>
            </span>
          </div>
          <template v-if="selectedInvoice === 1">
            <div class="operate-item">
              <span class="txt">发票抬头：<input class="inputMark" v-model="invoiceTitle" type="text" placeholder="请输入发票抬头"></span>
            </div>
          </template>
          <template v-else-if="selectedInvoice === 2">
            <div class="operate-item">
              <span class="txt">发票抬头：<input class="inputMark" v-model="invoiceTitle" type="text" placeholder="请输入发票抬头"></span>
            </div>
            <div class="operate-item">
              <span class="txt">发票税号：<input class="inputMark" v-model="invoiceNo" type="text" placeholder="请输入发票税号"></span>
            </div>
          </template>
          <div class="operate-item">
            <span class="txt">订单备注：<input class="inputMark" type="text" v-model="userMessage" placeholder="选填，30字以内" maxlength="30"></span>
          </div>
          <div class="operate-item">
            <span class="txt">配送方式</span>
            <span class="info">{{freight}}</span>
          </div>
          <template v-if="discountTotal>0">
            <!--普通订单才显示立减金额-->
            <div class="operate-item spec-item">
              <span class="txt">共{{totalNum}}件商品</span>
              小计：
              <span class="money">&yen;{{(discountTotal).toFixed(2)}}</span>
            </div>
            <div class="operate-item spec-item">
              <span class="txt">返现：</span>
              <span class="money">&yen;{{discountTotal.toFixed(2)}}</span>
            </div>
          </template>
          <template v-if="nowLessTotal>0">
            <!--普通订单才显示立减金额-->
            <div class="operate-item spec-item">
              <span class="txt">共{{totalNum}}件商品</span>
              小计：
              <span class="money">&yen;{{(waitPay+nowLessTotal).toFixed(2)}}</span>
            </div>
            <div class="operate-item spec-item">
              <span class="txt">立减：</span>
              <span class="money">&yen;{{nowLessTotal.toFixed(2)}}</span>
            </div>
          </template>
        </div>
      </div>
    </div>
    <!--底部提交订单块-->
    <div class="fixed_submit">
      <div class="total-money">
        共
        <span class="count">{{totalNum}}</span>件，合计:
        <span class="money">&yen;{{waitPay.toFixed(2)}}</span>
      </div>
      <div class="btn-submit" @click="submitOrder">提交订单</div>
    </div>
    <!--发票类型选择弹窗-->
    <mt-popup position="bottom" v-model="showInvoicePopup" class="invoicePopup">
      <ul class="invoice-list">
        <li class="invoice-item" v-for="(item,index) in invoice" @click="selectInvoice(index)">
          <span class="icon-select" v-show="index === selectedInvoice"></span>
          <span class="txt">{{item}}</span>
        </li>
      </ul>
    </mt-popup>
    <!-- 支付方式弹窗 -->
    <pay v-show="payShow" :startGroupBuy="mallStartGroupBuyId" ref="pay" @closeAlert="closeAlert" @payforSuccess="payforSuccess" :showVip="showVip" :showWallet="showWallet" :comeType="comeType" :payfor="payforType" :payforallMoney="payforallMoney" :payforUrl="payforUrl">
    </pay>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header'
import BScroll from 'better-scroll'
import { getUserAddressDefault } from 'api/address'
import { confirmOrder, addOrder } from 'api/order'
import { mapGetters, mapMutations } from 'vuex'
import { payforUrl } from 'api/config'
import Pay from 'components/pay/pay'
import MtPopup from 'mint-ui/lib/popup'
import 'mint-ui/lib/popup/style.css'
import { setToastMsg, initPage, share } from 'common/js/mixin'
export default {
  mixins: [initPage, setToastMsg, share],
  data() {
    return {
      receiveAddress: {}, //收货人及收货地址信息
      goodsData: [], //商品信息
      showInvoicePopup: false, //是否显示发票类型选择弹窗
      invoice: ['不开发票', '个人发票', '公司发票'], //发票类型
      invoiceTitle: '', //发票抬头
      invoiceNo: '', //发票税号
      selectedInvoice: 0, //选择的发票类型索引
      payShow: false, //显示支付方式弹窗
      showVip: false, //显示会员卡支付方式
      showWallet: true, //显示线上钱包支付方式
      comeType: 'online', //进入Pay组件的类型，线上
      payforType: 3, //支付类型 1:充值支付 2:共享支付 3:订单支付4:小程序共享支付5:会员卡充值支付6:购买会员卡7:会员卡和商品一起支付
      payforUrl: payforUrl, //线上商城下单接口url
      payforallMoney: 0, //订单待支付金额，传递给pay组件的
      pictureAddress: '', //图片地址前缀
      totalNum: 0, //订单商品总件数
      totalMoney: 0, //订单总金额
      freight: '', //邮费
      userMessage: '', //订单备注
      mallStartGroupBuyId: '', //用户发起拼团id
      discountTotal: 0, //总的返现金额(为0则不参与返现)
      nowLessTotal: 0 //总的立减金额(为0则不参与立减)
    }
  },
  // beforeRouteUpdate(to, from, next) {
  //   if (to.name == 'confirmorder' && from.name == 'orderpaysuccess') {
  //     next(vm => {
  //       vm.back()
  //     })
  //   } else {
  //     next()
  //   }
  // },
  // beforeRouteEnter(to, from, next) {
  //   alert(1)
  //   console.log('to' + to.name + '\n')
  //   console.log('from' + from.name)
  //   if (to.name == 'confirmorder' && from.name == 'transactionsucc') {
  //     next(vm => {
  //       vm.back()
  //     })
  //   } else {
  //     next()
  //   }
  // },
  computed: {
    waitPay() {
      //待付总金额
      let freight = this.freight === '包邮' ? 0 : this.freight
      this.totalMoney += parseFloat(freight)
      let total = this.totalMoney.toFixed(2)
      return Math.abs(total)
    },
    ...mapGetters(['userToken', 'goodsJson', 'IsSuperVip', 'orderNo'])
  },
  created() {
    this._orderNo = this.orderNo || localStorage.getItem('SHANGCHENGORDER')
    this.payforallMoney = Math.abs(localStorage.getItem('SHANGCHENGMONEY')) || 0
    this._shareDetail()
    document.title = '确认订单'

    if (localStorage.getItem('payforsuc')) {
      // this.setToastMsg('支付成功...')
      $('.confirm-order').hide()
      this.payShow = false
    } else {
      $('.confirm-order').show()
      this._goodsJson = this.goodsJson || localStorage.getItem('goodsJson') //商品json字符串
      this.mallStartGroupBuyId = localStorage.getItem('startGroupBuyId') || '' //发起的拼团id
      this._initscroll()
      this._initDataInfo()
      this.$nextTick(() => {
        this._initPage(this.$refs.confirmOrderWrapper)
      })
    }
  },
  mounted() {
    clearInterval(this.PAYFORTIMES)
    this.PAYFORTIMES = null
    this.$nextTick(() => {
      if (this.$refs.pay) {
        this.$refs.pay.countime()
      }
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 //g
      if (window.__wxjs_environment === 'miniprogram') {
        if (isAndroid) {
          console.log('进入安卓倒计时')
          this.PAYFORTIMES = setInterval(() => {
            let _num = localStorage.getItem('payforsuc')
            if (_num) {
              // alert('支付成功')
              // 微信小程序才会存在设置这个值
              localStorage.removeItem('payforsuc')
              // this.setToastMsg('支付成功')
              this.$emit('payforSuccess', 2)
              this.showToast = false
              return false
            }
          }, 1500)
        }
      }
    })
  },
  methods: {
    back() {
      this.$router.goBack()
    },
    _initscroll() {
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.confirmOrderWrapper, {
            click: true,
            probeType: 3
          })
        } else {
          this.scroll.refresh()
        }
      })
    },
    _initDataInfo() {
      let manageAddressParams = JSON.parse(
        localStorage.getItem('manageAddressParams')
      )
      if (!manageAddressParams) {
        //获取用户的默认地址
        getUserAddressDefault(this.userToken).then(res => {
          if (res.success) {
            if (res.data.length > 0) {
              //有数据时
              for (var i = 0; i < res.data.length; i++) {
                if (res.data[i].isDefault == 0) {
                  this.receiveAddress = res.data[i]
                }
              }
            } else {
              //无数据
              this.receiveAddress = null
            }
          } else {
            this.setToastMsg(res.msg)
          }
        })
      } else {
        this.receiveAddress = manageAddressParams
      }

      //获取确认订单信息
      confirmOrder(
        this.userToken,
        this._goodsJson,
        this.mallStartGroupBuyId
      ).then(res => {
        if (res.success) {
          this.pictureAddress = res.pictureAdress
          this.totalNum = res.goodsCount
          this.totalMoney = res.totalMoney
          this.freight = res.freight || '包邮'
          this.discountTotal = res.discountTotal || 0
          this.nowLessTotal = res.nowLessTotal || 0
          this.setUserWalletMoney(res.walletavailableAmount)
          this.goodsData = res.data
        } else {
          this.setToastMsg(res.msg)
        }
      })
    },
    picSrc(picAddr, picName) {
      //拼接图片地址
      return picAddr + picName
    },
    manageAddress() {
      //管理收货地址
      this.$router.push({
        name: 'manageaddress',
        params: {
          fromPage: 'confirmOrderBy'
        }
      })
    },
    addAddress() {
      //新增收货地址
      this.$router.push({
        name: 'addaddress',
        params: {
          fromPage: 'confirmOrder'
        }
      })
    },
    submitOrder() {
      //提交订单
      //收货地址非空判断
      if (!this.receiveAddress) {
        this.setToastMsg('请填写收货地址！')
        return
      }
      //1.先添加订单
      let params = {
        goodsJson: this._goodsJson,
        token: this.userToken,
        userMessage: this.userMessage,
        freight: parseFloat(this.freight === '包邮' ? 0 : this.freight),
        totalMoney: parseFloat(this.waitPay),
        shippingUserName: this.receiveAddress.receiver,
        shippingUserMobile: this.receiveAddress.phoneNo,
        invoiceType: this.selectedInvoice - 1,
        invoiceTitle: this.invoiceTitle,
        invoiceNo: this.invoiceNo,
        provinceId: this.receiveAddress.provinceId,
        provinceName: this.receiveAddress.provinceName,
        cityId: this.receiveAddress.cityId,
        cityName: this.receiveAddress.cityName,
        areaId: this.receiveAddress.areaId,
        areaName: this.receiveAddress.areaName,
        shippingDetailAddress: this.receiveAddress.detailAddress,
        mallStartGroupBuyId: this.mallStartGroupBuyId
      }
      if (this.selectedInvoice === 0) {
        //不开发票
        delete params.invoiceType
        delete params.invoiceTitle
        delete params.invoiceNo
      } else if (this.selectedInvoice === 1) {
        //个人发票
        delete params.invoiceNo
        if (this.invoiceTitle === '') {
          this.setToastMsg('请填写发票抬头信息')
          return
        }
      } else {
        if (this.invoiceTitle === '') {
          this.setToastMsg('请填写发票抬头')
          return
        }
        if (this.invoiceNo === '') {
          this.setToastMsg('请填写发票税号')
          return
        }
      }
      if (this._orderNo) {
        this.setOrderNo(this._orderNo)
        this.payShow = true
      } else {
        addOrder(params).then(res => {
          if (res.success) {
            this._orderNo = res.orderNo
            this.setOrderNo(res.orderNo)
            localStorage.setItem('SHANGCHENGORDER', res.orderNo)
            localStorage.setItem('SHANGCHENGMONEY', res.realMoney)
            this.payforallMoney = res.realMoney
            //2.订单添加成功，显示支付方式
            this.payShow = true
          } else {
            this.setToastMsg(res.msg)
          }
        })
      }
    },
    chooseInvoice() {
      //选择发票类型
      this.showInvoicePopup = true
    },
    selectInvoice(index) {
      //切换发票类型
      this.selectedInvoice = index
      this.invoiceTitle = ''
      this.invoiceNo = ''
      this.showInvoicePopup = false
    },
    payforSuccess() {
      // alert('支付回调')
      //支付成功回调
      localStorage.removeItem('goodsJson') //商品支付成功清空goodsJson
      localStorage.removeItem('manageAddressParams') //商品支付成功清空manageAddressParams
      localStorage.removeItem('startGroupBuyId') //发起的拼团id
      this.$router.replace(`/orderpaysuccess`)
      localStorage.removeItem('SHANGCHENGORDER')
    },
    // 关闭窗口
    closeAlert() {
      this.payShow = false
    },
    ...mapMutations({
      setOrderNo: 'SET_ORDERNO',
      setUserWalletMoney: 'SET_USER_WALLET_MONEY'
    })
  },
  destroyed() {
    this.setOrderNo('')
    clearInterval(this.PAYFORTIMES)
    this.PAYFORTIMES = null
  },
  components: {
    MHeader,
    MtPopup,
    Pay
  }
}
</script>

<style type="text/sass" lang="sass">
  @import "../../common/sass/variable"
  @import "../../common/sass/mixin"

  .confirm-order
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    font-size: 14/$cale+rem
    color: $text_color
    background-color: $background-base
  .confirm-order-wrapper
    position: fixed
    top: 44/$cale+rem
    bottom: 49/$cale+rem
    width: 100%
    overflow: hidden
    padding-bottom: 60/$cale+rem
    .scroll-inner
      padding-bottom: 30/$cale+rem
    .receiveAddress
      display: flex
      position: relative
      padding: 23/$cale+rem 15/$cale+rem
      margin-bottom: 10/$cale+rem
      background-color: $white
      .icon-address
        position: absolute
        left: 15/$cale+rem
        top: 50%
        margin-top: -12.5/$cale+rem
        display: inline-block
        +bg-image('./icon-address')
        background-size: 100% 100%
        +size(20/ $cale + rem,25/ $cale + rem)
        vertical-align: middle
      .address-info
        flex: 1
        padding: 0 13/$cale+rem 0 30/$cale+rem
        .name
          color: $text_color
          margin-bottom: 9/$cale+rem
          font-size: 14/$cale+rem
          +line-height(20/$cale+rem)
          .left
            float: left
          .right
            float: right
        .address
          font-size: 13/$cale+rem
          line-height: 17/$cale+rem
          color: $text_color
      .icon-arrow
        display: inline-block
        float: right
        +bg-image('./arrow-right')
        background-size: 100% 100%
        +size(10/ $cale + rem,18/ $cale + rem)
        vertical-align: middle
        margin: 23/$cale+rem 0
    .noReceiveAddress
      padding: 42/$cale+rem 0
      margin-bottom: 10/$cale+rem
      background-color: $white
      text-align: center
      .icon-address
        display: inline-block
        +bg-image('./icon-address')
        background-size: 100% 100%
        +size(20/ $cale + rem,25/ $cale + rem)
        vertical-align: middle
        margin-right: 10/$cale+rem
      .txt
        color: $text_light
    .goods-list
      background-color: $white
      .goods-item
        display: flex
        margin-bottom: 5/$cale+rem
        &:last-child
          margin-bottom: 0
        .item-info
          flex: 1
          display: flex
          padding: 8/$cale+rem 15/$cale+rem
          background-color: #f5f5f5
          .pic
            +size(88/$cale+rem)
          .detail
            flex: 1
            display: flex
            justify-content: space-between
            .left
              padding-left: 12/$cale+rem
              padding-right: 25/$cale+rem
              .name
                line-height: 20/$cale+rem
                color: $text_light
                margin-bottom: 3/$cale+rem
              .norms
                font-size: 12/$cale+rem
                color: $text_lighter
            .right
              text-align: right
              .price
                line-height: 20/$cale+rem
                font-size: 14/$cale+rem
                color: $text_lighter
              .oldprice
                color: #dedede
                font-size: 14/$cale+rem
                text-decoration: line-through
              .count
                line-height: 18/$cale+rem
                font-size: 13/$cale+rem
                color: $text_lighter
    .operate-area
      padding: 0 15/$cale+rem
      background-color: $white
      font-size: 14/$cale+rem
      line-height: 20/$cale+rem
      color: $text_color
      .operate-item
        display: flex
        justify-content: space-between
        padding: 12/$cale+rem 0
        border-bottom: 1px solid $mall-border-base
        &.spec-item
          justify-content: flex-end
          &:last-child
            border-bottom: 0
            .txt
              margin-right: 0
          .txt
            margin-right: 12/$cale+rem
          .money

            color: $mall-main
            margin-left: 5/$cale+rem
            margin-right: 5/$cale+rem
        .inputMark
          font-size: 12/$cale+rem
          line-height: 17/$cale+rem
          color: $text_lighter
          padding-left: 5/$cale+rem
        .info
          vertical-align: middle
          color: $text_lighter
          margin-right: 5/$cale+rem
          flex: 1
          text-align: right
          +extend-click()
        .icon-arrow
          display: inline-block
          +bg-image('./arrow-right')
          background-size: 100% 100%
          +size(5/ $cale + rem,9/ $cale + rem)
          margin-left: 6/$cale+rem
  .fixed_submit
    position: fixed
    bottom: 0
    left: 0
    z-index: 10
    +size(100%,49/$cale+rem)
    display: flex
    justify-content: flex-end
    background-color: $white
    .total-money
      line-height: 22/$cale+rem
      color: $text_color
      padding: 13/$cale+rem 10/$cale+rem 14/$cale+rem
      font-size: 12/$cale+rem
      .count
        color: $mall-main
      .money
        color: $mall-main
        font-size: 16/$cale+rem
        margin-left: 8/$cale+rem
    .btn-submit
      flex: 0 0 105/$cale+rem
      +size(105/$cale+rem,49/$cale+rem)
      background-color: $mall-main
      line-height: 20/$cale+rem
      font-size: 14/$cale+rem
      color: $white
      padding: 14/$cale+rem 0 15/$cale+rem
      text-align: center
  .invoicePopup
    width: 100%
    .invoice-list
      padding: 0 15/$cale+rem
    .invoice-item
      position: relative
      padding: 12/$cale+rem 0
      text-align: center
      border-bottom: 1px solid $mall-border-base
      &:last-child
        border-bottom: 0
      .txt
        line-height: 20/$cale+rem
        font-size: 14/$cale+rem
      .icon-select
        +position(absolute,(top 38% left 34%))
        display: inline-block
        +bg-image('./icon-select')
        background-size: 100% 100%
        +size(15/ $cale + rem,11/ $cale + rem)
        margin-right: 10/$cale+rem
  .rechargePopup
    width: 100%
    .recharge-title
      padding: 11/$cale+rem 15/$cale+rem
      background-color: $background-base
      .title
        line-height: 18/$cale+rem
        font-size: 13/$cale+rem
        color: $text_light
        padding-left: 8/$cale+rem
        border-left: 4/$cale+rem solid $mall-main
    .recharge-list
      padding-left: 15/$cale+rem
      padding-bottom: 20/$cale+rem
      .recharge-item
        position: relative
        padding: 9/$cale+rem 0
        border-bottom: 1px solid $mall-border-base
        .txt
          line-height: 21/$cale+rem
          font-size: 15/$cale+rem
          color: $text_color
          .recharge-icon
            display: inline-block
            background-size: 100% 100%
            +size(35/ $cale + rem,35/ $cale + rem)
            margin-right: 10/$cale+rem
            vertical-align: middle
          .icon-wallet
            +bg-image('./icon-wallet')
          .remain
            margin-left: 10/$cale+rem
        .icon-arrow
          position: absolute
          top: 20/$cale+rem
          right: 15/$cale+rem
          display: inline-block
          +bg-image('./arrow-right')
          background-size: 100% 100%
          +size(8/ $cale + rem,15/ $cale + rem)
          vertical-align: middle
</style>