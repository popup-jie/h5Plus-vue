<template>
  <div class="fight-list">
    <m-header title="正在拼单" :type="3" @back="back"></m-header>
    <div class="fight-list-wrapper" ref="fightList">
      <scroll class="scroll-inner" :data="fightList" :pullup="pullup" @scrollToEnd="fightScrollToEnd">
        <ul class="invite">
          <li class="invite-list" v-for="item in fightList" ref="pingdanListel">
            <div class="flex">
              <div class="avatar">
                <img v-lazy="avatarPic(item.avatar)" alt="">
              </div>
              <div class="nickname">
                {{item.userName}}
              </div>
              <div class="time flex_item">
                <p>{{item.groupNum}}人团，还差{{item.diffNum}}人拼成</p>
                <p><span class="tuan_price">¥{{item.minPrice?item.minPrice.toFixed(2):0}}</span>剩余{{item.extratime?item.extratime.extratime:item.time}}</p>
              </div>
              <div class="go-fight" @click="Joinsendpintuan(item)">
                去拼团
              </div>
            </div>
          </li>
        </ul>
      </scroll>
    </div>
    <!-- 拼团规格选择 -->
    <mt-popup position="bottom" v-model="pintuanguigeFlag" class="format">
      <div class="format-wrapper">
        <div class="format-content">
          <div class="format-top flex">
            <div class="format-top-left">
              <img :src="formatBgimg" />
            </div>
            <div class="format-top-info flex_item">
              <div class="title">{{title1}}</div>

              <div class="money" v-show="pintuannowActive > -1">¥{{pintuandiscountPrice}} </div>
              <div class="oldprice">{{pintuanpirce}}</div>
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
    <register ref="register"></register>
  </div>
</template>

<script type="text/ecmascript-6">
import MtPopup from 'mint-ui/lib/popup'
import MHeader from 'components/m-header/m-header'
import Scroll from 'base/scroll/scroll'
import { initPage, setToastMsg, CountDown, share } from 'common/js/mixin'
import {
  starGroupBuyList,
  groupBuyTypeList,
  groupBuySpecificationsList,
  startGroupBuy
} from 'api/groupbuy'
import { mapGetters, mapMutations } from 'Vuex'
import { avatar } from 'common/js/tools'
import Register from 'components/register/register'

export default {
  mixins: [initPage, setToastMsg, CountDown, share],
  computed: {
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
    pintuandiscountPrice() {
      if (this.pintuannowActive < 0) {
        return
      }
      //拼团规格折扣价
      return this.pintuanguigeList[this.pintuannowActive].discountPrice
    },
    ...mapGetters(['goodsid', 'userToken','mobile'])
  },
  data() {
    return {
      currpage: 1, //当前页数
      limit: 100, //每页条数
      fightList: [], //拼团列表
      pullup: true,
      totalPageCount: null, //总页数
      pintuanguigeFlag: false,
      formatBgimg: '',
      pintuanguigeList: [],
      pintuannowActive: -1,
      title1: '',
      hasCount: 1,
      _goodsid: null
    }
  },
  created() {
    document.title = '正在拼单'
    this._shareDetail()
    this.$nextTick(() => {
      this._initPage(this.$refs.fightList)
    })

    this.formatBgimg = localStorage.getItem('formatBgimg')
    this.title = localStorage.getItem('formatBgimgtitle')
    this._goodsid = this.goodsid || localStorage.getItem('formatBgimggoodsid')
    this._starGroupBuyList()
  },
  destroyed() {
    clearInterval(this.fightListTimer)
    this.fightListTime = null
  },
  methods: {
    avatarPic(va) {
      return avatar(va)
    },
    closeFormat() {
      this.formatflg = false
      this.pintuanguigeFlag = false
    },
    back() {
      this.$router.goBack()
    },
    Joinsendpintuan(item) {
      if(this.mobile == ''){
        this.$refs.register.show()
      }else {
        this.Joinpintuan = item.startGroupBuyId
        this.Btnsendpintuan(item.groupBuyTypeId)
      }
    },
    pintuanbuynow() {
      if (this.pintuannowActive < 0) {
        this.setToastMsg('请选择规格')
        return false
      }
      this.setToastMsg('请稍等...')
      //参加拼团接口
      localStorage.setItem('startGroupBuyId', this.Joinpintuan)
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
      this.$router.replace('/confirmorder')
      this.closeFormat()
      this.Joinpintuan = -1
    },
    //拼团规格选择
    pintuanchooseitem(index) {
      this.pintuannowActive = index
    },
    _starGroupBuyList() {
      this.currpage = 1
      starGroupBuyList(this._goodsid, this.currpage, this.limit).then(res => {
        if (res.success) {
          this.totalPageCount = res.totalPageCount
          this.fightList = res.data
          this.fightListTime = null
          clearInterval(this.fightListTimer)
          this.$nextTick(() => {
            this._getFormatTime(
              this.fightList,
              'diffTime',
              this.fightListTimer,
              (res, time) => {
                this.fightList = res
                this.fightListTimer = time
              },
              'close'
            )
          })
        }
      })
    },
    Btnsendpintuan(item) {
      this.pintuanguigeFlag = true
      this.groupBuyTypeId = item
      groupBuySpecificationsList(item).then(res => {
        this.pintuanguigeList = res.data
      })
    },
    fightScrollToEnd() {
      if (this.moreA) {
        return false
      }
      this.currpage++
      if (this.currpage <= this.totalPageCount) {
        starGroupBuyList(this._goodsid, this.currpage, this.limit).then(res => {
          if (res.success) {
            this.fightList = this.fightList.concat(res.data)
            clearInterval(this.fightListTimer)
            this.fightListTimer = null
            this._getFormatTime(
              this.fightList,
              'diffTime',
              this.fightListTimer,
              (res, time) => {
                this.fightList = res
                this.fightListTimer = time
              },
              'close'
            )
          } else {
            this.setToastMsg(res.msg)
          }
        })
      } else {
        this.moreA = true
        // this.setToastMsg('没有更多了')
      }
    },
    addCard(ind) {
      if (this.hasCount === 1 && ind === -1) {
        return
      }
      if (this.hasCount > this.pintuanstock) {
        this.setToastMsg('已选数量大于库存')
        return
      }
      this.hasCount += ind
    },
    normAlert() {},
    ...mapMutations({
      setGoodsJson: 'SET_GOODSJSON'
    })
  },
  components: {
    MHeader,
    Scroll,
    MtPopup,
    Register
  }
}
</script>

<style type="text/sass" lang="sass">
  @import "../../common/sass/variable"
  @import "../../common/sass/mixin"

  .fight-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    font-size: 14/$cale+rem
    color: $text_color
    background-color: $background-base
  .fight-list-wrapper
    position: fixed
    top: 44/$cale+rem
    bottom: 0/$cale+rem
    width: 100%
    overflow: hidden
    .scroll-inner
      padding-bottom: 30/$cale+rem
      height: 100%
      overflow: hidden
    .invite
      background: $white
      padding: 0 0.26rem
      li
        border-bottom: 1px solid $mall-border-base
        height: 66 / $cale + rem
        padding-top: 16 / $cale + rem
        display: flex
        justify-content: space-content
        position: relative
      li:last-child
        border-bottom: none
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
</style>