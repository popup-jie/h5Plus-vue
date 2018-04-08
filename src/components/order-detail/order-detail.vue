<template>
  <div class="order-detail">
    <m-header title="订单详情" :type="3" @back="back"></m-header>
    <div class="order-detail-wrapper" ref="orderDetailWrapper" :style="{bottom:newBottom}">
      <div class="scroll-inner">
        <!--订单步骤进度信息-->
        <div class="steps-wrapper">
          <div class="steps-tip">
            <span class="txt" :class="{'active':curOrderStatus>=index}" v-for="(item,index) in orderStatus">
              {{item}}
            </span>
          </div>
          <div class="steps">
            <div class="steps-inner" :style="{'width':stepWidth}">
            </div>
            <div class="icon-wrapper">
              <span class="step-icon" :class="{'active':curOrderStatus>=index}" v-for="(item,index) in tempArr"></span>
            </div>
          </div>
        </div>
        <!--物流信息-->
        <div class="logistics" @click="toLogistics">
          <div class="logistics-item">
            交易状态：
            <span class="status">{{NoworderStatus}}</span>
          </div>
          <div class="logistics-item">
            订单编号：{{orderInfo.orderNo}}
          </div>
          <div class="logistics-item">
            创建时间：{{orderInfo.createTime}}
          </div>
          <span class="icon-arrow"></span>
        </div>
        <!--收货人信息-->
        <div class="receiveAddress">
          <span class="icon-address"></span>
          <div class="address-info">
            <p class="name">
              <span class="left">收货人：{{orderInfo.receiver}}</span>
              <span class="right">{{orderInfo.phoneNo}}</span>
            </p>
            <p class="address">收货地址：{{orderInfo.addressDetail}}</p>
          </div>
        </div>
        <!--拼团信息---待分享--未拼满-->
        <div class="fightGroups" v-show="orderInfo.orderType === 1 && orderInfo.groupBuyInfo.status === 0">
          <div class="top-title">
            <span class="left">拼团信息：</span>
            <span class="right">还差{{orderInfo.groupBuyInfo?orderInfo.groupBuyInfo.needNum:0}}人，剩余{{pingdanList.length>0?(pingdanList[0].extratime?pingdanList[0].extratime.extratime:pingdanList.endTime):''}}</span>
          </div>
          <div class="bottom-wrapper">
            <div class="avatars">
              <div class="avatars-list">
                <div class="avatar-item" v-for="pic in fightGroupsAvatars.slice(0,4)" v-show="fightGroupsAvatars.length>0">
                  <img v-lazy="formatAvatar(pic)">
                </div>
              </div>
              <div class="more">...</div>
            </div>
            <div class="btn-share" @click="shareFriends">邀请好友</div>
          </div>
        </div>
        <!--拼团成功-->
        <div class="fightGroups" v-show="orderInfo.orderType === 1 && orderInfo.groupBuyInfo.status === 1">
          <div class="top-title">
            <span class="left">拼团信息：</span>
            <span class="right pink-color">拼团成功</span>
          </div>
          <div class="swiper-container" id="swiper-container">
            <div class="swiper-wrapper">
              <div class="swiper-slide" v-for="pic in fightGroupsAvatars">
                <img v-lazy="formatAvatar(pic)">
              </div>
            </div>
          </div>
        </div>
        <!--拼团结束-->
        <div class="fightGroups" v-show="orderInfo.orderType === 1 && orderInfo.groupBuyInfo.status === 2">
          <div class="top-title">
            <span class="left">拼团信息：</span>
            <span class="right pink-color">拼团结束</span>
          </div>
          <div class="swiper-container" id="swiper-container">
            <div class="swiper-wrapper">
              <div class="swiper-slide" v-for="pic in fightGroupsAvatars">
                <img v-lazy="formatAvatar(pic)">
              </div>
            </div>
          </div>
        </div>
        <!--商品信息-->
        <div class="goods-wrapper">
          <ul class="goods-item">
            <li class="product" v-for="(product,Cindex) in orderInfo.goods">
              <div class="product-info">
                <img class="pic" :src="orderInfo.pictureAddress+product.picture" />
                <div class="detail">
                  <div class="left">
                    <p class="name">{{product.goodsName}}</p>
                    <p class="norms">{{product.specificationsName}}</p>
                  </div>
                  <div class="right">
                    <p class="price">&yen;{{product.price}}</p>
                    <p class="oldprice" v-show="IsSuperVip && (product.price !== product.orginalPrice)">&yen;{{product.orginalPrice}}</p>
                    <p class="count">x{{product.num}}</p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <!--商品详细信息-->
          <div class="goods-desc">
            <div class="desc-item">
              <span class="left-txt">商品数量</span>
              <span class="right-txt">{{totalNum}}件</span>
            </div>
            <div class="desc-item">
              <span class="left-txt">商品总价</span>
              <span class="right-txt">&yen;{{toFixed2(orderInfo.totalMoney)}}</span>
            </div>
            <div class="desc-item">
              <span class="left-txt">运费</span>
              <span class="right-txt">&yen;{{toFixed2(orderInfo.freight)}}</span>
            </div>
            <div class="desc-item" v-show="orderInfo.orderType == 0 && orderInfo.discountPrice>0">
              <span class="left-txt">返现金额</span>
              <span class="right-txt">&yen;{{toFixed2(orderInfo.discountPrice)}}</span>
            </div>
            <div class="desc-item" v-show="orderInfo.orderType == 0 && orderInfo.nowLessPrice>0">
              <span class="left-txt">立减金额</span>
              <span class="right-txt">&yen;{{toFixed2(orderInfo.nowLessPrice)}}</span>
            </div>
            <div class="desc-item">
              <span class="left-txt">订单总价(含运费)</span>
              <span class="right-txt">&yen;{{toFixed2(orderInfo.realMoney)}}</span>
            </div>
          </div>
        </div>
        <!--付款方式-->
        <div class="payment" v-show="orderInfo.payType">
          <span class="txt">付款方式</span>
          <span class="txt">{{payTypeTxt}}支付</span>
        </div>
      </div>
    </div>
    <!--底部付款按钮-->
    <div class="fixed-btn" v-show="orderInfo.status===0" @click="ShoppingPay">付款</div>
    <!-- 付款--支付方式弹窗 -->
    <pay v-show="payShow" ref="pay" @closeAlert="closeAlert" @payforSuccess="payforSuccess" :showVip="showVip" :showWallet="showWallet" :comeType="comeType" :payfor="payforType" :payforallMoney="payforallMoney" :payforUrl="payforUrl" :groupBuyTypeId="groupBuyTypeId">
    </pay>
    <!--底部确认收货按钮-->
    <div class="fixed-btn" @click="ShoppingReceiveGoods" v-show="orderInfo.status===1">确认收货</div>
    <!--确认收货---系统确认弹窗-->
    <confirm ref="receiveGoodsConfirm" title="提示" :text="receiveGoodsConfirmTxt" @confirm="ReceiveGoods" @cancel="notReceiveGoods"></confirm>
    <!-- 分享 -->
    <transition name="fade">
      <div class="showMask" v-show="showMask" @click="closeShareAlert">
        <share-type ref="shareType" class="shareType" :title="inviteTitle" :content="inviteContent" :thumbs="shareThumbs" :href="shareGoodDetailUrl"></share-type>
      </div>
    </transition>
    <transition name="fade">
      <div class="share-mask-pic" v-show="shareMaskPic" @click="showSharePic">
        <img src="./share-mask-pic.png" alt="">
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header'
import BScroll from 'better-scroll'
import Confirm from 'base/confirm/confirm'
import { initPage, setToastMsg, CountDown } from 'common/js/mixin'
import { orderDetail, receiveGoods } from 'api/order'
import { mapGetters, mapMutations } from 'vuex'
import Pay from 'components/pay/pay'
import { payforUrl } from 'api/config'
import Swiper from 'swiper'
import ShareType from 'components/share-type/share-type'
import { serverUrlPrefix, serverUrlSuffix } from 'api/config'
import { Base64 } from 'js-base64'
import { avatar } from 'common/js/tools'

export default {
  mixins: [initPage, setToastMsg, CountDown],
  data() {
    return {
      orderStatus: ['下单', '发货', '收货', '完成'], //订单状态
      curOrderStatus: 0, //订单状态（0:下单，1:发货，2:收货，3:完成）
      tempArr: [0, 1, 2, 3], //临时数组，用于遍历进度条中的图标
      orderInfo: {}, //订单详细信息
      payShow: false, //显示支付方式弹窗
      showVip: false, //显示会员卡支付方式
      showWallet: true, //显示线上钱包支付方式
      comeType: 'online', //进入Pay组件的类型，线上
      payforType: 3, //支付类型 1:充值支付 2:共享支付 3:订单支付4:小程序共享支付5:会员卡充值支付6:购买会员卡7:会员卡和商品一起支付
      payforUrl: payforUrl, //线上商城下单接口url
      payforallMoney: 0, //订单待支付金额，传递给pay组件的
      receiveGoodsConfirmTxt: '您确认已经收到货物了吗？</br>否则财物两空喔。', //确认收货---系统确认弹窗（显示文字内容）
      groupBuyTypeId: '', //拼团类型ID
      pingdanList: [], //拼团倒计时数组
      orderDetailTimer: null, //拼团倒计时
      fightGroupsAvatars: [], //拼团成员头像地址
      goodsid: '', //邀请好友对应的商品ID
      sharegoodspingtuan: '', //邀请好友对应的拼团id
      showMask: false, //分享相关变量
      shareMaskPic: false, //是否显示指向右上角分享图片（分享相关变量）
      shareGoodDetailUrl: '',//分享链接
      formatBgimg: '', //邀请好友，商品图片
      shareTitle: '', //邀请好友，商品名称
      sharePrice: '', //邀请好友，商品价格
    }
  },
  computed: {
    stepWidth() {
      //绿色进度条的宽度
      return this.curOrderStatus * 33 + '%'
    },
    NoworderStatus() {
      let statusTxt
      console.log(this.orderInfo.status)
      switch (this.orderInfo.status) {
        case 0:
          statusTxt = '待付款'
          break
        case 1:
          statusTxt = '待收货'
          break
        case 2:
          statusTxt = '待分享'
          break
        case 3:
          statusTxt = '待发货'
          break
        case 4:
          statusTxt = '待评论'
          break
        case 5:
          statusTxt = '交易完成'
          break
        case 6:
          statusTxt = '交易关闭'
          break
        default:
          statusTxt = ''
      }
      return statusTxt
    },
    //商品总件数
    totalNum() {
      let total = 0
      if (this.orderInfo.goods) {
        this.orderInfo.goods.forEach(function (item, index) {
          total += item.num
        })
      }
      return total
    },
    //支付方式
    payTypeTxt() {
      let txt
      switch (this.orderInfo.payType) {
        case 1:
          txt = '支付宝'
          break
        case 2:
          txt = '微信'
          break
        case 3:
          txt = '线上钱包'
          break
        case 4:
          txt = '会员卡'
          break
        default:
          txt = ''
      }
      return txt
    },
    newBottom() {
      if (this.orderInfo.status !== 0 && this.orderInfo.status !== 1) {
        return '0rem'
      }
    },
    ...mapGetters([
      'userToken',
      'orderNo',
      'IsSuperVip',
      'programType',
      'shareThumbs',
      'inviteTitle',
      'inviteContent',
      'IsSuperVip'
    ])
  },
  created() {
    document.title = '订单详情'
    if (localStorage.getItem('payforsuc')) {
      // this.setToastMsg('支付成功...')
      this.payShow = false
      $('.order-detail').hide()
    } else {
      $('.order-detail').show()
      this._orderNo = this.orderNo || this.$route.params.orderNo
      this._initscroll()
      this._initData()
      this.shareMaskPic = false
    }
    //this.shareFriends('comeDetail')
  },
  mounted() {
    this.$nextTick(() => {
      this._initPage(this.$refs.orderDetailWrapper, 'close')
    })
    new Swiper('#swiper-container', {
      slidesPerView: 'auto',
      observer: true, //修改swiper自己或子元素时，自动初始化swiper
      observeParents: true //修改swiper的父元素时，自动初始化swiper
    })
    this.$nextTick(() => {
      if (this.$refs.pay) {
        this.$refs.pay.countime()
      }
      var u = navigator.userAgent,
        app = navigator.appVersion
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
  destroyed() {
    clearInterval(this.orderDetailTimer)
    this.orderDetailTimer = null
    clearInterval(this.PAYFORTIMES)
    this.PAYFORTIMES = null
  },
  methods: {
    back() {
      this.$router.goBack()
    },
    formatAvatar(item) {
      return avatar(item)
    },
    toFixed2(num) {
      return num ? num.toFixed(2) : '0.00'
    },
    _initscroll() {
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.orderDetailWrapper, {
            click: true,
            probeType: 3
          })
        } else {
          this.scroll.refresh()
        }
      })
    },
    _initData() {
      //查询订单信息
      orderDetail(this._orderNo, this.userToken).then(res => {
        if (res.success) {
          this.orderInfo = res
          if (res.groupBuyInfo && res.groupBuyInfo.userList) {
            this.fightGroupsAvatars = res.groupBuyInfo.userList.map(
              (item, index, arr) => {
                return item.avatar
              }
            )
          }
          //拼团订单未拼满时，调用计时器
          if (res.orderType == 1 && res.groupBuyInfo.status == 0) {
            this.CountDownList()
          }
          if (res.status == 4) {
            //待评价，即已确认收货
            this.curOrderStatus = 2 //强制定义为2(收货状态)
          } else if (res.status == 5) {
            //交易完成
            this.curOrderStatus = 3 //强制定义为3(完成状态)
          } else if (res.status == 6) {
            //交易关闭
            this.curOrderStatus = 0 //强制定义为0(下单状态)
          } else if (res.status == 3) {
            //待发货
            this.curOrderStatus = 0 //强制定义为0(下单状态)
          } else if (res.status == 2) {
            //待分享
            this.curOrderStatus = 0 //强制定义为0(下单状态)
          } else if (res.status == 1) {
            //待收货
            this.curOrderStatus = 1 //强制定义为1(发货状态)
          } else {
            this.curOrderStatus = res.status
          }
          this.setUserWalletMoney(res.walletavailableAmount)
        } else {
          this.setToastMsg(res.msg)
        }
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      })
    },
    //查看物流详情
    toLogistics() {
      let orderNo = this.orderInfo.orderNo
      this.setOrderNo(orderNo)
      this.$router.push(`/logistics/${orderNo}`)
    },
    //拼团订单倒计时时间数组重组
    CountDownList() {
      let _arr = []
      let tempItem = this.orderInfo.groupBuyInfo
        ? this.orderInfo.groupBuyInfo
        : { endTime: 0 }
      _arr.push(tempItem)
      clearInterval(this.orderDetailTimer)
      this.orderDetailTimer = null
      this.pingdanList = _arr
      console.log(_arr)
      //加载拼团订单---倒计时
      this.$nextTick(() => {
        this._getFormatTime(
          this.pingdanList,
          'endTime',
          this.orderDetailTimer,
          (res, time) => {
            this.pingdanList = res
            this.orderDetailTimer = time
            if (res[0].extratime && !res[0].extratime.isShow) {
              clearInterval(this.orderDetailTimer)
              this.orderDetailTimer = null
            }
            console.log(this.pingdanList)
          }
        )
      })
    },
    //邀请好友
    shareFriends(type) {
      let item = this.orderInfo
      console.log(item)
      this.setOrderNo(item.orderNo)
      if (item.orderType === 1) { //拼团订单
        this.goodsid = item.goods[0].goodsId;//邀请好友对应的商品ID
        this.formatBgimg = this.orderInfo.pictureAddress + item.goods[0].picture; //邀请好友对应的商品图片
        this.shareTitle = item.goods[0].goodsName;//邀请好友对应的商品名称
        this.sharePrice = item.goods[0].price;//邀请好友对应的商品价格
        this.sharegoodspingtuan = item.groupBuyInfo.startGroupBuyId;  //邀请好友对应的拼团id
        this.shareGoodDetailUrl = serverUrlPrefix + `programType=${this.programType}&target=goodsdetails&goodsid=${this.goodsid}&sharegoodspingtuan=${this.sharegoodspingtuan}` + serverUrlSuffix
      }
      //分享
      if (this.programType === 'H5App') {
        this.$refs.shareType.show()
        this.showMask = true
      } else {
        if (type == 'comeDetail') {
          this.shareMaskPic = false
        } else {
          this.shareMaskPic = true
        }
      }
      this.minipragram()
    },
    minipragram() {
      if (window.__wxjs_environment === 'miniprogram') {
        let goodsid = `${this.goodsid}`
        let sharegoodspingtuan = `${this.sharegoodspingtuan}`
        let title = `【立即拼团】${this.shareTitle}，售价${this.sharePrice}元，拼团享特惠,新锐礼助力新年好福气`
        console.log('goodsid=' + goodsid, 'title=' + title)
        wx.miniProgram.postMessage({ data: { 'goodsid': goodsid, 'sharegoodspingtuan': sharegoodspingtuan, 'title': title, 'formatBgimg': this.formatBgimg } })
      }
    },
    closeShareAlert() {
      this.$refs.shareType.hide()
      this.showMask = false
    },
    showSharePic() {
      this.shareMaskPic = false
    },
    //付款
    ShoppingPay() {
      let item = this.orderInfo
      this.setOrderNo(item.orderNo)
      if (item.orderType === 1) {
        //拼团订单
        this.groupBuyTypeId = item.groupBuyInfo.groupBuyTypeId.toString() //拼团类型ID
      }
      this.payforallMoney = item.realMoney
      this.payShow = true
    },
    //商城订单操作--【确认收货】
    ShoppingReceiveGoods() {
      let orderNo = this.orderInfo.orderNo
      this.setOrderNo(orderNo)
      this.$refs.receiveGoodsConfirm.show()
    },
    //【确认收货】--“确定”按钮事件
    ReceiveGoods() {
      receiveGoods(this.orderNo, this.userToken).then(res => {
        if (res.success) {
          this.$refs.receiveGoodsConfirm.hide()
          this._initData()
        } else {
          this.setToastMsg(res.msg)
          this.$refs.receiveGoodsConfirm.hide()
        }
      })
    },
    //【确认收货】--“取消”按钮事件
    notReceiveGoods() {
      this.$refs.receiveGoodsConfirm.hide()
    },
    //支付成功回调
    payforSuccess() {
      //支付成功回调
      if (window.__wxjs_environment === 'miniprogram') {
        this.$router.replace(`/orderpaysuccess`)
      } else {
        this.$router.push(`/orderpaysuccess`)
      }
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
  components: {
    MHeader,
    Confirm,
    Pay,
    ShareType
  }
}
</script>

<style type="text/sass" lang="sass">
  @import "../../common/sass/variable"
  @import "../../common/sass/mixin"

  .order-detail
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background-color: $background-base
    font-size: 14/$cale+rem
    line-height: 20/$cale+rem
    .order-detail-wrapper
      position: fixed
      top: 44/$cale+rem
      bottom: 47/$cale+rem
      overflow: hidden
      width: 100%
      padding-bottom: 60/$cale+rem
      .scroll-inner
        padding-bottom: 10/$cale+rem
    .steps-wrapper
      padding: 10/$cale+rem 20/$cale+rem
      background-color: $white
      border-bottom: 1px solid $mall-border-base
      .steps-tip
        display: flex
        justify-content: space-between
        padding-bottom: 14/$cale+rem
        .txt
          line-height: 17/$cale+rem
          font-size: 12/$cale+rem
          color: $text_lighter
          &.active
            color: $mall-green
      .steps
        position: relative
        +size(100%,2/$cale+rem)
        margin: 8/$cale+rem 0
        background-color: $text_lighter
      .steps-inner
        position: absolute
        left: 0
        top: 0
        +size(0,2/$cale+rem)
        background-color: $mall-green
      .step-icon
        position: absolute
        left: 0
        top: -8/$cale+rem
        display: inline-block
        +bg-image('./icon-circle')
        background-size: 100% 100%
        +size(18/ $cale + rem,18/ $cale + rem)
        &.active
          +bg-image('./icon-circle-active')
        &:nth-child(2)
          left: 33%
          margin-left: -9/$cale+rem
        &:nth-child(3)
          left: 66%
          margin-left: -9/$cale+rem
        &:last-child
          left: 99%
          margin-left: -9/$cale+rem
    .logistics
      position: relative
      padding: 12/$cale+rem 15/$cale+rem
      overflow: hidden
      background-color: $white
      &:after
        content: ''
        +size(92%,1px)
        position: absolute
        left: 15/$cale+rem
        bottom: 0
        border-bottom: 1px solid $mall-border-base
      .logistics-item
        line-height: 17/$cale+rem
        font-size: 12/$cale+rem
        color: $text_lighter
        margin-bottom: 6/$cale+rem
        &:last-child
          margin-bottom: 0
        .status
          color: $mall-green
      .icon-arrow
        display: inline-block
        position: absolute
        right: 15/$cale+rem
        top: 34/$cale+rem
        +bg-image('./arrow-right')
        background-size: 100% 100%
        +size(10/ $cale + rem,18/ $cale + rem)
    .receiveAddress
      display: flex
      position: relative
      padding: 12/$cale+rem 15/$cale+rem
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
      .address-info
        flex: 1
        padding-left: 30/$cale+rem
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
    .fightGroups
      padding: 12/$cale+rem 15/$cale+rem
      background-color: $white
      margin-bottom: 10/$cale+rem
      .top-title
        display: flex
        justify-content: space-between
        line-height: 17/$cale+rem
        font-size: 12/$cale+rem
        color: $text_lighter
        padding-bottom: 6/$cale+rem
        .pink-color
          color: $pink
      .bottom-wrapper
        display: flex
        justify-content: space-between
        .avatars
          display: flex
        .avatars-list
          display: flex
        .avatar-item
          flex: 1
          margin-right: 15/$cale+rem
          +size(40/$cale+rem)
          img
            +size(100%)
            border-radius: 50%
        .more
          line-height: 20/$cale+rem
          font-size: 20/$cale+rem
          color: $text_light
        .btn-share
          margin-top: 5/$cale+rem
          margin-bottom: 5/$cale+rem
          padding: 5/$cale+rem 12/$cale+rem
          border-radius: 100/$cale+rem
          background-color: $pink
          color: $white
          line-height: 20/$cale+rem
      .swiper-container
        overflow: hidden
        width: 100%
        height: 40/$cale+rem
        .swiper-slide
          +size(40/$cale+rem)
          margin-right: 15/$cale+rem
          img
            +size(100%)
            border-radius: 50%
    .goods-item
      background-color: $white
      padding: 10/$cale+rem 0 0
      .product
        display: flex
        margin-bottom: 2/$cale+rem
        &:last-child
          margin-bottom: 0
      .product-info
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
              color: $text_color
              font-weight: 600
            .oldprice
              color: #dedede
              font-size: 14/$cale+rem
              text-decoration: line-through
            .count
              line-height: 18/$cale+rem
              font-size: 13/$cale+rem
              color: $text_lighter
    .goods-desc
      margin-bottom: 10/$cale+rem
      padding: 10/$cale+rem 15/$cale+rem
      background-color: $white
      .desc-item
        display: flex
        justify-content: space-between
        font-size: 12/$cale+rem
        line-height: 17/$cale+rem
        color: $text_color
        margin-bottom: 6/$cale+rem
        &:last-child
          margin-bottom: 0
          font-size: 14/$cale+rem
          line-height: 20/$cale+rem
          .right-txt
            color: $mall-main
    .payment
      display: flex
      justify-content: space-between
      padding: 10/$cale+rem 15/$cale+rem
      background-color: $white
      .txt
        line-height: 20/$cale+rem
        font-size: 14/$cale+rem
        color: $text_color
    .fixed-btn
      position: fixed
      bottom: 0
      left: 0
      +size-height(100%,47/$cale+rem)
      font-size: 16/$cale+rem
      text-align: center
      background-color: $mall-main
      color: $white
    .shareType
      background: $white
      color: $gray-dark
    .showMask
      position: fixed
      z-index: 1001
      left: 0
      right: 0
      bottom: 0
      top: 0
      background: rgba(0,0,0,0.6)
      width: 100%
      height: 100%
      &.fade-enter-active, &.fade-leave-active
        transition: all 0.5s
      &.fade-enter, &.fade-leave-to
        opacity: 0
    .share-mask-pic
      position: fixed
      z-index: 1003
      left: 0
      right: 0
      bottom: 0
      top: 0
      >img
        width: 100%
      &.fade-enter-active, &.fade-leave-active
        transition: all 0.5s
      &.fade-enter, &.fade-leave-to
        opacity: 0
</style>