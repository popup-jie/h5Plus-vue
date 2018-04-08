<template>
  <div class="myAccount-container">
    <m-header title="我的账户" :type="3" @back="back"></m-header>

    <scroll class="myAccount-content" :data="detailsListInfo">
      <div class="myAccount" ref="myAccount">
        <div class="cloud8Wallet">
          <div class="ky">可用余额</div>
          <h1>&yen;
            <span id="totalAmount">{{(userWalletMoney != '') ? userWalletMoney.toFixed(2) : zero}}</span>
          </h1>
          <transition name="slide-left">
            <a @click="recharge">充值</a>
            <!-- <router-link :to="{path: `/user/myAccount/myAccountRecharge`,query: {avaAmount: datas.availableAmount}}">充值</router-link> -->
          </transition>
          <p>押金 {{shareData.shareDeposit || 0}} 元&nbsp;&nbsp;
            <span class="return" @click="showConfirm" v-show="shareData.shareDepositStatus==1">退款</span>
            <span class="return" v-show="shareData.shareDepositStatus==4">退款中</span>
          </p>
        </div>
        <div class="bill_wrap">
          <div class="bill_title">
            <span class="icon-bill"></span>
            <span class="myBill dib">我的账单</span>
          </div>
          <div class="bill_body">
            <div class="mui-col-xs-6">
              <p>本月入账&nbsp;(元)</p>
              <h4 id="income">{{(datas.income != null) ? datas.income.toFixed(2) : zero}}</h4>
            </div>
            <div class="mui-col-xs-6">
              <p>本月支出&nbsp;(元)</p>
              <h4 id="expenditure">{{(datas.expenditure != null) ? datas.expenditure.toFixed(2) : zero}}</h4>
            </div>
          </div>
        </div>
        <div class="transactionDetail">
          <h5>交易详情</h5>
          <ul class="tranc-list">
            <li class="tranc-item" v-for="(item,index) in detailsListInfo" :key="index">
              <div class="trancType orange" v-if="item.type === 2">
                <span class="fl">{{item.typeStr}}</span>
                <span class="fr">{{item.expenditure}}</span>
              </div>
              <div class="trancType orange" v-else-if="item.type === 5">
                <span class="fl">{{item.typeStr}}</span>
                <span class="fr">{{item.expenditure}}</span>
              </div>
              <div class="trancType blue" v-else>
                <span class="fl">{{item.typeStr}}</span>
                <span class="fr">{{item.income}}</span>
              </div>
              <div class="trancDate gray">
                <span class="fl">{{item.createTime}}</span>
                <span class="fr">{{item.transactionStatus}}</span>
              </div>
            </li>
          </ul>
        </div>
        <!-- <p class="noMore tc none">无更多交易</p> -->
        <!--一条交易记录总数为0时，显示 noTransaction-->
        <div class="noTransaction" v-show="datas.count == 0">
          <div class="img_noTransaction"><img src="./noTransaction.png"></div>
          <div class="tc">查无交易详情</div>
        </div>
        <!--当交易记录总数大于5时，本页面显示5条记录，并显示“查看更多交易”按钮-->
        <!-- 样式有问题 -->
        <div>
          <router-link class="lookDetails" v-show="datas.count > 5" to="/myaccountdetail">查看更多交易</router-link>
        </div>
      </div>
    </scroll>
    <div class="toast" v-show="showFlag">当前存在物品未归还，请先归还物品后，再进行押金退款</div>
    <confirm ref="confirm" @confirm="_refund" @cancel="_refund" :text="text" title="押金退款" cancelBtnText="取消退款"></confirm>

  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header'
import Scroll from 'base/scroll/scroll'
import Confirm from 'base/confirm/confirm'
import { mapGetters, mapMutations } from 'vuex'
import { queryTradeDetail, shareIsRetrun, refund } from 'api/userCenter'
import { initPage, setToastMsg,share } from 'common/js/mixin'

export default {
  mixins: [initPage, setToastMsg,share],
  data() {
    return {
      showFlag: false, //未归还时提示语显示
      yearAndMonth: '',
      datas: [], //交易详情全部内容
      detailsListInfo: [], //交易详情记录不为空时
      shareData: [], //是否归还物品全部内容
      zero: '0.00',
      text: '押金退款后将不能继续进行物品共享哦，确定要进行押金退款吗？'
    }
  },
  created() {
    document.title = '我的账户'
    this._shareDetail()
    this.$nextTick(() => {
      this._initPage(this.$refs.myAccount)
    })
    // 获取当天时间
    let myDate = new Date()
    if (parseInt(myDate.getMonth()) + 1 < 10) {
      this.yearAndMonth =
        myDate.getFullYear() + '-0' + (parseInt(myDate.getMonth()) + 1)
    } else {
      this.yearAndMonth =
        myDate.getFullYear() + '-' + (parseInt(myDate.getMonth()) + 1)
    }
    this._queryTradeDetail()
    this._shareIsRetrun()
  },
  computed: {
    ...mapGetters(['userToken', 'userWalletMoney'])
  },
  methods: {
    back() {
      this.$router.goBack()
      return
    },
    recharge() {
      this.$router.push('myaccountrecharge')
    },
    showConfirm() {
      if (this.shareData.isRetrun) {
        //已归还
        this.$refs.confirm.show()
      } else {
        this.showFlag = true
        setTimeout(() => {
          this.showFlag = false
        }, 2000)
      }
    },
    _queryTradeDetail() {
      //交易详情
      queryTradeDetail(this.userToken, this.yearAndMonth, 0).then(res => {
        if (res.success) {
          this.datas = res
          this.setUserWalletMoney(res.availableAmount)
          if (res.count) {
            this.detailsListInfo = res.fiveTradeDetail.slice(0, 5)
          }
        } else {
          this.setToastMsg(res.msg)
        }
      })
    },
    _shareIsRetrun() {
      //是否归还物品
      shareIsRetrun(this.userToken).then(res => {
        if (res.success) {
          this.shareData = res
        } else {
          this.setToastMsg(res.msg)
        }
      })
    },
    _refund(type) {
      //退款
      refund(this.userToken, type).then(res => {
        if (res.success) {
          if (type == 1) {
            //确定
            this.$router.push('/refundSuccess')
          }
        } else {
          this.setToastMsg(res.msg)
        }
      })
    },
    ...mapMutations({
      setUserWalletMoney: 'SET_USER_WALLET_MONEY'
    })
  },
  components: {
    MHeader,
    Confirm,
    Scroll
  }
}
</script>

<style lang="sass" type="text/sass">
@import "../../common/sass/variable"
@import "../../common/sass/mixin"
.myAccount-container
  position: fixed
  z-index: 100
  top: 0
  left: 0
  right: 0
  bottom: 0
  background-color: $white
  .myAccount-content
    position: fixed
    top: 44/$cale+rem
    bottom: 0
    width: 100%
    overflow: hidden 
    .myAccount
      padding-bottom: 8/$cale+rem
  span
    display: inline-block
  .cloud8Wallet
    width: 100%
    height: 250/$cale+rem
    margin: 10/$cale+rem 15/$cale+rem  0 0
    color: $white
    text-align: center
    +bg-image('./cloud8Wallet')
    background-size: 100% 100% 
    p
      padding-top: 14/$cale+rem
      font-size: 14/$cale+rem
      color: $white
      line-height: 20/$cale+rem
      font-weight: normal
    .return
      color: #dd7b7b
    .ky
      font-size: 17/$cale+rem
      font-weight: 600
      line-height: 28/$cale+rem
      padding-top: 55/$cale+rem
    h1
      font-size: 46/$cale+rem
      line-height: 56/$cale+rem
    a
      display: inline-block
      +size-height(57.5%,42/$cale+rem)
      border-radius: 100/$cale+rem
      background-color: #ff6565
      font-size: 18/$cale+rem
      color: $white
  .bill_wrap
    width: 100%
    .bill_title
      position: relative
      padding-left: 3.4%
      padding-bottom: 23/$cale+rem
      display: flex
      .icon-bill
        +size(22/$cale+rem, 24/$cale+rem)
        +bg-image('./bill')
        background-size: 100% 100%
        position: absolute
        top: -1px
      .myBill
        font-size: 17/$cale+rem
        line-height: 24/$cale+rem
        color: $gray-dark
        padding-left: 11%
        display: inline
        width: 100%
  .bill_body
      padding: 0 8.53%
      margin-bottom: 26/$cale+rem
      display: flex
      div
        width: 50%
        text-align: center
      .mui-col-xs-6
        padding-right: 4%
        color: $mall-blue
        &:last-child
          color: $mall-main
          padding-left: 4%
          padding-right: 0
          p
            color: $mall-main
          &:after
            content: ''
            width: 1/$cale+rem
            height: 39.4/$cale+rem
            +position(absolute,left 0 top 20.4/$cale+rem)
            background-color: #ccc
        p
          font-size: 20/$cale+rem
          line-height: 28/$cale+rem
          padding-bottom: 6/$cale+rem
          text-align: left
          color: $mall-blue
        h4
          font-size: 36/$cale+rem
          line-height: 42/$cale+rem
          text-align: center
  .lookDetails
    +size(37.34%,22/$cale+rem)
    display: block
    margin: 20/$cale+rem auto
    border: 1/$cale+rem solid $mall-main
    border-radius: 5/$cale+rem
    font-size: 15/$cale+rem
    color: $mall-main
    height: 40/$cale+rem
    line-height: 40/$cale+rem
    text-align: center
    &:hover,&:focus
      background-color: $mall-main
      color: $white
  .transactionDetail
    h5
      font-size: 13/$cale+rem
      line-height: 20/$cale+rem
      color: $gray-dark
      padding-bottom: 10/$cale+rem
      +b-solid(1/$cale+rem, $border-light, bottom)
      text-indent: 15/$cale+rem
    .tranc-list
      padding-left: 4%
    .tranc-item
      position: relative
      padding: 10/$cale+rem 4% 10/$cale+rem 0
      &:after
        content: ''
        +position(absolute, (right 0 bottom 0 left 0))
        +b-solid(1px, $border-light, bottom)
    .trancType
      font-size: 14/$cale+rem
      +line-height(20/$cale+rem)
    .trancDate
      font-size: 12/$cale+rem
      +line-height(17/$cale+rem)
  .noMore
    padding: 22/$cale+rem 0
    font-size: 14/$cale+rem
    line-height: 20/$cale+rem
  .noTransaction
    margin: 20/$cale+rem 0 70/$cale+rem
    .img_noTransaction
      width: 110/$cale+rem
      margin: 0 auto 20/$cale+rem
    img
      width: 100%
    .tc
      font-size: 14/$cale+rem
      line-height: 20/$cale+rem
      margin: 0
      color: $gray
  .toast
    @include center(null, 50/$cale+rem)
    width: 220/$cale+rem
    height: 90/$cale+rem
    line-height: 25/$cale+rem
    padding: 10/$cale+rem
    background: rgba(0, 0, 0, 0.7)
    border-radius: $border-radius-large
    color: $white
    font-size: 16/$cale+rem
    text-align: left
    transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
</style>