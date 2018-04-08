<template>
  <div class="goods-details">
    <m-header :title="title2" :type="2" @back="back"></m-header>
    <div class="goods-details-wrapper" ref="goodswrapper">
      <div>
        <div class="goods-details-banner-wrapper">
          <slide :listImg="listImg" :className="'goods-detals-banner'" ref="slide" :height="height"></slide>
        </div>
        <div class="goods-details-info">
          <div class="info-title">{{title2}}</div>
          <div v-show="nowActive>-1" class="info-price">
            ¥{{pirce}}
          </div>

          <div v-if="fications.length===1">
            <div class="info-price" v-show="nowActive<0">¥{{minPrice}}
              <span class="info-old-price" v-show="IsSuperVip">{{discountPrice}}</span>
            </div>
          </div>
          <div v-else>
            <div class="info-price" v-show="nowActive<0">¥{{minPrice}} - ¥{{maxPrice}}
              <span class="info-old-price" v-show="IsSuperVip">{{discountPrice}}</span>
            </div>
          </div>
          <div class="labelinfo" v-show="IsSuperVip && showRate">菁亭会员专享{{memberGradeRate}}折</div>
        </div>

        <div class="goods-info-prep" v-show="isShowDetail > 0">
          <pre v-html="activityExplain"></pre>
        </div>

        <div class="goods-details-choose flex" @click="openguige" v-show="!IsShareCome">
          <div class="flex_item flex">
            <div class="choose-name">
              已选：
            </div>
            <div class="choose-now">
              {{Choosetype?Choosetype:'请选择规格'}}
            </div>
          </div>
          <div class="choose-more">

          </div>
        </div>

        <div class="goods-pindan" v-show="pingdanList.length > 0 && groupBuyMinPrice> 0">
          <div class="goods-pindan-top flex">
            <div class="flex_item">
              <span v-show="isComingCopy">
                {{pingdanList.length / 2}}
              </span>
              <span v-show="!isComingCopy">{{pingdanList.length}}</span>人发起拼团</div>
            <div class="choose-more" @click="tofightList"></div>
          </div>
          <div class="goods-pindan-middle" ref="goodsPindanMiddle" v-if="pingdanList.length > 4">
            <div class="goods-pindan-middle-wrapper" ref="goodsPindanMiddleWrapper">
              <my-class :data="pingdanList" :class-option="classOption1" class="warp">
                <ul class="invite">
                  <li class="invite-list" v-for="item in pingdanList" ref="pingdanListel">
                    <div class="flex">
                      <div class="avatar">
                        <img :src="avatarPic(item.avatar)" alt="">
                      </div>
                      <div class="nickname">
                        {{item.userName}}
                      </div>
                      <div class="time flex_item">
                        <p>{{item.groupNum}}人团，还差{{item.diffNum}}人拼成</p>
                        <p>
                          <span class="tuan_price">¥{{item.minPrice?item.minPrice.toFixed(2):0}}</span>剩余{{item.extratime?item.extratime.extratime:item.time}}</p>
                      </div>
                      <div class="go-fight" @click="Joinsendpintuan(item)">
                        去拼团
                      </div>
                    </div>
                  </li>
                </ul>
              </my-class>
            </div>
          </div>
          <div class="goods-pindan-middle" ref="goodsPindanMiddle" v-else>
            <div class="goods-pindan-middle-wrapper" ref="goodsPindanMiddleWrapper">
              <ul class="invite" ref="pingdanListWrapper">
                <li class="invite-list" v-for="item in pingdanList" ref="pingdanListel" @click.stop.prevent="Joinsendpintuan(item)">
                  <div class="flex">
                    <div class="avatar">
                      <img v-lazy="avatarPic(item.avatar)" alt="">
                    </div>
                    <div class="nickname">
                      {{item.userName}}
                    </div>
                    <div class="time flex_item">
                      <p>{{item.groupNum}}人团，还差{{item.diffNum}}人拼成</p>
                      <p>
                        <span class="tuan_price">¥{{item.minPrice?item.minPrice.toFixed(2):0}}</span>剩余{{item.extratime?item.extratime.extratime:item.time}}</p>
                    </div>
                    <div class="go-fight">
                      去拼团
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="goods-details-more">
          <div class="more-tab">
            <s-witches :switches="switches" @switch="Btnswitch"></s-witches>
          </div>
          <!-- 商品详情 -->
          <div v-show="showWhich">
            <img :src="detailPicture" style="width: 100%" @load="loadImage" />
          </div>
          <!-- 评价晒单 -->
          <div v-show="!showWhich"></div>
        </div>

      </div>
    </div>
    <!-- 购物车 -->
    <div class="shop_cart flex" @click="goshop()" v-show="!IsShareCome">
      <div class="jq-cart flex_item">
        <div class="sx_cart">
          <div class="cart_bg"></div>
          <div class="cart_icon"></div>
          <!-- <i class="badge" v-show="cartNum>0">{{cartNum}}</i> -->
        </div>
        <!-- <span class="price">
          ¥
          <span id="total_money">0</span>
        </span> -->
      </div>
      <div class="btn2" @click.prevent.stop="gobuy('shopcart')">
        加入购物车
      </div>
      <div class="btn" @click.prevent.stop="gobuy('gobuy')">
        立即购买
      </div>
      <div class="btn3" @click.prevent.stop="sendpintuan" v-if="groupBuyMinPrice>0">
        <p>¥{{groupBuyMinPrice}}</p>
        <p>发起拼团</p>
      </div>
    </div>

    <div v-show="IsShareCome" class="pintuanfixedBtn flex">
      <div class="time flex_item" v-show="pintuaninfo.status == 0">仅剩{{pintuaninfo.diffNum}}个名额{{pintuaninfo.diffTime ? pintuaninfo.diffTime : ''}}</div>
      <div class="time flex_item" v-show="pintuaninfo.status == 1">该团已结束</div>
      <div class="btn" v-show="pintuaninfo.status == 0" @click="pintuanbuynowshare">立即拼团</div>
    </div>

    <div class="zhuanqian" @click="extension" v-show="shareSaleStatus"></div>
    <!-- 规格选择 -->
    <mt-popup position="bottom" v-model="formatflg" class="format">
      <div class="format-wrapper">
        <div class="format-content">
          <div class="format-top flex">
            <div class="format-top-left">
              <img :src="formatBgimg" />
            </div>
            <div class="format-top-info flex_item">
              <div class="title">{{title2}}</div>

              <div class="money" v-show="nowActive > -1">¥{{pirce}}
                <span v-if="promotionType < 1 && returnMoney">(立减:</span>
                <span v-else-if="promotionType > 0 && returnMoney">(返现:</span>
                <span v-show="returnMoney">{{returnMoney}}元)</span>
              </div>
              <div v-if="fications.length===1" class="money" v-show="nowActive < 0">¥{{minPrice}}</div>
              <div v-else class="money" v-show="nowActive < 0">¥{{minPrice}} - ¥{{maxPrice}} </div>
              <div class="oldprice" v-show="IsSuperVip && showRate">{{maxoldPrice || discountPrice}}</div>
              <div class="kucun" v-show="nowActive > -1">库存{{stock}}件</div>
            </div>
            <div class="format-close" @click="closeFormat"></div>
          </div>

          <div class="format-middle">
            <div class="format-title">规格</div>
            <div class="format-ul flex">
              <div class="format-list" @click="chooseitem(index,item.barCod)" v-for="(item, index) in fications" :class="{active:nowActive === index}">{{item.name}}</div>
            </div>
          </div>

          <div class="format-control flex">
            <div class="format-title flex_item">购买数量</div>
            <div class="control">
              <div class="minuicon" @click="addCard(-1)"></div>
              <!-- 到时候测试接口的时候把这里改成input 允许用户手动输入 -->
              <input type="tel" v-model="hasCount" class="text" />
              <div class="addicon" @click="addCard(1)"></div>
            </div>
          </div>
        </div>
        <div class="format-btn" @click="buyNow()">
          确定
        </div>
      </div>
    </mt-popup>
    <!-- 拼团类型弹窗 -->
    <mt-popup v-model="pintuanFlag" class="pintuan_bg">
      <div class="pintuan-wrapper">
        <div class="close-btn" @click="closePintuanPopup">×</div>
        <ul>
          <li class="flex" v-for="item in pingtuantypelist" v-bind:key="item.id" @click="Btnsendpintuan(item.groupBuyTypeId)">
            <div class="flex_item flex">
              <div class="name">优惠价：</div>
              <div class="price">¥{{item.price}}</div>
            </div>
            <div class="pintuan_btn">{{item.groupNum}}人</div>
          </li>
        </ul>
      </div>
    </mt-popup>
    <!-- 拼团规格选择 -->
    <mt-popup position="bottom" v-model="pintuanguigeFlag" class="format">
      <div class="format-wrapper">
        <div class="format-content">
          <div class="format-top flex">
            <div class="format-top-left">
              <img :src="formatBgimg" />
            </div>
            <div class="format-top-info flex_item">
              <div class="title">{{title2}}</div>

              <div class="money" v-show="pintuannowActive > -1">¥{{pintuandiscountPrice}} </div>
              <div class="oldprice" v-show="showRate">{{pintuanpirce}}</div>
              <div class="kucun" v-show="pintuannowActive > -1">库存{{pintuanstock}}件</div>

            </div>
            <div class="format-close" @click="closeFormat"></div>
          </div>

          <div class="format-middle">
            <div class="format-title">规格</div>
            <div class="format-ul flex">
              <div class="format-list" @click="pintuanchooseitem(index)" v-for="(item, index) in pintuanguigeList" :class="{active:pintuannowActive === index}">{{item.name}}</div>
            </div>
          </div>

          <div class="format-control flex">
            <div class="format-title flex_item">购买数量</div>
            <div class="control">
              <div class="minuicon" @click="addCard(-1)"></div>
              <!-- 到时候测试接口的时候把这里改成input 允许用户手动输入 -->
              <input type="tel" v-model="hasCount" class="text" />
              <div class="addicon" @click="addCard(1)"></div>
            </div>
          </div>
        </div>
        <div class="format-btn" @click="pintuanbuynow">
          确定
        </div>
      </div>
    </mt-popup>
    <pay v-show="false" @closeAlert="closeAlert" @payforSuccess="payforSuccess">
    </pay>
    <register ref="register"></register>
    <!-- 分享 -->
    <share-type ref="shareType" class="shareType" title="菁小咖" content="菁小咖 不寻常" :thumbs="thumbs" :href="href"></share-type>
    <div class="shareCommission" v-show="fenxiangjineShow" @click="closefenxiang">
      <div class="topicon"></div>
      <div class="toparea">
        <p>点击右上角，分享赚佣金</p>
        <p>预计收益 ¥{{fenxiangjine}}</p>
      </div>
    </div>
  </div>
</template>

<script>
const SCROLLLEGNTH = 4
let _IsShareGoodspingtuan = null
import MtPopup from 'mint-ui/lib/popup'
import 'mint-ui/lib/popup/style.css'
import BScroll from 'better-scroll'
import slide from 'base/slider/slider'
import SWitches from 'base/switches/switches'
import ShareType from 'components/share-type/share-type'
import { serverUrlPrefix, serverUrlSuffix } from 'api/config'
import { setToastMsg, initPage, CountDown, share } from 'common/js/mixin'
import {
  selectGoodDetail,
  selectGoodsspecifications,
  addCart,
  getPromotionDiscount,
  getGoodsCommission
} from 'api/goods'
import { mapGetters, mapMutations } from 'vuex'
import {
  formatTime,
  initformatTime,
  getUrlAttribute,
  deepCopy,
  whichTransitionEvent,
  avatar
} from 'common/js/tools'
import {
  starGroupBuyList,
  groupBuyTypeList,
  groupBuySpecificationsList,
  startGroupBuy,
  selectStartGroupBuyById
} from 'api/groupbuy'
import myClass from 'base/scrollClass/scrollClass'
import { mirWebUrl } from 'api/config'
import mHeader from 'components/m-header/m-header'
import pay from 'components/pay/pay'
import Register from 'components/register/register'
import { Base64 } from 'js-base64'
export default {
  // , share
  mixins: [setToastMsg, initPage, CountDown],
  data() {
    return {
      //, { name: '评论晒单' }
      switches: [{ name: '商品详情' }],
      formatflg: false,
      nowActive: -1,
      hasCount: 1,
      cartNum: 0,
      info: {}, // 物品信息
      fications: [], // 规格列表
      showWhich: true,
      listImg: [],
      showRate: true, //是否显示会员折扣
      initBuyType: false, //是否选择过规格
      pintuanFlag: false, //拼团弹窗
      pingdanList: [], //拼团用户列表
      pingtuantypelist: [], //拼团类型列表
      IsShareCome: false, //是否从分享进来
      shareSaleStatus: false, //是否参与分享
      groupBuyMinPrice: 0, //该商品是否参与拼团
      SCROLLLEGNTH: SCROLLLEGNTH,
      isComingCopy: false, //是否拷贝过
      pintuanguigeFlag: false, //拼团规格弹窗
      pintuanguigeList: [], //拼团规格列表
      pintuannowActive: -1, //拼团当前规格选择
      pintuaninfo: {}, //参与拼团信息
      isShowDetail: 0, // 是否展示说明 0 不展示 1展示
      activityExplain: '', // 活动说明
      returnMoney: '', //返现金额
      fenxiangjine: '', //分享金额 赚佣金
      fenxiangjineShow: false, //分享金额弹窗 是否显示
      promotionType: '' //商品类型，0 立减 1 返现
    }
  },
  computed: {
    thumbs() {
      return 'http://120.76.155.216/file/file/preview/bWFsbENhdGVJbWclMkYyMDE4MDExNiUyRjQ5MTEwNjFmZjFlZDRhN2JhZTY4Y2Y3NDYwODk0MjdkX2xBTFBCYkNjMVZRY3Back5BVlROQVdnXzM2MF8zNDAucG5n'
    },
    href() {
      return (
        serverUrlPrefix +
        `programType=${this.programType}&goodsid=${
          this._goodsid
        }&sharegoodspingtuan=0&target=goodsdetails` +
        serverUrlSuffix
      )
    },
    classOption1() {
      return {
        step: 1,
        limitMoveNum: 5,
        singleHeight: parseInt(1.76 * window.outerWidth / 10),
        waitTime: 3000,
        hoverStop: true,
        openWatch: false
      }
    },
    title2() {
      document.title = this.info.name || '物品详情'
      if (!this.info.name) {
        return
      }
      return this.info.name
    },
    describetion() {
      if (!this.info.describetion) {
        return
      }
      return this.info.describetion
    },
    minPrice() {
      if (!this.info.minPrice) {
        return
      }
      return this.info.minPrice
    },
    maxPrice() {
      if (!this.info.maxPrice) {
        return
      }
      return this.info.maxPrice
    },
    formatBgimg() {
      if (!this.info.pictures) {
        return
      }
      return this.info.pictureAdress + this.info.pictures[0].fid
    },
    pirce() {
      if (this.fications.length == 0) {
        return
      }
      if (this.nowActive == -1) {
        return
      }
      return this.fications[this.nowActive].discountPrice
    },
    stock() {
      if (this.fications.length == 0) {
        return
      }
      if (this.nowActive == -1) {
        return
      }
      return this.fications[this.nowActive].stock
    },
    Choosetype() {
      if (this.fications.length == 0) {
        return
      }
      if (this.nowActive == -1) {
        return
      }
      return this.fications[this.nowActive].name
    },
    detailPicture() {
      if (!this.info.detailPicture) {
        return
      }
      return this.info.pictureAdress + this.info.detailPicture
    },
    height() {
      return {
        height: document.body.clientWidth * 0.8 + 'px'
      }
    },
    discountPrice() {
      return '¥' + this.info.maxOriginalPrice
    },
    maxoldPrice() {
      if (!this.fications[this.nowActive]) {
        return ''
      }
      return '¥' + this.fications[this.nowActive].price
    },
    memberGradeRate() {
      if (this.info.memberGradeRate < 1) {
        this.showRate = true
        return this.info.memberGradeRate * 10
      }
      this.showRate = false
      return ''
    },
    pintuandiscountPrice() {
      if (this.pintuannowActive < 0) {
        return
      }
      //拼团规格折扣价
      return this.pintuanguigeList[this.pintuannowActive].discountPrice
    },
    pintuanpirce() {
      if (this.pintuannowActive < 0) {
        return
      }
      //拼团规格原价
      return '￥' + this.pintuanguigeList[this.pintuannowActive].price
    },
    pintuanstock() {
      if (this.pintuannowActive < 0) {
        return
      }
      //拼团规格库存
      return this.pintuanguigeList[this.pintuannowActive].stock
    },
    ...mapGetters([
      'goodsid',
      'userToken',
      'IsSuperVip',
      'programType',
      'mobile',
      'wxunionid'
    ])
  },
  components: {
    slide,
    SWitches,
    mHeader,
    MtPopup,
    pay,
    myClass,
    Register,
    ShareType
  },
  created() {
    if (localStorage.getItem('payforsuc')) {
      return false
    } else {
      // this._shareDetail()
      _IsShareGoodspingtuan =
        getUrlAttribute(window.location.href, 'sharegoodspingtuan') || '' //拼团id
      _IsShareGoodspingtuan = _IsShareGoodspingtuan.split('#')[0]
      if (
        _IsShareGoodspingtuan != 'null' &&
        _IsShareGoodspingtuan != null &&
        _IsShareGoodspingtuan != '' &&
        _IsShareGoodspingtuan > 0
      ) {
        this.IsShareCome = true
        this._selectStartGroupBuyById(_IsShareGoodspingtuan)
      } else {
        this.IsShareCome = false
      }
      this._goodsid = this.goodsid || this.$route.params.id
      localStorage.removeItem('goodsJson') //页面初始化清空goodsJson
      this._initInfo()
      this.$nextTick(() => {
        this._initPage(this.$refs.goodswrapper, 'close')
      })
    }
  },
  mounted() {
    this._initScroll()
  },

  methods: {
    closefenxiang() {
      this.fenxiangjineShow = false
    },
    minipragram() {
      console.log('进入小程序的分享')
      if (window.__wxjs_environment === 'miniprogram') {
        let goodsid = `${this._goodsid}`
        let formatBgimg = `${this.formatBgimg}`
        let title
        let sharegoodspingtuan
        console.log('_IsShareGoodspingtuan=' + _IsShareGoodspingtuan)
        if (
          _IsShareGoodspingtuan != 'null' &&
          _IsShareGoodspingtuan != null &&
          _IsShareGoodspingtuan != '' &&
          _IsShareGoodspingtuan > 0
        ) {
          sharegoodspingtuan = `${_IsShareGoodspingtuan}`
          if (
            this.pintuandiscountPrice == undefined ||
            this.pintuandiscountPrice == 'undefined'
          ) {
            groupBuySpecificationsList(this.pintuaninfo.groupBuyTypeId).then(
              res => {
                console.log(
                  '进入拼团分支 pintuandiscountPrice =' + res.data[0].price
                )
                title = `【立即拼团】${this.title2}，售价${
                  res.data[0].price
                }元，拼团享特惠，新锐礼助力新年好福气`
              }
            )
          }
        } else {
          sharegoodspingtuan = 0
          title = `${this.title2}，售价${this.minPrice}元，新锐礼助力新年好福气`
        }
        console.log(
          'goodsid=' +
            goodsid +
            'sharegoodspingtuan=' +
            sharegoodspingtuan +
            'title=' +
            title +
            'formatBgimg=' +
            formatBgimg
        )
        let _token = `${Base64.encode(this.wxunionid)}`
        wx.miniProgram.postMessage({
          data: {
            goodsid: goodsid,
            sharegoodspingtuan: sharegoodspingtuan,
            title: title,
            formatBgimg: formatBgimg,
            shareUsertoken: _token
          }
        })
      }
    },
    closeAlert() {},
    avatarPic(avv) {
      return avatar(avv)
    },
    payforSuccess() {
      //支付成功回调
      localStorage.removeItem('goodsJson') //商品支付成功清空goodsJson
      localStorage.removeItem('manageAddressParams') //商品支付成功清空manageAddressParams
      localStorage.removeItem('startGroupBuyId') //发起的拼团id
      this.$router.replace(`/orderpaysuccess`)
      localStorage.removeItem('SHANGCHENGORDER')
    },
    _selectStartGroupBuyById(id) {
      // this.minipragram()
      // 根据用户发起的拼团id查询该拼团信息
      clearInterval(this.formatTimer)
      this.formatTimer = null

      selectStartGroupBuyById(id).then(res => {
        if (res.status == 1) {
          this.IsShareCome = false
          //跳转商品详情
          this.$router.replace(`/goodsdetails/${this._goodsid}`)
          this._initInfo()
        } else {
          this._groupBuyTypeList()
          this.pintuaninfo = res
          this.pintuaninfoArr = [res]
          clearInterval(this.pintuaninfoTime)
          this.pintuaninfoTime = null

          this.pintuaninfoArr = initformatTime(this.pintuaninfoArr, 'diffTime')
          setInterval(() => {
            this.pintuaninfoArr = formatTime(this.pintuaninfoArr, 'diffTime')
          }, 1000)
          // this.pintuaninfo.diffTime = this.pintuaninfoArr[0]
          // this._getFormatTime(
          //   this.pintuaninfoArr,
          //   'diffTime',
          //   this.pintuaninfoTime,
          //   (res, time) => {
          //     this.pintuaninfoArr = res
          //     this.pintuaninfo = this.pintuaninfoArr[0]
          //     this.pintuaninfo.extratime = this.pintuaninfoArr[0].extratime
          //     console.log(this.pintuaninfo.extratime.extratime)
          //     this.pintuaninfoTime = time
          //   }
          // )
        }
      })
    },
    closePintuanPopup() {
      this.pintuanFlag = false
    },
    sendpintuan() {
      if (this.mobile == '') {
        this.$refs.register.show()
      } else {
        //发起拼团
        if (this.pingtuantypelist.length > 1) {
          this.pintuanFlag = true
        } else {
          this.pintuanguigeFlag = true
          this.groupBuyTypeId = this.pingtuantypelist[0].groupBuyTypeId
          this.Btnsendpintuan(this.groupBuyTypeId)
          // startGroupBuy(this.pingtuantypelist[0].groupBuyTypeId, this.userToken)
          //否则直接拼团接口
          // this.setToastMsg('单个规格发起拼团')
        }
      }
    },
    //拼团规格选择
    pintuanchooseitem(index) {
      // this.initBuyType = true
      this.pintuannowActive = index
    },
    pintuanbuynow() {
      if (this.pintuannowActive < 0) {
        this.setToastMsg('请选择规格')
        return false
      }

      this.setToastMsg('请稍等...')
      if (this.Joinpintuan > 0) {
        //参加拼团接口
        localStorage.setItem('startGroupBuyId', this.Joinpintuan)
        localStorage.setItem('groupBuyTypeId', this.pintuaninfo.groupBuyTypeId)
        this.formatflg = false
        this.pintuanFlag = false
        let tempGoodsJson = {
          id: this._goodsid,
          specificationsId: this.pintuanguigeList[this.pintuannowActive].id,
          num: this.hasCount
        }
        let goodsJson = JSON.stringify([tempGoodsJson])
        let goodsJsonClone = goodsJson.slice(0, goodsJson.length)
        this.setGoodsJson(goodsJsonClone) //存入state
        localStorage.setItem('goodsJson', goodsJsonClone) //存入缓存
        this.$router.push('/confirmorder')
        this.closeFormat()
        this.Joinpintuan = -1
      } else {
        //发起拼团
        startGroupBuy(this.groupBuyTypeId, this.userToken).then(res => {
          localStorage.setItem('startGroupBuyId', res.startGroupBuyId)
          this.formatflg = false
          this.pintuanFlag = false
          let tempGoodsJson = {
            id: this._goodsid,
            specificationsId: this.pintuanguigeList[this.pintuannowActive].id,
            num: this.hasCount
          }
          let goodsJson = JSON.stringify([tempGoodsJson])
          let goodsJsonClone = goodsJson.slice(0, goodsJson.length)
          this.setGoodsJson(goodsJsonClone) //存入state
          localStorage.setItem('goodsJson', goodsJsonClone) //存入缓存
          this.$router.push('/confirmorder')
          this.closeFormat()
        })
      }
    },
    //参与拼团
    pintuanbuynowshare() {
      this.pintuanguigeFlag = true
      this.Joinpintuan = _IsShareGoodspingtuan
      this.Btnsendpintuan(this.pintuaninfo.groupBuyTypeId)
      groupBuySpecificationsList(this.pintuaninfo.groupBuyTypeId).then(res => {
        this.pintuanguigeList = res.data
      })
    },
    Joinsendpintuan(item) {
      if (this.mobile == '') {
        this.$refs.register.show()
      } else {
        console.log(123)
        this.Joinpintuan = item.startGroupBuyId
        this.Btnsendpintuan(item.groupBuyTypeId)
      }
    },
    Btnsendpintuan(item) {
      this.pintuanguigeFlag = true
      this.groupBuyTypeId = item
      groupBuySpecificationsList(item).then(res => {
        this.pintuanguigeList = res.data
      })
    },
    tofightList() {
      localStorage.setItem('formatBgimg', this.formatBgimg)
      localStorage.setItem('formatBgimgtitle', this.title2)
      localStorage.setItem('formatBgimggoodsid', this._goodsid)
      this.$router.push('/fightlist')

      if (this.pingtuantypelist.length > 4) {
        localStorage.setItem('formatBgimg', this.formatBgimg)
      }
    },
    extension() {
      this.fenxiangjineShow = true
      // if (window.__wxjs_environment === 'miniprogram') {
      //   var path = '/page/extension/extension'
      //   //通过JSSDK的api使小程序跳转到指定的小程序页面
      //   wx.miniProgram.navigateTo({ url: path })
      // } else {
      //   this.$router.push('/extend')
      // }
    },
    loadImage() {
      this.scroll.refresh()
    },
    back() {
      this.$router.goBack()
    },
    Btnswitch(index) {
      if (index === 0) {
        console.log('商品详情')
      } else {
        console.log('评论晒单')
      }
    },
    closeFormat() {
      this.formatflg = false
      this.pintuanguigeFlag = false
    },
    //打开规格
    openguige() {
      // if (this.groupBuyMinPrice > 0) {
      //   this.pintuanguigeFlag = true

      // } else {
      this.formatflg = true
      // }
    },
    gobuy(type) {
      if (this.mobile == '') {
        this.$refs.register.show()
      } else {
        this.type = type
        if (this.initBuyType) {
          this.buyNow()
        } else {
          // if (this.groupBuyMinPrice > 0) {
          //   this.pintuanguigeFlag = true
          // } else {
          this.formatflg = true
          // }
        }
      }
    },
    goshop() {
      if (this.mobile == '') {
        this.$refs.register.show()
      } else {
        this.$router.push('/shopcart')
      }
    },
    chooseitem(ind, id) {
      this.returnMoney = 0
      this.nowActive = ind
      this.initBuyType = true
      this.barcode = id
      if (this.barcode && !this.showRate) {
        getPromotionDiscount(this._goodsid, this.barcode, this.hasCount).then(
          res => {
            if (res.success) {
              if (res.promotionType == '1') {
                this.promotionType = 1
                this.returnMoney = res.discountPrice
              } else {
                this.promotionType = 0
                this.nowLessPrice = res.discountPrice
              }
            }
          }
        )
      }
    },
    addCard(ind) {
      if (this.hasCount === 1 && ind === -1) {
        return
      }
      if (this.pintuanguigeFlag) {
        if (this.hasCount > this.pintuanstock) {
          this.setToastMsg('已选数量大于库存')
          return
        }
      } else {
        if (this.hasCount > this.kucun) {
          this.setToastMsg('已选数量大于库存')
          return
        }
      }
      this.hasCount += ind
      this.returnMoney = 0
      if (this.barcode && !this.showRate) {
        getPromotionDiscount(this._goodsid, this.barcode, this.hasCount).then(
          res => {
            if (res.success) {
              if (res.promotionType == '1') {
                this.returnMoney = res.discountPrice
              } else {
                this.nowLessPrice = res.discountPrice
              }
            }
          }
        )
      }
    },
    buyNow() {
      localStorage.removeItem('startGroupBuyId')
      if (this.nowActive < 0) {
        this.setToastMsg('未选择规格')
        return false
      }
      if (!this.type) {
        this.closeFormat()
        this.initBuyType = true
        return false
      }
      if (this.initBuyType) {
        this.formatflg = false
      }
      let _kucun = this.stock
      if (_kucun < this.hasCount) {
        this.setToastMsg('当前商品库存不足，请重新选择规格')
        this.formatflg = true
      } else {
        //请求后台数据加入购物车
        if (this.type === 'gobuy') {
          this.formatflg = false
          let tempGoodsJson = {
            id: this._goodsid,
            specificationsId: this.fications[this.nowActive].id,
            num: this.hasCount
          }
          let goodsJson = JSON.stringify([tempGoodsJson])
          let goodsJsonClone = goodsJson.slice(0, goodsJson.length)
          console.log(goodsJsonClone)
          this.setGoodsJson(goodsJsonClone) //存入state
          localStorage.setItem('goodsJson', goodsJsonClone) //存入缓存
          this.initBuyType = true
          this.$router.push('/confirmorder')

          //跳转确认订单页面
        } else {
          //加入购物车
          addCart(
            this.userToken,
            this._goodsid,
            this.fications[this.nowActive].id,
            this.hasCount
          ).then(res => {
            if (res.success) {
              this.setToastMsg('加入购物车成功')
              this.closeFormat()
              this.initBuyType = true
            } else {
              this.setToastMsg(res.msg)
            }
          })
        }
      }
    },
    _initInfo() {
      selectGoodDetail(this._goodsid, this.userToken || '').then(res => {
        if (res.success) {
          this.info = res
          this.listImg = res.pictures
          this.shareSaleStatus = res.shareSaleStatus > 0 ? true : false
          this.groupBuyMinPrice = Math.abs(res.groupBuyMinPrice)
          this.isShowDetail = res.isShowDetail > 0 ? true : false
          this.activityExplain = res.activityExplain
          if (this.groupBuyMinPrice > 0 && !this.IsShareCome) {
            this._getGroupBuyInfo()
            this._groupBuyTypeList()
          } else {
          }
          this.minipragram()
        } else {
          this.setToastMsg(res.msg)
        }
      })
      selectGoodsspecifications(this._goodsid, this.userToken || '').then(
        res => {
          if (res.success) {
            this.fications = res.data
          } else {
            this.setToastMsg(res.msg)
          }
        }
      )
      getGoodsCommission(this._goodsid).then(res => {
        if (res.success) {
          this.fenxiangjine = res.maxCommission
        }
      })
    },
    _getGroupBuyInfo() {
      // 获取拼团信息 默认请求10条
      starGroupBuyList(this._goodsid, 1, 10).then(res => {
        this.pingdanList = null
        this.pingdanList = res.data
        if (this.pingdanList.length > SCROLLLEGNTH) {
          this.$nextTick(() => {
            this.$refs.goodsPindanMiddle.style.height =
              SCROLLLEGNTH * 66 / 37.5 + 'rem'
          })
        } else {
          this.$nextTick(() => {
            this.$refs.goodsPindanMiddle.style.height =
              this.pingdanList.length * 66 / 37.5 + 'rem'
          })
        }
        this.ScrollPingtuan()
      })
    },
    _groupBuyTypeList() {
      groupBuyTypeList(this._goodsid).then(res => {
        this.pingtuantypelist = res.data
      })
    },
    _initScroll() {
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.goodswrapper, {
            click: true
          })
          // this.pintuanScroll = new BScroll(
          //   this.$refs.goodsPindanMiddleWrapper,
          //   {
          //     tap: true
          //   }
          // )
          // this.pintuanScroll.disable()
        } else {
          this.scroll.refresh()
          // this.pintuanScroll.refresh()
        }
      })
    },
    ScrollPingtuan() {
      if (this.pingdanList.length < 0) {
        return false
      }
      // if (this.pingdanList.length > SCROLLLEGNTH) {
      //   this.$refs.goodsPindanMiddle.style.height =
      //     SCROLLLEGNTH * 66 / 37.5 + 'rem'
      // } else {
      //   this.$refs.goodsPindanMiddle.style.height =
      //     this.pingdanList.length * 66 / 37.5 + 'rem'
      // }
      // let _transitionEvent = whichTransitionEvent()
      // this.isComingCopy = false //是否拷贝过
      // if (this.pingdanList.length > SCROLLLEGNTH) {
      //   //是否大于规定数量，如果大于则拷贝数组
      //   let copy2 = deepCopy(this.pingdanList)
      //   this.pingdanList.push(...copy2)
      //   this.isComingCopy = true
      // }
      // let j = 0
      // let i = 0
      this._getFormatTime(
        this.pingdanList,
        'diffTime',
        this.formatTimer,
        (res, time) => {
          this.formatTimer = time
          this.pingdanList = res
          // if (res.length < this.pingdanList.length) {
          //   //如果返回来的数组小于原本长度，则操作过删除
          //   if (this.isComingCopy) {
          //     if (res.length / 2 < SCROLLLEGNTH) {
          //       //返回来的数组长度小于默认长度
          //       this.pintuanScroll.scrollToElement(
          //         this.$refs.pingdanListel[0],
          //         0
          //       )
          //       this.$refs.goodsPindanMiddle.style.height =
          //         res.length / 2 * 66 / 37.5 + 'rem'
          //     }
          //   } else {
          //     this.$refs.goodsPindanMiddle.style.height =
          //       res.length * 66 / 37.5 + 'rem'
          //   }
          //   this._initScroll()
          // }

          // if (this.pingdanList.length / 2 > SCROLLLEGNTH) {
          //   if (this.pintuanScroll && this.$refs.pingdanListel) {
          //     j++
          //     if (j % 4 == 0) {
          //       i++
          //       this.pintuanScroll.scrollToElement(
          //         this.$refs.pingdanListel[i],
          //         300
          //       )
          //     }
          //   }
          //   _transitionEvent &&
          //     this.$refs.pingdanListWrapper.addEventListener(
          //       _transitionEvent,
          //       () => {
          //         if (i >= this.pingdanList.length / 2) {
          //           i = 0
          //           this.pintuanScroll.scrollToElement(
          //             this.$refs.pingdanListel[0],
          //             0
          //           )
          //         }
          //       }
          //     )
          // }
        },
        'close'
      )
      this._initScroll()
    },
    ...mapMutations({
      setGoodsJson: 'SET_GOODSJSON'
    })
  },
  activated() {
    localStorage.removeItem('SHANGCHENGORDER')
    if (this.scroll) {
      this.scroll.scrollTo(0, 0, 0)
      // this.pintuanScroll.scrollTo(0, 0, 0)
    }
    this.$nextTick(() => {
      document.title = this.info.name || '物品详情'
    })
    this.$refs.register.hide()
    // this._initInfo()
  },
  deactivated() {
    clearInterval(this.PAYFORTIME)
  },
  watch: {
    goodsid(newVal) {
      if (localStorage.getItem('payforsuc')) {
        return false
      } else {
        clearInterval(this.formatTimer)
        this.formatTimer = null
        this.type = ''
        this.pingdanList = null
        this.pingdanList = []
        this.initBuyType = false
        this.hasCount = 1
        // $('.goods-detals-banner .swiper-slide').remove()
        this.nowActive = -1
        this._goodsid = newVal
        this.returnMoney = ''
        this.activityExplain = ''
        this.isShowDetail = 0
        this._initInfo()
      }
    }
  }
}
</script>

<style lang="sass" type="text/sass">
@import "~common/sass/variable"
@import "~common/sass/mixin"
.format
  +size(100%,350/$cale+rem)
.goods-details
  position: fixed
  z-index: 100
  left: 0
  right: 0
  top: 0
  bottom: 0
  background: #f7f7f7
  .goods-details-wrapper
    position: fixed
    bottom: 48 / $cale + rem
    width: 100%
    top: 44 / $cale + rem
  .goods-details-info
    padding: 10 / $cale + rem
    background: #fff
    margin-bottom: 10 / $cale + rem
    .info-title
      font-size: 17 / $cale + rem
      color: #666
    .info-price
      color: $bottom-btn-background-base
      font-size: 24 / $cale + rem
      margin-top: 10 / $cale + rem
      font-weight: 600
      margin-bottom: 2 / $cale + rem
    .labelinfo
      color: #dd7b7b
      font-size: 14 / $cale + rem
      margin-top: 0.1rem
    .info-old-price
      color: #999
      font-size: 14 / $cale + rem
      text-decoration: line-through       
  .goods-details-choose
    background: #fff
    +line-height(40/ $cale + rem)
    padding: 0 10 / $cale + rem
    font-size: 15 / $cale + rem
    .choose-name
      color: #999
    .choose-now
      color: #333
      margin-left: 0.1rem
    .choose-more
      +bg-image('./right_icon')
      +size(10/ $cale + rem,18/ $cale + rem)
      background-size: 100%
      vertical-align: middle
      margin-top: 0.28rem
      +extend-click()
  .goods-details-more
    margin-top: 10 / $cale + rem
    background: #fff
    .more-tab
      font-size: 15 / $cale + rem
      color: #333
      text-align: center
      div
        border-bottom: 2px solid #fff
      .active
        color: $bottom-btn-background-base
        border-bottom: 2px solid $bottom-btn-background-base
  .shop_cart
    position: fixed
    bottom: 0
    left: 0
    height: 48 / $cale + rem
    line-height: 48 / $cale + rem
    width: 100%
    color: #fff
    background-color: rgba(51,51,51,0.9)
    z-index: 17
    .btn
      height: 100%
      top: 0
      right: 96  / $cale + rem
      width: 96 / $cale + rem
      font-size: 16 / $cale + rem
      font-weight: 500
      text-align: center
      background-color: $bottom-btn-background-base
    .btn2
      height: 100%
      top: 0
      right: 192 / $cale + rem
      width: 96 / $cale + rem
      font-size: 16 / $cale + rem
      font-weight: 500
      text-align: center
      background-color: $bottom-btn-background-light
    .btn3
      height: 100%
      top: 0
      right: 0
      width: 96 / $cale + rem
      font-size: 16 / $cale + rem
      font-weight: 500
      text-align: center
      background-color: #dd7b7b
      p
        line-height: 0.5rem
        &:nth-child(1)
          margin-top: 0.15rem
    .sx_cart
      position: absolute
      margin-top: -14 / $cale + rem
      z-index: 202
      width: 56 / $cale + rem
      height: 56 / $cale + rem
      margin-left: 0.4rem
      background-color: #464646
      box-shadow: 0 -2px 5px 0 rgba(0, 0, 0, 0.3)
      border-radius: 50%
      display: inline-block
      .cart_bg
        width: 46 / $cale + rem
        height: 46 / $cale + rem
        position: absolute
        top: 50%
        left: 50%
        margin-left: -23 / $cale + rem
        margin-top: -23 / $cale + rem
        background: $bottom-btn-background-base
        border-radius: 50%
      .cart_icon
        +bg-image('./shop_cart_icon')
        +size(32/ $cale + rem,29/ $cale + rem)
        background-size: 100%
        position: absolute
        top: 50%
        left: 50%
        margin-left: -16 / $cale + rem
        margin-top: -15 / $cale + rem
      .badge
        position: absolute
        color: #fff
        width: 0.5rem
        height: 0.5rem
        top: -0.05rem
        right: -0.05rem
        font-size: 12 / $cale + rem
        background: $bottom-btn-background-light
        border-radius: 50%
        line-height: 0.5rem
        text-align: center
    .price
      display: inline-block
      color: #fff
      padding-left: 78 / $cale + rem
      font-size: 18 / $cale + rem
      position: absolute
  .format-wrapper
    position: fixed
    z-index: 99
    background: rgba(0,0,0,0.5)
    bottom: 0
    top: 0
    left: 0
    right: 0
    .format-content
      position: absolute
      bottom: 0px
      padding: 10 / $cale + rem
      background: #fff
      width: 100%
      padding-bottom: 3rem
      .format-top
        margin-top: -0.9rem
        border-bottom: 1px solid #ebebeb
        padding-bottom: 15 / $cale + rem
        .format-top-left
          width: 118 / $cale + rem
          height: 118 / $cale + rem
          border-radius: 3px
          overflow: hidden
          img
            width: 100%
            height: 100%
        .format-top-info
          margin-top: 1rem
          margin-left: 0.5rem
          .title
            width: 5rem
            font-size: 15 / $cale + rem
            color: #666
            margin-bottom: 0.15rem
          .money
            font-size: 15 / $cale + rem
            color: $bottom-btn-background-base
            span
              margin-left: 0.1rem
              font-size: 12 / $cale + rem
              color: $bottom-btn-background-base
          .kucun
            color: #333333
            font-size: 14 / $cale + rem
            margin-top: 0.2rem
        .format-close
          +extend-click()
          +bg-image('./close')
          +size(12/ $cale + rem)
          background-size: 100%
          position: absolute
          right: 0.5rem
          top: 0.5rem
      .format-middle
        padding-top: 10 / $cale + rem
        border-bottom: 1px solid #ebebeb
        .format-ul
          flex-flow: wrap
          margin-top: 5 / $cale + rem
          .format-list
            padding: 0.2rem 0.5rem
            background: #f5f5f5
            border-radius: 4px
            color: #666
            font-size: 12 / $cale + rem
            margin-right: 0.1rem
            margin-bottom:  5 / $cale + rem
            margin-top:  5 / $cale + rem
            &.active
              background-color: $bottom-btn-background-base
              color: #fff
      .format-title
        color: #333333
        font-size: 16  / $cale + rem
      .format-control
        height: 65 / $cale + rem
        line-height: 65 / $cale + rem
        border-bottom: 1px solid #ebebeb
        .control
          display: flex
          div
            display: inline-block
            font-size: 0
            color: #666666
            vertical-align: top
          .minuicon
            +size(22/ $cale + rem)
            +bg-image('./minu')
            background-size: 100% 100%
            margin-right: .2rem
            margin-top: 0.55rem
            +extend-click()
          .addicon
            +size(22/ $cale + rem)
            +bg-image('./add')
            background-size: 100% 100%
            margin-left: .2rem
            margin-top: 0.55rem
            +extend-click()
          .text
            height: 22/ $cale + rem
            line-height: 22/ $cale + rem
            font-size: 14 / $cale + rem
            width: 1.4rem
            text-align: center
            vertical-align: top
            margin-top: 0.55rem
    .format-btn
      height: 48 /$cale + rem
      color: #ffffff
      font-size: 18 /$cale + rem
      line-height: 48 /$cale + rem
      text-align: center
      position: absolute
      bottom: 0
      width: 100%
      background: $bottom-btn-background-base
  .goods-pindan
    margin-top: 0.26667rem
    padding: 0 0.26667rem
    background: #fff
    .goods-pindan-top
      height: 1.06667rem
      line-height: 1.06667rem
      font-size: 0.4rem
      border-bottom: 1px solid $mall-border-base
      span
        color: $pink
      .choose-more
        +bg-image('./right_icon')
        +size(10/ $cale + rem,18/ $cale + rem)
        background-size: 100%
        vertical-align: middle
        margin-top: 0.28rem
        +extend-click()
    .goods-pindan-middle
      position: relative
      .goods-pindan-middle-wrapper
        position: absolute
        top: 0
        bottom: 0
        overflow: hidden
        width: 100%
      .invite
        background: $white
        li
          border-bottom: 1px solid $mall-border-base
          height: 66 / $cale + rem
          padding-top: 16 / $cale + rem
          display: flex
          justify-content: space-content
          position: relative
        // li:last-child
        //   border-bottom: none
        .avatar
          +size(40/$cale+rem)
          border-radius: 50%
          overflow: hidden
          img
            +size(100%)
        .nickname
          font-size: 14/$cale+rem
          color: $gray-dark  
          line-height: 40/$cale+rem
          margin-left: 10/$cale+rem
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap
          width: 2.6rem
        .time
          font-size: 14/$cale+rem !important
          line-height: 20/$cale+rem
          color: $gray
          text-align: right
          margin-left: 5/$cale+rem
          margin-right: 1.4rem
          .tuan_price
            color: $mall-main
            margin-right: 5/$cale+rem
        .go-fight
          background: #ff6565
          padding: 5/$cale+rem
          color: $white  
          position: absolute
          right: 0
          top: 22/$cale+rem
          border-radius: 3/$cale+rem
          font-size: 14 /$cale+rem
.zhuanqian
  +bg-image('./zhuanqian')
  background-size: 100%
  +size(40 /$cale + rem)
  position: fixed
  z-index: 98
  right: 0.5rem
  bottom: 1.6rem
.oldprice
  color: #999
  font-size: 0.37333rem
  text-decoration: line-through
.pintuan_bg
  background: #fff
  width: 80%
  border-radius: 10px
  .pintuan-wrapper
    padding: 0 0.4rem
    position: relative
    .close-btn
      background: #dedede
      color: $white
      +size(24 / $cale + rem)
      line-height: 22 / $cale + rem
      border-radius: 50%
      position: absolute
      right: -8/ $cale + rem
      top: -10/ $cale + rem
      text-align: center
      font-size: 18/ $cale + rem
    li
      line-height: 24 / $cale + rem
      border-bottom: 1px solid #dedede
      padding: 0.3rem 0
      .name
        color: #333333
        font-size: 14 / $cale + rem
      .price
        color: #dd7b7b
        font-size: 14 / $cale + rem
      .pintuan_btn
        background: #dd7b7b
        font-size: 14 / $cale + rem
        color: #fff
        border-radius: 3
        height: 24 / $cale + rem
        line-height: 24 / $cale + rem
        padding: 0 0.3rem
.pintuanfixedBtn
  position: fixed
  bottom: 0
  left: 0
  height: 48 / $cale + rem
  line-height: 48 / $cale + rem
  width: 100%
  color: #fff
  background-color: rgba(51,51,51,0.9)
  z-index: 17
  .btn
    width: 30%
    font-size: 16 / $cale + rem
    font-weight: 600
    text-align: center
    color: #ffffff
    background: #dd7b7b
  .time
    color: #fff
    font-size: 16 / $cale + rem
    text-align: center
.goods-info-prep
  padding: 10 / $cale + rem
  background: #fff
  margin-bottom: 10 / $cale + rem
  font-size: 14  / $cale + rem
  p
    white-space: pre-wrap
    display: block
    line-height: 0.55rem
.shareType
  background: $white
  color: $gray-dark
.shareCommission
  position: fixed
  z-index: 9999
  left: 0px
  right: 0px
  bottom: 0px
  top: 0px
  background: rgba(0,0,0,0.3)
  .topicon
    +bg-image('./upicon')
    width: 54 / $cale + rem
    height: 59 / $cale + rem
    background-size: 100% 100%
    position: absolute
    right: 0.5rem
    top: 0.5rem
  .toparea
    +bg-image('./top_area')
    width: 243 / $cale + rem
    height: 112 / $cale + rem
    background-size: 100% 100%
    position: absolute
    left: 0
    right: 0
    margin: 0 auto
    top: 2.2rem
    font-size: 16 / $cale + rem
    color: #fff
    text-align: center
    padding-top: 40/ $cale + rem
    p
      margin-bottom: 0.25rem
</style>
