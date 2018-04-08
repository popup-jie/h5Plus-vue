<template>
  <div class="my-order">
    <m-header title="我的订单" :type="3" @back="back"></m-header>
    <!--搜索框-->
    <mt-search v-model="value" placeholder="请输入订单编号" :result="[]"></mt-search>
    <ul class="order-switch">
      <li class="order-switch-item" :class="{'active':selectSwitchIndex===index}" v-for="(item,index) in orderSwitch" @click="switchOrder(index)">
        {{item}}
      </li>
    </ul>
    <div class="swiper-container" id="swiper-container" v-show="selectSwitchIndex === 0">
      <div class="swiper-wrapper order-type">
        <div class="swiper-slide order-type-item" :class="{'active':selectOrderStatus===index}" v-for="(item,index) in orderType" @click="switchStatus(index)">
          {{item}}
        </div>
      </div>
    </div>
    <!--商城订单--商品列表区-->
    <scroll class="goods-list" ref="goodsList" v-show="selectSwitchIndex === 0" :data="shoppingOrderList" :pullup="pullup" @scrollToEnd="orderscrollToEnd" :style="{top: newTop}">
      <div class="scroll-inner">
        <div class="goods-item" v-for="(item,Pindex) in shoppingOrderList" @click.stop.prevent="ShoppingOrderDetail(item.orderNo)">
          <!--拼团订单-->
          <template v-if="item.orderType === 1">
            <div class="item-title">
              <div class="order-info">
                <span class="icon-fightGroups"></span>
                <p class="time-wrapper">订单创建时间：
                  <span class="time">{{item.createTime}}</span>
                </p>
              </div>
              <div class="order-status">
                <template v-if="item.status === 0">
                  <p class="status pink" v-if="pingdanList[Pindex].extratime?!pingdanList[Pindex].extratime.isShow:false">交易关闭</p>
                  <p class="status pink" v-else>{{orderStatus(item.status)}}</p>
                </template>
                <template v-else>
                  <p class="status pink">{{orderStatus(item.status)}}</p>
                </template>
                <p class="hasTime pink" v-show="item.status === 0">{{pingdanList[Pindex].extratime?pingdanList[Pindex].extratime.extratime:pingdanList.payEndTime}}</p>
              </div>
            </div>
          </template>
          <!--普通订单-->
          <template v-else>
            <div class="item-title">
              <div class="order-info">
                <p class="time-wrapper">订单创建时间：
                  <span class="time">{{item.createTime}}</span>
                </p>
              </div>
              <div class="order-status">
                <template v-if="item.status === 0">
                  <p class="status" v-if="pingdanList[Pindex].extratime?!pingdanList[Pindex].extratime.isShow:false">交易关闭</p>
                  <p class="status" v-else>{{orderStatus(item.status)}}</p>
                </template>
                <template v-else>
                  <p class="status">{{orderStatus(item.status)}}</p>
                </template>
                <p class="hasTime" v-show="item.status === 0">{{pingdanList[Pindex].extratime?pingdanList[Pindex].extratime.extratime:pingdanList.payEndTime}}</p>
              </div>
            </div>
          </template>
          <ul class="item-goods">
            <li class="product" v-for="(product,Cindex) in item.goods">
              <div class="product-info">
                <img class="pic" v-lazy="(picAddress+product.picture)" />
                <div class="detail">
                  <div class="left">
                    <p class="name">{{product.goodsName}}</p>
                    <p class="norms">{{product.specificationsName}}</p>
                  </div>
                  <div class="right">
                    <p class="price">&yen;{{product.price}}</p>
                    <p class="oldprice" v-show="IsSuperVip  && (product.price !== product.orginalPrice)">&yen;{{product.orginalPrice}}</p>
                    <p class="count">x{{product.num}}</p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <template v-if="item.orderType == 0">
            <!--普通订单-->
            <template v-if="item.discountPrice>0">
              <div class="item-price">
                共{{item.goods.length||0}}件商品 合计：&yen;
                <span class="total-money">{{(item.allMoney||0).toFixed(2)}}</span> 返现：&yen;{{item.discountPrice.toFixed(2)}}
              </div>
            </template>
            <template v-else-if="item.nowLessPrice>0">
              <div class="item-price">
                共{{item.goods.length||0}}件商品 合计：&yen;
                <span class="total-money">{{(item.allMoney||0).toFixed(2)}}</span> 立减：&yen;{{item.nowLessPrice.toFixed(2)}}
              </div>
            </template>
            <template v-else>
              <div class="item-price">
                共{{item.goods.length||0}}件商品 合计：&yen;
                <span class="total-money">{{(item.allMoney||0).toFixed(2)}}</span>
              </div>
            </template>
          </template>
          <template v-else>
            <!--拼团订单-->
            <div class="item-price">
              共{{item.goods.length||0}}件商品 合计：&yen;
              <span class="total-money">{{(item.allMoney||0).toFixed(2)}}</span>
            </div>
          </template>
          <ul class="item-operate">
            <!--待付款-->
            <template v-if="item.status === 0">
              <li class="operate-btn" @click.stop.prevent="ShoppingOrderDetail(item.orderNo)">查看详情</li>
              <li class="operate-btn" @click.stop.prevent="ShoppingCancelOrder(item,Pindex)">取消订单</li>
              <li class="operate-btn spec-color" @click.stop.prevent="ShoppingPay(item)">付款</li>
            </template>
            <!--待收货-->
            <template v-else-if="item.status === 1">
              <li class="operate-btn" @click.stop.prevent="ShoppingOrderDetail(item.orderNo)">查看详情</li>
              <li class="operate-btn spec-color" @click.stop.prevent="ShoppingLogistics(item.orderNo)">查看物流</li>
              <li class="operate-btn spec-color" @click.stop.prevent="ShoppingReceiveGoods(item,Pindex)">确认收货</li>
            </template>
            <!--待分享-->
            <template v-else-if="item.status === 2">
              <li class="operate-btn" @click.stop.prevent="ShoppingOrderDetail(item.orderNo)">查看详情</li>
              <li class="operate-btn share-color" @click.stop.prevent="shareFriends(item)">邀请好友</li>
            </template>
            <!--待发货-->
            <template v-else-if="item.status === 3">
              <li class="operate-btn" @click.stop.prevent="ShoppingOrderDetail(item.orderNo)">查看详情</li>
            </template>
            <!--待评论-->
            <template v-else-if="item.status === 4">
              <li class="operate-btn" @click.stop.prevent="ShoppingOrderDetail(item.orderNo)">查看详情</li>
              <li class="operate-btn spec-color" @click.stop.prevent="ShoppingEvaluate(item.orderNo)">晒单评价</li>
            </template>
            <!--交易完成-->
            <template v-else-if="item.status === 5">
              <li class="operate-btn" @click.stop.prevent="ShoppingOrderDetail(item.orderNo)">查看详情</li>
            </template>
            <!--交易关闭-->
            <template v-else-if="item.status === 6">
              <li class="operate-btn" @click.stop.prevent="ShoppingOrderDetail(item.orderNo)">查看详情</li>
            </template>
          </ul>
        </div>
        <div class="no-order" v-show="shoppingOrderList.length === 0">暂无订单哦 (～￣▽￣)～</div>
        <!--
        <div class="loading-wrapper" v-show="shoppingOrderLoading">
          <loading title="加载中..."></loading>
        </div>
-->
      </div>
    </scroll>
    <!--倾停空间订单-商品列表区-->
    <scroll class="jingting-goods-list" ref="jingtingGoodsList" v-show="selectSwitchIndex === 1" :data="orderList" :pullup="pullup" @scrollToEnd="orderscrollToEnd" :style="{top: newTop}">
      <div class="scroll-inner">
        <div class="order_wrap">
          <div class="order_list" @click="toDetail(item)" v-for="(item,index) in orderList" :key="index" :orderId="item.id" :orderType="item.orderType" v-bind:dateString="item.dateString" v-bind:orderStatus="item.orderStatus">
            <h3 class="cloud8Name">{{item.baseName}}
              <span class="fr orderStatus" v-if="item.orderStatus === 0">待付款</span>
              <span class="fr orderStatus" v-else-if="item.orderStatus === 1">
                <template v-if="item.orderWay === 4 && item.pickupStatus === 0">
                  待取货
                </template>
                <template v-if="item.orderWay === 3 || ( item.orderWay === 4 && item.pickupStatus === 1)">
                  已取货
                </template>
              </span>
              <span class="fr orderStatus" v-else-if="item.orderStatus === 3">关闭(付款超时)</span>
              <span class="fr orderStatus" v-else-if="item.orderStatus === 6">已退款(取货超时)</span>
              <span class="fr orderStatus" v-else-if="item.orderStatus === 8">异常订单</span>
              <span class="fr orderStatus" v-else-if="item.orderStatus === 2">已完成</span>
              <span class="fr orderStatus" v-else-if="item.orderStatus === 13">关闭取货</span>
            </h3>
            <div class="order_detail">
              <ul class="goods_list">
                <li class="goods_item" v-for="(el,index) in item.detailList" :key="index">
                  <div class="fl">
                    <img class="goodsPic" v-bind:src="el.goodsPic" alt="商品图片">
                    <span class="goodsName">{{el.goodName}}</span>
                  </div>
                  <div class="fr">
                    <p class="price">&yen;{{el.buyPrice}}</p>
                    <div class="num">x{{el.goodsNum}}</div>
                  </div>
                </li>
              </ul>
              <div class="total">
                <div class="fl">{{item.createTime}}</div>
                <div class="fr">共{{item.num}}件，合计{{item.totalMoney}}元</div>
              </div>
              <div class="operate" v-if="item.orderType !== '2'" :orderType="item.orderType">
                <!-- <template v-if="item.orderStatus === 0 || (item.orderStatus === 1 && item.pickupStatus === 0 && item.orderWay !== 3)">
                    <span class="blue"></span>
                    <a v-bind:orderNo="item.orderNo" v-bind:orderId="item.id" v-bind:cloud8Id="item.cloud8Id" v-bind:payAmount="item.totalMoney" class="btn fk jq-btn" v-if="item.orderStatus === 0">立即付款</a>
                    <a v-bind:orderNo="item.orderNo" v-bind:orderId="item.id" v-bind:cloud8Id="item.cloud8Id" class="btn qh jq-btn" v-else>立即取货</a>
                  </template>
                  <template v-else>
                    <a v-bind:orderNo="item.orderNo" v-bind:recreationActivityId="item.recreationActivityId" v-bind:orderId="item.id" v-bind:cloud8Id="item.cloud8Id" class="buy-btn gm">再次购买</a>
                  </template> -->
                <a v-bind:orderNo="item.orderNo" v-bind:recreationActivityId="item.recreationActivityId" v-bind:orderId="item.id" v-bind:cloud8Id="item.cloud8Id" class="buy-btn gm">查看详情</a>
              </div>
            </div>
          </div>
        </div>
        <!--<div class="no-order" v-show="orderList.length === 0">暂无订单哦 (～￣▽￣)～</div>-->
        <div class="loading-wrapper" v-show="qingtingOrderLoading">
          <loading title="加载中..."></loading>
        </div>
      </div>
    </scroll>
    <!--取消订单---系统确认弹窗-->
    <confirm ref="cancelOrderConfirm" title="提示" :text="cancelOrderConfirmTxt" @confirm="cancelOrder" @cancel="notCancelOrder"></confirm>
    <!--确认收货---系统确认弹窗-->
    <confirm ref="receiveGoodsConfirm" title="提示" :text="receiveGoodsConfirmTxt" @confirm="ReceiveGoods" @cancel="notReceiveGoods"></confirm>
    <!-- 付款--支付方式弹窗 -->
    <pay v-show="payShow" ref="pay" @closeAlert="closeAlert" @payforSuccess="payforSuccess" :showVip="showVip" :showWallet="showWallet" :comeType="comeType" :payfor="payforType" :payforallMoney="payforallMoney" :payforUrl="payforUrl" :groupBuyTypeId="groupBuyTypeId">
    </pay>
    <!--拼团到期提示弹窗-->
    <!-- <mt-popup position="middle" v-model="showTips" class="fightPopup">
      <span class="txt">此订单已满，正在发起新拼单</span>
    </mt-popup>-->
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
import MtSearch from 'mint-ui/lib/search'
import Scroll from 'base/scroll/scroll'
import Confirm from 'base/confirm/confirm'
import Loading from 'base/loading/loading'
import { setToastMsg, CountDown } from 'common/js/mixin'
import 'mint-ui/lib/search/style.css'
import { mapGetters, mapMutations } from 'vuex'
import { queryOrderById } from 'api/userCenter'
import { userOrderList, cancelOrder, receiveGoods } from 'api/order'
import Pay from 'components/pay/pay'
import { payforUrl } from 'api/config'
import Swiper from 'swiper'
import ShareType from 'components/share-type/share-type'
import { serverUrlPrefix, serverUrlSuffix } from 'api/config'
import { Base64 } from 'js-base64'
import MtPopup from 'mint-ui/lib/popup'
import 'mint-ui/lib/popup/style.css'
var firstJoin = true

export default {
  mixins: [setToastMsg, CountDown],
  data() {
    return {
      value: '',
      defaultResult: [],
      orderSwitch: ['菁亭订单', '菁亭时光订单'], //订单切换类型
      selectSwitchIndex: 0, //当前选中的订单类型
      orderType: ['全部', '待付款', '待分享', '待收货', '待评价', '交易完成'], //订单种类
      selectOrderStatus: 0, //当前选中的订单状态
      orderList: [], //订单列表(倾停空间订单)
      currPage: 1, //页数
      totalPageCount: '', //总页数
      pageSize: 3, //每页加载数量
      showDetail: false, //loading是否展示
      showNomoreText: false, //没有更多字样显示
      pullup: true, //上拉加载
      shoppingOrderList: [], //订单列表(商城订单)
      cancelOrderConfirmTxt:
        '您确认要取消该订单吗？</br>取消后此订单将视为无效订单。', //取消订单---系统确认弹窗（显示文字内容）
      receiveGoodsConfirmTxt: '您确认已经收到货物了吗？</br>否则财物两空喔。', //确认收货---系统确认弹窗（显示文字内容）
      payShow: false, //显示支付方式弹窗
      showVip: false, //显示会员卡支付方式
      showWallet: true, //显示线上钱包支付方式
      comeType: 'online', //进入Pay组件的类型，线上
      payforType: 3, //支付类型 1:充值支付 2:共享支付 3:订单支付4:小程序共享支付5:会员卡充值支付6:购买会员卡7:会员卡和商品一起支付
      payforUrl: payforUrl, //线上商城下单接口url
      groupBuyTypeId: '', //拼团类型id
      payforallMoney: 0, //订单待支付金额，传递给pay组件的
      picAddress: '', //图片地址前缀
      shoppingOrderLoading: false, //商城订单加载中loading显示标志位
      qingtingOrderLoading: false, //倾停空间订单加载中loading显示标志位
      showTips: false, //是否显示拼团到期提示弹窗
      pingdanList: [],
      orderTimer: null,
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
    newTop() {
      if (this.hiddenHTab) {
        if (this.selectSwitchIndex === 0) {
          return '3.63rem'
        } else {
          return '2.35rem'
        }
      }
    },
    ...mapGetters([
      'userInfoId',
      'userToken',
      'orderNo',
      'userWalletMoney',
      'hiddenHTab',
      'IsSuperVip',
      'programType',
      'shareThumbs',
      'inviteTitle',
      'inviteContent'
    ])
  },
  created() {
    //this.selectSwitchIndex = 0
    //this.selectOrderStatus = 0
    document.title = '我的订单'
    if (localStorage.getItem('payforsuc')) {
      // this.setToastMsg('支付成功...')
      $('.my-order').hide()
      this.payShow = false
    } else {
      $('.my-order').show()
      this._initData(this.selectSwitchIndex) //默认加载商城订单
    }
    this.shareMaskPic = false
  },
  mounted() {
    //初始化订单状态swiper
    new Swiper('#swiper-container', {
      slidesPerView: 'auto',
      observer: true, //修改swiper自己或子元素时，自动初始化swiper
      observeParents: true //修改swiper的父元素时，自动初始化swiper
    })
    clearInterval(this.PAYFORTIMES)
    this.PAYFORTIMES = null
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
    clearInterval(this.orderTimer)
    this.orderTimer = null
    clearInterval(this.PAYFORTIMES)
    this.PAYFORTIMES = null
  },
  methods: {
    back() {
      this.$router.goBack()
      if (window.plus) {
        var ws = plus.webview.currentWebview()
        ws.hide('slide-out-left')
      }
    },
    _initData(type) {
      if (type == 0) {
        //加载商城订单
        this._shoppingUserOrderList(this.selectOrderStatus) //默认加载全部订单状态
      } else {
        //加载倾停空间订单
        this._queryOrderById()
      }
    },
    orderStatus(status) {
      let statusTxt
      switch (status) {
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
    switchOrder(index) {
      //切换订单类型(商城订单/倾停空间订单)
      this.selectSwitchIndex = index
      this._initData(this.selectSwitchIndex)
      this.selectOrderStatus = 0 //初始化
    },
    switchStatus(index) {
      //切换订单状态(全部/待付款/待收货/待评价/交易完成)
      this.selectOrderStatus = index
      this._shoppingUserOrderList(this.selectOrderStatus)
    },
    //拼团订单倒计时时间数组重组
    CountDownList() {
      let _arr = []
      if (this.shoppingOrderList.length > 0) {
        _arr = this.shoppingOrderList.map((item, index, arr) => {
          let newObj = { payEndTime: 0 }
          if (item) {
            if (item.status === 0) {
              newObj = { payEndTime: item.payEndTime }
              if (item.payEndTime < 0) {
                newObj = { payEndTime: 0 }
              }
            }
          }
          return newObj
        })
      }
      clearInterval(this.orderTimer)
      this.orderTimer = null
      this.pingdanList = _arr
      //加载拼团订单---倒计时
      this.$nextTick(() => {
        this._getFormatTime(
          this.pingdanList,
          'payEndTime',
          this.orderTimer,
          (res, time) => {
            this.pingdanList = res
            this.orderTimer = time
            //*****判断是否关闭计时器 begin*********
            let closeNum = 0
            res.forEach((item, index, arr) => {
              if (item.extratime && !item.extratime.isShow) {
                closeNum++
              }
            })
            if (closeNum === res.length) {
              clearInterval(this.orderTimer)
              this.orderTimer = null
            }
            //*****判断是否关闭计时器 end*********
            console.log(this.pingdanList)
          }
        )
      })
    },
    //商城订单--查看订单详情
    ShoppingOrderDetail(orderNo) {
      this.setOrderNo(orderNo)
      if (window.__wxjs_environment === 'miniprogram') {
        // &goodsid=${this.goodsid}&formatBgimg=${this.formatBgimg}&title=${title}&sharegoodspingtuan=${this.sharegoodspingtuan}
        var path = `/page/shoporderdetails/shoporderdetails?orderno=${orderNo}`
        //通过JSSDK的api使小程序跳转到指定的小程序页面
        wx.miniProgram.navigateTo({ url: path })
      } else {
        this.$router.push(`/orderdetail/${orderNo}`)
      }
    },
    //商城订单操作--查看物流
    ShoppingLogistics(orderNo) {
      this.setOrderNo(orderNo)
      this.$router.push(`/logistics/${orderNo}`)
    },
    //商城订单操作--晒单评价
    ShoppingEvaluate(orderNo) {
      this.setOrderNo(orderNo)
      this.$router.push(`/evaluate/${orderNo}`)
    },
    //商城订单操作--【付款】
    ShoppingPay(item) {
      this.setOrderNo(item.orderNo)
      if (item.orderType === 1) {
        //拼团订单
        this.groupBuyTypeId = item.groupBuyInfo.groupBuyTypeId.toString()
      }
      this.payforallMoney = parseFloat(item.allMoney + item.freight)
      this.payShow = true
    },
    //商城订单操作--【邀请好友】
    shareFriends(item) {
      this.setOrderNo(item.orderNo)
      if (item.orderType === 1) { //拼团订单
        this.goodsid = item.goods[0].goodsId; //邀请好友对应的商品ID
        this.formatBgimg = this.picAddress + item.goods[0].picture; //邀请好友对应的商品图片
        this.shareTitle = item.goods[0].goodsName;//邀请好友对应的商品名称
        this.sharePrice = item.goods[0].price;//邀请好友对应的商品价格
        this.sharegoodspingtuan = item.groupBuyInfo.startGroupBuyId; //邀请好友对应的拼团id
        this.shareGoodDetailUrl = serverUrlPrefix + `programType=${this.programType}&target=goodsdetails&goodsid=${this.goodsid}&sharegoodspingtuan=${this.sharegoodspingtuan}` + serverUrlSuffix
      }
      //分享
      if (this.programType === 'H5App') {
        this.$refs.shareType.show()
        this.showMask = true
      } else {
        this.shareMaskPic = true
      }
      this.minipragram()
    },
    minipragram() {
      if (window.__wxjs_environment === 'miniprogram') {
        let goodsid = `${this.goodsid}`
        let sharegoodspingtuan = `${this.sharegoodspingtuan}`
        let title = `【立即拼团】${this.shareTitle}，售价${this.sharePrice}元，拼团享特惠,新锐礼助力新年好福气`
        console.log('goodsid=' + goodsid, 'title=' + title + 'sharegoodspingtuan=' + this.sharegoodspingtuan)
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
    //商城订单操作--【取消订单】
    ShoppingCancelOrder(item, Pindex) {
      this.setOrderNo(item.orderNo)
      this.cancelOrderIndex = Pindex //记录当前取消的订单在shoppingOrderList数组中的索引
      this.$refs.cancelOrderConfirm.show()
    },
    //【取消订单】--“确定”按钮事件
    cancelOrder() {
      cancelOrder(this.orderNo, this.userToken).then(res => {
        if (res.success) {
          //实现局部刷新，避免重新请求接口查询订单信息，浪费流量
          let Pindex = this.cancelOrderIndex
          this.shoppingOrderList[Pindex].status = 6 //手动将其订单状态更新为交易关闭
          this.$set(
            this.$data.shoppingOrderList,
            Pindex,
            this.shoppingOrderList[Pindex]
          )
          this.$refs.cancelOrderConfirm.hide()
        } else {
          this.setToastMsg(res.msg)
          this.$refs.cancelOrderConfirm.hide()
        }
      })
    },
    //【取消订单】--“取消”按钮事件
    notCancelOrder() {
      this.$refs.cancelOrderConfirm.hide()
    },
    //商城订单操作--【确认收货】
    ShoppingReceiveGoods(item, Pindex) {
      this.setOrderNo(item.orderNo)
      this.receiveOrderIndex = Pindex //记录当前确认的订单在shoppingOrderList数组中的索引
      this.$refs.receiveGoodsConfirm.show()
    },
    //【确认收货】--“确定”按钮事件
    ReceiveGoods() {
      receiveGoods(this.orderNo, this.userToken).then(res => {
        if (res.success) {
          //实现局部刷新，避免重新请求接口查询订单信息，浪费流量
          let Pindex = this.receiveOrderIndex
          this.shoppingOrderList[Pindex].status = 4 //手动将其订单状态更新为待评论
          this.$set(
            this.$data.shoppingOrderList,
            Pindex,
            this.shoppingOrderList[Pindex]
          )
          this.$refs.receiveGoodsConfirm.hide()
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
    toDetail(item) {
      //倾停空间订单--查看订单详情
      this.$router.push({ path: `/myorder/${item.id}` })
    },
    _queryOrderById() {
      //加载倾停空间订单
      this.qingtingOrderLoading = true
      this.currPage = 1
      queryOrderById(this.userInfoId, this.currPage).then(res => {
        if (res.success) {
          this.qingtingOrderLoading = false
          this.orderList = res.list
          this.totalPageCount = res.totalPageCount
        } else {
          this.setToastMsg(res.msg)
        }
      })
    },
    _shoppingUserOrderList(status) {
      this.shoppingOrderLoading = true
      //商城订单列表数据
      this.currPage = 1
      //记得处理搜索功能
      userOrderList(
        this.userToken,
        this.value,
        status,
        this.currPage,
        this.pageSize
      ).then(res => {
        if (res.success) {
          this.shoppingOrderLoading = false
          this.shoppingOrderList = res.orders
          this.CountDownList() //拼团订单倒计时时间数组重组
          this.picAddress = res.pictureAddress
          if (firstJoin) {
            //是否第一次进入该页面
            this.setUserWalletMoney(res.walletavailableAmount)
            firstJoin = false
          }

          this.totalPageCount = res.totalPageCount
        } else {
          this.setToastMsg(res.msg)
        }
      })
    },
    orderscrollToEnd() {
      this.currPage++
      if (this.currPage <= this.totalPageCount) {
        this.showDetail = true
        if (this.selectSwitchIndex === 0) {
          //商城订单--触底加载
          userOrderList(
            this.userToken,
            this.value,
            this.selectOrderStatus,
            this.currPage,
            this.pageSize
          ).then(res => {
            if (res.success) {
              this.shoppingOrderList = this.shoppingOrderList.concat(res.orders)
              this.CountDownList() //拼团订单倒计时时间数组重组
            } else {
              this.setToastMsg(res.msg)
            }
          })
        } else {
          //倾停空间订单--触底加载
          queryOrderById(this.userInfoId, this.currPage).then(res => {
            if (res.success) {
              this.orderList = this.orderList.concat(res.list)
            } else {
              this.setToastMsg(res.msg)
            }
          })
        }
      } else {
        this.showDetail = false
        this.showNomoreText = true
      }
    },
    //支付成功回调
    payforSuccess() {
      //支付成功回调
      if (window.__wxjs_environment === 'miniprogram') {
        this.$router.push(`/orderpaysuccess`)
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
    MtSearch,
    Confirm,
    Scroll,
    Pay,
    Loading,
    MtPopup,
    ShareType
  },
  watch: {
    value(newVal) {
      var reg = new RegExp('^[0-9]*$')
      if (reg.test(newVal)) {
        this._shoppingUserOrderList(this.selectOrderStatus)
      }
    }
  }
}
</script>

<style type="text/sass" lang="sass">
@import "../../common/sass/variable"
@import "../../common/sass/mixin"

.my-order
  position: fixed
  z-index: 100
  top: 0
  left: 0
  right: 0
  bottom: 0
  background-color: $background-base
  font-size: 14/$cale+rem
  line-height: 20/$cale+rem
  .pink
    color: $pink
  .mint-search
    height: auto
    .mint-searchbar
      background-color: $background-base
      .mintui-search
        font-size: 14/$cale+rem
        margin-top: 3/$cale+rem
      .mint-searchbar-core
        font-size: 14/$cale+rem
        vertical-align: middle
        margin-left: 8/$cale+rem
  .order-switch
    overflow: hidden
    display: flex
    .order-switch-item
      flex: 1
      background-color: #f7f7f7
      padding: 12/$cale+rem 0
      color: #676767
      text-align: center
      &.active
        color: $white
        background-color: $mall-main
        font-weight: 600
  .swiper-container
    overflow: hidden
    width: 100%
    height: 40/$cale+rem
  .order-type
    height: 40/$cale+rem
    margin-bottom: 10/$cale+rem
    .order-type-item
      padding: 10/$cale+rem 0
      position: relative
      width: 80/$cale+rem
      background-color: $white
      color: #676767
      text-align: center
      &:last-child:after
        border-right: 0
      &:after
        display: block
        width: 1px
        height: 10/$cale+rem
        position: absolute
        right: 0
        top: 15/$cale+rem
        border-right: 1px solid $mall-border-base
        content: ''
      &.active
        color: $mall-main
        font-weight: 600
  .goods-list
    position: fixed
    top: 180/$cale+rem
    bottom: 0
    overflow: hidden
    width: 100%
    padding-bottom: 20/$cale+rem
  .goods-item
    margin-bottom: 10/$cale+rem
    background-color: $white
    &:last-child
      margin-bottom: 0
    .item-title
      display: flex
      justify-content: space-between
      padding: 6/$cale+rem 15/$cale+rem
      .order-info
        flex: 1
        display: flex
        align-items: center
        .icon-fightGroups
          display: inline-block
          +size(16/$cale+rem)
          +bg-image('./icon-fightGroups')
          background-size: 100% 100%
          vertical-align: middle
          margin-right: 5/$cale+rem
        .title
          line-height: 20/$cale+rem
          font-weight: 600
        .time-wrapper
          display: inline-block
          color: $text_lighter
          font-size: 12/$cale+rem
          line-height: 24/$cale+rem
          .time
            color: $text_color
      .order-status
        line-height: 24/$cale+rem
        font-size: 14/$cale+rem
        color: $mall-main
        text-align: right
    .item-goods
      background-color: $white
      .product
        display: flex
        margin-bottom: 5/$cale+rem
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
              color: $text_lighter
            .oldprice
              color: #dedede
              font-size: 14/$cale+rem
              text-decoration: line-through
            .count
              line-height: 18/$cale+rem
              font-size: 13/$cale+rem
              color: $text_lighter
    .item-price
      padding: 6/$cale+rem 10/$cale+rem
      background-color: $white
      border-bottom: 1px solid $mall-border-base
      line-height: 17/$cale+rem
      font-size: 12/$cale+rem
      color: $text_color
      text-align: right
      .total-money
        font-size: 14/$cale+rem
        font-weight: 600
    .item-operate
      display: flex
      justify-content: flex-end
      padding: 6/$cale+rem 0
      background-color: $white
      overflow: hidden
      .operate-btn
        width: 80/$cale+rem
        padding: 3/$cale+rem 0
        line-height: 20/$cale+rem
        border-radius: 100/$cale+rem
        margin-right: 15/$cale+rem
        text-align: center
        color: $white
        background-color: $text_lighter
        &.spec-color
          background-color: $mall-main
        &.share-color
          background-color: $pink
  .jingting-goods-list
    position: fixed
    top: 132/$cale+rem
    bottom: 0
    overflow: hidden
    width: 100%
    background-color: $gray-bg
    padding-top: 10/$cale+rem
    padding-bottom: 20/$cale+rem
  .payment-modal
    bottom: 0
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
        color: #ff8216
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
      .buy-btn
        display: inline-block
        background: $new-main
        color: $white
        line-height: 20px
        font-weight: 600
        padding: 6px 17px
        border-radius: $border-radius-base
        vertical-align: middle
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

  .no-order
    +position(fixed,left 30% top 40%)
    font-size: 14px
    color: #ccc
    padding-top: 20/$cale+rem
  .loading-wrapper
    position: absolute
    width: 100%
    height: 100%
    top: 50%
    transform: translateY(-50%)
  .fightPopup
    padding: 14/$cale+rem 17/$cale+rem
    border-radius: 5/$cale+rem
    background-color: $text_color
    left: 42%
    transform: translate3d(-36%, -50%, 0)
    .txt
      line-height: 20/$cale+rem
      font-size: 14/$cale+rem
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