<template>
  <transition name="slide">
    <div class="orderDetail">
      <m-header title="订单详情" :type="3" @back="back"></m-header>
      <div class="order_wrap" ref="orderWrap">
        <div class="order_list">
          <h3 class="cloud8Name">{{orderInfo.themeName}}
            <span class="fr orderStatus" v-if="orderInfo.orderStatus === 0">待付款</span>
            <span class="fr orderStatus" v-else-if="orderInfo.orderStatus === 1">
              <template v-if="orderInfo.orderWay === 1 && orderInfo.pickupStatus === 0">
                待取货
              </template>
              <template v-if="orderInfo.orderWay === 3 || ( orderInfo.orderWay === 1 && orderInfo.pickupStatus === 1)">
                已取货
              </template>
            </span>
            <span class="fr orderStatus" v-else-if="orderInfo.orderStatus === 3">关闭(付款超时)</span>
            <span class="fr orderStatus" v-else-if="orderInfo.orderStatus === 6">已退款(取货超时)</span>
            <span class="fr orderStatus" v-else-if="orderInfo.orderStatus === 8">异常订单</span>
            <span class="fr orderStatus" v-else-if="orderInfo.orderStatus === 2">已完成</span>
            <span class="fr orderStatus" v-else-if="orderInfo.orderStatus === 13">关闭取货</span>
          </h3>
          <div class="order_detail">
            <ul class="goods_list">
              <li class="goods_item" v-for="(el,index) in orderInfo.datailList" :key="index">
                <div class="fl">
                  <img class="goodsPic" v-bind:src="el.goodsPic" alt="商品图片">
                  <span class="goodsName">{{el.goodsName}}</span>
                </div>
                <div class="fr">
                  <p class="price">&yen;{{el.buyPrice}}</p>
                  <div class="num">x{{el.goodsNum}}</div>
                </div>
              </li>
            </ul>
            <div class="total">
              <div class="fl">{{orderInfo.createTime}}</div>
              <div class="fr">共{{orderInfo.detailCount}}件，合计{{orderInfo.totalMoney}}元</div>
            </div>
            <div class="total" v-if="orderInfo.redPacketMoney">
              <div class="right">红包抵扣：{{parseFloat(orderInfo.totalMoney - orderInfo.redPacketMoney).toFixed(2) > 0 ? orderInfo.redPacketMoney : orderInfo.totalMoney}}元</div>
            </div>
            <div class="total" v-if="orderInfo.redPacketMoney">
              <div class="right">实际支付：{{parseFloat(orderInfo.totalMoney - orderInfo.redPacketMoney).toFixed(2) > 0 ? parseFloat(orderInfo.totalMoney - orderInfo.redPacketMoney).toFixed(2) : 0}}元</div>
            </div>
          </div>
        </div>
        <ul class="detail_list">
          <li>订单编号：{{orderInfo.orderNo}}</li>
          <li>创建时间：{{orderInfo.createTime}}</li>
          <li v-if="orderInfo.payTime">付款时间：{{orderInfo.payTime}}</li>
          <li v-if="orderInfo.pickupTime">取货时间：{{orderInfo.pickupTime}}</li>
          <template v-if="orderInfo.orderStatus === 2 || orderInfo.orderStatus === 8">
            <!-- <li class="getRed-wrapper" v-show="orderInfo.hasActivity">
                      <template v-if="orderInfo.hadJoinActivity === 0">
                          <a class="getRed jq-getRed"><span class="sx_icon icon-red"></span>领红包</a>
                      </template>
                      <template v-else>
                          <a class="getRed received jq-hadGotRed"><span class="sx_icon icon-red_got"></span>领红包</a>
                      </template>
                  </li> -->
          </template>
        </ul>
        <!-- <a class="fixed-btn" @click="toTerminal">再次购买</a> -->
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header'
import { mapGetters, mapMutations } from 'vuex'
import { queryOrderDetail } from 'api/userCenter'
import { setToastMsg, initPage,share } from 'common/js/mixin'
export default {
  mixins: [setToastMsg, initPage,share],
  computed: {
    ...mapGetters(['userInfoId'])
  },
  data() {
    return {
      orderId: '',//订单id
      orderInfo: '',
      goodsList: [],//商品列表
      goodsIds: '',//商品id拼接
    }
  },
  created() {
    document.title='订单详情'
    this._shareDetail()
    this.orderId = this.$route.params.orderId
    this._queryOrderDetail()
    this.$nextTick(() => {
      this._initPage(this.$refs.orderWrap)
    })
  },
  methods: {
    back() {
      this.$router.goBack()
    },
    _queryOrderDetail() {
      queryOrderDetail(this.orderId, this.userInfoId).then(res => {
        if (res.success) {
          this.orderInfo = res
          this.setOrderNo(res.orderNo)
          this.setThemeId(res.cloud8Id)
          this.goodsList = res.datailList
          for (var i = 0; i < this.goodsList.length; i++) {
            if (i == (this.goodsList.length - 1)) {
              this.goodsIds += this.goodsList[i].goodsInfoId;
            } else {
              this.goodsIds += this.goodsList[i].goodsInfoId + ",";
            }
          }

        }else{
          this.setToastMsg(res.msg)
        }
      })
    },
    toTerminal() {
      this.setOrderGoodsIds(this.goodsIds)

      this.$router.push(`/terminal`)

    },
    ...mapMutations({
      setOrderNo: 'SET_ORDERNO',
      setOrderGoodsIds: 'SET_ORDER_GOODS_IDS',
      setThemeId: 'SET_THEMEID'
    })
  },
  components: {
    MHeader
  }
}
</script>


<style lang="sass" type="text/sass">
  @import "../../common/sass/variable"
  @import "../../common/sass/mixin"

  .orderDetail
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background-color: $white
    .payment-modal
      bottom: 48px
    .mui-scroll-wrapper
      top: 0
    .order_list
      background-color: $white
      padding: 0 15px
      &+.order_list
        margin-top: 10px
      .cloud8Name
        padding: 10px 0 10px 9px
        line-height: 20px
        color: $gray-dark
        position: relative
        font-size: 14px
        &:before
          content: ''
          width: 4px
          height: 18px
          background-color: $new-main
          +position(absolute,left 0 top 12px)
      .orderStatus
        color: $new-main
        line-height: 20px
      .goods_list
        overflow: hidden
        margin: 0 -15px
      .goods_item
        background-color: $gray-bg
        padding: 5px 15px
        overflow: hidden
        &+.goods_item
          margin-top: 3px
      .goodsPic
        +size(60px)
        margin-right: 10px
        vertical-align: top
      .goodsName
        line-height: 20px
        font-size: 14px
      .price,.num
        color: $gray
        font-size: 12px
        line-height: 17px
        text-align: right
      .price
        padding-top: 10px
      .total
        position: relative
        padding: 5px 0
        overflow: hidden
        margin-right: -15px
        font-size: 14px
        &:after
          content: ''
          width: 100%
          height: 1px
          box-shadow: inset 0 -0.5px 0 0 #ececec
          +position(absolute,left 0 bottom 0)
        .fr
          line-height: 20px
          color: $gray-base
          vertical-align: bottom
          padding-right: 15px
        .right
          margin-right: 15px
          float: right
          color: $new-main
        .fl
          color: $gray
          font-size: 12px
          line-height: 17px
      .operate
        text-align: right
        padding: 10px 0
        .blue
          font-size: 12px
          color: $blue
          line-height: 17px
          margin-right: 10px
        .btn
          display: inline-block
          background: $new-main
          color: $white
          line-height: 20px
          font-weight: 600
          padding: 6px 17px
          border-radius: $border-radius-base
          vertical-align: middle
    .orange
      margin-top: 20px
      color: #ff9600 !important
    .detail_list
      padding: 10px 15px 10px
      position: relative
      &:after
        content: ''
        width: 100%
        height: 1px
        box-shadow: inset 0 -0.5px 0 0 #ececec
        +position(absolute,left 15px bottom 0)
      li
        font-size: 12px
        line-height: 17px
        color: $gray
        &+li
          margin-top: 5px
      .getRed-wrapper
        +position(absolute,(right 15px bottom 4px))
        margin-top: 0
        .getRed
          font-size: 12px
          color: #333
          line-height: 20px
          padding: 9px 15px 9px 0
          margin-right: -3px
          &.received
            color: #999
        .icon-red,.icon-red_got
          vertical-align: middle
          margin-top: -5px
          margin-right: -4px
    .fixed-btn
      text-align: center
      width: 100%
      position: fixed
      bottom: 0
      left: 0
      color: $white
      height: 50px
      line-height: 50px
      font-size: 18px
      background: $new-main 
      font-weight: 700    

</style>  

